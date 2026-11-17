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
        { find: /^@kiwoompay\/design-system$/, replacement: r('./src/index.ts') },
      ],
    },
    css: {
      // 디자인 시스템 vite.config.ts와 같게
      modules: { generateScopedName: 'kp_[name]_[local]_[hash:base64:5]' },
      preprocessorOptions: { scss: { loadPaths: [r('./src/styles')] } },
    },
  };
}
