import type { Decorator, Preview } from '@storybook/react-vite';
import { Fragment } from 'react';
import '../src/styles/index.scss';

// defaultValue · defaultOpen 같은 초기값은 처음 그릴 때만 반영된다.
// 단순 값(글자·숫자·참거짓) 컨트롤이 바뀌면 다시 그려서 Controls 변경이 바로 보이게 한다.
const remountOnArgsChange: Decorator = (Story, context) => {
  const key = Object.entries(context.args)
    .filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value))
    .map(([name, value]) => `${name}=${String(value)}`)
    .join('&');
  // Fragment에 key만 준다 (DOM에 요소를 추가하지 않음)
  return (
    <Fragment key={key}>
      <Story />
    </Fragment>
  );
};

// 시스템별 키컬러 확인: 툴바에서 고른 시스템을 <html data-system>에 넣는다 (tokens/custom/themes/*.json)
const applySystem: Decorator = (Story, context) => {
  const system = context.globals.system as string | undefined;
  if (system && system !== 'internal') document.documentElement.dataset.system = system;
  else delete document.documentElement.dataset.system;
  return <Story />;
};

const preview: Preview = {
  decorators: [remountOnArgsChange, applySystem],
  globalTypes: {
    system: {
      description: '시스템별 키컬러',
      toolbar: {
        title: '시스템',
        icon: 'paintbrush',
        items: [
          { value: 'internal', title: '내부관리자 (기본)' },
          { value: 'merchant', title: '가맹점관리자' },
          { value: 'agency', title: '영업대행사 (미정 · 기본색)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { system: 'internal' },
  parameters: {
    controls: { expanded: true },
    layout: 'padded',
    // 사이드바 순서: 소개 → Foundation → Components, 각 컴포넌트 안에서는 Guide를 먼저
    options: {
      storySort: {
        order: ['Introduction', 'Foundation', 'Components', ['*', ['Guide', '*']]],
      },
    },
  },
};

export default preview;
