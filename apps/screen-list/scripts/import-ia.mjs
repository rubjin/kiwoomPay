// IA(구글 시트) → src/ia/<시스템>.generated.ts
// 사용: pnpm --filter screen-list ia   (시트 공유: 링크가 있는 모든 사용자 – 뷰어)
// 시트 열: NO · 위치(1~4depth) · … · 화면ID · 화면 유형(M/T/P/PT) · 신규 구분 · … · 비고
// 탭마다 열 위치가 달라(가맹점관리자는 퍼블 예정일 없음, 영업대행파트너는 신규 구분 없음) 열 이름으로 찾는다
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SHEET_ID = '1UsTFZIQsprf0OieYVVkhEDGDXy3sxbFM';
// 시스템별 탭(gid). 전자계약(388644757)은 화면 목록 시스템이 없어 제외
const TABS = [
  { system: 'internal', gid: '1963685273', file: 'internal' },
  { system: 'merchant', gid: '2077804602', file: 'merchant' },
  { system: 'agency', gid: '1121402985', file: 'agency' },
];

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** 따옴표 · 칸 안 줄바꿈을 처리하는 CSV 파서 */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(cell);
      cell = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += c;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

const clean = (s = '') => s.replace(/\s+/g, ' ').trim();

for (const tab of TABS) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${tab.gid}`;
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`시트를 받지 못했습니다 (${res.status}). 공유 설정을 확인하세요: ${url}`);
  const rows = parseCsv(await res.text());
  // 열 이름 줄(NO로 시작)에서 열 위치를 찾는다. 화면ID는 두 번 나오는데 뒤쪽이 전체 ID
  const head = rows.find((r) => clean(r[0]) === 'NO');
  if (!head) throw new Error(`[ia] ${tab.system}: 열 이름 줄(NO)을 찾지 못했습니다`);
  const names = head.map((c) => c.replace(/\s+/g, ''));
  const col = (name) => names.lastIndexOf(name);
  const at = {
    id: col('화면ID'),
    kind: col('화면유형'),
    change: col('신규구분'),
    note: col('비고'),
  };
  if (at.id < 0) throw new Error(`[ia] ${tab.system}: 화면ID 열이 없습니다`);
  const cell = (r, i) => (i < 0 ? '' : clean(r[i]));
  // NO가 숫자이고 화면ID가 있는 줄만
  const items = rows
    .filter((r) => /^\d+$/.test(clean(r[0])) && cell(r, at.id))
    .map((r) => ({
      no: Number(clean(r[0])),
      depth1: clean(r[1]),
      depth2: clean(r[2]),
      depth3: clean(r[3]),
      depth4: clean(r[4]),
      id: cell(r, at.id),
      kind: cell(r, at.kind),
      change: cell(r, at.change),
      note: cell(r, at.note),
    }));
  const out = resolve(root, `src/ia/${tab.file}.generated.ts`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(
    out,
    `// 자동 생성 — 직접 고치지 않는다. scripts/import-ia.mjs (pnpm --filter screen-list ia)\n` +
      `// 출처: 구글 시트 ${SHEET_ID} gid ${tab.gid} · ${items.length}줄\n` +
      `import type { IaRow } from './types';\n\n` +
      `export const IA_${tab.file.toUpperCase()}: IaRow[] = ${JSON.stringify(items, null, 2)};\n`,
  );
  console.log(`[ia] ${tab.system}: ${items.length}줄 → ${out}`);
}
