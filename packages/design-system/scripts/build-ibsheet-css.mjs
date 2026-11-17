// KWP IBSheet 테마(src/styles/ibsheet/ibsheet-theme.scss) → dist/ibsheet.css
// 디자인 시스템 공통 CSS(kiwoompay-ui.css)와 별도 파일 — IBSheet를 쓰는 앱만 불러온다 (@kiwoompay/design-system/ibsheet.css).
// 색 · 글자는 --kp-* CSS 변수라 kiwoompay-ui.css(:root 변수)가 함께 로드돼 있어야 한다
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(ROOT, 'src/styles/ibsheet/ibsheet-theme.scss');
const dest = path.join(ROOT, 'dist/ibsheet.css');

const { css } = sass.compile(src, {
  loadPaths: [path.join(ROOT, 'src/styles')],
  style: 'compressed',
});
await mkdir(path.dirname(dest), { recursive: true });
await writeFile(dest, css);
console.log('[build-ibsheet-css] dist/ibsheet.css 생성 완료');
