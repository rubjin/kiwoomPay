import clsx from 'clsx';
import { forwardRef, useState, type HTMLAttributes } from 'react';
import { useControllableState } from '../../hooks';
import { Icon } from '../Icon';
import styles from './DatePicker.module.scss';
import {
  addDays,
  addMonths,
  buildMonthCells,
  monthOf,
  todayString,
  type CalendarCell,
  type DateRange,
  type MonthKey,
} from './dateUtils';

interface DatePickerBaseProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /** 선택 가능한 첫 날짜 (YYYY-MM-DD) */
  min?: string;
  /** 선택 가능한 마지막 날짜 (YYYY-MM-DD) */
  max?: string;
  /** 날짜별로 선택을 막을 때 (휴일 등) */
  isDateDisabled?: (date: string) => boolean;
  /** 처음 보여줄 달 (YYYY-MM). 생략하면 선택값의 달, 없으면 오늘의 달 */
  defaultMonth?: string;
  /** 오늘 날짜 (YYYY-MM-DD). 생략하면 사용자 PC 기준 */
  today?: string;
  prevMonthLabel?: string;
  nextMonthLabel?: string;
}

export interface SingleDatePickerProps extends DatePickerBaseProps {
  /** single(기본): 하루 선택 */
  mode?: 'single';
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  maxRangeDays?: never;
}

export interface RangeDatePickerProps extends DatePickerBaseProps {
  /** range: 시작일 → 종료일 순서로 두 번 선택 */
  mode: 'range';
  value?: DateRange;
  defaultValue?: DateRange;
  /** 시작일과 종료일을 모두 고르면 호출된다 */
  onChange?: (value: DateRange) => void;
  /** 최대 조회 기간(일). 시작일을 고르면 이 기간을 넘는 날짜는 선택할 수 없다 */
  maxRangeDays?: number;
}

export type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps;

type LooseProps = DatePickerBaseProps & {
  mode?: 'single' | 'range';
  value?: string | DateRange;
  defaultValue?: string | DateRange;
  onChange?: (value: never) => void;
  maxRangeDays?: number;
};

const EMPTY_RANGE: DateRange = { start: '', end: '' };

const parseMonth = (value?: string): MonthKey | null => {
  const m = /^(\d{4})-(\d{2})$/.exec(value ?? '');
  return m ? { year: Number(m[1]), month: Number(m[2]) } : null;
};

/**
 * 날짜 선택 패널. 이전·다음 달로 이동해도 선택값은 유지된다.
 * 입력 필드와 함께 쓸 때는 DateField · DateRangeField가 이 패널을 열어준다.
 */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => {
  const {
    mode = 'single',
    value,
    defaultValue,
    onChange,
    min,
    max,
    isDateDisabled,
    maxRangeDays,
    defaultMonth,
    today: todayProp,
    prevMonthLabel = '이전 달',
    nextMonthLabel = '다음 달',
    className,
    ...rest
  } = props as LooseProps;

  const isRange = mode === 'range';
  const today = todayProp ?? todayString();

  const [single, setSingle] = useControllableState<string>(
    isRange ? undefined : (value as string | undefined),
    isRange ? '' : ((defaultValue as string | undefined) ?? ''),
    isRange ? undefined : (onChange as ((v: string) => void) | undefined),
  );
  const [range, setRange] = useControllableState<DateRange>(
    isRange ? (value as DateRange | undefined) : undefined,
    isRange ? ((defaultValue as DateRange | undefined) ?? EMPTY_RANGE) : EMPTY_RANGE,
    isRange ? (onChange as ((v: DateRange) => void) | undefined) : undefined,
  );
  // 기간 선택 중 시작일만 고른 상태 (종료일을 고르면 onChange)
  const [draftStart, setDraftStart] = useState<string | null>(null);

  const [view, setView] = useState<MonthKey>(
    () =>
      parseMonth(defaultMonth) ??
      monthOf(isRange ? range.start : single) ??
      monthOf(today) ?? { year: 2000, month: 1 },
  );

  const shown: DateRange = draftStart ? { start: draftStart, end: '' } : range;
  const rangeLimit = draftStart && maxRangeDays ? addDays(draftStart, maxRangeDays - 1) : null;

  const disabledDate = (date: string) =>
    (min !== undefined && date < min) ||
    (max !== undefined && date > max) ||
    (rangeLimit !== null && date > rangeLimit) ||
    (isDateDisabled?.(date) ?? false);

  const select = (date: string) => {
    if (!isRange) {
      setSingle(date);
      return;
    }
    if (!draftStart || date < draftStart) {
      setDraftStart(date);
      return;
    }
    setDraftStart(null);
    setRange({ start: draftStart, end: date });
  };

  const cells = buildMonthCells(view);

  const renderCell = (cell: CalendarCell | null, index: number) => {
    if (!cell) return <span key={`empty-${index}`} />;
    if (cell.outside) {
      return (
        <span key={cell.date} className={clsx(styles.day, styles.outside)} aria-hidden="true">
          {cell.day}
        </span>
      );
    }
    const { date } = cell;
    const isSelected = isRange ? date === shown.start || date === shown.end : date === single;
    const inRange =
      isRange && !!shown.start && !!shown.end && date > shown.start && date < shown.end;
    const isToday = date === today;

    return (
      <button
        key={date}
        type="button"
        className={clsx(
          styles.day,
          cell.weekday === 6 && styles.sat,
          cell.weekday === 0 && styles.sun,
          isToday && styles.today,
          inRange && styles.inRange,
          isSelected && styles.selected,
        )}
        disabled={disabledDate(date)}
        aria-pressed={isSelected || inRange}
        aria-current={isToday ? 'date' : undefined}
        aria-label={date}
        onClick={() => select(date)}
      >
        {cell.day}
      </button>
    );
  };

  return (
    <div {...rest} ref={ref} className={clsx(styles.panel, className)}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.nav}
          aria-label={prevMonthLabel}
          onClick={() => setView(addMonths(view, -1))}
        >
          <Icon name="chevron-left" size={20} />
        </button>
        <span className={styles.title} aria-live="polite">
          {view.year}년 {view.month}월
        </span>
        <button
          type="button"
          className={styles.nav}
          aria-label={nextMonthLabel}
          onClick={() => setView(addMonths(view, 1))}
        >
          <Icon name="chevron-right" size={20} />
        </button>
      </div>
      <div className={styles.grid}>{cells.map(renderCell)}</div>
    </div>
  );
});

DatePicker.displayName = 'DatePicker';
