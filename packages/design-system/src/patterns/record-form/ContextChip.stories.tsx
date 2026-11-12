import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContextChip } from './ContextChip';

const meta = {
  title: 'Composites/Form/Record Form/ContextChip',
  component: ContextChip,
  args: {
    items: [
      { label: '현재 사업자', value: '㈜ABC커머스' },
      { label: '사업자번호', value: '123-45-67890' },
      { label: '사업자구분', value: '법인 (중소2)' },
    ],
    muted: false,
  },
  argTypes: { muted: { control: 'boolean' } },
} satisfies Meta<typeof ContextChip>;
export default meta;
type Story = StoryObj<typeof meta>;

/** 흰색: 페이지 제목 옆 (회색 배경 위) */
export const Playground: Story = {
  render: (args) => (
    <div style={{ padding: 12, background: 'var(--kp-color-bg-page)' }}>
      <ContextChip {...args} />
    </div>
  ),
};

/** muted: 흰 카드 안 (선택 CPID 아래 줄) */
export const Muted: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ContextChip
      muted
      items={[
        { label: '현재 사업자', value: '㈜ABC커머스' },
        { label: '대표자명', value: '홍길동' },
      ]}
    />
  ),
};
