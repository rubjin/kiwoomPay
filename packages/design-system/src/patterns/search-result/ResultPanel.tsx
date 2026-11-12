import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { StatusView, type StatusViewProps, type StatusViewStatus } from '../common/StatusView';
import styles from './SearchResult.module.scss';

export type SearchStatus = StatusViewStatus | 'success';

export interface ResultPanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** 제목 (기본 '조회 결과') */
  title?: ReactNode;
  /** 제목 옆 Grid 공통 Action (표시항목설정 · 엑셀 다운로드) */
  titleActions?: ReactNode;
  /** 오른쪽 업무 Action (선택 대상 처리 · 등록) */
  actions?: ReactNode;
  /** success가 아니면 Grid 아래에 StatusView를 보여준다 (조회 전 · 0건 · 오류 …) */
  status?: SearchStatus;
  /** StatusView 문구 바꾸기 */
  statusProps?: Omit<StatusViewProps, 'status'>;
  /** Grid (IBSheet8) */
  children?: ReactNode;
}

/**
 * P01 조회 결과 카드: 제목 줄(64) + Grid + 상태 표시.
 * Grid 머리는 상태와 관계없이 보이고, 행이 없을 때 그 아래에 StatusView를 둔다 (Figma Grid State / Empty).
 */
export const ResultPanel = forwardRef<HTMLElement, ResultPanelProps>(
  (
    {
      title = '조회 결과',
      titleActions,
      actions,
      status = 'success',
      statusProps,
      className,
      children,
      ...rest
    },
    ref,
  ) => (
    <section {...rest} ref={ref} className={clsx(styles.resultPanel, className)}>
      <div className={styles.resultHeader}>
        <div className={styles.resultHeading}>
          <h2 className={styles.resultTitle}>{title}</h2>
          {titleActions && <div className={styles.actions}>{titleActions}</div>}
        </div>
        {actions && <div className={clsx(styles.actions, styles.resultActions)}>{actions}</div>}
      </div>
      <div className={styles.resultBody}>
        {children}
        {status !== 'success' && <StatusView {...statusProps} status={status} />}
      </div>
    </section>
  ),
);
ResultPanel.displayName = 'ResultPanel';
