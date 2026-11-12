import clsx from 'clsx';
import { Fragment, forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styles from './RecordForm.module.scss';

export interface ContextChipItem {
  label: ReactNode;
  value: ReactNode;
}

export interface ContextChipProps extends HTMLAttributes<HTMLDivElement> {
  /** 이름 · 값 쌍 (예: 현재 사업자 ㈜ABC커머스 | 사업자번호 123-45-67890) */
  items: ContextChipItem[];
  /** 흰 카드 안에서 쓸 때 회색 배경 */
  muted?: boolean;
}

/** P02 대상 식별(Record Context): 지금 보고 있는 업무 대상을 한 줄로 (Figma Context / 현재 사업자) */
export const ContextChip = forwardRef<HTMLDivElement, ContextChipProps>(
  ({ items, muted = false, className, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.chip, muted && styles.chipMuted, className)}>
      {items.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <span className={styles.chipDivider} aria-hidden>
              ㅣ
            </span>
          )}
          <span className={styles.chipLabel}>{item.label}</span>
          <span className={styles.chipValue}>{item.value}</span>
        </Fragment>
      ))}
    </div>
  ),
);
ContextChip.displayName = 'ContextChip';
