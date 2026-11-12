import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { SelectionGroup } from './SelectionGroup';
import { ToggleSwitch } from './ToggleSwitch';

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--kp-space-24)',
  alignItems: 'flex-start',
};

const meta = {
  title: 'Components/Selection/ToggleSwitch',
  component: ToggleSwitch,
  args: { label: '토글 스위치' },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Default 20 · Small 16 */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <ToggleSwitch size="md" label="Default 20" />
      <ToggleSwitch size="sm" label="Small 16" />
    </div>
  ),
};

/** Off · On */
export const Value: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <ToggleSwitch label="Off" />
      <ToggleSwitch label="On" defaultChecked />
    </div>
  ),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <ToggleSwitch label="Default" defaultChecked />
      <ToggleSwitch label="Disabled" defaultChecked disabled />
      <ToggleSwitch label="Disabled Off" disabled />
    </div>
  ),
};

export const Content: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <ToggleSwitch label="토글 스위치" />
      <ToggleSwitch label="토글 스위치" helperText="부가 설명이 들어갑니다." />
    </div>
  ),
};

function GroupExample() {
  const [on, setOn] = useState([false, true, false, true]);
  return (
    <SelectionGroup>
      {on.map((value, i) => (
        <ToggleSwitch
          key={i}
          label="토글 스위치"
          checked={value}
          onChange={(e) => setOn(on.map((v, j) => (j === i ? e.target.checked : v)))}
        />
      ))}
    </SelectionGroup>
  );
}

/** 설정이나 기능을 즉시 켜거나 끌 때 사용한다. */
export const Group: Story = {
  parameters: { controls: { disable: true } },
  render: () => <GroupExample />,
};
