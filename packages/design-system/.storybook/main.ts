import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: ['../docs/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    {
      name: '@storybook/addon-docs',
      // MDX 가이드의 마크다운 표(| … |)를 그리려면 GFM이 필요하다 (Storybook 기본 MDX는 표 미지원)
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
  ],
  framework: '@storybook/react-vite',
  // Pretendard 웹폰트(self-host). 라이브러리 빌드에서는 scripts/copy-fonts.mjs가 dist/fonts로 복사한다.
  staticDirs: [{ from: '../node_modules/pretendard/dist/web/variable', to: '/fonts/pretendard' }],
};

export default config;
