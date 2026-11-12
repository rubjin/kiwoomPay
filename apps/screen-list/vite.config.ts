import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, mergeConfig } from 'vite';
import { designSystemSource } from '../../packages/design-system/vite.source';

// 화면 확인용 목록 (임의 작업). 관리자 앱과 별도로 띄운다: pnpm --filter @kiwoompay/screen-list dev
export default defineConfig(({ command }) =>
  mergeConfig(
    {
      plugins: [react()],
      // 개발 서버에서 디자인 시스템 빌드 폴더(fonts/)를 정적 파일로 쓴다
      publicDir:
        command === 'serve'
          ? fileURLToPath(new URL('../../packages/design-system/dist', import.meta.url))
          : false,
      server: { port: 5180 },
      base: './',
    },
    command === 'serve' ? designSystemSource() : {},
  ),
);
