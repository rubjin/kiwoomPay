// Figma 토큰 JSON + 코드 토큰 JSON → src/styles/tokens/_generated.scss
//
//   node scripts/build-tokens.mjs           생성
//   node scripts/build-tokens.mjs --check   생성 결과가 현재 파일과 다르면 실패 (CI용)
//
// 입력
//   tokens/figma/color.json        Figma Variables(색)   — 수정 금지
//   tokens/figma/space.json        Figma Variables(간격) — 수정 금지
//   tokens/figma/text-styles.json  Figma Text Styles     — 수정 금지
//   tokens/custom/*.json           퍼블리셔가 작성한 코드 토큰 (DTCG 형식)
//
// 이름 규칙은 docs/token-workflow.md 참고.

import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIGMA_DIR = path.join(ROOT, 'tokens/figma');
const CUSTOM_DIR = path.join(ROOT, 'tokens/custom');
const OUT_FILE = path.join(ROOT, 'src/styles/tokens/_generated.scss');
const CSS_PREFIX = '--kp-';

// number 타입 토큰에 px를 붙일 최상위 그룹 (Figma space 변수)
const PX_GROUPS = new Set(['space']);
// 미디어쿼리에서 써야 하므로 CSS 변수가 아닌 값 그대로 SCSS 변수로 내보내는 그룹
const RAW_SCSS_GROUPS = new Set(['breakpoint']);

const FIGMA_FILES = {
  color: 'color.json',
  space: 'space.json',
  textStyles: 'text-styles.json',
};

/** 토큰 하나. value는 CSS 값이고, ref가 있으면 다른 토큰을 가리키는 alias다. */
const tokens = [];
const byPath = new Map(); // "Primary.500" → 토큰 이름 (alias 해석용)
const byName = new Map(); // "color-primary-500" → 토큰

const fail = (msg) => {
  console.error(`[build-tokens] ${msg}`);
  process.exit(1);
};

const kebab = (s) =>
  String(s)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_/.]+/g, '-')
    .toLowerCase();

const readJson = async (file) => {
  try {
    const text = await readFile(file, 'utf8');
    return JSON.parse(text.charCodeAt(0) === 0xfeff ? text.slice(1) : text); // BOM 제거
  } catch (e) {
    return fail(`${path.relative(ROOT, file)} 읽기 실패: ${e.message}`);
  }
};

function addToken({ pathParts, name, value, ref, section, description, source, scssRaw = false }) {
  const dotPath = pathParts.join('.');
  if (byName.has(name)) {
    fail(`이름 충돌: "${name}" (${source} ↔ ${byName.get(name).source})`);
  }
  if (byPath.has(dotPath)) {
    fail(`경로 충돌: "${dotPath}" (${source} ↔ ${byName.get(byPath.get(dotPath)).source})`);
  }
  const token = { name, value, ref, section, description, source, scssRaw };
  tokens.push(token);
  byName.set(name, token);
  byPath.set(dotPath, name);
}

// ---------- 값 변환 ----------

const to255 = (c) => Math.round(c * 255);

function colorValue(raw, where) {
  if (typeof raw === 'string') return raw;
  const { hex, components, alpha = 1 } = raw;
  if (alpha === 1 && hex) return hex.toUpperCase();
  if (!components) fail(`${where}: color 값에 components 또는 hex가 필요합니다`);
  const [r, g, b] = components.map(to255);
  return `rgba(${r}, ${g}, ${b}, ${Number(alpha.toFixed(3))})`;
}

const REF = /^\{([^{}]+)\}$/;

/** DTCG 트리를 순회하며 토큰을 모은다. */
function walk(node, pathParts, ctx) {
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue; // $extensions, $description 등 그룹 메타
    if (child === null || typeof child !== 'object') continue;
    const nextPath = [...pathParts, key];
    if ('$value' in child) {
      collectToken(child, nextPath, ctx);
    } else {
      walk(child, nextPath, ctx);
    }
  }
}

function collectToken(node, pathParts, ctx) {
  const where = `${ctx.source} › ${pathParts.join('/')}`;
  const type = node.$type;
  const raw = node.$value;
  const description = node.$description;
  const group = pathParts[0].toLowerCase();

  if (type === 'typography') {
    return collectTypographyRole(node, pathParts, ctx, where);
  }

  const refMatch = typeof raw === 'string' ? raw.match(REF) : null;
  const nameParts = type === 'color' ? ['color', ...pathParts] : pathParts;
  const name = nameParts.map(kebab).join('-');

  const base = {
    pathParts,
    name,
    section: ctx.section ?? group,
    description,
    source: ctx.source,
    scssRaw: RAW_SCSS_GROUPS.has(group),
  };

  if (refMatch) return addToken({ ...base, ref: refMatch[1] });

  let value;
  if (type === 'color') value = colorValue(raw, where);
  else if (type === 'number')
    value = typeof raw === 'number' && PX_GROUPS.has(group) ? `${raw}px` : String(raw);
  else if (
    ['string', 'dimension', 'fontFamily', 'duration', 'cubicBezier', 'shadow'].includes(type)
  )
    value = String(raw);
  else return fail(`${where}: 지원하지 않는 $type "${type}"`);

  return addToken({ ...base, value });
}

// ---------- Typography ----------

const TYPO_PROPS = ['font-size', 'font-weight', 'line-height', 'letter-spacing'];

function percentToCss(unit, value, where, kind) {
  if (unit !== 'PERCENT') fail(`${where}: ${kind} 단위 "${unit}"는 지원하지 않습니다 (PERCENT만)`);
  if (kind === 'lineHeight') return String(Number((value / 100).toFixed(4)));
  return value === 0 ? '0' : `${Number((value / 100).toFixed(4))}em`;
}

function collectFigmaTextStyles(json) {
  const source = `tokens/figma/${FIGMA_FILES.textStyles}`;
  for (const style of json.textStyles) {
    const pathParts = style.name.split('/').map((s) => s.trim());
    const where = `${source} › ${style.name}`;
    if (style.fontFamily !== 'Pretendard') {
      fail(`${where}: fontFamily "${style.fontFamily}" — 전역 font-family-base만 지원합니다`);
    }
    const values = {
      'font-size': `${style.fontSize}px`,
      'font-weight': String(style.fontWeight),
      'line-height': percentToCss(
        style.lineHeight.unit,
        style.lineHeight.value,
        where,
        'lineHeight',
      ),
      'letter-spacing': percentToCss(
        style.letterSpacing.unit,
        style.letterSpacing.value,
        where,
        'letterSpacing',
      ),
    };
    const baseName = ['typography', ...pathParts].map(kebab).join('-');
    // 스타일 자체를 가리키는 경로(역할 이름 alias 해석용)를 먼저 등록
    byPath.set(pathParts.join('.'), baseName);
    for (const prop of TYPO_PROPS) {
      const name = `${baseName}-${prop}`;
      if (byName.has(name)) fail(`이름 충돌: "${name}" (${where})`);
      const token = {
        name,
        value: values[prop],
        section: 'typography',
        description: prop === 'font-size' ? style.description || undefined : undefined,
        source,
      };
      tokens.push(token);
      byName.set(name, token);
    }
  }
}

/** { "$type": "typography", "$value": "{Typo.14.Regular}" } → 4개 속성 alias */
function collectTypographyRole(node, pathParts, ctx, where) {
  const m = typeof node.$value === 'string' ? node.$value.match(REF) : null;
  if (!m) fail(`${where}: typography 토큰은 "{Typo.14.Regular}" 같은 alias만 지원합니다`);
  const baseName = ['typography', ...pathParts].map(kebab).join('-');
  byPath.set(pathParts.join('.'), baseName);
  for (const prop of TYPO_PROPS) {
    const name = `${baseName}-${prop}`;
    if (byName.has(name)) fail(`이름 충돌: "${name}" (${where})`);
    const token = {
      name,
      ref: m[1],
      refProp: prop,
      section: 'typography',
      description: prop === 'font-size' ? node.$description : undefined,
      source: ctx.source,
      where,
    };
    tokens.push(token);
    byName.set(name, token);
  }
}

// ---------- alias 해석 ----------

function resolveRef(token) {
  // 다른 토큰을 가리키는 alias는 CSS에서 var()로 연결한다 (Figma 계층 유지).
  const target = byPath.get(token.ref);
  const label = token.where ?? `${token.source} › ${token.name}`;
  if (!target) fail(`${label}: 참조 대상 "{${token.ref}}"를 찾을 수 없습니다`);
  const targetName = token.refProp ? `${target}-${token.refProp}` : target;
  const targetToken = byName.get(targetName);
  if (!targetToken) fail(`${label}: 참조 대상 "{${token.ref}}"의 값 토큰이 없습니다`);
  token.resolvedName = targetName;
  token.targetToken = targetToken;
}

function checkCycles() {
  for (const token of tokens) {
    const seen = new Set([token.name]);
    let cur = token.targetToken;
    while (cur) {
      if (seen.has(cur.name)) fail(`순환 참조: ${[...seen, cur.name].join(' → ')}`);
      seen.add(cur.name);
      cur = cur.targetToken;
    }
  }
}

// ---------- 출력 ----------

const quote = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
const cssValue = (t) => (t.resolvedName ? `var(${CSS_PREFIX}${t.resolvedName})` : t.value);

function render() {
  const lines = [
    '// 자동 생성 파일 — 직접 수정 금지. `pnpm tokens`로 갱신한다.',
    '// 원본: tokens/figma/*.json (Figma 내보내기), tokens/custom/*.json (코드 토큰)',
    '// 사용: @use "tokens" as t;  →  t.$color-primary-500',
    '',
  ];

  const sections = [...new Set(tokens.map((t) => t.section))];
  for (const section of sections) {
    lines.push(`// ── ${section} ${'─'.repeat(Math.max(2, 60 - section.length))}`);
    for (const t of tokens.filter((x) => x.section === section)) {
      const note = t.description ? ` // ${t.description}` : '';
      const value = t.scssRaw ? cssValue(t) : `var(${CSS_PREFIX}${t.name})`;
      lines.push(`$${t.name}: ${value};${note}`);
    }
    lines.push('');
  }

  const raw = tokens.filter((t) => t.scssRaw);
  if (raw.length) {
    lines.push('// 미디어쿼리용 (CSS 변수는 @media 안에서 쓸 수 없어 값을 그대로 둔다)');
    lines.push('$breakpoints: (');
    for (const t of raw) {
      const key = t.name.replace(/^breakpoint-/, '');
      lines.push(`  ${key}: ${cssValue(t)},`);
    }
    lines.push(');', '');
  }

  lines.push('// :root에 출력할 CSS 변수 전체 (base/_root.scss가 사용)');
  lines.push('$css-variables: (');
  for (const t of tokens) {
    lines.push(`  ${quote(CSS_PREFIX + t.name)}: ${quote(cssValue(t))},`);
  }
  lines.push(');', '');

  return lines.join('\n');
}

// ---------- 실행 ----------

async function main() {
  const check = process.argv.includes('--check');

  const [color, space, textStyles] = await Promise.all(
    Object.values(FIGMA_FILES).map((f) => readJson(path.join(FIGMA_DIR, f))),
  );

  walk(color, [], { source: `tokens/figma/${FIGMA_FILES.color}`, section: 'color' });
  walk(space, [], { source: `tokens/figma/${FIGMA_FILES.space}`, section: 'space' });
  collectFigmaTextStyles(textStyles);

  let customFiles = [];
  try {
    customFiles = (await readdir(CUSTOM_DIR)).filter((f) => f.endsWith('.json')).sort();
  } catch {
    /* tokens/custom 없음 */
  }
  for (const file of customFiles) {
    const json = await readJson(path.join(CUSTOM_DIR, file));
    walk(json, [], {
      source: `tokens/custom/${file}`,
      section: `custom · ${file.replace('.json', '')}`,
    });
  }

  for (const t of tokens) if (t.ref) resolveRef(t);
  checkCycles();

  const next = render();
  if (check) {
    let current = '';
    try {
      current = await readFile(OUT_FILE, 'utf8');
    } catch {
      /* 없으면 불일치 */
    }
    if (current !== next) fail('_generated.scss가 최신이 아닙니다. `pnpm tokens`를 실행하세요.');
    console.log(`[build-tokens] OK — 토큰 ${tokens.length}개, _generated.scss 최신`);
    return;
  }

  await writeFile(OUT_FILE, next, 'utf8');
  const figmaCount = tokens.filter((t) => t.source.startsWith('tokens/figma')).length;
  console.log(
    `[build-tokens] ${path.relative(ROOT, OUT_FILE)} 생성 — 토큰 ${tokens.length}개 (Figma ${figmaCount}, 코드 ${tokens.length - figmaCount})`,
  );
}

main();
