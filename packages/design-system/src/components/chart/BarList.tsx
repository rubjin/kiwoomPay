import clsx from 'clsx';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { chartColor } from './chartColors';
import styles from './BarList.module.scss';

export interface BarListItem {
  label: ReactNode;
  /** 막대 길이 기준 값 */
  value: number;
  /** 오른쪽 표시 글자 (기본 value) — 예: 18건 · 12.46억 */
  display?: ReactNode;
  /** 막대 색 (기본: 순서대로 Chart Category 01~09) */
  color?: string;
}

export interface BarListProps extends HTMLAttributes<HTMLDivElement> {
  items: BarListItem[];
  /** 막대 100% 값 (기본: 가장 큰 값) */
  max?: number;
  /**
   * compact: 이름(10) · 막대(6) · 값(11 Bold) 줄 — 카드 한쪽 요약 (RM 리스크) /
   * ranked: 회색 줄마다 순위 · 이름(12 SemiBold) · 막대(9) · 값(12 Bold), 위에 축 눈금 — 순위 비교 (영업대행사별 실적)
   */
  variant?: 'compact' | 'ranked';
  /** ranked: 축 눈금 값 (예: [0, 5, 10, 15]) — 마지막 값이 막대 100% */
  ticks?: number[];
  /** ranked: 축 왼쪽 단위 (예: 실적 금액 (억원)) */
  axisLabel?: ReactNode;
}

/** 가로 막대 목록 — 차트 라이브러리 없이 CSS로 그린다 */
export const BarList = forwardRef<HTMLDivElement, BarListProps>(
  ({ items, max, variant = 'compact', ticks, axisLabel, className, ...rest }, ref) => {
    const scale = max ?? ticks?.[ticks.length - 1] ?? Math.max(1, ...items.map((i) => i.value));
    const ratio = (value: number) => `${Math.min(100, Math.max(0, (value / scale) * 100))}%`;
    return (
      <div {...rest} ref={ref} className={clsx(styles.list, styles[variant], className)}>
        {variant === 'ranked' && ticks && (
          <div className={styles.axis} aria-hidden>
            <span className={styles.axisLabel}>{axisLabel}</span>
            <span className={styles.axisTrack}>
              {ticks.map((tick) => (
                <span
                  key={tick}
                  className={styles.tick}
                  style={{ '--bar-pos': ratio(tick) } as CSSProperties}
                >
                  {tick}
                </span>
              ))}
            </span>
          </div>
        )}
        {items.map((item, index) => (
          <div key={index} className={styles.row}>
            {variant === 'ranked' && (
              <span className={clsx(styles.rank, index === 0 && styles.rankFirst)}>
                {index + 1}
              </span>
            )}
            <span className={styles.label}>{item.label}</span>
            <span className={styles.track}>
              <span
                className={styles.fill}
                style={
                  {
                    '--bar-size': ratio(item.value),
                    '--bar-color': item.color ?? chartColor(index),
                  } as CSSProperties
                }
              />
            </span>
            <span className={styles.value}>{item.display ?? item.value}</span>
          </div>
        ))}
      </div>
    );
  },
);
BarList.displayName = 'BarList';
