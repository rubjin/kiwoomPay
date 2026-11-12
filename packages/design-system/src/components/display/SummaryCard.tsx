import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { InfoTip } from '../Tooltip';
import styles from './SummaryCard.module.scss';

export type SummaryCardSize = 'md' | 'sm';

export interface SummaryCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 지표 이름 */
  title: ReactNode;
  /** 제목 옆 Info 아이콘(20)의 Tooltip 문구. 없으면 아이콘을 그리지 않는다 */
  info?: ReactNode;
  /** 값. 숫자는 천 단위 쉼표를 붙인다 */
  value?: ReactNode;
  /** 단위 (예: ₩, 건). md는 값 앞, sm은 값 뒤 */
  unit?: ReactNode;
  /** 보조 문구 (앞에 • 표시). md는 값 아래, sm은 값 옆 */
  meta?: ReactNode;
  /** md: 120 높이 · 큰 강조 값 / sm: 96 높이 · 한 줄 */
  size?: SummaryCardSize;
  /** 조회 중 (값 자리에 Skeleton) */
  loading?: boolean;
  /** 조회 결과 없음 */
  empty?: boolean;
  emptyTitle?: ReactNode;
  emptyDescription?: ReactNode;
}

const format = (value: ReactNode) =>
  typeof value === 'number' ? value.toLocaleString('ko-KR') : value;

/** 조회 결과 요약 지표 카드 (예: 총 거래 건수 · 금액) */
export const SummaryCard = forwardRef<HTMLDivElement, SummaryCardProps>(
  (
    {
      title,
      info,
      value,
      unit,
      meta,
      size = 'md',
      loading = false,
      empty = false,
      emptyTitle = '조회 결과 없음',
      emptyDescription = '조회 후 결과가 표시됩니다.',
      className,
      ...rest
    },
    ref,
  ) => {
    let body: ReactNode;
    if (loading) {
      body = (
        <div className={styles.skeleton} role="status" aria-label="불러오는 중">
          <span className={styles.skeletonValue} />
          <span className={styles.skeletonMeta} />
        </div>
      );
    } else if (empty) {
      body = (
        <div className={styles.empty}>
          <span className={styles.emptyTitle}>{emptyTitle}</span>
          {emptyDescription && <span className={styles.emptyText}>{emptyDescription}</span>}
        </div>
      );
    } else {
      const unitNode = unit !== undefined && <span className={styles.unit}>{unit}</span>;
      body = (
        <div className={styles.body}>
          <span className={styles.valueRow}>
            {size === 'md' && unitNode}
            <span className={styles.value}>{format(value)}</span>
            {size === 'sm' && unitNode}
            {size === 'sm' && meta !== undefined && <span className={styles.meta}>{meta}</span>}
          </span>
          {size === 'md' && meta !== undefined && <span className={styles.meta}>{meta}</span>}
        </div>
      );
    }

    return (
      <div
        {...rest}
        ref={ref}
        className={clsx(styles.card, styles[size], className)}
        aria-busy={loading || undefined}
      >
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          {info !== undefined && <InfoTip content={info} size={20} />}
        </div>
        {body}
      </div>
    );
  },
);
SummaryCard.displayName = 'SummaryCard';
