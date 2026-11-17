import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { devScopedName } from './vite.source_bak';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig(({ command }) => ({
  plugins: [react()],
  css: {
    modules: {
      // 개발 서버(Storybook 포함)는 Badge_badge처럼 짧게 — 검수용 (*.module.scss 파일 이름이 겹치지 않아야 함).
      // 빌드는 앱 스타일과 충돌하지 않도록 접두어 + 해시.
      generateScopedName:
        command === 'serve' ? devScopedName : 'kp_[name]_[local]_[hash:base64:5]',
    },
    // 개발자 도구 Styles 패널에 원본 SCSS 파일 · 줄 표시
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        // 컴포넌트에서 @use 'tokens' / @use 'mixins' 로 불러온다.
        loadPaths: [r('./src/styles')],
      },
    },
  },
  build: {
    sourcemap: true,
    cssCodeSplit: false,
    lib: {
      entry: r('./src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
      cssFileName: 'kiwoompay-ui',
    },
    rollupOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/],
    },
  },
}));
