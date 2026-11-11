import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { Checkbox } from './Checkbox';
import { SelectionGroup } from './SelectionGroup';

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--kp-space-24)',
  alignItems: 'flex-start',
};

const meta = {
  title: 'Components/Selection/Checkbox',
  component: Checkbox,
  args: { label: '체크박스' },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Default 20 · Small 16 */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Checkbox size="md" label="Default 20" />
      <Checkbox size="sm" label="Small 16" />
    </div>
  ),
};

/** Off · On · Indeterminate */
export const Check: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Checkbox label="Off" />
      <Checkbox label="On" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
    </div>
  ),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Checkbox label="Default" defaultChecked />
      <Checkbox label="Disabled" defaultChecked disabled />
      <Checkbox label="Disabled Off" disabled />
    </div>
  ),
};

/** Label · Label + Helper · 라벨 없음 */
export const Content: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Checkbox label="체크박스" />
      <Checkbox label="체크박스" helperText="부가 설명이 들어갑니다." />
      <Checkbox aria-label="라벨 없음" />
    </div>
  ),
};

const items = ['항목 1', '항목 2', '항목 3'];

function GroupExample() {
  const [checked, setChecked] = useState<string[]>(['항목 2', '항목 3']);
  const all = checked.length === items.length;
  const some = checked.length > 0 && !all;

  return (
    <SelectionGroup>
      <Checkbox
        label={<strong>전체 선택</strong>}
        checked={all}
        indeterminate={some}
        onChange={() => setChecked(all ? [] : items)}
      />
      {items.map((item) => (
        <Checkbox
          key={item}
          label={item}
          checked={checked.includes(item)}
          onChange={(e) =>
            setChecked(e.target.checked ? [...checked, item] : checked.filter((v) => v !== item))
          }
        />
      ))}
    </SelectionGroup>
  );
}

/** 전체 선택 대상 중 일부만 선택되면 전체 선택 체크박스를 Indeterminate로 표시한다. */
export const Group: Story = {
  parameters: { controls: { disable: true } },
  render: () => <GroupExample />,
};

export const Single: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <SelectionGroup>
      <Checkbox label="거래 1건 선택" />
      <Checkbox label="거래 2건 선택" defaultChecked />
    </SelectionGroup>
  ),
};
