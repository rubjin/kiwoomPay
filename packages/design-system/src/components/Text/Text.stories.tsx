import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';

const meta = {
  title: 'Components/Text',
  component: Text,
  args: {
    children: '현재 적용된 메뉴별 기능 권한 및 부여 구분을 팝업에서 확인할 수 있습니다.',
    variant: 'caption-md',
    tone: 'secondary',
    as: 'span',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['body-md', 'body-sm', 'caption-md', 'caption-strong', 'label-strong'],
    },
    tone: { control: 'inline-radio', options: ['body', 'secondary', 'heading'] },
    as: { control: 'inline-radio', options: ['span', 'p', 'div'] },
  },
} satisfies Meta<typeof Text>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** 역할별 크기 · 굵기 */
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 8 }}>
      <Text variant="body-md">body-md — 14 Regular</Text>
      <Text variant="body-sm">body-sm — 13 Regular</Text>
      <Text variant="caption-md">caption-md — 12 Regular (기본)</Text>
      <Text variant="caption-strong">caption-strong — 12 SemiBold</Text>
      <Text variant="label-strong">label-strong — 13 SemiBold</Text>
    </div>
  ),
};

/** 글자색 */
export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 8 }}>
      <Text tone="secondary">secondary — 보조 설명 (기본)</Text>
      <Text tone="body">body — 본문</Text>
      <Text tone="heading" variant="label-strong">
        heading — 진한 강조
      </Text>
    </div>
  ),
};
