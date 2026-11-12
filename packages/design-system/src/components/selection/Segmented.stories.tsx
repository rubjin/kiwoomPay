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

/** 크기: sm 32(기본) · md 40 — 검색 조건 줄에서 필드 높이 40에 맞출 때 (Figma KWPC06010201 퀵 기간) */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      {(['sm', 'md'] as const).map((size) => (
        <Segmented key={size} size={size} defaultValue="1w" aria-label={`조회 기간 ${size}`}>
          <Segmented.Item value="1w">1주일</Segmented.Item>
          <Segmented.Item value="1m">1개월</Segmented.Item>
          <Segmented.Item value="2m">2개월</Segmented.Item>
          <Segmented.Item value="3m">3개월</Segmented.Item>
        </Segmented>
      ))}
    </div>
  ),
};

/** fullWidth: 부모 폭을 채우고 옵션을 같은 폭으로 (Figma KWPC04010100 조회 기간) */
export const FullWidth: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 360 }}>
      <Segmented size="md" fullWidth defaultValue="1m" aria-label="조회 기간">
        <Segmented.Item value="1w">1주일</Segmented.Item>
        <Segmented.Item value="1m">1개월</Segmented.Item>
        <Segmented.Item value="2m">2개월</Segmented.Item>
        <Segmented.Item value="3m">3개월</Segmented.Item>
      </Segmented>
    </div>
  ),
};
