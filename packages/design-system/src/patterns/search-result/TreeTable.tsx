import clsx from 'clsx';
import { type CSSProperties, type ReactNode } from 'react';
import { Icon } from '../../components/Icon';
import type { GridPlaceholderColumn } from './GridPlaceholder';
import styles from './SearchResult.module.scss';

export interface TreeTableNode {
  id: string;
  children?: this[];
}

export interface TreeTableProps<T extends TreeTableNode> {
  /** 열 정의 (GridPlaceholder와 같음). 첫 열이 트리 열 — 단계만큼 들여 쓰고 앞에 펼침 · 접기 화살표 */
  columns: GridPlaceholderColumn<T>[];
  nodes: T[];
  /** 펼친 줄 id (controlled — 검색 결과 펼치기 · 모두 접기는 쓰는 곳이 정한다) */
  expandedIds: string[];
  onExpandedChange: (ids: string[]) => void;
  /** 선택한 줄 (배경 Primary 50 · 글자 Primary) */
  selectedId?: string | null;
  /** 줄을 누르면 */
  onSelect?: (node: T) => void;
  /** 줄이 없을 때 (GridPlaceholder empty와 같음) */
  empty?: ReactNode;
  /** 최대 높이 — 주면 표 안에서 스크롤 · 머리 고정 */
  maxHeight?: number | string;
  className?: string;
  style?: CSSProperties;
}

/** 하위가 있는 줄 id 전체 (모두 펼치기) */
export function treeTableGroupIds<T extends TreeTableNode>(nodes: T[]): string[] {
  return nodes.flatMap((n) => (n.children?.length ? [n.id, ...treeTableGroupIds(n.children)] : []));
}

/**
 * 조건에 맞는 줄과 그 상위 경로만 남긴다. expandedIds = 맞는 줄까지 펼칠 상위 id (검색 결과 펼침).
 * 상위가 맞으면 하위는 하위 중 맞는 것만 남긴다
 */
export function filterTreeTable<T extends TreeTableNode>(
  nodes: T[],
  match: (node: T) => boolean,
): { nodes: T[]; expandedIds: string[] } {
  const expandedIds: string[] = [];
  const walk = (list: T[]): T[] =>
    list.flatMap((node) => {
      const children = node.children ? walk(node.children) : [];
      if (children.length > 0) {
        expandedIds.push(node.id);
        return [{ ...node, children }];
      }
      return match(node) ? [{ ...node, children: [] }] : [];
    });
  return { nodes: walk(nodes), expandedIds };
}

/**
 * 트리 표 (IBSheet8 Tree 자리): 펼침 · 접기 + 줄 선택 → 옆 상세. 모양은 GridPlaceholder와 같다(머리 · 줄 40 · 선).
 * 화면설계서 KWPC10010201 메뉴 관리 메뉴 목록. 하위가 없는 평평한 목록이면 줄 선택 목록(KWPC10010202 기능 목록). TODO(IBSheet) 실제 화면은 IBSheet8 Tree로 바꿀 수 있다
 */
export function TreeTable<T extends TreeTableNode>({
  columns,
  nodes,
  expandedIds,
  onExpandedChange,
  selectedId,
  onSelect,
  empty,
  maxHeight,
  className,
  style,
}: TreeTableProps<T>) {
  const toggle = (id: string) =>
    onExpandedChange(
      expandedIds.includes(id) ? expandedIds.filter((x) => x !== id) : [...expandedIds, id],
    );

  const rows: { node: T; depth: number }[] = [];
  const walk = (list: T[], depth: number) => {
    for (const node of list) {
      rows.push({ node, depth });
      if (node.children?.length && expandedIds.includes(node.id)) walk(node.children, depth + 1);
    }
  };
  walk(nodes, 0);
  // 하위가 하나도 없는 평평한 목록이면 화살표 자리를 두지 않는다 (줄 선택 목록으로 쓸 때)
  const hasGroups = nodes.some((n) => n.children?.length);

  const valueOf = (row: T, key: string) => String((row as Record<string, unknown>)[key] ?? '');

  return (
    <div
      className={clsx(styles.grid, maxHeight !== undefined && styles.gridScroll, className)}
      style={maxHeight !== undefined ? { maxHeight, ...style } : style}
    >
      <table className={styles.gridTable} data-kp-table="">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={styles.gridHead}
                style={{ width: column.width, minWidth: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && empty !== undefined && (
            <tr>
              <td
                className={typeof empty === 'string' ? styles.gridEmptyText : styles.gridEmpty}
                colSpan={columns.length}
              >
                {empty}
              </td>
            </tr>
          )}
          {rows.map(({ node, depth }) => {
            const group = Boolean(node.children?.length);
            const open = expandedIds.includes(node.id);
            return (
              <tr
                key={node.id}
                className={clsx(
                  onSelect && styles.treeRowSelectable,
                  selectedId === node.id && styles.treeRowSelected,
                )}
                aria-selected={onSelect ? selectedId === node.id : undefined}
                onClick={onSelect ? () => onSelect(node) : undefined}
              >
                {columns.map((column, i) => {
                  const content = column.render ? column.render(node) : valueOf(node, column.key);
                  return (
                    <td
                      key={column.key}
                      className={clsx(
                        styles.gridCell,
                        i === 0 && styles.alignLeft,
                        i > 0 && column.align === 'left' && styles.alignLeft,
                        column.align === 'right' && styles.alignRight,
                      )}
                    >
                      {i === 0 && hasGroups ? (
                        <span
                          className={styles.treeCell}
                          style={{ '--tree-depth': depth } as CSSProperties}
                        >
                          {group ? (
                            <button
                              type="button"
                              className={styles.treeToggle}
                              aria-expanded={open}
                              aria-label={open ? '접기' : '펼치기'}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggle(node.id);
                              }}
                            >
                              <Icon name={open ? 'chevron-down' : 'chevron-right'} size={16} />
                            </button>
                          ) : (
                            <span className={styles.treeToggleSpace} aria-hidden />
                          )}
                          <span className={styles.treeLabel}>{content}</span>
                        </span>
                      ) : (
                        content
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
