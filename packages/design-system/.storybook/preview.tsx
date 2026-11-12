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

// 시안 · 정책 없이 임시로 만든 부분 표시: 스토리(또는 meta) parameters.tempWork → 오른쪽 위 "(임의 작업: …)" 배지
const tempWorkBadge: Decorator = (Story, context) => {
  const text = context.parameters.tempWork as string | undefined;
  if (!text) return <Story />;
  return (
    <div style={{ position: 'relative' }}>
      <Story />
      <div
        role="note"
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2000,
          maxWidth: 480,
          padding: '4px 8px',
          font: '600 12px/1.5 Pretendard, sans-serif',
          color: 'var(--kp-color-status-warning-text)',
          background: 'var(--kp-color-status-warning-background)',
          border: '1px solid var(--kp-color-status-warning-border)',
          borderRadius: 4,
          pointerEvents: 'none',
        }}
      >
        (임의 작업: {text})
      </div>
    </div>
  );
};

const preview: Preview = {
  decorators: [remountOnArgsChange, applySystem, tempWorkBadge],
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
    // 사이드바 순서: 소개 → Foundation(토큰) → Components(단일 UI, 역할별 섹션) → Composites(컴포넌트 조합, 역할별 섹션)
    // → Layout(화면 틀) → Patterns(페이지 패턴). 각 항목 안에서는 Guide를 먼저
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundation',
          'Components',
          [
            'Action',
            ['*', ['Guide', '*']],
            'Input',
            ['Field', ['Guide', '*'], 'Selection', ['Guide', '*'], '*', ['Guide', '*']],
            'Navigation',
            ['*', ['Guide', '*']],
            'Display',
            ['*', ['Guide', '*']],
            'Feedback',
            ['*', ['Guide', '*']],
            'Icon',
            ['Guide', '*'],
          ],
          'Composites',
          [
            'Search',
            ['Search Area', ['Guide', '*'], 'Search Panel', ['Guide', '*'], '*', ['Guide', '*']],
            'Result',
            ['Result Parts', ['Guide', '*'], 'Status View', ['Guide', '*'], '*', ['Guide', '*']],
            'Form',
            ['*', ['Guide', '*']],
            'Feedback',
            ['*', ['Guide', '*']],
          ],
          'Layout',
          ['*', ['Guide', '*']],
          'Patterns',
          ['*', ['Guide', '*']],
        ],
      },
    },
  },
};

export default preview;
