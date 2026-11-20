import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Badge } from '../Badge';
import { Icon } from '../Icon';
import styles from './DashboardLists.module.scss';

// ── CarouselNav: ‹ 1 / 3 › ────────────────────────────────
export interface CarouselNavProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 현재 쪽 (1부터) */
  page: number;
  total: number;
  onChange: (page: number) => void;
}

/** 카드 안 작은 쪽 넘김 (Figma Carousel / Compact Navigation). 1쪽뿐이면 그리지 않는다 */
export const CarouselNav = forwardRef<HTMLDivElement, CarouselNavProps>(
  ({ page, total, onChange, className, ...rest }, ref) => {
    if (total <= 1) return null;
    return (
      <div {...rest} ref={ref} className={clsx(styles.carousel, className)}>
        <button
          type="button"
          className={styles.carouselButton}
          aria-label="이전"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          <Icon name="chevron-left" size={16} />
        </button>
        <span className={styles.carouselPage}>
          <span className={styles.carouselCurrent}>{page}</span>{' '}
          <span className={styles.carouselSlash}>/</span> {total}
        </span>
        <button
          type="button"
          className={styles.carouselButton}
          aria-label="다음"
          disabled={page >= total}
          onClick={() => onChange(page + 1)}
        >
          <Icon name="chevron-right" size={16} />
        </button>
      </div>
    );
  },
);
CarouselNav.displayName = 'CarouselNav';

// ── EventFeed: 시각 · 구분 · 내용 ──────────────────────────
export interface EventFeedItem {
  key?: string;
  /** 시각 (예: 10:24) */
  time: ReactNode;
  /** 구분 (회색 Badge, 예: 정산 · 원천사 장애) */
  category: ReactNode;
  message: ReactNode;
}

export interface EventFeedProps extends HTMLAttributes<HTMLUListElement> {
  items: EventFeedItem[];
  /** 0건일 때 글자 */
  empty?: ReactNode;
}

/** 당일 알림 줄 목록 (Figma 당일 업무 · 시스템 알림). 줄은 카드 높이에 고르게 나눈다 */
export const EventFeed = forwardRef<HTMLUListElement, EventFeedProps>(
  ({ items, empty = '알림이 없습니다.', className, ...rest }, ref) => (
    <ul {...rest} ref={ref} className={clsx(styles.feed, className)}>
      {items.length === 0 && <li className={styles.empty}>{empty}</li>}
      {items.map((item, index) => (
        <li key={item.key ?? index} className={styles.feedRow}>
          <span className={styles.feedTime}>{item.time}</span>
          <span>
            <Badge tone="neutral" size="sm">
              {item.category}
            </Badge>
          </span>
          <span className={styles.feedMessage}>{item.message}</span>
        </li>
      ))}
    </ul>
  ),
);
EventFeed.displayName = 'EventFeed';

// ── NoticeList: 구분 · (N) 제목 · 날짜 ─────────────────────
export interface NoticeListItem {
  key?: string;
  /** 구분 (예: 일반 · 시스템 · 정책) */
  category: ReactNode;
  title: ReactNode;
  /** 날짜 (예: 07-18) */
  date: ReactNode;
  /** 읽지 않음 — 제목 앞 N */
  unread?: boolean;
  /** 흐리게 (지난 공지) */
  muted?: boolean;
}

export interface NoticeListProps extends HTMLAttributes<HTMLUListElement> {
  items: NoticeListItem[];
  /** 있으면 제목이 버튼 */
  onItemClick?: (item: NoticeListItem, index: number) => void;
  empty?: ReactNode;
}

/** 공지 짧은 목록 (Figma 공지사항). 제목이 길면 말줄임 */
export const NoticeList = forwardRef<HTMLUListElement, NoticeListProps>(
  ({ items, onItemClick, empty = '공지사항이 없습니다.', className, ...rest }, ref) => (
    <ul {...rest} ref={ref} className={clsx(styles.notice, className)}>
      {items.length === 0 && <li className={styles.empty}>{empty}</li>}
      {items.map((item, index) => {
        const title = (
          <>
            {item.unread && <span className={styles.unread}>N</span>}
            <span className={styles.noticeText}>{item.title}</span>
          </>
        );
        return (
          <li key={item.key ?? index} className={styles.noticeRow}>
            <span className={styles.noticeCategory}>{item.category}</span>
            {onItemClick ? (
              <button
                type="button"
                className={clsx(
                  styles.noticeTitle,
                  styles.noticeButton,
                  item.muted && styles.muted,
                )}
                onClick={() => onItemClick(item, index)}
              >
                {title}
              </button>
            ) : (
              <span className={clsx(styles.noticeTitle, item.muted && styles.muted)}>{title}</span>
            )}
            <span className={styles.noticeDate}>{item.date}</span>
          </li>
        );
      })}
    </ul>
  ),
);
NoticeList.displayName = 'NoticeList';

// ── InfoChip: 이름 | 분류 Badge + 값 ───────────────────────
export interface InfoChipProps extends HTMLAttributes<HTMLDivElement> {
  /** 왼쪽 이름 (예: 가맹점명) */
  label: ReactNode;
  /** 오른쪽 분류 (회색 선 Badge) */
  badge?: ReactNode;
  /** 오른쪽 값 (12 SemiBold) */
  value?: ReactNode;
}

/** 작은 회색 칩 한 줄 (Figma 최근 리스크 등록 가맹점) — 격자로 2 × 2 등 배치 */
export const InfoChip = forwardRef<HTMLDivElement, InfoChipProps>(
  ({ label, badge, value, className, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.chip, className)}>
      <span className={styles.chipLabel}>{label}</span>
      <span className={styles.chipRight}>
        {badge && (
          <Badge tone="neutral" appearance="line" size="sm">
            {badge}
          </Badge>
        )}
        {value && <span className={styles.chipValue}>{value}</span>}
      </span>
    </div>
  ),
);
InfoChip.displayName = 'InfoChip';
