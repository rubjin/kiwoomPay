import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styles from './InfoStrip.module.scss';

export interface InfoStripItem {
  /** 이름 */
  label: ReactNode;
  /** 값 — Badge 등도 넣을 수 있다 */
  value: ReactNode;
  /** 있으면 값을 누를 수 있다 (stacked: Primary 글자 + 밑줄, 예: 전체 건수 → 목록 전체 보기) */
  onClick?: () => void;
}

export interface InfoStripProps extends HTMLAttributes<HTMLDListElement> {
  items: InfoStripItem[];
  /**
   * inline(기본): [이름 값] 쌍을 가운데 정렬로 나란히 — 이름 13 Bold ↔ 값 14 Regular 12, 쌍 사이 60
   * (Figma 계정 상태 이력 "현재 계정 상태") /
   * stacked: 이름(12 Regular) 위 · 값(18 Bold) 아래 8, 칸 사이 16 · 왼쪽 정렬 (Figma 개별 예외 권한 "권한 적용 기준")
   */
  layout?: 'inline' | 'stacked';
  /** stacked 칸 폭 (grid-template-columns). 기본 같은 폭 */
  columns?: string;
}

/**
 * 한 줄 요약 상자: 회색 상자(Neutral 50 · 반경 8) 안에 이름 · 값 쌍을 나란히.
 * 팝업 위쪽 "현재 상태" · "적용 기준" 같은 조회 전용 요약에 쓴다
 */
export const InfoStrip = forwardRef<HTMLDListElement, InfoStripProps>(
  ({ items, layout = 'inline', columns, className, style, ...rest }, ref) => {
    const stacked = layout === 'stacked';
    return (
      <dl
        {...rest}
        ref={ref}
        className={clsx(styles.strip, stacked && styles.stacked, className)}
        style={
          stacked
            ? {
                gridTemplateColumns: columns ?? `repeat(${items.length}, minmax(0, 1fr))`,
                ...style,
              }
            : style
        }
      >
        {items.map((item, index) => (
          <div key={index} className={styles.item}>
            <dt className={styles.label}>{item.label}</dt>
            <dd className={styles.value}>
              {item.onClick ? (
                <button type="button" className={styles.link} onClick={item.onClick}>
                  {item.value}
                </button>
              ) : (
                item.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    );
  },
);
InfoStrip.displayName = 'InfoStrip';
