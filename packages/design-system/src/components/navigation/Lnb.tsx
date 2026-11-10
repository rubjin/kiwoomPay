import clsx from 'clsx';
import { forwardRef, useState, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { useControllableState } from '../../hooks';
import { Button, TextButton } from '../Button';
import { SearchField } from '../field/SearchField';
import { Icon } from '../Icon';
import styles from './Lnb.module.scss';
import { findPath, searchMenu, splitByQuery, type LnbMenuItem } from './lnbUtils';

export type LnbView = 'all' | 'favorites';

export interface LnbProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** 메뉴 트리 (1Depth → 2Depth → 3Depth) */
  items: LnbMenuItem[];
  /** 현재 화면 메뉴 id. 이 메뉴가 Active, 상위 메뉴는 Current로 표시된다 */
  activeId?: string;
  /** 하위 메뉴가 없는 메뉴를 고를 때. href 메뉴는 링크 이동 전에 호출된다 */
  onNavigate?: (item: LnbMenuItem, event: MouseEvent<HTMLElement>) => void;
  /** 로고 (이미지 등) */
  logo?: ReactNode;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  view?: LnbView;
  defaultView?: LnbView;
  onViewChange?: (view: LnbView) => void;
  /** 즐겨찾기 메뉴 id 목록 (MY 메뉴) */
  favoriteIds?: string[];
  /** '편집'을 누를 때. 즐겨찾기 편집은 Modal 패턴으로 화면에서 연다 */
  onFavoriteEdit?: () => void;
  searchPlaceholder?: string;
}

/** href가 있으면 링크, 없으면 버튼 */
function MenuLink({
  item,
  className,
  onSelect,
  children,
  current,
  expanded,
}: {
  item: LnbMenuItem;
  className?: string;
  onSelect: (event: MouseEvent<HTMLElement>) => void;
  children: ReactNode;
  current?: boolean;
  expanded?: boolean;
}) {
  const common = {
    className,
    onClick: onSelect,
    'aria-current': current ? ('page' as const) : undefined,
  };
  if (item.href && !item.children?.length) {
    return (
      <a
        {...common}
        href={item.href}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }
  return (
    <button {...common} type="button" aria-expanded={expanded}>
      {children}
    </button>
  );
}

function Highlight({ label, query }: { label: string; query: string }) {
  return (
    <>
      {splitByQuery(label, query).map((part, i) =>
        part.match ? (
          <mark key={i} className={styles.highlight}>
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

/**
 * 전체 메뉴 · 즐겨찾기 · 메뉴 검색을 제공하는 왼쪽 내비게이션(LNB). 라우팅에 의존하지 않는다.
 * 3Depth가 Active면 해당 2Depth는 Current + Open, 상위 1Depth는 Current로 표시된다.
 * 접은 모드(Collapsed)에서도 1Depth 아이콘과 현재 위치 표시는 유지된다.
 */
export const Lnb = forwardRef<HTMLElement, LnbProps>(
  (
    {
      items,
      activeId,
      onNavigate,
      logo,
      collapsed,
      defaultCollapsed = false,
      onCollapsedChange,
      view,
      defaultView = 'all',
      onViewChange,
      favoriteIds = [],
      onFavoriteEdit,
      searchPlaceholder = '메뉴명을 입력해주세요',
      className,
      'aria-label': ariaLabel = '전체 메뉴',
      ...rest
    },
    ref,
  ) => {
    const [isCollapsed, setCollapsed] = useControllableState(
      collapsed,
      defaultCollapsed,
      onCollapsedChange,
    );
    const [currentView, setView] = useControllableState(view, defaultView, onViewChange);
    const [query, setQuery] = useState('');

    const activePath = findPath(items, activeId);
    const currentIds = new Set(activePath.map((item) => item.id));
    const [openIds, setOpenIds] = useState<Set<string>>(
      () => new Set(activePath.slice(0, -1).map((item) => item.id)),
    );

    // 현재 화면이 바뀌면 그 상위 메뉴를 펼친다 (사용자가 펼친 다른 메뉴는 유지).
    // 렌더 중에 바로 반영해 현재 메뉴가 한 프레임이라도 가려지지 않게 한다.
    const [openedFor, setOpenedFor] = useState(activeId);
    if (openedFor !== activeId) {
      setOpenedFor(activeId);
      const ancestors = activePath.slice(0, -1);
      if (ancestors.length > 0) {
        setOpenIds((prev) => {
          const next = new Set(prev);
          ancestors.forEach((item) => next.add(item.id));
          return next;
        });
      }
    }

    const toggle = (id: string) =>
      setOpenIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });

    const navigate = (item: LnbMenuItem, event: MouseEvent<HTMLElement>) => {
      onNavigate?.(item, event);
    };

    const select = (item: LnbMenuItem) => (event: MouseEvent<HTMLElement>) => {
      if (item.children?.length) toggle(item.id);
      else navigate(item, event);
    };

    // ── 접은 모드: 1Depth 아이콘만 ───────────────────
    if (isCollapsed) {
      return (
        <nav
          {...rest}
          ref={ref}
          aria-label={ariaLabel}
          className={clsx(styles.lnb, styles.collapsed, className)}
        >
          <div className={styles.header}>
            <button
              type="button"
              className={styles.toggle}
              aria-label="메뉴 펼치기"
              aria-expanded={false}
              onClick={() => setCollapsed(false)}
            >
              <Icon name="menu" size={24} />
            </button>
          </div>
          <ul className={clsx(styles.list, styles.scroll)}>
            {items.map((item) => (
              <li key={item.id}>
                <MenuLink
                  item={item}
                  className={clsx(styles.iconOnly, currentIds.has(item.id) && styles.current)}
                  current={item.id === activeId}
                  onSelect={(event) => {
                    if (item.children?.length) {
                      // 접은 상태에서 하위 메뉴가 있는 1Depth를 고르면 펼치고 해당 메뉴를 연다
                      setOpenIds((prev) => new Set(prev).add(item.id));
                      setCollapsed(false);
                    } else navigate(item, event);
                  }}
                >
                  <span className={styles.icon} title={item.label}>
                    {item.icon && <Icon name={item.icon} size={20} />}
                  </span>
                  <span className={styles.srOnly}>{item.label}</span>
                </MenuLink>
              </li>
            ))}
          </ul>
        </nav>
      );
    }

    // ── 메뉴 트리 ────────────────────────────────────
    const renderDepth3 = (item: LnbMenuItem) => (
      <li key={item.id}>
        <MenuLink
          item={item}
          className={clsx(styles.depth3, item.id === activeId && styles.active)}
          current={item.id === activeId}
          onSelect={(event) => navigate(item, event)}
        >
          <span className={styles.bullet} aria-hidden="true" />
          <span className={styles.label} title={item.label}>
            {item.label}
          </span>
          <span className={styles.go} aria-hidden="true">
            <Icon name={item.external ? 'link-external' : 'arrow-up-right'} size={16} />
          </span>
        </MenuLink>
      </li>
    );

    const renderDepth2 = (item: LnbMenuItem) => {
      const open = openIds.has(item.id);
      const hasChildren = !!item.children?.length;
      return (
        <li key={item.id}>
          <MenuLink
            item={item}
            className={clsx(
              styles.depth2,
              currentIds.has(item.id) && styles.current,
              item.id === activeId && styles.active,
            )}
            current={item.id === activeId}
            expanded={hasChildren ? open : undefined}
            onSelect={select(item)}
          >
            <span className={styles.label} title={item.label}>
              {item.label}
            </span>
            <span className={styles.chevron}>
              <Icon name={hasChildren && open ? 'chevron-down' : 'chevron-right'} size={16} />
            </span>
          </MenuLink>
          {hasChildren && open && (
            <ul className={styles.list}>{item.children!.map(renderDepth3)}</ul>
          )}
        </li>
      );
    };

    const tree = (
      <ul className={styles.list}>
        {items.map((item) => {
          const open = openIds.has(item.id);
          const hasChildren = !!item.children?.length;
          return (
            <li key={item.id}>
              <MenuLink
                item={item}
                className={clsx(
                  styles.depth1,
                  currentIds.has(item.id) && styles.current,
                  item.id === activeId && styles.active,
                )}
                current={item.id === activeId}
                expanded={hasChildren ? open : undefined}
                onSelect={select(item)}
              >
                <span className={styles.icon}>
                  {item.icon && <Icon name={item.icon} size={20} />}
                </span>
                <span className={styles.label} title={item.label}>
                  {item.label}
                </span>
                <span className={clsx(styles.chevron, styles.muted)}>
                  <Icon name={hasChildren && open ? 'chevron-down' : 'chevron-right'} size={16} />
                </span>
              </MenuLink>
              {hasChildren && open && (
                <ul className={clsx(styles.list, styles.sub)}>
                  {item.children!.map(renderDepth2)}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    );

    // ── 즐겨찾기 ────────────────────────────────────
    const favorites = favoriteIds
      .map((id) => findPath(items, id))
      .filter((path) => path.length > 0);

    const favoriteView = (
      <div className={styles.favorites}>
        <div className={styles.favoriteHeader}>
          <span className={styles.favoriteTitle}>MY 메뉴</span>
          {onFavoriteEdit && favorites.length > 0 && (
            <TextButton size="sm" onClick={onFavoriteEdit}>
              편집
            </TextButton>
          )}
        </div>
        {favorites.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>등록된 메뉴가 없습니다.</p>
            <p className={styles.emptyDesc}>
              자주 사용하는 메뉴를 등록하면
              <br />
              빠르게 이동할 수 있어요
            </p>
            {onFavoriteEdit && (
              <Button size="sm" appearance="line" onClick={onFavoriteEdit}>
                즐겨찾기 편집
              </Button>
            )}
          </div>
        ) : (
          <ul className={clsx(styles.list, styles.favoriteList)}>
            {favorites.map((path) => {
              const item = path[path.length - 1]!;
              return (
                <li key={item.id}>
                  <MenuLink
                    item={item}
                    className={styles.favoriteItem}
                    current={item.id === activeId}
                    onSelect={(event) => navigate(item, event)}
                  >
                    <span className={styles.heart}>
                      <Icon name="heart" size={16} />
                    </span>
                    <span className={styles.itemText}>
                      <span className={styles.itemName} title={item.label}>
                        {item.label}
                      </span>
                      <span className={styles.itemPath}>
                        {path
                          .slice(0, -1)
                          .map((p) => p.label)
                          .join(' > ')}
                      </span>
                    </span>
                  </MenuLink>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );

    // ── 검색 결과 ───────────────────────────────────
    const results = searchMenu(items, query);
    const searchView =
      results.length === 0 ? (
        <div className={styles.searchEmpty}>
          <p className={styles.emptyTitle}>검색 결과가 없습니다.</p>
          <p className={styles.itemPath}>메뉴명을 다시 확인해주세요.</p>
        </div>
      ) : (
        <ul className={clsx(styles.list, styles.results)}>
          {results.map(({ item, ancestors }) => (
            <li key={item.id} className={styles.resultRow}>
              <MenuLink
                item={item}
                className={styles.result}
                current={item.id === activeId}
                onSelect={(event) => {
                  navigate(item, event);
                  setQuery('');
                }}
              >
                <span className={styles.itemName} title={item.label}>
                  <Highlight label={item.label} query={query} />
                </span>
                <span className={styles.itemPath}>
                  {[...ancestors.map((a) => a.label), item.label].join(' > ')}
                </span>
              </MenuLink>
            </li>
          ))}
        </ul>
      );

    return (
      <nav {...rest} ref={ref} aria-label={ariaLabel} className={clsx(styles.lnb, className)}>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.toggle}
            aria-label="메뉴 접기"
            aria-expanded
            onClick={() => setCollapsed(true)}
          >
            <Icon name="menu" size={24} />
          </button>
          {logo && <div className={styles.logo}>{logo}</div>}
        </div>

        <div className={styles.search}>
          <SearchField
            size="sm"
            fullWidth
            placeholder={searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery('')}
          />
        </div>

        {query.trim() ? (
          <div className={styles.scroll}>{searchView}</div>
        ) : (
          <>
            <div className={styles.tabs} role="tablist" aria-label="메뉴 보기">
              {(['all', 'favorites'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={currentView === key}
                  className={clsx(styles.tab, currentView === key && styles.tabActive)}
                  onClick={() => setView(key)}
                >
                  {key === 'all' ? '전체 메뉴' : '즐겨찾기'}
                  {key === 'favorites' && <span className={styles.count}>{favorites.length}</span>}
                </button>
              ))}
            </div>
            <div className={styles.scroll} role="tabpanel">
              {currentView === 'all' ? tree : favoriteView}
            </div>
          </>
        )}
      </nav>
    );
  },
);

Lnb.displayName = 'Lnb';
