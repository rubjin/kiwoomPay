import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import type { DateRange } from '../DatePicker';
import { DateRangeField } from './DateRangeField';

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--kp-space-16)',
  alignItems: 'flex-start',
};
const filled: DateRange = { start: '2026-08-01', end: '2026-08-13' };

const meta = {
  title: 'Components/Field/DateRangeField',
  component: DateRangeField,
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    feedback: { control: 'inline-radio', options: [undefined, 'positive', 'negative'] },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
} satisfies Meta<typeof DateRangeField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={row}>
      <DateRangeField size="md" />
      <DateRangeField size="sm" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={row}>
      <DateRangeField />
      <DateRangeField defaultValue={filled} />
      <DateRangeField disabled />
      <DateRangeField readOnly defaultValue={filled} />
      <DateRangeField feedback="negative" defaultValue={filled} />
    </div>
  ),
};

function ControlledExample() {
  const [value, setValue] = useState<DateRange>({ start: '', end: '' });
  return (
    <div style={row}>
      <DateRangeField value={value} onChange={setValue} />
      <span>
        {value.start || '시작일'} ~ {value.end || '종료일'}
      </span>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
};
