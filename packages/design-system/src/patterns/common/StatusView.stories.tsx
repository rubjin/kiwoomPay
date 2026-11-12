import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/Button';
import { StatusView } from './StatusView';

const meta = {
  title: 'Components/Status View',
  component: StatusView,
  args: { status: 'empty' },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['idle', 'loading', 'empty', 'error', 'forbidden'],
    },
  },
} satisfies Meta<typeof StatusView>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** 다섯 상태 (Figma 상태별 GUI: 조회 전 · 조회 중 · 결과 없음 · 조회 실패) */
export const States: Story = {
  parameters: { controls: { disable: true }, tempWork: '권한 없음(forbidden) 문구' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      {(['idle', 'loading', 'empty', 'error', 'forbidden'] as const).map((status) => (
        <StatusView key={status} status={status} />
      ))}
      <StatusView
        status="error"
        description="네트워크 상태를 확인해주세요"
        action={
          <Button size="sm" variant="neutral">
            다시 시도
          </Button>
        }
      />
    </div>
  ),
};
