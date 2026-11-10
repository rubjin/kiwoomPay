import clsx from 'clsx';
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { SelectionItem, type SelectionSize } from './SelectionItem';
import styles from './ToggleSwitch.module.scss';

export interface ToggleSwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'role'
> {
  /** md 20 (기본) · sm 16 */
  size?: SelectionSize;
  label?: ReactNode;
  /** 라벨 아래 부가 설명 */
  helperText?: ReactNode;
}

/**
 * 설정이나 기능의 상태를 즉시 켜고 끄는 스위치. native input(`checked` / `defaultChecked` / `onChange`)을
 * 그대로 쓰므로 controlled · uncontrolled 모두 지원한다. className · style은 바깥 요소에, 나머지 속성은 input에 적용된다.
 */
export const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(
  ({ size = 'md', label, helperText, className, style, disabled, ...rest }, ref) => (
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
        ref={ref}
        type="checkbox"
        role="switch"
        disabled={disabled}
        className={styles.input}
      />
      <span className={clsx(styles.track, styles[size])} aria-hidden="true" />
    </SelectionItem>
  ),
);

ToggleSwitch.displayName = 'ToggleSwitch';
