import {
  forwardRef,
  useRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { useControllableState } from '../../hooks';
import { mergeRefs } from '../../utils';
import { useFieldControl, type FieldFeedback, type FieldSize } from './fieldContext';
import { FieldBox, FieldIcon, FieldIconButton, FieldInput, FieldSuffix } from './FieldBox';
import { ClearIcon } from './icons';

export interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value' | 'defaultValue' | 'prefix'
> {
  /** md 40 (기본) · sm 32 */
  size?: FieldSize;
  /** 검증 결과 표시 */
  feedback?: FieldFeedback;
  value?: string;
  defaultValue?: string;
  /** 입력 앞 아이콘 (예: 검색) */
  leadingIcon?: ReactNode;
  /** 입력 뒤 아이콘 */
  trailingIcon?: ReactNode;
  /** 입력 뒤 단위·접미사 (예: 원) */
  suffix?: ReactNode;
  /** 값이 있을 때 지우기 버튼 표시. controlled일 때는 onClear에서 값을 비운다 */
  clearable?: boolean;
  onClear?: () => void;
  clearLabel?: string;
  /** 부모 폭을 꽉 채운다. 기본은 내용(입력 길이) 기준 */
  fullWidth?: boolean;
}

/** className · style은 바깥 박스에 적용되고, 나머지 속성은 input에 전달된다. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  const {
    size,
    feedback,
    value,
    defaultValue = '',
    onChange,
    leadingIcon,
    trailingIcon,
    suffix,
    clearable,
    onClear,
    clearLabel = '지우기',
    fullWidth,
    className,
    style,
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [current, setCurrent] = useControllableState(value, defaultValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrent(event.target.value);
    onChange?.(event);
  };

  const handleClear = () => {
    setCurrent('');
    onClear?.();
    inputRef.current?.focus();
  };

  const showClear = clearable && !field.disabled && !readOnly && current.length > 0;
  const trailing =
    showClear || trailingIcon ? (
      <>
        {showClear && (
          <FieldIconButton tone="muted" aria-label={clearLabel} onClick={handleClear}>
            <ClearIcon />
          </FieldIconButton>
        )}
        {trailingIcon && <FieldIcon>{trailingIcon}</FieldIcon>}
      </>
    ) : undefined;

  return (
    <FieldBox
      size={field.size}
      feedback={field.feedback}
      disabled={field.disabled}
      readOnly={readOnly}
      fullWidth={fullWidth}
      leading={leadingIcon}
      trailing={trailing}
      className={className}
      style={style}
    >
      <FieldInput
        {...rest}
        ref={mergeRefs(ref, inputRef)}
        id={field.id}
        value={current}
        onChange={handleChange}
        disabled={field.disabled}
        readOnly={readOnly}
        aria-invalid={field.invalid}
        aria-describedby={field.describedBy}
      />
      {suffix && <FieldSuffix>{suffix}</FieldSuffix>}
    </FieldBox>
  );
});

TextField.displayName = 'TextField';
