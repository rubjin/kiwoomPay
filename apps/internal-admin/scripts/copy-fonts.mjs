// 디자인 시스템의 Pretendard 폰트를 앱 빌드 폴더(fonts/)로 복사한다. 셸 JSP가 <link>로 로드
import { cpSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const from = fileURLToPath(new URL('../../../packages/design-system/dist/fonts', import.meta.url));
const outDir = process.env.JSP_STATIC_DIR ?? fileURLToPath(new URL('../dist', import.meta.url));
cpSync(from, `${outDir}/fonts`, { recursive: true });
console.log(`fonts → ${outDir}/fonts`);
