import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../docs/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  // Pretendard 웹폰트(self-host). 라이브러리 빌드에서는 scripts/copy-fonts.mjs가 dist/fonts로 복사한다.
  staticDirs: [{ from: '../node_modules/pretendard/dist/web/variable', to: '/fonts/pretendard' }],
};

export default config;
