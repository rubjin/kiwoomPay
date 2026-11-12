import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styles from './ActionBar.module.scss';

export interface ActionBarProps extends HTMLAttributes<HTMLDivElement> {
  /** 왼쪽 라벨 (예: 취소사유) */
  label?: ReactNode;
  /** 입력 · 선택 · 버튼 (sm 크기 권장) */
  children: ReactNode;
}

/**
 * 그리드에서 고른 행에 바로 적용할 입력 + 실행을 한 줄로 묶는 작업 바 (Figma 취소사유입력).
 *   <ActionBar label="취소사유">
 *     <TextField size="sm" /> <RadioGroup …/> <Button size="sm" variant="dark">선택 취소</Button>
 *   </ActionBar>
 */
export const ActionBar = forwardRef<HTMLDivElement, ActionBarProps>(
  ({ label, className, children, ...rest }, ref) => (
    <div {...rest} ref={ref} role="group" className={clsx(styles.bar, className)}>
      {label !== undefined && <span className={styles.label}>{label}</span>}
      {children}
    </div>
  ),
);
ActionBar.displayName = 'ActionBar';
