import clsx from 'clsx';
import { forwardRef, useId, type FormEvent, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { SectionHeading } from '../../components/SectionHeading';
import { useControllableState } from '../../hooks';
import styles from './SearchResult.module.scss';

export interface SearchPanelProps extends Omit<
  HTMLAttributes<HTMLFormElement>,
  'title' | 'onSubmit' | 'onReset'
> {
  /** 제목 (기본 '검색 조건') */
  title?: ReactNode;
  /** [조회] · Enter */
  onSearch?: () => void;
  /** 새로고침 아이콘 버튼 (초기화). 없으면 버튼을 그리지 않는다 */
  onReset?: () => void;
  /** 조회 중: [조회] 로딩 · 중복 실행 차단 */
  loading?: boolean;
  /** 상세 검색 조건. 없으면 '상세 검색' 줄을 그리지 않는다 */
  detail?: ReactNode;
  /** 상세 검색 펼침 (controlled) */
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** 검색 조건 접기 (controlled) — 제목 옆 화살표 */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  labels?: { search?: string; reset?: string; detail?: string; collapse?: string; expand?: string };
  /** 기본 검색 조건 (한 줄, 넘치면 줄바꿈) */
  children: ReactNode;
}

/**
 * P01 검색 조건 카드 (KWP GUI 기준).
 * 제목 줄 오른쪽에 [초기화 ↻] · [조회], 구분선 아래 기본 조건, 아래 붙은 카드에 [상세 검색 ⌄].
 * 필드는 Field(라벨 왼쪽) + 각 입력 컴포넌트를 children으로 넣는다. 줄을 나누려면 SearchPanel.Row, 같은 폭 N칸이면 SearchPanel.Grid.
 */
const SearchPanelRoot = forwardRef<HTMLFormElement, SearchPanelProps>(
  (
    {
      title = '검색 조건',
      onSearch,
      onReset,
      loading = false,
      detail,
      expanded,
      defaultExpanded = false,
      onExpandedChange,
      collapsed,
      defaultCollapsed = false,
      onCollapsedChange,
      labels,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const detailId = useId();
    const bodyId = useId();
    const [isExpanded, setExpanded] = useControllableState(
      expanded,
      defaultExpanded,
      onExpandedChange,
    );
    const [isCollapsed, setCollapsed] = useControllableState(
      collapsed,
      defaultCollapsed,
      onCollapsedChange,
    );
    const text = {
      search: '조회',
      reset: '초기화',
      detail: '상세 검색',
      collapse: '검색 조건 접기',
      expand: '검색 조건 펼치기',
      ...labels,
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!loading) onSearch?.();
    };

    const hasDetail = detail !== undefined && !isCollapsed;

    return (
      <form
        {...rest}
        ref={ref}
        role="search"
        noValidate
        className={clsx(styles.searchPanel, className)}
        onSubmit={handleSubmit}
      >
        <div className={clsx(styles.card, hasDetail && styles.cardTop)}>
          <SectionHeading
            className={styles.searchHeader}
            title={title}
            addon={
              <button
                type="button"
                className={styles.iconToggle}
                aria-expanded={!isCollapsed}
                aria-controls={bodyId}
                aria-label={isCollapsed ? text.expand : text.collapse}
                onClick={() => setCollapsed(!isCollapsed)}
              >
                <Icon name={isCollapsed ? 'chevron-down' : 'chevron-up'} size={24} />
              </button>
            }
            actions={
              <>
                {onReset && (
                  <Button
                    variant="neutral"
                    appearance="line"
                    iconOnly
                    icon={<Icon name="refresh" size={20} />}
                    aria-label={text.reset}
                    disabled={loading}
                    onClick={onReset}
                  />
                )}
                <Button type="submit" variant="neutral" loading={loading}>
                  {text.search}
                </Button>
              </>
            }
          />
          {!isCollapsed && (
            <div id={bodyId} className={styles.searchBody}>
              <div className={styles.fieldRow}>{children}</div>
            </div>
          )}
        </div>
        {hasDetail && (
          <div className={clsx(styles.card, styles.cardBottom, isExpanded && styles.detailOpen)}>
            <button
              type="button"
              className={styles.detailToggle}
              aria-expanded={isExpanded}
              aria-controls={detailId}
              onClick={() => setExpanded(!isExpanded)}
            >
              <Icon name="setting-sliders" size={20} />
              <span>{text.detail}</span>
              <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} />
            </button>
            {isExpanded && (
              <div id={detailId} className={styles.fieldRow}>
                {detail}
              </div>
            )}
          </div>
        )}
      </form>
    );
  },
);
SearchPanelRoot.displayName = 'SearchPanel';

/** 필드를 줄 단위로 나눌 때 (한 줄 = 전체 폭, 줄 사이 16) */
const SearchPanelRow = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.fieldLine, className)} />
  ),
);
SearchPanelRow.displayName = 'SearchPanel.Row';

export interface SearchPanelGridProps extends HTMLAttributes<HTMLDivElement> {
  /** 칸 수 (기본 5). 모든 칸이 같은 폭 · 간격 16 — 줄이 바뀌어도 칸이 위아래로 맞는다 */
  columns?: number;
}

/** 필드를 N칸 격자로 (예: 상세 검색 5칸). 칸 안의 컨트롤은 fullWidth로 채운다 */
const SearchPanelGrid = forwardRef<HTMLDivElement, SearchPanelGridProps>(
  ({ columns = 5, className, style, ...rest }, ref) => (
    <div
      {...rest}
      ref={ref}
      className={clsx(styles.fieldGrid, className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, ...style }}
    />
  ),
);
SearchPanelGrid.displayName = 'SearchPanel.Grid';

export const SearchPanel = Object.assign(SearchPanelRoot, {
  Row: SearchPanelRow,
  Grid: SearchPanelGrid,
});
