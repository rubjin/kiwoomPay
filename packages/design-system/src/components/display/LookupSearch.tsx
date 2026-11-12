import clsx from 'clsx';
import { forwardRef, type FormEvent, type HTMLAttributes, type ReactNode } from 'react';
import { useControllableState } from '../../hooks';
import { Button } from '../Button';
import { Field, SearchField } from '../field';
import styles from './LookupSearch.module.scss';

export interface LookupSearchProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  /** 검색 필드 라벨 (예: 업체명). 없으면 라벨 없이 검색창만 */
  label?: ReactNode;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** [조회] · Enter. 조회(API)는 화면에서 하고 결과는 children(IBSheet 그리드)으로 넘긴다 */
  onSearch?: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
  searchLabel?: ReactNode;
  /** 검색어 앞에 둘 추가 조건 (예: 코드 입력 TextField를 Field로 감싸서) */
  extraFields?: ReactNode;
  /** 검색 줄 위 (예: 찾기 방식 Button Tab) */
  header?: ReactNode;
  /** 결과 없음: children 대신 안내를 보여준다 */
  empty?: boolean;
  emptyTitle?: ReactNode;
  emptyDescription?: ReactNode;
  /** 결과 영역 (IBSheet 그리드). 조회 전이면 비워 둔다 */
  children?: ReactNode;
}

/**
 * 조회형 Lookup Modal의 본문 (Modal.Body에 넣는다). 검색 줄 + 결과 그리드(IBSheet) · 결과 없음.
 *   <Modal size="lg"><Modal.Header title="사업자번호 검색" closeButton />
 *     <Modal.Body><LookupSearch label="업체명" onSearch={…}>{grid}</LookupSearch></Modal.Body></Modal>
 */
export const LookupSearch = forwardRef<HTMLDivElement, LookupSearchProps>(
  (
    {
      label,
      query,
      defaultQuery = '',
      onQueryChange,
      onSearch,
      loading = false,
      placeholder = '검색어를 입력해주세요',
      searchLabel = '조회',
      extraFields,
      header,
      empty = false,
      emptyTitle = '검색 결과가 없습니다.',
      emptyDescription = '검색어를 다시 확인해 주세요.',
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const [current, setCurrent] = useControllableState(query, defaultQuery, onQueryChange);

    const submit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!loading) onSearch?.(current.trim());
    };

    const searchField = (
      <SearchField
        fullWidth
        placeholder={placeholder}
        value={current}
        onChange={(event) => setCurrent(event.target.value)}
        onClear={() => setCurrent('')}
        aria-label={typeof label === 'string' ? undefined : '검색어'}
      />
    );

    return (
      <div {...rest} ref={ref} className={clsx(styles.lookup, className)}>
        {header}
        <form className={styles.bar} role="search" onSubmit={submit}>
          {extraFields}
          {label !== undefined ? (
            <Field label={label} className={styles.field}>
              {searchField}
            </Field>
          ) : (
            <div className={styles.field}>{searchField}</div>
          )}
          <Button type="submit" variant="neutral" loading={loading}>
            {searchLabel}
          </Button>
        </form>
        {empty ? (
          <div className={styles.empty} role="status">
            <p className={styles.emptyTitle}>{emptyTitle}</p>
            {emptyDescription && <p className={styles.emptyText}>{emptyDescription}</p>}
          </div>
        ) : (
          children
        )}
      </div>
    );
  },
);
LookupSearch.displayName = 'LookupSearch';
