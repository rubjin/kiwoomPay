// Pretendard Variable(dynamic subset) woff2를 dist/fonts/pretendard로 복사한다.
// 앱/JSP는 이 폴더의 CSS를 <link>로 불러온다. (docs/jsp-integration.md)
import { cp, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const pkgDir = path.dirname(require.resolve('pretendard/package.json'));
const src = path.join(pkgDir, 'dist/web/variable');
const dest = path.join(ROOT, 'dist/fonts/pretendard');

await mkdir(dest, { recursive: true });
await cp(
  path.join(src, 'pretendardvariable-dynamic-subset.css'),
  path.join(dest, 'pretendardvariable-dynamic-subset.css'),
);
await cp(path.join(src, 'woff2-dynamic-subset'), path.join(dest, 'woff2-dynamic-subset'), {
  recursive: true,
});
console.log('[copy-fonts] dist/fonts/pretendard 복사 완료');
