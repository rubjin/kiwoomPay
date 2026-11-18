import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, mergeConfig } from 'vite';
import { designSystemSource } from '../../packages/design-system/vite.source';
import { ibsheet } from '../../packages/design-system/vite.ibsheet';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// JSP 프로젝트의 정적 폴더 (docs/jsp-integration.md). 예: <JSP>/src/main/webapp/static/kwp2-center-admin-fe
const outDir = process.env.JSP_STATIC_DIR ?? 'dist';

export default defineConfig(({ command }) =>
  mergeConfig(
    {
      // ibsheet(): 개발 서버에서 vendor/ibsheet(IBSheet8, git 제외)를 로드. 운영은 셸 JSP (vendor/README.md)
      plugins: [react(), ibsheet()],
      resolve: {
        alias: { '@': r('./src') },
      },
      // 폰트: 개발 서버는 designSystemSource()가 pretendard 패키지에서 바로 준다. 운영은 JSP가 로드(빌드 후 copy-fonts)
      server: {
        // 화면 목록 앱(apps/screen-list)의 링크가 이 주소를 가리킨다 (VITE_URL_CENTER 기본값)
        port: 5173,
        strictPort: true,
        proxy: { '/api': 'http://localhost:8580' },
      },
      // 상대 경로: lazy chunk · 폰트를 app.js 위치 기준으로 찾는다 → 컨텍스트 패스가 바뀌어도 빌드를 다시 할 필요 없음
      base: command === 'build' ? './' : '/',
      build: {
        outDir,
        emptyOutDir: true,
        cssCodeSplit: false,
        rollupOptions: {
          input: r('./src/app/main.tsx'),
          output: {
            entryFileNames: 'app.js',
            chunkFileNames: 'chunks/[name]-[hash].js',
            assetFileNames: (info: { names?: string[] }) =>
              info.names?.[0]?.endsWith('.css') ? 'app.css' : 'assets/[name]-[hash][extname]',
          },
        },
      },
    },
    // 개발 서버: 디자인 시스템 src를 바로 읽는다 (수정 즉시 반영). 운영 빌드는 dist
    command === 'serve' ? designSystemSource() : {},
  ),
);
