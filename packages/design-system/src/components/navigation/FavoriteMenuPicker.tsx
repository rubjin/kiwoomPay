import clsx from 'clsx';
import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { useControllableState } from '../../hooks';
import { SearchField } from '../field';
import { ClearIcon } from '../field/icons';
import { Icon } from '../Icon';
import { Checkbox } from '../selection';
import { findPath, searchMenu, splitByQuery, type LnbMenuItem } from './lnbUtils';
import styles from './FavoriteMenuPicker.module.scss';

export interface FavoriteMenuPickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /** LNB와 같은 메뉴 트리 (1Depth → 2Depth → 3Depth). 하위가 없는 메뉴만 고를 수 있다 */
  items: LnbMenuItem[];
  /** 선택한 메뉴 id (controlled, 선택한 순서) */
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** 최대 선택 수 (기본 10). 다 차면 나머지는 고를 수 없다 */
  max?: number;
  searchPlaceholder?: string;
  /** 처음 검색어 */
  defaultQuery?: string;
  /** 처음 펼칠 메뉴 id (1 · 2Depth) */
  defaultOpenIds?: string[];
  /** 즐겨찾기 메뉴 상자 제목 (기본 '즐겨찾기 메뉴') */
  selectedLabel?: ReactNode;
  emptySearchText?: ReactNode;
}

/**
 * 즐겨찾기 편집 Modal 본문 (P07 Selection & Configuration V01).
 * 메뉴 검색 → 즐겨찾기 메뉴(N / 10, 칩 x로 빼기) → 메뉴 트리(1Depth 44 · 2Depth 40 · 3Depth 체크박스 40).
 * 검색 중에는 트리 대신 일치하는 메뉴 목록(이름 강조 + 경로). Figma KWPC1301 즐겨찾기 편집 팝업.
 */
export const FavoriteMenuPicker = forwardRef<HTMLDivElement, FavoriteMenuPickerProps>(
  (
    {
      items,
      value,
      defaultValue = [],
      onChange,
      max = 10,
      searchPlaceholder = '즐겨찾기에 추가할 메뉴를 검색해보세요',
      defaultQuery = '',
      defaultOpenIds = [],
      selectedLabel = '즐겨찾기 메뉴',
      emptySearchText = '검색 결과가 없습니다.',
      className,
      ...rest
    },
    ref,
  ) => {
    const [selected, setSelected] = useControllableState(value, defaultValue, onChange);
    const [open, setOpen] = useState(() => new Set(defaultOpenIds));
    const [query, setQuery] = useState(defaultQuery);
    const q = query.trim();
    const full = selected.length >= max;
    const results = useMemo(() => searchMenu(items, q), [items, q]);

    const toggleOpen = (id: string) =>
      setOpen((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    const toggle = (id: string, checked: boolean) =>
      setSelected(checked ? [...selected, id] : selected.filter((v) => v !== id));

    // 칩 줄: 넘치면 → 버튼으로 옆으로 넘긴다
    const chipsRef = useRef<HTMLUListElement>(null);
    const [overflow, setOverflow] = useState(false);
    useEffect(() => {
      const el = chipsRef.current;
      if (!el) return;
      const check = () => setOverflow(el.scrollWidth > el.clientWidth + 1);
      check();
      // 칩 폭은 웹폰트가 늦게 적용될 때도 바뀌므로 칩마다 지켜본다
      const observer = new ResizeObserver(check);
      observer.observe(el);
      for (const chip of Array.from(el.children)) observer.observe(chip);
      return () => observer.disconnect();
    }, [selected]);

    const checkbox = (item: LnbMenuItem, label: ReactNode) => {
      const checked = selected.includes(item.id);
      return (
        <Checkbox
          className={clsx(styles.check, !checked && full && styles.checkDisabled)}
          label={label}
          checked={checked}
          disabled={!checked && full}
          onChange={(event) => toggle(item.id, event.target.checked)}
        />
      );
    };

    const row = (item: LnbMenuItem, depth: number): ReactNode => {
      if (!item.children?.length) {
        return (
          <div
            key={item.id}
            className={clsx(styles.row, styles.leaf, depth < 3 && styles.leafShallow)}
          >
            {checkbox(item, item.label)}
          </div>
        );
      }
      const expanded = open.has(item.id);
      const isRoot = depth === 1;
      return (
        <div key={item.id}>
          <button
            type="button"
            className={clsx(styles.row, styles.toggle, isRoot ? styles.root : styles.group)}
            aria-expanded={expanded}
            onClick={() => toggleOpen(item.id)}
          >
            <span className={isRoot ? styles.chevronRoot : styles.chevronGroup}>
              <Icon name={expanded ? 'chevron-down' : 'chevron-right'} size={isRoot ? 20 : 16} />
            </span>
            {item.label}
          </button>
          {expanded && item.children.map((child) => row(child, depth + 1))}
        </div>
      );
    };

    const labelOf = (id: string) => findPath(items, id).at(-1)?.label ?? id;

    return (
      <div {...rest} ref={ref} className={clsx(styles.picker, className)}>
        <SearchField
          size="lg"
          fullWidth
          placeholder={searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery('')}
          aria-label="메뉴 검색"
        />

        <div className={styles.selected}>
          <p className={styles.count} role="status">
            {selectedLabel}
            <span className={styles.countNumber}>
              {selected.length} / {max}
            </span>
          </p>
          <div className={styles.chipRow}>
            {selected.length === 0 ? (
              <span className={styles.chipEmpty}>아래 메뉴에서 선택해주세요.</span>
            ) : (
              <ul ref={chipsRef} className={styles.chips}>
                {selected.map((id) => (
                  <li key={id} className={styles.chip}>
                    {labelOf(id)}
                    <button
                      type="button"
                      className={styles.chipRemove}
                      aria-label={`${labelOf(id)} 빼기`}
                      onClick={() => toggle(id, false)}
                    >
                      <ClearIcon />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {overflow && (
              <button
                type="button"
                className={styles.scrollRight}
                aria-label="즐겨찾기 메뉴 더 보기"
                onClick={() => chipsRef.current?.scrollBy({ left: 200 })}
              >
                <Icon name="chevron-right" size={20} />
              </button>
            )}
          </div>
        </div>

        <div className={styles.tree}>
          {!q ? (
            items.map((item) => row(item, 1))
          ) : results.length === 0 ? (
            <p className={styles.empty}>{emptySearchText}</p>
          ) : (
            results.map(({ item, ancestors }) => (
              <div key={item.id} className={clsx(styles.row, styles.result)}>
                {checkbox(
                  item,
                  <span className={styles.resultText}>
                    <span>
                      {splitByQuery(item.label, q).map((part, index) =>
                        part.match ? (
                          <mark key={index} className={styles.match}>
                            {part.text}
                          </mark>
                        ) : (
                          part.text
                        ),
                      )}
                    </span>
                    <span className={styles.path}>{ancestors.map((a) => a.label).join(' > ')}</span>
                  </span>,
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  },
);
FavoriteMenuPicker.displayName = 'FavoriteMenuPicker';
