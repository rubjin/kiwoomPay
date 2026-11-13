import clsx from 'clsx';
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { TextButton } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { InfoTip } from '../../components/Tooltip';
import styles from './Feed.module.scss';

export interface HubGridProps extends HTMLAttributes<HTMLDivElement> {
  /** 카드 폭 비율 (예: [470, 532, 598] — Figma 1632 안 배분). 기본 같은 폭 */
  columns?: number[];
}

/** 요약 카드 줄 (마이페이지 Hub). 카드 사이 16, 높이는 가장 긴 카드에 맞춤 */
export const HubGrid = forwardRef<HTMLDivElement, HubGridProps>(
  ({ columns, className, style, ...rest }, ref) => (
    <div
      {...rest}
      ref={ref}
      className={clsx(styles.grid, className)}
      style={{
        gridTemplateColumns: columns
          ? columns.map((c) => `minmax(0, ${c}fr)`).join(' ')
          : `repeat(auto-fit, minmax(0, 1fr))`,
        ...style,
      }}
    />
  ),
);
HubGrid.displayName = 'HubGrid';

export interface HubCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  /** [상세보기 >] → 해당 메뉴로 이동 */
  onMore?: () => void;
  moreLabel?: ReactNode;
}

/** 요약 카드: 제목(20 Bold) + [상세보기 >] → 구분선 → 내용 (사이 16) */
export const HubCard = forwardRef<HTMLElement, HubCardProps>(
  ({ title, onMore, moreLabel = '상세보기', className, children, ...rest }, ref) => (
    <section {...rest} ref={ref} className={clsx(styles.card, className)}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{title}</h2>
        {onMore && (
          <TextButton variant="neutral" className={styles.more} onClick={onMore}>
            {moreLabel}
            <Icon name="chevron-right" size={20} />
          </TextButton>
        )}
      </div>
      <hr className={styles.divider} />
      {children}
    </section>
  ),
);
HubCard.displayName = 'HubCard';

/** 카드 안 구분선 (내용 묶음 사이) */
export function HubDivider() {
  return <hr className={styles.divider} />;
}

export interface HubInfoListProps extends HTMLAttributes<HTMLDivElement> {
  /** 줄 사이 간격 (기본 20 — 계정관리) */
  gap?: CSSProperties['gap'];
}

/** 라벨 · 값 줄 묶음 */
export const HubInfoList = forwardRef<HTMLDivElement, HubInfoListProps>(
  ({ gap = 20, className, style, ...rest }, ref) => (
    <div
      {...rest}
      ref={ref}
      className={clsx(styles.infoList, className)}
      style={{ gap, ...style }}
    />
  ),
);
HubInfoList.displayName = 'HubInfoList';

export interface HubInfoProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  /** 라벨 옆 도움말 (InfoTip) */
  hint?: ReactNode;
  /** 라벨 칸 폭 (기본 138, 도움말이 있는 권한관리는 152) */
  labelWidth?: CSSProperties['width'];
  children: ReactNode;
}

function HubInfoSub({ children }: { children: ReactNode }) {
  return <span className={styles.infoSub}>{children}</span>;
}

/** 라벨(13 Regular) · 값(14 Medium) 한 줄. 값에 Badge · 보조 글자(HubInfo.Sub)를 넣을 수 있다 */
const HubInfoRoot = forwardRef<HTMLDivElement, HubInfoProps>(
  ({ label, hint, labelWidth, className, children, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.info, className)}>
      <span className={styles.infoLabel} style={labelWidth ? { width: labelWidth } : undefined}>
        {label}
        {hint && <InfoTip content={hint} />}
      </span>
      <span className={styles.infoValue}>{children}</span>
    </div>
  ),
);
HubInfoRoot.displayName = 'HubInfo';

export const HubInfo = Object.assign(HubInfoRoot, {
  /** 값 옆 보조 글자 (14 Regular, 예: (47일 경과)) */
  Sub: HubInfoSub,
});

export interface HubSubtitleProps extends HTMLAttributes<HTMLHeadingElement> {
  hint?: ReactNode;
}

/** 카드 안 작은 제목 (13 SemiBold, 예: 특수권한) */
export function HubSubtitle({ hint, className, children, ...rest }: HubSubtitleProps) {
  return (
    <h3 {...rest} className={clsx(styles.subtitle, className)}>
      {children}
      {hint && <InfoTip content={hint} />}
    </h3>
  );
}

export interface HubPanelItem {
  label: ReactNode;
  value?: ReactNode;
}

/** 회색 상자 목록 (Neutral 50 · 반경 6 · 여백 12): 이름(13 Medium) · 오른쪽 보조(12 Regular) */
export function HubPanel({ items, className }: { items: HubPanelItem[]; className?: string }) {
  return (
    <div className={clsx(styles.panel, className)}>
      {items.map((item, index) => (
        <div key={index} className={styles.panelRow}>
          <span className={styles.panelLabel}>{item.label}</span>
          {item.value !== undefined && <span className={styles.panelValue}>{item.value}</span>}
        </div>
      ))}
    </div>
  );
}

export interface HubEmptyProps {
  /** 빈 상태 문구 (12 Regular) */
  message: ReactNode;
  /** 문구 아래 Action (예: [특수권한 신청] Button sm Neutral Line) */
  action?: ReactNode;
  className?: string;
}

/** 카드 안 빈 상태 상자 (회색 상자, 가운데 문구 + Action, 사이 2). 예: 현재 보유 중인 특수권한이 없습니다. */
export function HubEmpty({ message, action, className }: HubEmptyProps) {
  return (
    <div className={clsx(styles.empty, className)}>
      <p className={styles.emptyMessage}>{message}</p>
      {action}
    </div>
  );
}

export interface HubLinkRowProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  label: ReactNode;
  value: ReactNode;
}

/** 이동 줄 (회색 상자, 예: 권한 신청 현황 1건 >) */
export const HubLinkRow = forwardRef<HTMLButtonElement, HubLinkRowProps>(
  ({ label, value, className, type = 'button', ...rest }, ref) => (
    <button {...rest} ref={ref} type={type} className={clsx(styles.linkRow, className)}>
      <span className={styles.linkLabel}>{label}</span>
      <span className={styles.linkValue}>
        {value}
        <span className={styles.linkIcon}>
          <Icon name="chevron-right" size={20} />
        </span>
      </span>
    </button>
  ),
);
HubLinkRow.displayName = 'HubLinkRow';
