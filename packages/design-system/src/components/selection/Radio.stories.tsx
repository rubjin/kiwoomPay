import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { Radio, RadioGroup } from './Radio';

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--kp-space-24)',
  alignItems: 'flex-start',
};

const meta = {
  title: 'Components/Selection/Radio',
  component: Radio,
  args: { label: '라디오', value: 'a', name: 'playground' },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Default 20 · Small 16 */
export const Sizes: Story = {
  render: () => (
    <div style={row}>
      <Radio value="md" name="sizes" size="md" label="Default 20" />
      <Radio value="sm" name="sizes" size="sm" label="Small 16" />
    </div>
  ),
};

/** Off · On */
export const Check: Story = {
  render: () => (
    <div style={row}>
      <Radio value="off" name="check" label="Off" />
      <Radio value="on" name="check" label="On" defaultChecked />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={row}>
      <Radio value="a" name="states-a" label="Default" defaultChecked />
      <Radio value="b" name="states-b" label="Disabled" defaultChecked disabled />
      <Radio value="c" name="states-c" label="Disabled Off" disabled />
    </div>
  ),
};

export const Content: Story = {
  render: () => (
    <div style={row}>
      <Radio value="a" name="content-a" label="라디오" />
      <Radio value="b" name="content-b" label="라디오" helperText="부가 설명이 들어갑니다." />
    </div>
  ),
};

function GroupExample() {
  const [value, setValue] = useState('4');
  return (
    <div style={row}>
      <RadioGroup value={value} onChange={setValue} aria-label="항목">
        {['1', '2', '3', '4'].map((v) => (
          <Radio key={v} value={v} label={`항목 ${v}`} />
        ))}
      </RadioGroup>
      <span>선택값: {value}</span>
    </div>
  );
}

/** 같은 그룹에서는 하나의 항목만 선택된다. */
export const Group: Story = {
  render: () => <GroupExample />,
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="b" direction="horizontal" aria-label="구분">
      <Radio value="a" label="개인" />
      <Radio value="b" label="법인" />
      <Radio value="c" label="기타" disabled />
    </RadioGroup>
  ),
};
