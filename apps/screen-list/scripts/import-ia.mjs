// IA(구글 시트) → src/ia/<시스템>.generated.ts
// 사용: pnpm --filter screen-list ia   (시트 공유: 링크가 있는 모든 사용자 – 뷰어)
// 시트 열: NO · 위치(1~4depth) · … · 화면ID(12자리) · 화면유형(M/T/P/PT) · 신규구분 · … · 비고
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SHEET_ID = '1UsTFZIQsprf0OieYVVkhEDGDXy3sxbFM';
// 시스템별 탭(gid). 가맹점관리자 · 영업대행사 탭이 생기면 추가
const TABS = [{ system: 'internal', gid: '1963685273', file: 'internal' }];

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
  // 머리 2줄(제목 · 범례) + 열 이름 2줄 다음부터. NO가 숫자이고 화면ID가 있는 줄만
  const items = rows
    .filter((r) => /^\d+$/.test(clean(r[0])) && clean(r[17]))
    .map((r) => ({
      no: Number(clean(r[0])),
      depth1: clean(r[1]),
      depth2: clean(r[2]),
      depth3: clean(r[3]),
      depth4: clean(r[4]),
      id: clean(r[17]),
      kind: clean(r[18]),
      change: clean(r[19]),
      note: clean(r[22]),
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
