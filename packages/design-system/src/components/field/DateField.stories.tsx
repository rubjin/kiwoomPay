import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { CalendarProvider, type DateRange } from '../DatePicker';
import { mockCalendarAdapter } from '../DatePicker/mockCalendarAdapter';
import { DateField } from './DateField';
import { DateRangeField } from './DateRangeField';

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
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <DateField size="md" />
      <DateField size="sm" />
    </div>
  ),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
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
      <DateField value={value} onChange={setValue} />
      <span>값: {value || '(없음)'}</span>
    </div>
  );
}

/** 숫자만 입력해도 YYYY-MM-DD로 정렬된다. 필드나 달력 아이콘을 누르면 Date Picker가 열린다. */
export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ControlledExample />,
};

/** 외부 달력(IBSheet 등) 연결: 앱 최상단의 CalendarProvider에 어댑터를 넣으면 기본 Date Picker 대신 그 달력이 열린다 */
export const ExternalCalendar: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [single, setSingle] = useState('');
    const [range, setRange] = useState<DateRange>({ start: '', end: '' });
    return (
      <CalendarProvider adapter={mockCalendarAdapter}>
        <div style={{ display: 'flex', gap: 'var(--kp-space-16)', minHeight: 120 }}>
          <DateField value={single} onChange={setSingle} />
          <DateRangeField value={range} onChange={setRange} />
        </div>
      </CalendarProvider>
    );
  },
};
