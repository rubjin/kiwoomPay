import clsx from 'clsx';
import type { CSSProperties, ReactNode } from 'react';
import { SectionHeading } from '../../components/SectionHeading';
import styles from './RecordDetail.module.scss';

export interface DetailTargetProps {
  /** 대상 이름 (12 Regular) */
  label?: ReactNode;
  /** 대상 값 (13 SemiBold Accent, 예: 거래번호) */
  value: ReactNode;
  /** 아래 구분선 (기본 true — 탭이 이어질 때). 바로 카드가 오면 false */
  divider?: boolean;
  className?: string;
}

/**
 * 상세 팝업 대상 줄 (P02 V01 조회 전용): Modal.Header 바로 아래, 아래 구분선.
 * Figma KWPC04010101 거래 상세정보 "선택한 거래 T…"
 */
export function DetailTarget({
  label = '선택한 거래',
  value,
  divider = true,
  className,
}: DetailTargetProps) {
  return (
    <div className={clsx(styles.target, !divider && styles.targetPlain, className)}>
      <span className={styles.targetLabel}>{label}</span>
      <span className={styles.targetValue}>{value}</span>
    </div>
  );
}

/** 상세 팝업 탭 줄 (DetailTarget 아래, 스크롤 밖). children = `<Tab variant="title" fullWidth>` */
export function DetailTabs({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx(styles.tabs, className)}>{children}</div>;
}

export interface DetailSectionProps {
  /** 영역 제목 (16 Bold) */
  title: ReactNode;
  /** 제목 옆 설명 (12 Regular) */
  description?: ReactNode;
  /** DetailCard 목록 (사이 12) */
  children: ReactNode;
  className?: string;
}

/** 상세 영역: SectionHeading md + 카드 묶음 */
export function DetailSection({ title, description, children, className }: DetailSectionProps) {
  return (
    <section className={clsx(styles.section, className)}>
      <SectionHeading size="md" as="h3" title={title} description={description} />
      {children}
    </section>
  );
}

export interface DetailCardItem {
  label: ReactNode;
  /** 값이 없으면 '-' */
  value?: ReactNode;
  /** error: 값을 빨간 글자로 (결제 오류 · 에러코드 · 에러내용) */
  tone?: 'error';
  /** 차지할 칸 수 (예: URL 한 줄 전체 = 2) */
  span?: number;
}

export interface DetailCardProps {
  /** 카드 제목 (14 Bold) */
  title: ReactNode;
  items?: DetailCardItem[];
  /** 열 수 (기본 2, 칸은 카드 폭을 똑같이 나눔) */
  columns?: number;
  /** 항목 이름 폭 (기본 73) */
  labelWidth?: number;
  /** 항목 이름 ↔ 값 (기본 0 — 이름 폭 안에서 띄움, 이름이 길면 20) */
  labelGap?: number;
  /**
   * 입력 폼 카드: 값 자리에 SelectBox · TextField 등 컨트롤 (열 사이 40 · 이름 ↔ 컨트롤 20, 말줄임 없음).
   * 한 줄 전체 컨트롤은 항목 span
   */
  form?: boolean;
  /** 상자 없이 제목 + 줄만 (팝업 본문의 입력 묶음 · 내역 묶음 — 제목 아래 · 줄 사이 12) */
  plain?: boolean;
  /** 격자 대신 자유 내용 (예: 접수 내역 표). items보다 우선 */
  children?: ReactNode;
  /** items가 비었을 때 가운데 안내 */
  emptyText?: ReactNode;
  className?: string;
}

/** 조회 전용 정보 카드: 제목 + 라벨-값 격자 (Neutral 50 · 반경 6, 12 SemiBold / 12 Regular, 줄 사이 16) */
export function DetailCard({
  title,
  items = [],
  columns = 2,
  labelWidth,
  labelGap,
  form = false,
  plain = false,
  children,
  emptyText = '표시할 내용이 없습니다.',
  className,
}: DetailCardProps) {
  const style = {
    '--detail-columns': columns,
    ...(labelWidth ? { '--detail-label-width': `${labelWidth}px` } : {}),
    ...(labelGap !== undefined ? { '--detail-label-gap': `${labelGap}px` } : {}),
  } as CSSProperties;
  return (
    <div className={clsx(styles.card, plain && styles.cardPlain, className)}>
      <h4 className={styles.cardTitle}>{title}</h4>
      {children !== undefined ? (
        children
      ) : items.length === 0 ? (
        <p className={styles.empty}>{emptyText}</p>
      ) : (
        <dl className={clsx(styles.items, form && styles.itemsForm)} style={style}>
          {items.map((item, index) => (
            <div
              key={index}
              className={styles.item}
              style={item.span ? { gridColumn: `span ${item.span}` } : undefined}
            >
              <dt className={styles.label}>{item.label}</dt>
              <dd className={clsx(styles.value, item.tone === 'error' && styles.valueError)}>
                {item.value ?? '-'}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

export interface DetailSummaryItem {
  label: ReactNode;
  value: ReactNode;
}

/**
 * 금액 요약 상자: 항목(이름 12 Regular · 값 16 Bold, 오른쪽 정렬) 사이 세로선.
 * Figma KWPC04010111 부분취소 요청 "누적 취소금액 | 잔여 취소가능금액"
 */
export function DetailSummary({
  items,
  className,
}: {
  items: DetailSummaryItem[];
  className?: string;
}) {
  return (
    <dl className={clsx(styles.summary, className)}>
      {items.map((item, index) => (
        <div key={index} className={styles.summaryItem}>
          <dt className={styles.summaryLabel}>{item.label}</dt>
          <dd className={styles.summaryValue}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
