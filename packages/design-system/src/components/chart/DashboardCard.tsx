import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../Icon';
import { InfoTip } from '../Tooltip';
import styles from './DashboardCard.module.scss';

export interface DashboardCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** 카드 제목. 없으면 제목 줄을 그리지 않는다 (split 카드 — 칸마다 bare 카드로 제목) */
  title?: ReactNode;
  /** xs: 12 SemiBold(칸 안 작은 제목) / sm: 13 SemiBold(기본) / md: 14 SemiBold — 넓은 차트 카드 */
  titleSize?: 'xs' | 'sm' | 'md';
  /** 제목 옆 Info 아이콘(16) Tooltip 문구 */
  info?: ReactNode;
  /** 제목 옆 기간 · 보조 글자 (11 Medium 회색, 예: 2026-07-01 ~ 07-17) */
  period?: ReactNode;
  /** 제목 묶음 뒤에 붙는 요소 (예: CarouselNav) */
  titleAddon?: ReactNode;
  /** 오른쪽 링크 글자 (예: 전체보기 · 통계 상세 보기). onLinkClick과 함께 */
  linkLabel?: ReactNode;
  onLinkClick?: () => void;
  /** 오른쪽 끝 글자 — 링크 대신 기간 등 (11 Medium 회색) */
  aside?: ReactNode;
  /** 제목 줄 ↔ 본문 (기본 8) */
  gap?: 4 | 8 | 12;
  /** 본문을 가로 칸으로 나누고 사이에 세로선(칸 사이 16) — 첫 칸은 내용 폭, 나머지가 남는 폭 (RM 리스크 관리 현황) */
  split?: boolean;
  /** 테두리 · 배경 · 안쪽 여백 없음 — split 카드 안 칸 */
  bare?: boolean;
}

/**
 * 대시보드 카드: 흰 카드(반경 12 · 위아래 12 · 좌우 16) + 제목 줄(제목 · Info · 기간 | 링크 >) + 본문.
 * 본문은 남는 높이를 채운다 — 같은 줄 카드끼리 높이를 맞출 때 부모 격자가 늘린다
 */
export const DashboardCard = forwardRef<HTMLElement, DashboardCardProps>(
  (
    {
      title,
      titleSize = 'sm',
      info,
      period,
      titleAddon,
      linkLabel,
      onLinkClick,
      aside,
      gap = 8,
      split = false,
      bare = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => (
    <section
      {...rest}
      ref={ref}
      className={clsx(styles.card, styles[`gap${gap}`], bare && styles.bare, className)}
    >
      {title !== undefined && (
        <div className={styles.header}>
          <div className={styles.heading}>
            <h3 className={clsx(styles.title, styles[`title${titleSize.toUpperCase()}`])}>
              {title}
            </h3>
            {info && <InfoTip size={16} content={info} />}
            {period && <span className={styles.period}>{period}</span>}
            {titleAddon}
          </div>
          {linkLabel && (
            <button type="button" className={styles.link} onClick={onLinkClick}>
              {linkLabel}
              <Icon name="chevron-right" size={16} className={styles.linkIcon} />
            </button>
          )}
          {aside && <span className={styles.period}>{aside}</span>}
        </div>
      )}
      <div className={clsx(styles.body, split && styles.split)}>{children}</div>
    </section>
  ),
);
DashboardCard.displayName = 'DashboardCard';
