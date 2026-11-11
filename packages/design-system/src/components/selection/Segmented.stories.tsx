import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Segmented } from './Segmented';

const meta = {
  title: 'Components/Selection/Segmented',
  component: Segmented,
  args: { children: null },
  argTypes: {
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Segmented>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Segmented {...args} defaultValue="normal">
      <Segmented.Item value="all">전체</Segmented.Item>
      <Segmented.Item value="normal">일반</Segmented.Item>
      <Segmented.Item value="special">특약</Segmented.Item>
    </Segmented>
  ),
};

/** Default · Selected · Disabled */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Segmented defaultValue="selected">
      <Segmented.Item value="default">옵션</Segmented.Item>
      <Segmented.Item value="selected">일반</Segmented.Item>
      <Segmented.Item value="disabled" disabled>
        옵션
      </Segmented.Item>
    </Segmented>
  ),
};

function ControlledExample() {
  const [value, setValue] = useState('daily');
  return (
    <div style={{ display: 'flex', gap: 'var(--kp-space-16)', alignItems: 'center' }}>
      <Segmented value={value} onChange={setValue} aria-label="조회 단위">
        <Segmented.Item value="daily">일별</Segmented.Item>
        <Segmented.Item value="weekly">주별</Segmented.Item>
        <Segmented.Item value="monthly">월별</Segmented.Item>
      </Segmented>
      <span>선택값: {value}</span>
    </div>
  );
}

/** 클릭 즉시 값이 바뀐다 (controlled). */
export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ControlledExample />,
};

export const LongLabel: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 260 }}>
      <Segmented defaultValue="a">
        <Segmented.Item value="a">아주 긴 옵션 이름이 들어가는 경우</Segmented.Item>
        <Segmented.Item value="b">옵션</Segmented.Item>
      </Segmented>
    </div>
  ),
};

export const AllDisabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Segmented defaultValue="a" disabled>
      <Segmented.Item value="a">일반</Segmented.Item>
      <Segmented.Item value="b">옵션</Segmented.Item>
    </Segmented>
  ),
};
