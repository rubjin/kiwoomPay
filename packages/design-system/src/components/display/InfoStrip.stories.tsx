import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge';
import { InfoStrip } from './InfoStrip';

const meta = {
  title: 'Components/Info Strip',
  component: InfoStrip,
  args: {
    items: [
      {
        label: '현재 상태',
        value: (
          <Badge tone="success" size="md">
            정상
          </Badge>
        ),
      },
      { label: '최종 변경일시', value: '2026-08-29 15:30:00' },
      { label: '최근 변경사유', value: '관리자 잠금 해제' },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: 840 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InfoStrip>;
export default meta;
type Story = StoryObj<typeof meta>;

/** 현재 상태 요약 (Figma 마이페이지 계정 상태 이력 "현재 계정 상태") */
export const Playground: Story = {};
