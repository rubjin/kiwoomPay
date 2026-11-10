import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { useControllableState } from '../../hooks';
import { Icon } from '../Icon';
import { getPageItems } from './getPageItems';
import styles from './Pagination.module.scss';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** 전체 페이지 수. 페이지 단위·총 건수는 화면에서 계산해 넘긴다 */
  totalPages: number;
  /** 현재 페이지 (1부터, controlled) */
  page?: number;
  /** 처음 페이지 (uncontrolled, 기본 1) */
  defaultPage?: number;
  onChange?: (page: number) => void;
  /** 현재 페이지 양옆에 보여줄 번호 수 (기본 1) */
  siblingCount?: number;
  /** 처음·끝에 항상 보여줄 번호 수 (기본 1) */
  boundaryCount?: number;
  prevLabel?: ReactNode;
  nextLabel?: ReactNode;
  /** 전체 비활성 (조회 중 등) */
  disabled?: boolean;
}

const clamp = (value: number, total: number) => Math.min(Math.max(value, 1), Math.max(total, 1));

/**
 * 데이터 목록의 페이지 이동. 이전 → 번호 → 생략(…) → 다음 순으로 놓이고, 현재 페이지 1개만 Active로 표시한다.
 * 첫·마지막 페이지에서는 이동할 수 없는 방향이 비활성화된다.
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      totalPages,
      page,
      defaultPage = 1,
      onChange,
      siblingCount = 1,
      boundaryCount = 1,
      prevLabel = '이전',
      nextLabel = '다음',
      disabled = false,
      className,
      'aria-label': ariaLabel = '페이지 이동',
      ...rest
    },
    ref,
  ) => {
    const [current, setCurrent] = useControllableState(page, defaultPage);
    const currentPage = clamp(current, totalPages);

    if (totalPages <= 0) return null;

    const go = (next: number) => {
      const target = clamp(next, totalPages);
      if (target === currentPage) return;
      setCurrent(target);
      onChange?.(target);
    };

    const items = getPageItems(totalPages, currentPage, siblingCount, boundaryCount);

    return (
      <nav {...rest} ref={ref} aria-label={ariaLabel} className={clsx(styles.root, className)}>
        <ul className={styles.list}>
          <li>
            <button
              type="button"
              className={clsx(styles.item, styles.nav)}
              disabled={disabled || currentPage <= 1}
              onClick={() => go(currentPage - 1)}
            >
              <Icon name="chevron-left" size={20} className={styles.icon} />
              <span>{prevLabel}</span>
            </button>
          </li>

          {items.map((item) =>
            typeof item === 'number' ? (
              <li key={item}>
                <button
                  type="button"
                  className={clsx(styles.item, item === currentPage && styles.active)}
                  aria-current={item === currentPage ? 'page' : undefined}
                  disabled={disabled}
                  onClick={() => go(item)}
                >
                  {item}
                </button>
              </li>
            ) : (
              <li key={item} className={styles.ellipsis} aria-hidden="true">
                …
              </li>
            ),
          )}

          <li>
            <button
              type="button"
              className={clsx(styles.item, styles.nav)}
              disabled={disabled || currentPage >= totalPages}
              onClick={() => go(currentPage + 1)}
            >
              <span>{nextLabel}</span>
              <Icon name="chevron-right" size={20} className={styles.icon} />
            </button>
          </li>
        </ul>
      </nav>
    );
  },
);

Pagination.displayName = 'Pagination';
