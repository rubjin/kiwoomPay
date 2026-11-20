import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../Icon';
import styles from './Kpi.module.scss';

const format = (value: ReactNode) =>
  typeof value === 'number' ? value.toLocaleString('ko-KR') : value;

// ── Delta: 증감 ▲ +6.8% / ▼ -2.1% ─────────────────────────
export interface DeltaProps extends HTMLAttributes<HTMLSpanElement> {
  /** 증감 값. 양수 ▲ 초록 · 음수 ▼ 빨강 · 0은 회색 */
  value: number;
  /** 단위 (기본 %) */
  unit?: string;
}

/** 증감 표시 (12 SemiBold, Chart Positive · Negative) */
export const Delta = forwardRef<HTMLSpanElement, DeltaProps>(
  ({ value, unit = '%', className, ...rest }, ref) => {
    const tone = value > 0 ? 'up' : value < 0 ? 'down' : 'flat';
    const sign = value > 0 ? '▲+' : value < 0 ? '▼-' : '';
    return (
      <span {...rest} ref={ref} className={clsx(styles.delta, styles[tone], className)}>
        {sign}
        {Math.abs(value).toLocaleString('ko-KR')}
        {unit}
      </span>
    );
  },
);
Delta.displayName = 'Delta';

// ── MetricValue: 값 + 단위 ───────────────────────────────
export interface MetricValueProps extends HTMLAttributes<HTMLSpanElement> {
  /** 숫자는 천 단위 쉼표 */
  value: ReactNode;
  unit?: ReactNode;
  /** md: 값 20 Bold + 단위 13 (카드) / sm: 값 20 Bold + 단위 12 (칸) */
  size?: 'md' | 'sm';
}

/** 지표 값 + 단위 (예: 4,286,950,120 원) */
export const MetricValue = forwardRef<HTMLSpanElement, MetricValueProps>(
  ({ value, unit, size = 'md', className, ...rest }, ref) => (
    <span {...rest} ref={ref} className={clsx(styles.metric, styles[size], className)}>
      <span className={styles.metricValue}>{format(value)}</span>
      {unit && <span className={styles.metricUnit}>{unit}</span>}
    </span>
  ),
);
MetricValue.displayName = 'MetricValue';

// ── MetricSummary: 값 + 증감 + 기준일 (당월 거래금액) ───────
export interface MetricSummaryProps extends HTMLAttributes<HTMLDivElement> {
  value: ReactNode;
  unit?: ReactNode;
  /** 증감 (%) */
  delta?: number;
  /** 증감 뒤 설명 (예: 전월 대비) */
  deltaLabel?: ReactNode;
  /** 오른쪽 아래 기준 (예: 2026-07-17 기준) */
  reference?: ReactNode;
}

/** DashboardCard 본문: 값(위) · 증감 + 기준일(아래), 위아래 끝에 붙는다 */
export const MetricSummary = forwardRef<HTMLDivElement, MetricSummaryProps>(
  ({ value, unit, delta, deltaLabel, reference, className, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.summary, className)}>
      <MetricValue value={value} unit={unit} />
      <div className={styles.summaryFoot}>
        <span className={styles.summaryDelta}>
          {delta !== undefined && <Delta value={delta} />}
          {deltaLabel && <span className={styles.caption}>{deltaLabel}</span>}
        </span>
        {reference && <span className={styles.reference}>{reference}</span>}
      </div>
    </div>
  ),
);
MetricSummary.displayName = 'MetricSummary';

// ── KpiCard: 상단 KPI 카드 ───────────────────────────────
export interface KpiCardProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  /** 지표 이름 (예: 정산 대상) */
  label: ReactNode;
  value: ReactNode;
  /** 단위 (예: 건) — 값과 같은 글자 */
  unit?: ReactNode;
  /** 값 앞 작은 이름 (기본 "건수") */
  metricLabel?: ReactNode;
  /**
   * hero: 강조(Primary 50 배경 · 값 32) / default: 흰 카드(값 24) /
   * status: 한 줄 — 상태 이름 상자 + 값 20 (보류/상계 · 지급 실패, tone으로 색)
   */
  variant?: 'hero' | 'default' | 'status';
  /** status 색 */
  tone?: 'warning' | 'error';
  /** 있으면 카드 전체가 버튼 (오른쪽 > 아이콘) — 상세 화면 이동 */
  onClick?: () => void;
}

/** 대시보드 상단 KPI 카드 (Figma "KPI Layout / 1+3+2") */
export const KpiCard = forwardRef<HTMLElement, KpiCardProps>(
  (
    {
      label,
      value,
      unit,
      metricLabel = '건수',
      variant = 'default',
      tone = 'warning',
      onClick,
      className,
      ...rest
    },
    ref,
  ) => {
    const Tag = onClick ? 'button' : 'div';
    const chevron = onClick && <Icon name="chevron-right" size={20} className={styles.chevron} />;
    const metric = (
      <span className={styles.kpiMetric}>
        <span className={styles.caption}>{metricLabel}</span>
        <span className={styles.kpiValue}>
          {format(value)}
          {unit}
        </span>
      </span>
    );
    return (
      <Tag
        {...rest}
        ref={ref as never}
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        className={clsx(
          styles.kpi,
          styles[variant],
          variant === 'status' && styles[tone],
          onClick && styles.clickable,
          className,
        )}
      >
        {variant === 'status' ? (
          <>
            <span className={styles.kpiStatus}>{label}</span>
            {metric}
            {chevron}
          </>
        ) : (
          <>
            <span className={styles.kpiHeader}>
              <span className={styles.kpiLabel}>{label}</span>
              {chevron}
            </span>
            {metric}
          </>
        )}
      </Tag>
    );
  },
);
KpiCard.displayName = 'KpiCard';

// ── KpiTile: 카드 안 회색 칸 (영업 실적 요약) ─────────────────
export interface KpiTileProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  /** 증감 (%) — 오른쪽 아래 */
  delta?: number;
  /** 있으면 칸 전체가 버튼 (이름 옆 >) */
  onClick?: () => void;
}

/** 회색 칸: 이름(12) + > · 값(20 Bold) + 단위 · 증감 */
export const KpiTile = forwardRef<HTMLElement, KpiTileProps>(
  ({ label, value, unit, delta, onClick, className, ...rest }, ref) => {
    const Tag = onClick ? 'button' : 'div';
    return (
      <Tag
        {...rest}
        ref={ref as never}
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        className={clsx(styles.tile, onClick && styles.clickable, className)}
      >
        <span className={styles.tileHeader}>
          <span className={styles.tileLabel}>{label}</span>
          {onClick && <Icon name="chevron-right" size={16} className={styles.tileChevron} />}
        </span>
        <span className={styles.tileFoot}>
          <MetricValue value={value} unit={unit} size="sm" />
          {delta !== undefined && <Delta value={delta} />}
        </span>
      </Tag>
    );
  },
);
KpiTile.displayName = 'KpiTile';
