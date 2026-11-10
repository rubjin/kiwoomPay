import clsx from 'clsx';
import { forwardRef, useEffect, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { mergeRefs } from '../../utils';
import styles from './Checkbox.module.scss';
import { SelectionItem, type SelectionSize } from './SelectionItem';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  /** md 20 (기본) · sm 16 */
  size?: SelectionSize;
  label?: ReactNode;
  /** 라벨 아래 부가 설명 */
  helperText?: ReactNode;
  /** 일부만 선택된 상태(전체 선택 체크박스). 표시만 바뀌고 checked 값은 그대로다 */
  indeterminate?: boolean;
}

/**
 * 선택 상태를 표시하는 체크박스. native input(`checked` / `defaultChecked` / `onChange`)을 그대로 쓰므로
 * controlled · uncontrolled 모두 지원한다. className · style은 바깥 요소에, 나머지 속성은 input에 적용된다.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { size = 'md', label, helperText, indeterminate = false, className, style, disabled, ...rest },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // indeterminate는 HTML 속성이 아니라 DOM 프로퍼티라서 렌더마다 맞춰준다 (클릭 시 브라우저가 해제하므로)
    useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    });

    return (
      <SelectionItem
        size={size}
        disabled={disabled}
        label={label}
        helperText={helperText}
        className={className}
        style={style}
      >
        <input
          {...rest}
          ref={mergeRefs(ref, inputRef)}
          type="checkbox"
          disabled={disabled}
          className={styles.input}
        />
        <span className={clsx(styles.box, styles[size])} aria-hidden="true">
          <svg className={styles.check} viewBox="0 0 20 20" fill="none">
            <path
              d="M5.4 10.4l3.2 3 6-6.6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg className={styles.dash} viewBox="0 0 20 20" fill="none">
            <path d="M6 10h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </SelectionItem>
    );
  },
);

Checkbox.displayName = 'Checkbox';
