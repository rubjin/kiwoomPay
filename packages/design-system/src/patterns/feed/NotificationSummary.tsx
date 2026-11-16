import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { TextButton } from '../../components/Button';
import styles from './Feed.module.scss';

export interface NotificationCount {
  key: string;
  label: ReactNode;
  count: number;
  /** 업무유형 앞 아이콘 (16) */
  icon?: ReactNode;
}

const format = (value: number, unit: ReactNode) => (
  <>
    {value.toLocaleString('ko-KR')}
    {unit}
  </>
);

/** 업무유형별 미확인 건수 칩 (회색 · 높이 20 · 사이 6) — NotificationFeed · NotificationSummary 공용 */
export function NotificationCountChips({
  counts,
  unit = '건',
}: {
  counts: NotificationCount[];
  unit?: ReactNode;
}) {
  return (
    <ul className={styles.chips} aria-label="업무유형별 미확인 알림">
      {counts.map((c) => (
        <li key={c.key} className={styles.chip}>
          {c.icon && <span className={styles.chipIcon}>{c.icon}</span>}
          {c.label}
          <span className={styles.chipCount}>{format(c.count, unit)}</span>
        </li>
      ))}
    </ul>
  );
}

export interface NotificationSummaryProps extends HTMLAttributes<HTMLDivElement> {
  unreadCount: number;
  counts?: NotificationCount[];
  /** [모두 읽음 처리] — 미확인이 없으면 숨김 */
  onReadAll?: () => void;
  unit?: ReactNode;
}

/**
 * 알림센터 미확인 요약 한 줄: [미확인 알림 N건] · 업무유형별 칩 ··· [모두 읽음 처리]
 * (미확인 알림 14 SemiBold · 건수 16 Bold Primary, 칩과 사이 24 — Figma KWPC02030000).
 * 조회 조건과 한 카드에 둘 때는 SearchPanel `header`로 넣는다
 */
export const NotificationSummary = forwardRef<HTMLDivElement, NotificationSummaryProps>(
  ({ unreadCount, counts, onReadAll, unit = '건', className, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.summaryRow, className)}>
      <span className={styles.summaryUnread}>
        <span className={styles.summaryRowLabel}>미확인 알림</span>
        <span className={styles.summaryCount}>{format(unreadCount, unit)}</span>
      </span>
      {counts && counts.length > 0 && <NotificationCountChips counts={counts} unit={unit} />}
      {onReadAll && unreadCount > 0 && (
        <TextButton variant="neutral" className={styles.summaryReadAll} onClick={onReadAll}>
          모두 읽음 처리
        </TextButton>
      )}
    </div>
  ),
);
NotificationSummary.displayName = 'NotificationSummary';
