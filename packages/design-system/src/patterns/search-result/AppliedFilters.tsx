import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { SectionHeading } from '../../components/SectionHeading';
import styles from './SearchResult.module.scss';

export interface AppliedFilter {
  /** 조건 이름 (예: 지급예정일) */
  label?: ReactNode;
  /** 적용된 값 (예: 2026-08-25 ~ 2026-09-01) */
  value: ReactNode;
}

export interface AppliedFiltersProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** 제목 (기본 '적용된 검색 조건') */
  title?: ReactNode;
  /** 조회에 사용한 조건. 비어 있으면 emptyText */
  items: AppliedFilter[];
  /** 조회 전 문구 */
  emptyText?: ReactNode;
}

/**
 * P01 V04 적용된 검색 조건: 마지막으로 조회한 조건을 칩으로 보여준다.
 * 입력 중인 조건이 아니라 **조회에 사용된 조건**(useSearchResult의 appliedParams)을 넣는다.
 */
export const AppliedFilters = forwardRef<HTMLElement, AppliedFiltersProps>(
  (
    {
      title = '적용된 검색 조건',
      items,
      emptyText = '조회 실행 후 적용된 조건이 표시됩니다.',
      className,
      ...rest
    },
    ref,
  ) => (
    <section
      {...rest}
      ref={ref}
      className={clsx(styles.inlineCard, items.length === 0 && styles.inlineCardEmpty, className)}
    >
      <SectionHeading className={styles.subTitle} size="md" subtle title={title} />
      {items.length === 0 ? (
        <p className={styles.placeholder}>{emptyText}</p>
      ) : (
        <ul className={styles.chips}>
          {items.map((item, index) => (
            <li key={index} className={styles.chip}>
              {item.label !== undefined && <>{item.label} </>}
              {item.value}
            </li>
          ))}
        </ul>
      )}
    </section>
  ),
);
AppliedFilters.displayName = 'AppliedFilters';
