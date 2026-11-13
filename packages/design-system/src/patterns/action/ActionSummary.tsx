import clsx from 'clsx';
import { Fragment, forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styles from './ActionSummary.module.scss';

export interface ActionSummaryPart {
  /** 숫자 앞 글자 (예: 선택한 일반 정산원장 · 합계) */
  label?: ReactNode;
  /** 숫자는 천 단위 쉼표 */
  value: number | string;
  /** 단위 (기본 '건') */
  unit?: ReactNode;
}

const format = (value: number | string) =>
  typeof value === 'number' ? value.toLocaleString('ko-KR') : value;

export interface ActionTargetBarProps extends HTMLAttributes<HTMLParagraphElement> {
  /** 가운뎃점(·)으로 이어 붙인다. 숫자는 Primary SemiBold */
  parts: ActionSummaryPart[];
}

/**
 * 일괄 처리 팝업의 선택 대상 요약 줄 (회색 상자):
 * "선택한 일반 정산원장 3건 · 합계 10,500,000원" (Figma 처리_실행 팝업)
 */
export const ActionTargetBar = forwardRef<HTMLParagraphElement, ActionTargetBarProps>(
  ({ parts, className, ...rest }, ref) => (
    <p {...rest} ref={ref} className={clsx(styles.bar, className)}>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <span className={styles.dot} aria-hidden>
              ·
            </span>
          )}
          {part.label !== undefined && <span>{part.label}</span>}
          <strong className={styles.accent}>{format(part.value)}</strong>
          <span>{part.unit ?? '건'}</span>
        </Fragment>
      ))}
    </p>
  ),
);
ActionTargetBar.displayName = 'ActionTargetBar';

export interface ActionStatItem {
  label: ReactNode;
  /** 가운뎃점으로 이어지는 값들 (예: 2건 · 1,030,250원) */
  values: ActionSummaryPart[];
}

export interface ActionStatsProps extends HTMLAttributes<HTMLDListElement> {
  items: ActionStatItem[];
}

/**
 * 처리 가능 / 불가처럼 나눠 보는 건수 · 금액 상자 (같은 폭 칸):
 * 이름 12 Regular 위 · 숫자 24 Bold + 단위 오른쪽 아래 (Figma 처리_실행 팝업 · 보류 해제)
 */
export const ActionStats = forwardRef<HTMLDListElement, ActionStatsProps>(
  ({ items, className, style, ...rest }, ref) => (
    <dl
      {...rest}
      ref={ref}
      className={clsx(styles.stats, className)}
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`, ...style }}
    >
      {items.map((item, index) => (
        <div key={index} className={styles.stat}>
          <dt className={styles.statLabel}>{item.label}</dt>
          <dd className={styles.statValue}>
            {item.values.map((v, i) => (
              <Fragment key={i}>
                {i > 0 && (
                  <span className={styles.dot} aria-hidden>
                    ·
                  </span>
                )}
                <strong className={styles.statNumber}>{format(v.value)}</strong>
                <span>{v.unit ?? '건'}</span>
              </Fragment>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  ),
);
ActionStats.displayName = 'ActionStats';
