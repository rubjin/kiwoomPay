import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Icon, type IconName } from '../../components/Icon';
import styles from './StatusView.module.scss';

/** idle: 조회 전 · loading: 조회 중 · empty: 0건 · error: 오류 · forbidden: 권한 없음 */
export type StatusViewStatus = 'idle' | 'loading' | 'empty' | 'error' | 'forbidden';

const DEFAULTS: Record<StatusViewStatus, { icon: IconName; title: string; description: string }> = {
  // Figma 상태별 GUI 02 Initial · KWPC04010100 최초진입: "거래내역을 조회해주세요" — 제목은 화면이 바꾼다 (title prop)
  idle: {
    icon: 'search',
    title: '내역을 조회해주세요',
    description: '검색조건을 설정한 후 [조회] 버튼을 눌러주세요',
  },
  // Figma 상태별 GUI 03 Loading (시안 문구 "조회 중 입니다" → 맞춤법대로 붙여 씀)
  loading: { icon: 'loading', title: '조회 중입니다', description: '잠시만 기다려주세요' },
  // Figma 상태별 GUI 01 Empty
  empty: {
    icon: 'empty',
    title: '조회 결과가 없습니다',
    description: '검색조건을 변경하여 다시 조회해주세요',
  },
  // Figma 상태별 GUI 04 Error (Alert-circle_filled 빨강)
  error: {
    icon: 'alert-circle-filled',
    title: '조회 중 오류가 발생했습니다',
    description: '재조회하여 다시 시도해주세요',
  },
  // TODO(시안) 권한 없음 문구
  forbidden: {
    icon: 'lock',
    title: '조회 권한이 없습니다',
    description: '권한이 필요하면 관리자에게 문의해주세요',
  },
};

export interface StatusViewProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  status: StatusViewStatus;
  /** 기본 문구 대신 쓸 제목 */
  title?: ReactNode;
  /** 기본 문구 대신 쓸 설명. null이면 숨김 */
  description?: ReactNode | null;
  /** 아래 Action (예: [다시 시도]) */
  action?: ReactNode;
}

/**
 * 결과 영역의 공통 상태 표시 (조회 전 · 조회 중 · 0건 · 오류 · 권한 없음).
 * 문구 · 아이콘 · 높이를 한 곳에서 정하고, 화면은 status만 넘긴다.
 */
export const StatusView = forwardRef<HTMLDivElement, StatusViewProps>(
  ({ status, title, description, action, className, ...rest }, ref) => {
    const preset = DEFAULTS[status];
    const desc = description === undefined ? preset.description : description;
    return (
      <div
        {...rest}
        ref={ref}
        role={status === 'error' ? 'alert' : 'status'}
        className={clsx(styles.statusView, className)}
      >
        <span className={styles.icon}>
          <Icon name={preset.icon} size={24} />
        </span>
        <p className={styles.title}>{title ?? preset.title}</p>
        {desc !== null && <p className={styles.description}>{desc}</p>}
        {action && <div className={styles.action}>{action}</div>}
      </div>
    );
  },
);
StatusView.displayName = 'StatusView';
