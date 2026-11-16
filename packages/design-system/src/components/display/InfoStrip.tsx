import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styles from './InfoStrip.module.scss';

export interface InfoStripItem {
  /** 이름 (13 Bold) */
  label: ReactNode;
  /** 값 (14 Regular) — Badge 등도 넣을 수 있다 */
  value: ReactNode;
}

export interface InfoStripProps extends HTMLAttributes<HTMLDListElement> {
  items: InfoStripItem[];
}

/**
 * 한 줄 요약 상자: 회색 상자 안에 [이름 값] 쌍을 가운데 정렬로 나란히 (쌍 사이 60 · 이름 ↔ 값 12, 여백 16 · 반경 8).
 * 팝업 위쪽 "현재 상태" 같은 조회 전용 요약 (Figma 마이페이지 계정 상태 이력 "현재 계정 상태")
 */
export const InfoStrip = forwardRef<HTMLDListElement, InfoStripProps>(
  ({ items, className, ...rest }, ref) => (
    <dl {...rest} ref={ref} className={clsx(styles.strip, className)}>
      {items.map((item, index) => (
        <div key={index} className={styles.item}>
          <dt className={styles.label}>{item.label}</dt>
          <dd className={styles.value}>{item.value}</dd>
        </div>
      ))}
    </dl>
  ),
);
InfoStrip.displayName = 'InfoStrip';
