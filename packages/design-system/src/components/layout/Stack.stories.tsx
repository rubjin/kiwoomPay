import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Stack } from './Stack';

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  args: { gap: 16, as: 'div' },
  argTypes: {
    gap: { control: 'inline-radio', options: [0, 4, 8, 12, 16, 24] },
    as: { control: 'inline-radio', options: ['div', 'section', 'span', 'dl'] },
    direction: { control: 'inline-radio', options: ['column', 'row'] },
    justify: { control: 'inline-radio', options: ['start', 'between'] },
    align: { control: 'inline-radio', options: ['stretch', 'start', 'center', 'baseline'] },
    wrap: { control: 'boolean' },
    columns: { control: 'inline-radio', options: [undefined, 2] },
    paddingBlock: { control: 'inline-radio', options: [undefined, 4, 8] },
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

/** 가로 양끝 정렬: 왼쪽 탭 · 설명 ↔ 오른쪽 버튼 (인라인 display: flex · space-between 대신) */
export const RowBetween: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack direction="row" justify="between" align="center">
      <Box>왼쪽 (탭 · 설명)</Box>
      <Box>오른쪽 (버튼)</Box>
    </Stack>
  ),
};

/** 같은 폭 2단 격자 (사이 간격은 gap) — 안내 상자 두 개 · 정보 두 열 */
export const TwoColumns: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack columns={2} gap={12}>
      <Box>왼쪽 안내</Box>
      <Box>오른쪽 안내</Box>
    </Stack>
  ),
};

/** 표 칸 안 위아래 여백: 칸 안 입력 · 두 줄 글자가 줄 높이보다 클 때 (paddingBlock 4 · 8) */
export const PaddingBlock: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack direction="row" gap={16} align="start">
      <Stack paddingBlock={8}>
        <Box>paddingBlock 8 (칸 안 입력)</Box>
      </Stack>
      <Stack as="span" gap={0} paddingBlock={4}>
        <span>가맹점명</span>
        <span>CPID</span>
      </Stack>
    </Stack>
  ),
};
