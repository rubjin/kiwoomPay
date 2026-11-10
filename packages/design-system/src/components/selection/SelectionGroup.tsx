import clsx from 'clsx';
import { forwardRef, type HTMLAttributes } from 'react';
import styles from './SelectionGroup.module.scss';

export interface SelectionGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** vertical(기본): 세로로 쌓는다 / horizontal: 가로로 나열한다 */
  direction?: 'vertical' | 'horizontal';
}

/** Checkbox · ToggleSwitch를 묶는 레이아웃. 항목 간격 8px. RadioGroup은 내부에서 이 컴포넌트를 쓴다. */
export const SelectionGroup = forwardRef<HTMLDivElement, SelectionGroupProps>(
  ({ direction = 'vertical', role = 'group', className, ...rest }, ref) => (
    <div
      {...rest}
      ref={ref}
      role={role}
      className={clsx(styles.group, direction === 'horizontal' && styles.horizontal, className)}
    />
  ),
);

SelectionGroup.displayName = 'SelectionGroup';
