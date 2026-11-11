import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styles from './Badge.module.scss';

export type BadgeTone = 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'error';
export type BadgeAppearance = 'soft' | 'line';
export type BadgeSize = 'md' | 'sm';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** 의미: Status 색 체계를 그대로 쓴다. 분류·속성은 neutral / primary */
  tone?: BadgeTone;
  /** soft(기본): 기본 상태 표현 / line: 속성·분류 보조 */
  appearance?: BadgeAppearance;
  /** md 24 (기본) · sm 20 */
  size?: BadgeSize;
  /** 상태 점(Status Dot). 기본 숨김. 여러 상태를 비교하는 목록·모니터링에서만 켠다 */
  dot?: boolean;
  children: ReactNode;
}

/** 상태 · 속성 · 분류를 짧은 글자로 표시한다. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      tone = 'neutral',
      appearance = 'soft',
      size = 'md',
      dot = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => (
    <span
      {...rest}
      ref={ref}
      className={clsx(styles.badge, styles[tone], styles[appearance], styles[size], className)}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      <span className={styles.label}>{children}</span>
    </span>
  ),
);

Badge.displayName = 'Badge';

export type CountBadgeTone = 'primary' | 'error';
export type NumberBadgeAppearance = 'solid' | 'soft';

export interface NumberBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** 건수 */
  count: number;
  /** 이 값을 넘으면 `max+`로 표시 (기본 99 → 99+) */
  max?: number;
  /** primary(기본): 일반 알림 / error: 긴급·위험 건수 */
  tone?: CountBadgeTone;
  /** solid(기본): 알림 건수 / soft: Tab 안 건수처럼 연한 배경 */
  appearance?: NumberBadgeAppearance;
  /** 0일 때도 보여준다 (기본은 숨김) */
  showZero?: boolean;
}

/** 알림 · 미처리 건수. */
export const NumberBadge = forwardRef<HTMLSpanElement, NumberBadgeProps>(
  (
    {
      count,
      max = 99,
      tone = 'primary',
      appearance = 'solid',
      showZero = false,
      className,
      ...rest
    },
    ref,
  ) => {
    if (count <= 0 && !showZero) return null;
    const text = count > max ? `${max}+` : String(Math.max(count, 0));
    return (
      <span
        {...rest}
        ref={ref}
        className={clsx(
          styles.number,
          appearance === 'soft'
            ? tone === 'error'
              ? styles.softError
              : styles.softPrimary
            : tone === 'error'
              ? styles.countError
              : styles.countPrimary,
          className,
        )}
      >
        {text}
      </span>
    );
  },
);

NumberBadge.displayName = 'NumberBadge';

export interface DotBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** primary(기본) · error */
  tone?: CountBadgeTone;
}

/**
 * 신규 기능 · 메뉴 업데이트 표시(New Indicator). 상태 Badge 안의 Status Dot과는 다르다.
 * 점만 있으므로 의미가 필요하면 `aria-label`(예: "새 기능")을 준다.
 */
export const DotBadge = forwardRef<HTMLSpanElement, DotBadgeProps>(
  ({ tone = 'primary', className, 'aria-label': ariaLabel, ...rest }, ref) => (
    <span
      {...rest}
      ref={ref}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={clsx(
        styles.dotBadge,
        tone === 'error' ? styles.countError : styles.countPrimary,
        className,
      )}
    />
  ),
);

DotBadge.displayName = 'DotBadge';

export interface UnreadIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  /** 표시 글자 (기본 N) */
  children?: ReactNode;
}

/**
 * 읽지 않은 알림 · 게시물 · 메시지 옆에 붙는 "N" 표시. 신규 기능 · 메뉴 표시는 DotBadge를 쓴다.
 * 기본 `aria-label`은 "읽지 않음"이다.
 */
export const UnreadIndicator = forwardRef<HTMLSpanElement, UnreadIndicatorProps>(
  ({ children = 'N', className, 'aria-label': ariaLabel = '읽지 않음', ...rest }, ref) => (
    <span
      {...rest}
      ref={ref}
      role="img"
      aria-label={ariaLabel}
      className={clsx(styles.unread, className)}
    >
      {children}
    </span>
  ),
);

UnreadIndicator.displayName = 'UnreadIndicator';
