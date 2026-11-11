import clsx from 'clsx';
import { forwardRef, type FormEvent, type HTMLAttributes, type ReactNode } from 'react';
import { useControllableState } from '../../hooks';
import { Button } from '../Button';
import { SearchField } from '../field';
import { AddressResultRow } from './AddressResultRow';
import styles from './AddressSearch.module.scss';

export interface AddressItem {
  /** 목록 key (없으면 우편번호 + 도로명) */
  id?: string;
  zipCode: string;
  roadAddress: string;
  jibunAddress?: string;
}

export interface AddressSearchExample {
  label: ReactNode;
  text: ReactNode;
}

const DEFAULT_EXAMPLES: AddressSearchExample[] = [
  { label: '도로명', text: '예) 한강대로 32, 종로구 새문안로 55' },
  { label: '지번', text: '예) 원효동 623, 신문로2가 2-1' },
  { label: '건물명', text: '예) 건영한가람아파트' },
];

export interface AddressSearchProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onSelect' | 'results'
> {
  /** 검색어 (controlled) */
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** [조회] · Enter. 실제 조회(API)는 화면에서 하고 결과를 results로 넘긴다 */
  onSearch?: (query: string) => void;
  /** 조회 결과. undefined = 조회 전(검색 예시), [] = 결과 없음 */
  results?: AddressItem[];
  /** 전체 건수 (페이지로 나눠 받을 때). 기본은 results 길이 */
  total?: number;
  onSelect?: (item: AddressItem) => void;
  /** 조회 중 ([조회] 로딩) */
  loading?: boolean;
  placeholder?: string;
  examples?: AddressSearchExample[];
  emptyTitle?: ReactNode;
  emptyDescription?: ReactNode;
}

/**
 * 주소 검색 (Modal Body에 넣는 Lookup 내용). 조회 전 → 검색 예시, 결과 → 목록, 결과 없음 → 안내.
 * 주소 API 호출은 하지 않는다 (순수 UI).
 */
export const AddressSearch = forwardRef<HTMLDivElement, AddressSearchProps>(
  (
    {
      query,
      defaultQuery = '',
      onQueryChange,
      onSearch,
      results,
      total,
      onSelect,
      loading = false,
      placeholder = '도로명, 지번, 건물명을 입력해주세요',
      examples = DEFAULT_EXAMPLES,
      emptyTitle = '검색 결과가 없습니다.',
      emptyDescription = '도로명, 지번 또는 건물명을 다시 확인해 주세요.',
      className,
      ...rest
    },
    ref,
  ) => {
    const [current, setCurrent] = useControllableState(query, defaultQuery, onQueryChange);

    const submit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!loading) onSearch?.(current.trim());
    };

    let body: ReactNode;
    if (results === undefined) {
      body = (
        <div className={styles.examples}>
          <p className={styles.heading}>검색 예시</p>
          <dl className={styles.exampleList}>
            {examples.map((example, index) => (
              <div key={index} className={styles.example}>
                <dt className={styles.exampleLabel}>{example.label}</dt>
                <dd className={styles.exampleText}>{example.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    } else if (results.length === 0) {
      body = (
        <div className={styles.empty} role="status">
          <p className={styles.emptyTitle}>{emptyTitle}</p>
          {emptyDescription && <p className={styles.emptyText}>{emptyDescription}</p>}
        </div>
      );
    } else {
      body = (
        <div>
          <p className={styles.heading} role="status">
            검색결과{' '}
            <em className={styles.count}>{(total ?? results.length).toLocaleString('ko-KR')}</em> 건
          </p>
          <ul className={styles.list}>
            {results.map((item) => (
              <li key={item.id ?? `${item.zipCode}-${item.roadAddress}`} className={styles.item}>
                <AddressResultRow
                  zipCode={item.zipCode}
                  roadAddress={item.roadAddress}
                  jibunAddress={item.jibunAddress}
                  onSelect={onSelect && (() => onSelect(item))}
                />
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div {...rest} ref={ref} className={clsx(styles.search, className)}>
        <form className={styles.bar} role="search" onSubmit={submit}>
          <SearchField
            fullWidth
            placeholder={placeholder}
            value={current}
            onChange={(event) => setCurrent(event.target.value)}
            onClear={() => setCurrent('')}
            aria-label="주소 검색어"
          />
          <Button type="submit" variant="neutral" loading={loading}>
            조회
          </Button>
        </form>
        {body}
      </div>
    );
  },
);
AddressSearch.displayName = 'AddressSearch';
