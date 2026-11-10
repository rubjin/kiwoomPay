import { forwardRef, type ChangeEvent, type HTMLAttributes } from 'react';
import { useControllableState } from '../../hooks';
import { formatDateInput } from '../../utils';
import { useFieldControl, type FieldFeedback, type FieldSize } from './fieldContext';
import { FieldBox, FieldIconButton, FieldInput, FieldSeparator } from './FieldBox';
import { CalendarIcon } from './icons';

export interface DateRange {
  /** YYYY-MM-DD */
  start: string;
  /** YYYY-MM-DD */
  end: string;
}

export interface DateRangeFieldProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  size?: FieldSize;
  feedback?: FieldFeedback;
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (value: DateRange) => void;
  /** 달력 아이콘을 눌렀을 때. Range Date Picker를 여는 용도 */
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

/** 시작일 ~ 종료일 입력. ref는 바깥 박스(div)에 연결된다. */
export const DateRangeField = forwardRef<HTMLDivElement, DateRangeFieldProps>((props, ref) => {
  const {
    size,
    feedback,
    value,
    defaultValue = EMPTY,
    onChange,
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

  const change = (key: keyof DateRange) => (event: ChangeEvent<HTMLInputElement>) => {
    setCurrent({ ...current, [key]: formatDateInput(event.target.value) });
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
  } as const;

  return (
    <FieldBox
      {...rest}
      ref={ref}
      size={field.size}
      feedback={field.feedback}
      disabled={field.disabled}
      readOnly={readOnly}
      fullWidth={fullWidth}
      className={className}
      trailing={
        <FieldIconButton
          aria-label={calendarLabel}
          disabled={field.disabled || readOnly}
          onClick={onCalendarClick}
        >
          <CalendarIcon />
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
  );
});

DateRangeField.displayName = 'DateRangeField';
