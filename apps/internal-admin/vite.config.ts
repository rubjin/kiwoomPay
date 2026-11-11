import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// JSP 프로젝트의 정적 폴더 (docs/jsp-integration.md). 예: <JSP>/src/main/webapp/static/internal-admin
const outDir = process.env.JSP_STATIC_DIR ?? 'dist';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias: { '@': r('./src') },
  },
  // 개발 서버에서만 디자인 시스템 빌드 폴더(fonts/)를 정적 파일로 쓴다. 운영은 JSP가 폰트를 로드
  publicDir: command === 'serve' ? r('../../packages/design-system/dist') : false,
  server: {
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
        assetFileNames: (info) =>
          info.names?.[0]?.endsWith('.css') ? 'app.css' : 'assets/[name]-[hash][extname]',
      },
    },
  },
}));
