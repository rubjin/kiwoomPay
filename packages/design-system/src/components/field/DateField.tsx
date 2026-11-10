import { forwardRef, type ChangeEvent, type InputHTMLAttributes } from 'react';
import { useControllableState } from '../../hooks';
import { formatDateInput } from '../../utils';
import { useFieldControl, type FieldFeedback, type FieldSize } from './fieldContext';
import { FieldBox, FieldIconButton, FieldInput } from './FieldBox';
import { CalendarIcon } from './icons';

export interface DateFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value' | 'defaultValue' | 'onChange' | 'type' | 'prefix'
> {
  size?: FieldSize;
  feedback?: FieldFeedback;
  /** YYYY-MM-DD */
  value?: string;
  defaultValue?: string;
  /** 숫자만 입력해도 YYYY-MM-DD로 자동 정렬된 값이 전달된다 */
  onChange?: (value: string) => void;
  /** 달력 아이콘을 눌렀을 때. Date Picker를 여는 용도 */
  onCalendarClick?: () => void;
  calendarLabel?: string;
  fullWidth?: boolean;
}

/** 날짜 입력. Date Picker는 포함하지 않고 `onCalendarClick`으로 호출만 한다. */
export const DateField = forwardRef<HTMLInputElement, DateFieldProps>((props, ref) => {
  const {
    size,
    feedback,
    value,
    defaultValue = '',
    onChange,
    onCalendarClick,
    calendarLabel = '달력 열기',
    fullWidth,
    className,
    style,
    disabled,
    readOnly,
    id,
    placeholder = 'YYYY-MM-DD',
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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrent(formatDateInput(event.target.value));
  };

  return (
    <FieldBox
      size={field.size}
      feedback={field.feedback}
      disabled={field.disabled}
      readOnly={readOnly}
      fullWidth={fullWidth}
      className={className}
      style={style}
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
        {...rest}
        ref={ref}
        id={field.id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        maxLength={10}
        size={10}
        date
        placeholder={placeholder}
        value={current}
        onChange={handleChange}
        disabled={field.disabled}
        readOnly={readOnly}
        aria-invalid={field.invalid}
        aria-describedby={field.describedBy}
      />
    </FieldBox>
  );
});

DateField.displayName = 'DateField';
