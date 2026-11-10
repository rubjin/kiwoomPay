import { forwardRef, type ChangeEvent, type TextareaHTMLAttributes } from 'react';
import { useControllableState } from '../../hooks';
import { useFieldControl, type FieldFeedback, type FieldSize } from './fieldContext';
import { FieldBox, FieldCounter, FieldTextarea } from './FieldBox';

export interface TextAreaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'defaultValue'
> {
  /** md (기본) · sm. 높이는 rows로 정해진다 */
  size?: FieldSize;
  feedback?: FieldFeedback;
  value?: string;
  defaultValue?: string;
  /** 우측 하단에 글자수(0 / 200)를 표시한다. maxLength가 있으면 함께 보여준다 */
  showCounter?: boolean;
  fullWidth?: boolean;
}

/** className · style은 바깥 박스에 적용되고, 나머지 속성은 textarea에 전달된다. */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  const {
    size,
    feedback,
    value,
    defaultValue = '',
    onChange,
    showCounter,
    fullWidth,
    className,
    style,
    disabled,
    readOnly,
    id,
    rows = 3,
    maxLength,
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
  const [current, setCurrent] = useControllableState(value, defaultValue);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCurrent(event.target.value);
    onChange?.(event);
  };

  return (
    <FieldBox
      multiline
      size={field.size}
      feedback={field.feedback}
      disabled={field.disabled}
      readOnly={readOnly}
      fullWidth={fullWidth}
      className={className}
      style={style}
    >
      <FieldTextarea
        {...rest}
        ref={ref}
        id={field.id}
        rows={rows}
        maxLength={maxLength}
        value={current}
        onChange={handleChange}
        disabled={field.disabled}
        readOnly={readOnly}
        aria-invalid={field.invalid}
        aria-describedby={field.describedBy}
      />
      {showCounter && (
        <FieldCounter>
          {current.length}
          {maxLength !== undefined && ` / ${maxLength}`}
        </FieldCounter>
      )}
    </FieldBox>
  );
});

TextArea.displayName = 'TextArea';
