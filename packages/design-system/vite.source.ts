// 앱 개발 서버가 디자인 시스템을 dist(빌드 결과)가 아니라 src에서 바로 읽게 하는 설정.
// 컴포넌트를 고치고 저장하면 앱 화면에 즉시 반영된다 (pnpm build 불필요).
// 운영 빌드(vite build)에서는 쓰지 않는다 — 앱은 그대로 dist를 번들한다.
//
//   import { designSystemSource } from '../../packages/design-system/vite.source';
//   export default defineConfig(({ command }) => mergeConfig({...}, command === 'serve' ? designSystemSource() : {}));
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin, UserConfig } from 'vite';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// Pretendard 웹폰트 원본 (Storybook staticDirs와 같은 폴더). dist/fonts는 pnpm build 중에 지워졌다 다시 생기므로 쓰지 않는다
const FONT_URL = '/fonts/pretendard/';
const fontDir = path.join(
  path.dirname(createRequire(import.meta.url).resolve('pretendard/package.json')),
  'dist/web/variable',
);
const FONT_TYPES: Record<string, string> = { '.css': 'text/css', '.woff2': 'font/woff2' };

/** 개발 서버: /fonts/pretendard/* → pretendard 패키지 (index.html · 셸 JSP와 같은 주소) */
function pretendardFonts(): Plugin {
  return {
    name: 'kp-pretendard-fonts',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? '';
        if (!url.startsWith(FONT_URL)) return next();
        const file = path.join(fontDir, decodeURIComponent(url.slice(FONT_URL.length)));
        if (!file.startsWith(fontDir) || !existsSync(file) || !statSync(file).isFile())
          return next();
        res.setHeader('Content-Type', FONT_TYPES[path.extname(file)] ?? 'application/octet-stream');
        createReadStream(file).pipe(res);
      });
    },
  };
}

/**
 * 개발 서버용 CSS Modules 클래스 이름: Badge.module.scss의 .badge → Badge_badge (해시 없음 — 검수용).
 * 파일 이름으로 구분하므로 *.module.scss 파일 이름이 겹치면 안 된다. 빌드는 해시를 붙인다(vite.config.ts).
 */
export function devScopedName(local: string, filename: string): string {
  const file = path.basename(filename.split('?')[0] ?? filename).replace(/\.module\.\w+$/, '');
  return `${file}_${local}`;
}

export function designSystemSource(): UserConfig {
  return {
    plugins: [pretendardFonts()],
    resolve: {
      alias: [
        // style.css(토큰 · reset · global)는 src/index.ts가 이미 불러오므로 같은 SCSS로 연결
        {
          find: /^@kiwoompay\/design-system\/style\.css$/,
          replacement: r('./src/styles/index.scss'),
        },
        // IBSheet 연결 (IbsheetGrid · 공통 옵션 · 셀 도우미, 운영은 dist/ibsheet.js)
        {
          find: /^@kiwoompay\/design-system\/ibsheet$/,
          replacement: r('./src/ibsheet/index.ts'),
        },
        // KWP IBSheet 테마 (공통 CSS와 별도 파일, 운영은 dist/ibsheet.css)
        {
          find: /^@kiwoompay\/design-system\/ibsheet\.css$/,
          replacement: r('./src/styles/ibsheet/ibsheet-theme.scss'),
        },
        { find: /^@kiwoompay\/design-system$/, replacement: r('./src/index.ts') },
      ],
    },
    css: {
      // 디자인 시스템 vite.config.ts 개발 서버와 같게: 짧은 클래스 이름 + 개발자 도구에 SCSS 파일 · 줄 표시
      modules: { generateScopedName: devScopedName },
      devSourcemap: true,
      preprocessorOptions: { scss: { loadPaths: [r('./src/styles')] } },
    },
  };
}
