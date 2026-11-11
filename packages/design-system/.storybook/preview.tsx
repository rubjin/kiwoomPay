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

const preview: Preview = {
  decorators: [remountOnArgsChange],
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
