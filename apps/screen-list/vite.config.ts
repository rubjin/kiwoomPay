import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, mergeConfig } from 'vite';
import { designSystemSource } from '../../packages/design-system/vite.source';

// 화면 확인용 목록 (임의 작업). 루트 pnpm dev(관리자 앱과 함께) 또는 pnpm screens(목록만)
export default defineConfig(({ command }) =>
  mergeConfig(
    {
      plugins: [react()],
      // 개발 서버에서 디자인 시스템 빌드 폴더(fonts/)를 정적 파일로 쓴다
      publicDir:
        command === 'serve'
          ? fileURLToPath(new URL('../../packages/design-system/dist', import.meta.url))
          : false,
      // pnpm dev · pnpm screens 실행 시 브라우저에서 화면 목록을 바로 연다
      server: { port: 5180, strictPort: true, open: true },
      base: './',
    },
    command === 'serve' ? designSystemSource() : {},
  ),
);
