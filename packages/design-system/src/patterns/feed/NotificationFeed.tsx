import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { UnreadIndicator } from '../../components/Badge';
import { TextButton } from '../../components/Button';
import styles from './Feed.module.scss';

export interface NotificationItem {
  id: string;
  /** 업무유형 (예: 정산 · 리스크/FDS) */
  category: ReactNode;
  title: ReactNode;
  /** 표시용 일시 (예: 2026-09-07 13:42) */
  date: ReactNode;
  unread?: boolean;
}

export interface NotificationCount {
  key: string;
  label: ReactNode;
  count: number;
  /** 업무유형 앞 아이콘 (16) */
  icon?: ReactNode;
}

export interface NotificationFeedProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  items: NotificationItem[];
  /** 미확인 건수 (없으면 items의 unread 수) */
  unreadCount?: number;
  /** 업무유형별 미확인 건수 칩 (0건도 보여 준다) */
  counts?: NotificationCount[];
  /** [모두 읽음 처리] — 미확인이 없으면 숨김 */
  onReadAll?: () => void;
  /** 알림 선택 → 읽음 처리 · 관련 업무로 이동은 화면이 한다 */
  onSelect?: (item: NotificationItem) => void;
  /** 보여줄 최대 건수 (Hub 축약형: 5) */
  limit?: number;
  /** 단위 (기본 '건') */
  unit?: ReactNode;
  /** 알림이 없을 때 */
  empty?: ReactNode;
}

/**
 * P06 Notification Feed: 미확인 요약([모두 읽음 처리]) → 업무유형별 건수 → 알림 목록.
 * 미확인 알림은 Primary 50 배경 + N 표시 + 제목 SemiBold. Figma KWPC2000 마이페이지 알림센터 카드.
 */
export const NotificationFeed = forwardRef<HTMLDivElement, NotificationFeedProps>(
  (
    {
      items,
      unreadCount,
      counts,
      onReadAll,
      onSelect,
      limit,
      unit = '건',
      empty = '최근 수신된 알림이 없습니다.',
      className,
      ...rest
    },
    ref,
  ) => {
    const unread = unreadCount ?? items.filter((item) => item.unread).length;
    const shown = limit === undefined ? items : items.slice(0, limit);
    return (
      <div {...rest} ref={ref} className={clsx(styles.feed, className)}>
        <div className={styles.summary}>
          <span className={styles.summaryUnread}>
            <span className={styles.summaryLabel}>미확인 알림</span>
            <span className={styles.summaryCount}>
              {unread.toLocaleString('ko-KR')}
              {unit}
            </span>
          </span>
          {onReadAll && unread > 0 && (
            <TextButton variant="neutral" onClick={onReadAll}>
              모두 읽음 처리
            </TextButton>
          )}
        </div>
        {counts && counts.length > 0 && (
          <ul className={styles.chips} aria-label="업무유형별 미확인 알림">
            {counts.map((c) => (
              <li key={c.key} className={styles.chip}>
                {c.icon && <span className={styles.chipIcon}>{c.icon}</span>}
                {c.label}
                <span className={styles.chipCount}>
                  {c.count.toLocaleString('ko-KR')}
                  {unit}
                </span>
              </li>
            ))}
          </ul>
        )}
        {shown.length === 0 ? (
          <p className={styles.feedEmpty}>{empty}</p>
        ) : (
          <ul className={styles.list}>
            {shown.map((item) => (
              <li key={item.id} className={styles.listItem}>
                <button
                  type="button"
                  className={clsx(styles.item, item.unread && styles.unread)}
                  onClick={() => onSelect?.(item)}
                >
                  <span className={styles.indicator}>{item.unread && <UnreadIndicator />}</span>
                  <span className={styles.category}>{item.category}</span>
                  <span className={clsx(styles.itemTitle, item.unread && styles.itemTitleUnread)}>
                    {item.title}
                  </span>
                  <span className={styles.date}>{item.date}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);
NotificationFeed.displayName = 'NotificationFeed';
