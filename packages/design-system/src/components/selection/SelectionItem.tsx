import clsx from 'clsx';
import type { CSSProperties, ReactNode } from 'react';
import styles from './SelectionItem.module.scss';

export type SelectionSize = 'sm' | 'md';

interface SelectionItemProps {
  size: SelectionSize;
  disabled?: boolean;
  label?: ReactNode;
  /** 라벨 아래 부가 설명 */
  helperText?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** 숨겨진 input + 그려진 컨트롤. 반드시 이 순서(input 다음 컨트롤)로 넣는다 */
  children: ReactNode;
}

// Checkbox · Radio · ToggleSwitch가 공유하는 `컨트롤 + 라벨 + 부가 설명` 레이아웃. 패키지 내부용이다.
export function SelectionItem({
  size,
  disabled,
  label,
  helperText,
  className,
  style,
  children,
}: SelectionItemProps) {
  return (
    <label
      className={clsx(styles.root, styles[size], disabled && styles.disabled, className)}
      style={style}
    >
      {children}
      {(label || helperText) && (
        <span className={styles.content}>
          {label && <span>{label}</span>}
          {helperText && <span className={styles.helper}>{helperText}</span>}
        </span>
      )}
    </label>
  );
}
