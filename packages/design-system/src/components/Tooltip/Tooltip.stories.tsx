import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';
import { Button } from '../Button';
import { InfoTip } from './InfoTip';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Components/Feedback/Tooltip',
  component: InfoTip,
  args: { content: '도움말 내용을 확인할 수 있습니다.' },
  argTypes: {
    placement: { control: 'inline-radio', options: ['bottom', 'top', 'left', 'right'] },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '40px 40px 120px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: { tempWork: '화면 경계 최소 간격 · 비활성 Info 아이콘 · z-index' },
} satisfies Meta<typeof InfoTip>;

export default meta;
type Story = StoryObj<typeof meta>;

const row: CSSProperties = {
  display: 'flex',
  gap: 280,
  alignItems: 'flex-start',
  flexWrap: 'wrap',
};
const label: CSSProperties = {
  display: 'inline-flex',
  gap: 4,
  alignItems: 'center',
  fontSize: 14,
  fontWeight: 600,
};

function Labeled({ title, children }: { title: string; children: ReactNode }) {
  return (
    <span style={label}>
      {title}
      {children}
    </span>
  );
}

/** Info 아이콘에 마우스를 올리면 200ms 후, Tab 키로 Focus하면 바로 표시. 벗어나거나 Esc로 닫기 */
export const Playground: Story = {};

/** Short: 콘텐츠 크기에 맞춰 가로 확장 / Long: 최대 320에서 자동 줄바꿈, 높이 Hug */
export const SizeAndWrap: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ ...row, paddingBottom: 60 }}>
      <InfoTip defaultOpen content="짧은 안내 문구입니다." />
      <InfoTip
        defaultOpen
        content="안내 문구가 길어져 툴팁의 최대 너비를 초과하면 텍스트가 자동으로 줄바꿈됩니다. 내용이 여러 줄이어도 잘리지 않도록 툴팁 높이가 함께 늘어납니다."
      />
    </div>
  ),
};

/** 실제 문구 4개를 연결한 예시 (권한 관리 화면) */
export const ContentExamples: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 360px)',
        rowGap: 120,
        columnGap: 40,
      }}
    >
      <Labeled title="보유 메뉴 권한">
        <InfoTip
          defaultOpen
          content="현재 사용자에게 부여된 메뉴 접근 권한을 기준으로 산정합니다. 메뉴 내 조회·등록·수정·다운로드 등 상세 기능 권한은 권한관리 화면에서 확인할 수 있습니다."
        />
      </Labeled>
      <Labeled title="권한 템플릿">
        <InfoTip
          defaultOpen
          content="사용자에게 적용된 기본 권한 묶음입니다. 템플릿에 정의된 메뉴·기능 권한을 기본으로 하며 별도로 부여된 예외 권한이 추가될 수 있습니다."
        />
      </Labeled>
      <Labeled title="데이터 접근 범위">
        <InfoTip
          defaultOpen
          content="사용자가 조회·처리할 수 있는 데이터의 범위입니다. CPID 등 업무 데이터 접근 기준에 따라 제한될 수 있습니다."
        />
      </Labeled>
      <Labeled title="특수권한">
        <InfoTip
          defaultOpen
          content="업무상 별도 승인이 필요한 한시적 권한입니다. 권한별 유효기간이 적용되며 기간 만료 시 사용할 수 없습니다."
        />
      </Labeled>
    </div>
  ),
};

/** Bottom(기본) · Top · Left · Right. 공간이 모자라면 자동으로 바뀐다 */
export const Placement: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 480px)', gridAutoRows: 120 }}>
      <div style={{ paddingLeft: 40 }}>
        <InfoTip defaultOpen content="도움말 내용을 확인할 수 있습니다." />
      </div>
      <div style={{ paddingLeft: 40, paddingTop: 60 }}>
        <InfoTip defaultOpen placement="top" content="툴팁을 아이콘 위쪽에 표시합니다." />
      </div>
      <div style={{ paddingLeft: 300, paddingTop: 40 }}>
        <InfoTip
          defaultOpen
          placement="left"
          content="화면 경계를 넘지 않도록 위치를 조정합니다."
        />
      </div>
      <div style={{ paddingLeft: 40, paddingTop: 40 }}>
        <InfoTip defaultOpen placement="right" content="아이콘 오른쪽에 툴팁을 표시합니다." />
      </div>
    </div>
  ),
};

/** 화면 오른쪽 끝: 아래 배치가 넘치면 아이콘 왼쪽에 표시 (Viewport Boundary) */
export const ViewportBoundary: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <InfoTip defaultOpen content="화면 경계를 넘지 않도록 위치를 조정합니다." />
    </div>
  ),
};

/** 카드가 overflow: hidden이어도 툴팁은 Overlay 계층에 그려져 잘리지 않는다 */
export const ContainerClip: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        width: 360,
        height: 72,
        padding: 12,
        overflow: 'hidden',
        border: '1px solid var(--kp-color-line-subtle)',
        borderRadius: 8,
        fontSize: 12,
        color: 'var(--kp-color-text-secondary)',
      }}
    >
      CARD / CLIP CONTENT
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <InfoTip defaultOpen content="카드 영역을 벗어나도 툴팁은 잘리지 않습니다." />
      </div>
    </div>
  ),
};

/** Info 아이콘이 아닌 요소에도 Tooltip을 붙일 수 있다 (보조 설명 전용) */
export const OnButton: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Tooltip content="선택한 거래만 취소 요청합니다.">
      <Button size="sm">선택 취소</Button>
    </Tooltip>
  ),
};
