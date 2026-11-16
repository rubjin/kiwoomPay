import type { Meta, StoryObj } from '@storybook/react-vite';
import { InlineFeedback } from './InlineFeedback';

const meta = {
  title: 'Components/Inline Feedback',
  component: InlineFeedback,
  args: {
    tone: 'error',
    children: '비밀번호 변경 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 580 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InlineFeedback>;
export default meta;
type Story = StoryObj<typeof meta>;

/** 처리 실패 안내 (Figma KWPC02010101 변경 처리 실패). error 외 tone은 같은 규칙의 Status 색 */
export const Playground: Story = {};

export const Tones: Story = {
  parameters: {
    controls: { disable: true },
    tempWork: 'error 외 tone (시안 없음)',
  },
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <InlineFeedback tone="error">
        비밀번호 변경 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
      </InlineFeedback>
      {/* <InlineFeedback tone="warning">일부 항목은 저장되지 않았습니다.</InlineFeedback>
      <InlineFeedback tone="success">저장되었습니다.</InlineFeedback>
      <InlineFeedback tone="info">처리 결과는 다운로드 센터에서 확인할 수 있습니다.</InlineFeedback> */}
    </div>
  ),
};
