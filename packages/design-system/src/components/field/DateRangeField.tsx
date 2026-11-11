import { forwardRef, useCallback, useState, type ChangeEvent, type HTMLAttributes } from 'react';
import { useControllableState } from '../../hooks';
import { formatDateInput } from '../../utils';
import { DatePicker } from '../DatePicker';
import { useCalendarAdapter } from '../DatePicker/CalendarProvider';
import { DatePickerAnchor } from '../DatePicker/DatePickerAnchor';
import { isValidDate, type DateRange } from '../DatePicker/dateUtils';
import { Icon } from '../Icon';
import { useFieldControl, type FieldFeedback, type FieldSize } from './fieldContext';
import { FieldBox, FieldIconButton, FieldInput, FieldSeparator } from './FieldBox';

export interface DateRangeFieldProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  size?: FieldSize;
  feedback?: FieldFeedback;
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (value: DateRange) => void;
  /** 필드·달력 아이콘을 누르면 Range Date Picker를 연다 (기본 true). false면 입력만 받는다 */
  picker?: boolean;
  /** 달력에서 선택 가능한 첫 날짜 (YYYY-MM-DD) */
  min?: string;
  /** 달력에서 선택 가능한 마지막 날짜 (YYYY-MM-DD) */
  max?: string;
  /** 날짜별로 선택을 막을 때 */
  isDateDisabled?: (date: string) => boolean;
  /** 최대 조회 기간(일). 시작일을 고르면 이 기간을 넘는 날짜는 선택할 수 없다 */
  maxRangeDays?: number;
  /** 달력 아이콘을 눌렀을 때 추가로 할 일 */
  onCalendarClick?: () => void;
  calendarLabel?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  /** form 전송용 name */
  startName?: string;
  endName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  /** 라벨 연결용 id (시작일 입력에 붙는다) */
  id?: string;
  fullWidth?: boolean;
}

const EMPTY: DateRange = { start: '', end: '' };

/**
 * 시작일 ~ 종료일 입력. 필드나 달력 아이콘을 누르면 Range Date Picker가 열리고,
 * 시작일 → 종료일을 고르면 값이 반영되고 닫힌다. ref는 바깥 박스(div)에 연결된다.
 */
export const DateRangeField = forwardRef<HTMLDivElement, DateRangeFieldProps>((props, ref) => {
  const {
    size,
    feedback,
    value,
    defaultValue = EMPTY,
    onChange,
    picker = true,
    min,
    max,
    isDateDisabled,
    maxRangeDays,
    onCalendarClick,
    calendarLabel = '달력 열기',
    startPlaceholder = 'YYYY-MM-DD',
    endPlaceholder = 'YYYY-MM-DD',
    startName,
    endName,
    fullWidth,
    className,
    disabled,
    readOnly,
    id,
    'aria-describedby': ariaDescribedBy,
    ...rest
  } = props;

  const field = useFieldControl({
    id,
    size,
    feedback,
    disabled,
    'aria-describedby': ariaDescribedBy,
  });
  const [current, setCurrent] = useControllableState(value, defaultValue, onChange);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const canOpen = picker && !field.disabled && !readOnly;
  const adapter = useCalendarAdapter();

  const change = (key: keyof DateRange) => (event: ChangeEvent<HTMLInputElement>) => {
    setCurrent({ ...current, [key]: formatDateInput(event.target.value) });
  };

  const openPicker = () => {
    if (canOpen) setOpen(true);
  };

  const handleCalendarClick = () => {
    onCalendarClick?.();
    if (canOpen) setOpen((prev) => !prev);
  };

  const handlePick = (range: DateRange) => {
    setCurrent(range);
    setOpen(false);
  };

  const common = {
    type: 'text',
    inputMode: 'numeric',
    autoComplete: 'off',
    maxLength: 10,
    size: 10,
    date: true,
    disabled: field.disabled,
    readOnly,
    'aria-invalid': field.invalid,
    onClick: openPicker,
  } as const;

  const openExternal =
    adapter &&
    ((anchor: HTMLElement) =>
      adapter.open({
        mode: 'range',
        anchor,
        value: {
          start: isValidDate(current.start) ? current.start : '',
          end: isValidDate(current.end) ? current.end : '',
        },
        min,
        max,
        maxRangeDays,
        onSelect: handlePick,
        onClose: close,
      }));

  return (
    <DatePickerAnchor
      open={open}
      onClose={close}
      fullWidth={fullWidth}
      openExternal={openExternal}
      panel={
        <DatePicker
          mode="range"
          value={{
            start: isValidDate(current.start) ? current.start : '',
            end: isValidDate(current.end) ? current.end : '',
          }}
          onChange={handlePick}
          min={min}
          max={max}
          isDateDisabled={isDateDisabled}
          maxRangeDays={maxRangeDays}
        />
      }
    >
      <FieldBox
        {...rest}
        ref={ref}
        size={field.size}
        feedback={field.feedback}
        disabled={field.disabled}
        readOnly={readOnly}
        fullWidth={fullWidth}
        active={open}
        className={className}
        trailing={
          <FieldIconButton
            aria-label={calendarLabel}
            aria-expanded={picker ? open : undefined}
            disabled={field.disabled || readOnly}
            onClick={handleCalendarClick}
          >
            <Icon name="calendar" size={20} />
          </FieldIconButton>
        }
      >
        <FieldInput
          {...common}
          id={field.id}
          name={startName}
          aria-describedby={field.describedBy}
          placeholder={startPlaceholder}
          value={current.start}
          onChange={change('start')}
        />
        <FieldSeparator filled={Boolean(current.start || current.end)} />
        <FieldInput
          {...common}
          name={endName}
          placeholder={endPlaceholder}
          value={current.end}
          onChange={change('end')}
        />
      </FieldBox>
    </DatePickerAnchor>
  );
});

DateRangeField.displayName = 'DateRangeField';
