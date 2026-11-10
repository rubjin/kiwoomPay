import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      // 라이브러리 클래스가 앱 스타일과 충돌하지 않도록 접두어를 붙인다.
      generateScopedName: 'kp_[name]_[local]_[hash:base64:5]',
    },
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
});
