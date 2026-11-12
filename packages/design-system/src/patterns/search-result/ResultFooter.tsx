import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styles from './SearchResult.module.scss';

export interface ResultFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** 전체 건수 */
  total: number;
  /** 건수 앞 문구 (기본 'Total:') */
  totalLabel?: ReactNode;
  /** Pagination */
  children?: ReactNode;
}

/** P01 결과 아래 줄: 왼쪽 Total · 가운데 Pagination (Figma Pagination Area) */
export const ResultFooter = forwardRef<HTMLDivElement, ResultFooterProps>(
  ({ total, totalLabel = 'Total:', className, children, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.resultFooter, className)}>
      <p className={styles.total}>
        {totalLabel} <strong className={styles.totalValue}>{total.toLocaleString('ko-KR')}</strong>
      </p>
      {children && <div className={styles.pagination}>{children}</div>}
    </div>
  ),
);
ResultFooter.displayName = 'ResultFooter';
