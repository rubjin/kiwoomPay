import clsx from 'clsx';
import { forwardRef, useId, type FormHTMLAttributes, type ReactNode } from 'react';
import { useControllableState } from '../../hooks';
import { Button } from '../Button';
import styles from './SearchArea.module.scss';

export interface SearchAreaLabels {
  reset?: string;
  search?: string;
  expand?: string;
  collapse?: string;
}

const defaultLabels: Required<SearchAreaLabels> = {
  reset: '초기화',
  search: '조회',
  expand: '상세조건',
  collapse: '상세조건 닫기',
};

export interface SearchAreaProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onReset'> {
  /** 기본 조건: 항상 보이는 핵심 검색 필드 (Field 라벨 왼쪽 배치) */
  children: ReactNode;
  /** 상세 조건: 펼쳤을 때 추가되는 필드. 없으면 [상세조건] 버튼도 없다 */
  detail?: ReactNode;
  /** 상세 조건 줄 끝의 버튼 (예: 조건 저장 · 내 검색조건) */
  detailActions?: ReactNode;
  /** 상세 조건 펼침 (controlled) */
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** [조회] 또는 필드에서 Enter */
  onSearch?: () => void;
  /** [초기화] */
  onReset?: () => void;
  /** 조회 중: [조회] 버튼 로딩 */
  loading?: boolean;
  /** 버튼 문구 변경 */
  labels?: SearchAreaLabels;
}

/**
 * 화면 본문 검색 영역. 기본 조건 + 상세 조건 구조와 초기화 · 조회 · 상세조건 버튼 배치만 담당한다.
 * 어떤 필드를 둘지, 기본값 · 필수 여부는 각 화면설계서에서 정한다.
 */
export const SearchArea = forwardRef<HTMLFormElement, SearchAreaProps>(
  (
    {
      children,
      detail,
      detailActions,
      expanded,
      defaultExpanded = false,
      onExpandedChange,
      onSearch,
      onReset,
      loading = false,
      labels,
      className,
      onSubmit,
      ...rest
    },
    ref,
  ) => {
    const detailId = useId();
    const text = { ...defaultLabels, ...labels };
    const [open, setOpen] = useControllableState(expanded, defaultExpanded, onExpandedChange);
    const hasDetail = detail !== undefined && detail !== null;

    const handleSubmit: FormHTMLAttributes<HTMLFormElement>['onSubmit'] = (event) => {
      event.preventDefault();
      onSubmit?.(event);
      if (!loading) onSearch?.();
    };

    return (
      <form
        {...rest}
        ref={ref}
        role="search"
        noValidate
        className={clsx(styles.searchArea, className)}
        onSubmit={handleSubmit}
      >
        <div className={styles.row}>
          {children}
          <div className={styles.actions}>
            <Button size="sm" variant="neutral" appearance="line" onClick={onReset}>
              {text.reset}
            </Button>
            <Button size="sm" type="submit" loading={loading}>
              {text.search}
            </Button>
            {hasDetail && (
              <Button
                size="sm"
                appearance="line"
                aria-expanded={open}
                aria-controls={detailId}
                onClick={() => setOpen(!open)}
              >
                {open ? text.collapse : text.expand}
              </Button>
            )}
          </div>
        </div>
        {hasDetail && open && (
          <div id={detailId} className={clsx(styles.row, styles.detail)}>
            {detail}
            {detailActions && <div className={styles.actions}>{detailActions}</div>}
          </div>
        )}
      </form>
    );
  },
);

SearchArea.displayName = 'SearchArea';
