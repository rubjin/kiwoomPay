// Figma에서 내보낸 SVG → src/components/Icon/icons.generated.tsx
//
//   node scripts/build-icons.mjs           생성
//   node scripts/build-icons.mjs --check   생성 결과가 현재 파일과 다르면 실패 (CI용)
//
// 입력: src/assets/icons/Name=<아이콘명>, Size=<12|16|20|24>.svg  (Figma 기본 내보내기 이름)
//   - `Name=`으로 시작하지 않는 파일(Icon-1.svg 등)은 무시한다.
// 규칙은 docs/icon-workflow.md 참고.

import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ICON_DIR = path.join(ROOT, 'src/assets/icons');
const OUT_FILE = path.join(ROOT, 'src/components/Icon/icons.generated.tsx');
const SIZES = [12, 16, 20, 24];

// ── 이름 규칙 ────────────────────────────────────────────
// 기본: Figma 이름을 kebab-case로 바꾼다. (Check-circle_filled → check-circle-filled, InfoBox → info-box)
// 아래는 Figma 이름이 의미를 알 수 없거나 서로 다른 모양이 같은 이름을 쓴 경우의 지정이다.
const NAME_BY_FIGMA_NAME = {
  '1dp(0)': 'home',
  '1dp(1)': 'card-check',
  '1dp(2)': 'bar-chart',
  '1dp(3)': 'file-text',
  '1dp(4)': 'building',
  '1dp(5)': 'archive',
  '1dp(6)': 'shield-check',
};
// 파일 단위 지정 (같은 이름·크기가 중복되거나, 같은 Figma 이름에 다른 모양이 섞여 있는 파일)
const BY_FILE = {
  'Name=Link-external, Size=12.svg': { name: 'arrow-up-right', size: 12 },
  'Name=Link-external, Size=24-1.svg': { name: 'arrow-up-right', size: 24 },
  'Name=Setting, Size=20-1.svg': { name: 'setting-sliders', size: 20 },
};

// ── 색 규칙 ──────────────────────────────────────────────
// 선 아이콘은 색을 고정하지 않고 글자색(currentColor)을 따른다.
// 상태색을 쓰는 채움 아이콘만 토큰 변수(tokens/custom/icon.json)로 연결한다.
const TOKEN_BY_HEX = {
  '#8C98A6': 'var(--kp-color-icon-muted)',
  '#2484C6': 'var(--kp-color-icon-accent)',
  '#3B82F6': 'var(--kp-color-icon-info)',
  '#22C55E': 'var(--kp-color-icon-success)',
  '#F59E0B': 'var(--kp-color-icon-warning)',
  '#EF4444': 'var(--kp-color-icon-error)',
};
const ON_COLOR = 'var(--kp-color-icon-on-color)';
// 선 아이콘의 기본색으로 쓰인 값 (글자색을 따른다)
const LINE_COLORS = new Set(['#111827', '#1E293B', '#667281', '#8C98A6']);
const DARK_FILLS = new Set(['#111827', '#1E293B']);

const ALLOWED_TAGS = new Set([
  'path',
  'rect',
  'circle',
  'ellipse',
  'line',
  'polyline',
  'polygon',
  'g',
  'defs',
  'clipPath',
]);

const fail = (msg) => {
  console.error(`[build-icons] ${msg}`);
  process.exit(1);
};

const kebab = (s) =>
  s
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

const camel = (attr) => attr.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

// ── SVG 파싱 (Figma 내보내기 수준의 단순한 구조만 지원) ──
function parseAttrs(text) {
  const attrs = {};
  for (const m of text.matchAll(/([\w:-]+)="([^"]*)"/g)) attrs[m[1]] = m[2];
  return attrs;
}

function parseSvg(source, where) {
  const root = source.match(/<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/);
  if (!root) fail(`${where}: <svg> 요소를 찾을 수 없습니다`);
  const rootAttrs = parseAttrs(root[1]);
  const top = { tag: 'root', attrs: {}, children: [] };
  const stack = [top];
  for (const m of root[2].matchAll(/<(\/?)([A-Za-z][\w:-]*)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>/g)) {
    const [, closing, tag, attrText, selfClosing] = m;
    if (closing) {
      stack.pop();
      continue;
    }
    if (!ALLOWED_TAGS.has(tag)) fail(`${where}: 지원하지 않는 요소 <${tag}>`);
    const node = { tag, attrs: parseAttrs(attrText), children: [] };
    stack[stack.length - 1].children.push(node);
    if (!selfClosing) stack.push(node);
  }
  if (stack.length !== 1) fail(`${where}: 닫히지 않은 요소가 있습니다`);
  return { rootAttrs, children: top.children };
}

// ── 색 변환 ──────────────────────────────────────────────
const isWhite = (c) => c === 'white' || c.toUpperCase() === '#FFFFFF';
const hexOf = (c) => c.toUpperCase();

function convertColors(children, where) {
  let seenColoredFill = false; // 색 채움 도형을 이미 지났다면, 이후의 흰색은 그 위의 글리프다

  const mapFilled = (value) => {
    // 색 도형 앞의 흰색은 선·점 아이콘의 자리 표시이고, 색 도형 뒤의 흰색은 그 위에 얹힌 글리프다
    if (isWhite(value)) return seenColoredFill ? ON_COLOR : 'currentColor';
    const hex = hexOf(value);
    if (DARK_FILLS.has(hex)) return 'currentColor';
    if (TOKEN_BY_HEX[hex]) return TOKEN_BY_HEX[hex];
    return fail(
      `${where}: 매핑되지 않은 채움 색 ${value} — build-icons.mjs의 색 규칙에 추가하세요`,
    );
  };

  const visit = (node) => {
    if (node.tag === 'defs') return; // clipPath 안의 흰색은 모양 정의일 뿐이라 건드리지 않는다
    if (node.tag === 'g') return node.children.forEach(visit);
    const { fill, stroke } = node.attrs;
    const filled = fill !== undefined && fill !== 'none';
    if (filled) {
      node.attrs.fill = mapFilled(fill);
      if (stroke !== undefined) node.attrs.stroke = mapFilled(stroke);
      if (!isWhite(fill)) seenColoredFill = true;
    } else if (stroke !== undefined) {
      if (isWhite(stroke)) node.attrs.stroke = seenColoredFill ? ON_COLOR : 'currentColor';
      else if (LINE_COLORS.has(hexOf(stroke))) node.attrs.stroke = 'currentColor';
      else if (TOKEN_BY_HEX[hexOf(stroke)]) node.attrs.stroke = TOKEN_BY_HEX[hexOf(stroke)];
      else fail(`${where}: 매핑되지 않은 선 색 ${stroke} — build-icons.mjs의 색 규칙에 추가하세요`);
    }
  };
  children.forEach(visit);
}

// clipPath id는 아이콘 사이에서 겹치지 않도록 이름·크기를 붙여 새로 만든다
function renameIds(children, prefix) {
  const map = new Map();
  const collect = (node) => {
    if (node.attrs.id) map.set(node.attrs.id, `${prefix}-${map.size}`);
    node.children.forEach(collect);
  };
  children.forEach(collect);
  if (map.size === 0) return;
  const apply = (node) => {
    if (node.attrs.id) node.attrs.id = map.get(node.attrs.id);
    for (const [key, value] of Object.entries(node.attrs)) {
      node.attrs[key] = value.replace(/url\(#([^)]+)\)/g, (m, id) =>
        map.has(id) ? `url(#${map.get(id)})` : m,
      );
    }
    node.children.forEach(apply);
  };
  children.forEach(apply);
}

// ── JSX 출력 ─────────────────────────────────────────────
function toJsx(node, indent) {
  const pad = '  '.repeat(indent);
  const attrs = Object.entries(node.attrs)
    .map(([k, v]) => ` ${camel(k)}="${v.replace(/"/g, '&quot;')}"`)
    .join('');
  if (node.children.length === 0) return `${pad}<${node.tag}${attrs} />`;
  const inner = node.children.map((c) => toJsx(c, indent + 1)).join('\n');
  return `${pad}<${node.tag}${attrs}>\n${inner}\n${pad}</${node.tag}>`;
}

// ── 실행 ─────────────────────────────────────────────────
async function main() {
  const check = process.argv.includes('--check');
  const files = (await readdir(ICON_DIR))
    .filter((f) => f.startsWith('Name=') && f.endsWith('.svg'))
    .sort();
  if (files.length === 0) fail(`${path.relative(ROOT, ICON_DIR)}에 Name=*.svg 파일이 없습니다`);

  /** name → size → 아이콘 */
  const icons = new Map();
  for (const file of files) {
    let name;
    let size;
    if (BY_FILE[file]) {
      ({ name, size } = BY_FILE[file]);
    } else {
      const m = file.match(/^Name=(.+), Size=(\d+)(?:-\d+)?\.svg$/);
      if (!m) fail(`${file}: 파일 이름이 "Name=<이름>, Size=<크기>.svg" 형식이 아닙니다`);
      if (/-\d+\.svg$/.test(file))
        fail(`${file}: 같은 이름·크기가 중복됩니다. build-icons.mjs의 BY_FILE에 이름을 지정하세요`);
      name = NAME_BY_FIGMA_NAME[m[1]] ?? kebab(m[1]);
      size = Number(m[2]);
    }
    if (!/^[a-z][a-z0-9-]*$/.test(name))
      fail(
        `${file}: 아이콘 이름 "${name}"을(를) 만들 수 없습니다 (NAME_BY_FIGMA_NAME에 지정하세요)`,
      );
    if (!SIZES.includes(size)) fail(`${file}: 지원하지 않는 크기 ${size} (${SIZES.join('/')})`);

    const source = await readFile(path.join(ICON_DIR, file), 'utf8');
    const { rootAttrs, children } = parseSvg(source, file);
    const vb = (rootAttrs.viewBox ?? '').split(/\s+/).join(' ');
    if (
      Number(rootAttrs.width) !== size ||
      Number(rootAttrs.height) !== size ||
      vb !== `0 0 ${size} ${size}`
    ) {
      fail(
        `${file}: width/height/viewBox가 Size=${size}와 다릅니다 (${rootAttrs.width}×${rootAttrs.height}, ${rootAttrs.viewBox})`,
      );
    }
    convertColors(children, file);
    renameIds(children, `kp-icon-${name}-${size}`);

    const bySize = icons.get(name) ?? icons.set(name, new Map()).get(name);
    if (bySize.has(size)) fail(`${file}: ${name} ${size}px가 이미 있습니다`);
    bySize.set(size, children);
  }

  const lines = [
    '// 자동 생성 파일 — 직접 수정 금지. `pnpm icons`로 갱신한다.',
    '// 원본: src/assets/icons/Name=*.svg (Figma 내보내기). 규칙: docs/icon-workflow.md',
    '',
    "import type { ReactNode } from 'react';",
    '',
    'export const iconSet = {',
  ];
  for (const name of [...icons.keys()].sort()) {
    lines.push(`  '${name}': {`);
    for (const size of [...icons.get(name).keys()].sort((a, b) => a - b)) {
      const body = icons
        .get(name)
        .get(size)
        .map((n) => toJsx(n, 4))
        .join('\n');
      lines.push(`    ${size}: () => (`, '      <>', body, '      </>', '    ),');
    }
    lines.push('  },');
  }
  lines.push(
    '} satisfies Record<string, Partial<Record<12 | 16 | 20 | 24, () => ReactNode>>>;',
    '',
  );
  const next = lines.join('\n');

  if (check) {
    let current = '';
    try {
      current = await readFile(OUT_FILE, 'utf8');
    } catch {
      /* 없으면 불일치 */
    }
    if (current !== next) fail('icons.generated.tsx가 최신이 아닙니다. `pnpm icons`를 실행하세요.');
    console.log(`[build-icons] OK — 아이콘 ${icons.size}개, icons.generated.tsx 최신`);
    return;
  }

  await writeFile(OUT_FILE, next, 'utf8');
  const variants = [...icons.values()].reduce((n, m) => n + m.size, 0);
  console.log(
    `[build-icons] ${path.relative(ROOT, OUT_FILE)} 생성 — 아이콘 ${icons.size}개, variant ${variants}개`,
  );
}

main();
