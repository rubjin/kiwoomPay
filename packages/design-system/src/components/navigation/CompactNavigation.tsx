import clsx from 'clsx';
import { forwardRef, type HTMLAttributes } from 'react';
import { useControllableState } from '../../hooks';
import { Icon } from '../Icon';
import styles from './CompactNavigation.module.scss';

export interface CompactNavigationProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'onChange' | 'defaultValue'
> {
  /** 전체 개수 (1 이상) */
  total: number;
  /** 현재 위치 (1부터) */
  page?: number;
  defaultPage?: number;
  onChange?: (page: number) => void;
  /** 끝에서 처음으로(또는 반대로) 이어서 넘긴다 */
  loop?: boolean;
  disabled?: boolean;
  prevLabel?: string;
  nextLabel?: string;
}

/**
 * `< 1 / 3 >` 형태의 작은 이전 · 다음 이동. 카드 · Carousel처럼 좁은 영역에서 쓴다.
 * 번호 목록이 필요한 목록 화면에는 Pagination을 쓴다. 전체가 1페이지 이하면 그리지 않는다.
 */
export const CompactNavigation = forwardRef<HTMLElement, CompactNavigationProps>(
  (
    {
      total,
      page,
      defaultPage = 1,
      onChange,
      loop = false,
      disabled,
      prevLabel = '이전',
      nextLabel = '다음',
      className,
      'aria-label': ariaLabel = '페이지 이동',
      ...rest
    },
    ref,
  ) => {
    const [current, setCurrent] = useControllableState(page, defaultPage);
    const count = Math.max(1, total);
    const value = Math.min(Math.max(1, current), count);

    const canPrev = !disabled && (value > 1 || (loop && count > 1));
    const canNext = !disabled && (value < count || (loop && count > 1));

    // 한 페이지뿐이면 이동할 곳이 없으므로 그리지 않는다 (Figma: one page hides control)
    if (count <= 1) return null;

    const move = (next: number) => {
      const target = next < 1 ? count : next > count ? 1 : next;
      setCurrent(target);
      onChange?.(target);
    };

    return (
      <nav {...rest} ref={ref} aria-label={ariaLabel} className={clsx(styles.root, className)}>
        <button
          type="button"
          className={styles.button}
          disabled={!canPrev}
          aria-label={prevLabel}
          onClick={() => move(value - 1)}
        >
          <Icon name="chevron-left" size={16} />
        </button>
        <span className={styles.count} aria-live="polite">
          {/* Figma: 현재 번호 Bold · ' / 전체' Regular (공백 포함) */}
          <span className={styles.current}>{value}</span>{' '}
          <span className={styles.divider} aria-hidden="true">
            /
          </span>{' '}
          {count}
        </span>
        <button
          type="button"
          className={styles.button}
          disabled={!canNext}
          aria-label={nextLabel}
          onClick={() => move(value + 1)}
        >
          <Icon name="chevron-right" size={16} />
        </button>
      </nav>
    );
  },
);

CompactNavigation.displayName = 'CompactNavigation';
