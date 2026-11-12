import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { DateField } from '../field/DateField';
import { DateRangeField } from '../field/DateRangeField';
import { DatePicker } from './DatePicker';
import type { DateRange } from './dateUtils';

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--kp-space-24)',
  alignItems: 'flex-start',
};

const meta = {
  title: 'Components/Input/DatePicker',
  component: DatePicker,
  // 시안과 같은 화면을 위해 오늘을 고정한다 (실사용에서는 생략 → 사용자 PC 기준)
  args: { today: '2026-08-11', defaultValue: '2026-08-14' },
  parameters: { tempWork: '필드 ↔ 달력 패널 간격' },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 단일 날짜. 오늘(11)은 테두리, 선택(14)은 채움. 토요일 파랑 · 일요일 빨강 · 지난달 회색 */
export const Single: Story = {};

/** 기간: 시작일 → 종료일 순서로 두 번 고른다. 시작·끝은 채움, 중간은 연한 배경 */
export const Range: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DatePicker
      mode="range"
      today="2026-08-10"
      defaultValue={{ start: '2026-08-12', end: '2026-08-15' }}
    />
  ),
};

function ControlledExample() {
  const [date, setDate] = useState('2026-08-14');
  const [range, setRange] = useState<DateRange>({ start: '2026-08-12', end: '2026-08-15' });
  return (
    <div style={row}>
      <div>
        <DatePicker today="2026-08-11" value={date} onChange={setDate} />
        <p>선택: {date}</p>
      </div>
      <div>
        <DatePicker mode="range" today="2026-08-10" value={range} onChange={setRange} />
        <p>
          기간: {range.start} ~ {range.end}
        </p>
      </div>
    </div>
  );
}

/** 이전·다음 달로 이동해도 선택값은 유지된다. */
export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ControlledExample />,
};

/** 선택 가능 범위(min · max)와 날짜별 비활성(isDateDisabled: 주말) */
export const DisabledDates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DatePicker
      today="2026-08-11"
      min="2026-08-05"
      max="2026-08-25"
      isDateDisabled={(date) => [0, 6].includes(new Date(`${date}T00:00:00`).getDay())}
    />
  ),
};

/** 최대 조회 기간 7일: 시작일을 고르면 7일을 넘는 날짜는 선택할 수 없다. */
export const MaxRange: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DatePicker mode="range" today="2026-08-11" defaultMonth="2026-08" maxRangeDays={7} />
  ),
};

/** 필드를 누르거나 달력 아이콘을 누르면 열리고, 날짜를 고르면 값이 반영되며 닫힌다. */
export const WithField: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ ...row, minHeight: 420 }}>
      <DateField defaultValue="2026-08-14" />
      <DateRangeField defaultValue={{ start: '2026-08-12', end: '2026-08-15' }} />
    </div>
  ),
};
