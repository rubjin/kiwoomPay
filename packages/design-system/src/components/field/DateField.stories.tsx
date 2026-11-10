import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { DateField } from './DateField';

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--kp-space-16)',
  alignItems: 'flex-start',
};

const meta = {
  title: 'Components/Field/DateField',
  component: DateField,
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    feedback: { control: 'inline-radio', options: [undefined, 'positive', 'negative'] },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={row}>
      <DateField size="md" />
      <DateField size="sm" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={row}>
      <DateField />
      <DateField defaultValue="2026-08-13" />
      <DateField disabled />
      <DateField readOnly defaultValue="2026-08-13" />
      <DateField feedback="negative" defaultValue="2026-08-13" />
    </div>
  ),
};

function ControlledExample() {
  const [value, setValue] = useState('');
  return (
    <div style={row}>
      <DateField
        value={value}
        onChange={setValue}
        onCalendarClick={() => alert('Date Picker 열기')}
      />
      <span>값: {value || '(없음)'}</span>
    </div>
  );
}

/** 숫자만 입력해도 YYYY-MM-DD로 정렬된다. 달력 아이콘은 onCalendarClick으로 Date Picker를 연다. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};
