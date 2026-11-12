import clsx from 'clsx';
import { forwardRef, useMemo, useState, type HTMLAttributes, type ReactNode } from 'react';
import { useControllableState } from '../../hooks';
import { SearchField } from '../field';
import { Icon } from '../Icon';
import { Checkbox } from '../selection';
import type { LnbMenuItem } from './lnbUtils';
import styles from './FavoriteMenuPicker.module.scss';

export interface FavoriteMenuPickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /** LNB와 같은 메뉴 트리 (1Depth → 2Depth → 3Depth). 하위가 없는 메뉴만 고를 수 있다 */
  items: LnbMenuItem[];
  /** 선택한 메뉴 id (controlled) */
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** 최대 선택 수 (기본 10). 다 차면 나머지는 고를 수 없다 */
  max?: number;
  description?: ReactNode;
  searchPlaceholder?: string;
  /** 처음 펼칠 메뉴 id (1 · 2Depth) */
  defaultOpenIds?: string[];
}

const matches = (item: LnbMenuItem, q: string): boolean =>
  item.children?.length ? item.children.some((c) => matches(c, q)) : item.label.includes(q);

/** 즐겨찾기 편집 Modal 본문: 메뉴 검색 + 1Depth 펼침 + 3Depth 체크박스 (최대 개수 제한) */
export const FavoriteMenuPicker = forwardRef<HTMLDivElement, FavoriteMenuPickerProps>(
  (
    {
      items,
      value,
      defaultValue = [],
      onChange,
      max = 10,
      description,
      searchPlaceholder = '즐겨찾기에 추가할 메뉴를 검색해보세요',
      defaultOpenIds = [],
      className,
      ...rest
    },
    ref,
  ) => {
    const [selected, setSelected] = useControllableState(value, defaultValue, onChange);
    const [open, setOpen] = useState(() => new Set(defaultOpenIds));
    const [query, setQuery] = useState('');
    const q = query.trim();
    const full = selected.length >= max;

    const visible = useMemo(() => (q ? items.filter((i) => matches(i, q)) : items), [items, q]);
    // 검색 중에는 일치하는 메뉴가 보이도록 모두 펼친다
    const isOpen = (id: string) => Boolean(q) || open.has(id);
    const toggleOpen = (id: string) =>
      setOpen((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });

    const toggle = (id: string, checked: boolean) =>
      setSelected(checked ? [...selected, id] : selected.filter((v) => v !== id));

    const filterChildren = (list: LnbMenuItem[] = []) =>
      q ? list.filter((c) => matches(c, q)) : list;

    const leaf = (item: LnbMenuItem) => {
      const checked = selected.includes(item.id);
      return (
        <div key={item.id} className={styles.leaf}>
          <Checkbox
            className={clsx(styles.check, !checked && full && styles.checkDisabled)}
            label={item.label}
            checked={checked}
            disabled={!checked && full}
            onChange={(event) => toggle(item.id, event.target.checked)}
          />
        </div>
      );
    };

    const sub = (item: LnbMenuItem): ReactNode => {
      if (!item.children?.length) return leaf(item);
      const expanded = isOpen(item.id);
      return (
        <div key={item.id} className={styles.subGroup}>
          <button
            type="button"
            className={styles.sub}
            aria-expanded={expanded}
            onClick={() => toggleOpen(item.id)}
          >
            <span className={styles.subLabel}>{item.label}</span>
            <Icon name={expanded ? 'chevron-down' : 'chevron-right'} size={20} />
          </button>
          {expanded && filterChildren(item.children).map(sub)}
        </div>
      );
    };

    return (
      <div {...rest} ref={ref} className={clsx(styles.picker, className)}>
        <p className={styles.description}>
          {description ?? `자주 사용하는 메뉴를 최대 ${max}개까지 선택할 수 있습니다.`}
        </p>
        <SearchField
          size="lg"
          fullWidth
          placeholder={searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery('')}
          aria-label="메뉴 검색"
        />
        {visible.map((group) => {
          const expanded = isOpen(group.id);
          const children = filterChildren(group.children);
          return (
            <section key={group.id} className={clsx(styles.group, expanded && styles.groupOpen)}>
              <button
                type="button"
                className={styles.groupHeader}
                aria-expanded={expanded}
                onClick={() => toggleOpen(group.id)}
              >
                <span className={styles.groupLabel}>{group.label}</span>
                <Icon name={expanded ? 'chevron-down' : 'chevron-right'} size={20} />
              </button>
              {expanded && children.length > 0 && (
                <div className={styles.panel}>{children.map(sub)}</div>
              )}
            </section>
          );
        })}
      </div>
    );
  },
);
FavoriteMenuPicker.displayName = 'FavoriteMenuPicker';

export interface FavoriteCountProps extends HTMLAttributes<HTMLSpanElement> {
  count: number;
  max: number;
  label?: ReactNode;
}

/** "선택한 메뉴 0 / 10" (Modal.Header addon) */
export const FavoriteCount = forwardRef<HTMLSpanElement, FavoriteCountProps>(
  ({ count, max, label = '선택한 메뉴', className, ...rest }, ref) => (
    <span {...rest} ref={ref} className={clsx(styles.count, className)} role="status">
      <span className={styles.countLabel}>{label}</span>
      <span className={styles.countNumber}>
        {count} / {max}
      </span>
    </span>
  ),
);
FavoriteCount.displayName = 'FavoriteCount';
