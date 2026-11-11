import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type MouseEvent,
} from 'react';
import { useControllableState } from '../../hooks';
import { formatDateInput, mergeRefs } from '../../utils';
import { DatePicker } from '../DatePicker';
import { useCalendarAdapter } from '../DatePicker/CalendarProvider';
import { DatePickerAnchor } from '../DatePicker/DatePickerAnchor';
import { isValidDate } from '../DatePicker/dateUtils';
import { Icon } from '../Icon';
import { useFieldControl, type FieldFeedback, type FieldSize } from './fieldContext';
import { FieldBox, FieldIconButton, FieldInput } from './FieldBox';

export interface DateFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value' | 'defaultValue' | 'onChange' | 'type' | 'prefix' | 'min' | 'max'
> {
  size?: FieldSize;
  feedback?: FieldFeedback;
  /** YYYY-MM-DD */
  value?: string;
  defaultValue?: string;
  /** 숫자만 입력해도 YYYY-MM-DD로 자동 정렬된 값이 전달된다. 달력에서 고른 값도 같은 형식이다 */
  onChange?: (value: string) => void;
  /** 필드·달력 아이콘을 누르면 Date Picker를 연다 (기본 true). false면 입력만 받는다 */
  picker?: boolean;
  /** 달력에서 선택 가능한 첫 날짜 (YYYY-MM-DD) */
  min?: string;
  /** 달력에서 선택 가능한 마지막 날짜 (YYYY-MM-DD) */
  max?: string;
  /** 날짜별로 선택을 막을 때 */
  isDateDisabled?: (date: string) => boolean;
  /** 달력 아이콘을 눌렀을 때 추가로 할 일 */
  onCalendarClick?: () => void;
  calendarLabel?: string;
  fullWidth?: boolean;
}

/**
 * 단일 날짜 입력. 필드나 달력 아이콘을 누르면 Date Picker가 열리고, 날짜를 고르면 값이 반영되고 닫힌다.
 * 형식 검증(존재하는 날짜인지)은 하지 않으므로 결과는 feedback으로 알려준다.
 */
export const DateField = forwardRef<HTMLInputElement, DateFieldProps>((props, ref) => {
  const {
    size,
    feedback,
    value,
    defaultValue = '',
    onChange,
    picker = true,
    min,
    max,
    isDateDisabled,
    onCalendarClick,
    calendarLabel = '달력 열기',
    fullWidth,
    className,
    style,
    disabled,
    readOnly,
    id,
    onClick,
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
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const canOpen = picker && !field.disabled && !readOnly;
  const adapter = useCalendarAdapter();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrent(formatDateInput(event.target.value));
  };

  const handleInputClick = (event: MouseEvent<HTMLInputElement>) => {
    onClick?.(event);
    if (canOpen) setOpen(true);
  };

  const handleCalendarClick = () => {
    onCalendarClick?.();
    if (canOpen) setOpen((prev) => !prev);
  };

  const handlePick = (date: string) => {
    setCurrent(date);
    setOpen(false);
    inputRef.current?.focus();
  };

  const openExternal =
    adapter &&
    ((anchor: HTMLElement) =>
      adapter.open({
        mode: 'single',
        anchor,
        value: isValidDate(current) ? current : '',
        min,
        max,
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
          value={isValidDate(current) ? current : ''}
          onChange={handlePick}
          min={min}
          max={max}
          isDateDisabled={isDateDisabled}
        />
      }
    >
      <FieldBox
        size={field.size}
        feedback={field.feedback}
        disabled={field.disabled}
        readOnly={readOnly}
        fullWidth={fullWidth}
        active={open}
        className={className}
        style={style}
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
          {...rest}
          ref={mergeRefs(ref, inputRef)}
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
          onClick={handleInputClick}
          disabled={field.disabled}
          readOnly={readOnly}
          aria-invalid={field.invalid}
          aria-describedby={field.describedBy}
        />
      </FieldBox>
    </DatePickerAnchor>
  );
});

DateField.displayName = 'DateField';
