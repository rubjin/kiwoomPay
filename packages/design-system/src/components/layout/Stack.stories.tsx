import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Stack } from './Stack';

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  args: { gap: 16, as: 'div' },
  argTypes: {
    gap: { control: 'inline-radio', options: [0, 4, 8, 12, 16, 24] },
    as: { control: 'inline-radio', options: ['div', 'section', 'span'] },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

// 예시 칸 (간격이 보이도록 회색 상자)
const Box = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      padding: 'var(--kp-space-12)',
      background: 'var(--kp-color-bg-page)',
      border: '1px solid var(--kp-color-line-default)',
    }}
  >
    {children}
  </div>
);

export const Playground: Story = {
  render: (args) => (
    <Stack {...args}>
      <Box>안내</Box>
      <Box>요청 정보 표</Box>
      <Box>처리 이력 표</Box>
    </Stack>
  ),
};

/** 팝업 본문: 영역 사이 16, 영역 안 소제목 ↔ 표 8 */
export const Nested: Story = {
  render: () => (
    <Stack>
      <Box>안내 (Infobox)</Box>
      <Stack as="section" gap={8}>
        <Box>소제목 (SectionHeading h3)</Box>
        <Box>표 (FormTable)</Box>
      </Stack>
      <Stack as="section" gap={8}>
        <Box>소제목</Box>
        <Box>표</Box>
      </Stack>
    </Stack>
  ),
};
