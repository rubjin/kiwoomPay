import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styles from './SearchResult.module.scss';

export interface ResultSummaryItem {
  label: ReactNode;
  /** 숫자는 천 단위 쉼표. null · undefined(조회 전)는 '-' */
  value?: number | string | null;
  /** 단위 (기본 '건') */
  unit?: ReactNode;
}

export interface ResultSummaryProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** 제목 (기본 '조회 요약') */
  title?: ReactNode;
  items: ResultSummaryItem[];
}

const formatValue = (value: ResultSummaryItem['value']) => {
  if (value === null || value === undefined || value === '') return '-';
  return typeof value === 'number' ? value.toLocaleString('ko-KR') : value;
};

/**
 * P01 조회 요약(옵션): 결과 집계 항목을 한 줄로. 집계 항목 · 기준은 화면설계서가 정한다.
 * 조회 전에는 value를 비워 '-'로 보여준다.
 */
export const ResultSummary = forwardRef<HTMLElement, ResultSummaryProps>(
  ({ title = '조회 요약', items, className, ...rest }, ref) => (
    <section {...rest} ref={ref} className={clsx(styles.inlineCard, className)}>
      <h2 className={styles.subTitle}>{title}</h2>
      <dl className={styles.summaryList}>
        {items.map((item, index) => (
          <div key={index} className={styles.summaryItem}>
            <dt className={styles.summaryLabel}>{item.label}</dt>
            <dd className={styles.summaryValue}>
              <strong className={styles.summaryNumber}>{formatValue(item.value)}</strong>
              <span>{item.unit ?? '건'}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  ),
);
ResultSummary.displayName = 'ResultSummary';
