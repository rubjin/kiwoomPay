import clsx from 'clsx';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import styles from './DashboardLayout.module.scss';

export interface DashboardGridProps extends HTMLAttributes<HTMLDivElement> {
  /** 열 비율 (예: [2, 1, 1] → 2fr 1fr 1fr). 기본 4열 같은 폭 */
  columns?: number[];
  /** 칸 사이 (기본 12 — 대시보드 카드 사이, 한 칸 안 위아래 묶음은 8) */
  gap?: 8 | 12;
  /** 줄 높이 (시안 카드 높이). 없으면 내용 높이 — 같은 줄 카드는 가장 높은 카드에 맞춘다 */
  rowHeight?: number;
}

/**
 * 대시보드 카드 격자. 줄이 여럿이면(한 칸 안 위아래 카드) 줄 높이를 똑같이 나눈다.
 * 칸 안을 다시 나눌 때는 DashboardGrid를 겹쳐 쓴다 (예: [536, 262] 안에 [2, 1, 1])
 */
export const DashboardGrid = forwardRef<HTMLDivElement, DashboardGridProps>(
  ({ columns = [1, 1, 1, 1], gap = 12, rowHeight, className, style, ...rest }, ref) => (
    <div
      {...rest}
      ref={ref}
      className={clsx(styles.grid, styles[`gap${gap}`], className)}
      style={
        {
          gridTemplateColumns: columns.map((c) => `minmax(0, ${c}fr)`).join(' '),
          ...(rowHeight ? { gridAutoRows: `${rowHeight}px` } : null),
          ...style,
        } as CSSProperties
      }
    />
  ),
);
DashboardGrid.displayName = 'DashboardGrid';

export interface DashboardSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** 영역 제목 (20 SemiBold) */
  title?: ReactNode;
  /** 오른쪽 기준일 등 (13 Medium 회색) */
  aside?: ReactNode;
}

/** 대시보드 영역: 제목 줄(제목 | 기준일) + 카드 격자, 사이 12 (Figma 당일 정산 진행현황) */
export const DashboardSection = forwardRef<HTMLElement, DashboardSectionProps>(
  ({ title, aside, className, children, ...rest }, ref) => (
    <section {...rest} ref={ref} className={clsx(styles.section, className)}>
      {(title || aside) && (
        <div className={styles.sectionHeader}>
          {title && <h2 className={styles.sectionTitle}>{title}</h2>}
          {aside && <span className={styles.sectionAside}>{aside}</span>}
        </div>
      )}
      {children}
    </section>
  ),
);
DashboardSection.displayName = 'DashboardSection';
