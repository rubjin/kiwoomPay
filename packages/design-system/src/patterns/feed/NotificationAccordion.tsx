import clsx from 'clsx';
import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { DotBadge } from '../../components/Badge';
import { Icon } from '../../components/Icon';
import { useControllableState } from '../../hooks/useControllableState';
import styles from './Feed.module.scss';

export interface NotificationAccordionItem {
  id: string;
  /** 업무유형 (예: 정산 · RM/리스크) */
  category: ReactNode;
  title: ReactNode;
  /** 표시용 일시 */
  date: ReactNode;
  unread?: boolean;
  /** 펼쳤을 때 내용 (보통 NotificationDetail) */
  detail?: ReactNode;
}

export interface NotificationAccordionProps extends Omit<
  HTMLAttributes<HTMLUListElement>,
  'onToggle'
> {
  items: NotificationAccordionItem[];
  /** 펼친 알림 (한 번에 하나, null이면 모두 접힘) */
  expandedId?: string | null;
  defaultExpandedId?: string | null;
  /** 줄을 눌렀을 때 — 읽음 처리는 화면이 한다 */
  onToggle?: (item: NotificationAccordionItem, expanded: boolean) => void;
  /** 알림이 없을 때 */
  empty?: ReactNode;
}

/**
 * 알림센터 목록 (FAQ식 아코디언): 줄 = [미확인 점] 업무유형 · 제목 · 일시 · 화살표, 누르면 아래에 상세가 펼쳐진다.
 * 미확인 제목 14 Bold, 확인한 제목 14 Regular 회색. 줄 높이 56 · 좌우 20 · 사이 16 (Figma KWPC02030000)
 */
export const NotificationAccordion = forwardRef<HTMLUListElement, NotificationAccordionProps>(
  (
    {
      items,
      expandedId,
      defaultExpandedId = null,
      onToggle,
      empty = '알림이 없습니다.',
      className,
      ...rest
    },
    ref,
  ) => {
    const baseId = useId();
    const [current, setCurrent] = useControllableState<string | null>(
      expandedId,
      defaultExpandedId,
    );

    if (items.length === 0) {
      return <p className={clsx(styles.accordion, styles.accordionEmpty, className)}>{empty}</p>;
    }

    return (
      <ul {...rest} ref={ref} className={clsx(styles.accordion, className)}>
        {items.map((item) => {
          const open = current === item.id;
          const panelId = `${baseId}-${item.id}`;
          return (
            <li key={item.id} className={clsx(styles.accordionItem, open && styles.accordionOpen)}>
              <button
                type="button"
                className={styles.accordionRow}
                aria-expanded={open}
                aria-controls={item.detail ? panelId : undefined}
                onClick={() => {
                  setCurrent(open ? null : item.id);
                  onToggle?.(item, !open);
                }}
              >
                <span className={styles.accordionDot}>
                  {item.unread && <DotBadge aria-label="미확인" />}
                </span>
                <span className={styles.accordionCategory}>{item.category}</span>
                <span
                  className={clsx(
                    styles.accordionTitle,
                    item.unread && styles.accordionTitleUnread,
                  )}
                >
                  {item.title}
                </span>
                <span className={styles.accordionDate}>{item.date}</span>
                <span className={styles.accordionChevron} aria-hidden>
                  <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} />
                </span>
              </button>
              {open && item.detail && (
                <div id={panelId} className={styles.accordionPanel}>
                  {item.detail}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  },
);
NotificationAccordion.displayName = 'NotificationAccordion';

export interface NotificationDetailProps {
  /** 알림 내용 (14 Regular, 줄바꿈 유지) */
  message: ReactNode;
  /** 관련 업무: 메뉴 경로 + 이동 버튼 */
  related?: { path: ReactNode; action?: ReactNode };
  /** 알림 정보 (2열: 이름 58 · 값) */
  meta?: { label: ReactNode; value: ReactNode }[];
}

/**
 * 펼친 알림 상세: 알림 내용 → 흰 상자 [관련 업무 · 이동 버튼 | 알림 정보 2×2]
 * (상자 테두리 Primary 100 · 반경 6, 알림 정보 Neutral 50 — Figma KWPC02030000)
 */
export function NotificationDetail({ message, related, meta }: NotificationDetailProps) {
  return (
    <div className={styles.detail}>
      <div className={styles.detailMessage}>{message}</div>
      {(related || (meta && meta.length > 0)) && (
        <div className={styles.detailBox}>
          {related && (
            <div className={styles.detailRelated}>
              <div className={styles.detailRelatedText}>
                <p className={styles.detailRelatedTitle}>관련 업무</p>
                <p className={styles.detailRelatedPath}>{related.path}</p>
              </div>
              {related.action}
            </div>
          )}
          {meta && meta.length > 0 && (
            <dl className={styles.detailMeta}>
              {meta.map((m, index) => (
                <div key={index} className={styles.detailMetaItem}>
                  <dt className={styles.detailMetaLabel}>{m.label}</dt>
                  <dd className={styles.detailMetaValue}>{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}
    </div>
  );
}
