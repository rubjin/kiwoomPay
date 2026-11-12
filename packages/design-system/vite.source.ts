// 앱 개발 서버가 디자인 시스템을 dist(빌드 결과)가 아니라 src에서 바로 읽게 하는 설정.
// 컴포넌트를 고치고 저장하면 앱 화면에 즉시 반영된다 (pnpm build 불필요).
// 운영 빌드(vite build)에서는 쓰지 않는다 — 앱은 그대로 dist를 번들한다.
//
//   import { designSystemSource } from '../../packages/design-system/vite.source';
//   export default defineConfig(({ command }) => mergeConfig({...}, command === 'serve' ? designSystemSource() : {}));
import { fileURLToPath } from 'node:url';
import type { UserConfig } from 'vite';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export function designSystemSource(): UserConfig {
  return {
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
