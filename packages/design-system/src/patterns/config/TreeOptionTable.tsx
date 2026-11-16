import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Badge } from '../../components/Badge';
import { Icon } from '../../components/Icon';
import { Checkbox } from '../../components/selection';
import styles from './TreeOptionTable.module.scss';

export interface TreeOption {
  value: string;
  label: ReactNode;
  /** 고를 수 없음 (승인대기 등) — 체크박스 비활성 */
  disabled?: boolean;
  /** 옆에 붙는 상태 (예: 승인대기 Badge) */
  addon?: ReactNode;
}

export interface TreeOptionNode {
  id: string;
  label: string;
  /** 하위 메뉴 (있으면 펼침 · 접힘 줄) */
  children?: TreeOptionNode[];
  /** 현재 보유 (예: 조회) — 회색 Badge로 */
  current?: string[];
  /** 고를 수 있는 항목 */
  options?: TreeOption[];
}

export interface TreeOptionTableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  nodes: TreeOptionNode[];
  /** 펼친 줄 id (controlled — 모두 접기 · 펼치기 · Tree Depth는 쓰는 곳이 정한다) */
  expandedIds: string[];
  onExpandedChange: (ids: string[]) => void;
  /** 고른 항목: 메뉴 id → 항목 value[] */
  value: Record<string, string[]>;
  onChange: (value: Record<string, string[]>) => void;
  /** 머리 3칸 이름 (기본 메뉴 · 현재 보유 권한 · 신청 가능 권한(선택)) */
  headers?: [ReactNode, ReactNode, ReactNode];
  /** 위 도구 줄 (검색 · Tree Depth · 모두 접기/펼치기) */
  toolbar?: ReactNode;
  /** 줄이 없을 때 (검색 결과 없음) */
  empty?: ReactNode;
}

/** 트리 안 모든 그룹(하위가 있는 줄) id — 깊이 제한 (1 = 1Depth만 펼침) */
export function treeGroupIds(nodes: TreeOptionNode[], maxDepth = Infinity, depth = 1): string[] {
  return nodes.flatMap((n) =>
    n.children && depth <= maxDepth ? [n.id, ...treeGroupIds(n.children, maxDepth, depth + 1)] : [],
  );
}

/** 이름에 검색어가 들어간 끝 메뉴와 그 상위만 남긴다 */
export function filterTree(nodes: TreeOptionNode[], query: string): TreeOptionNode[] {
  const q = query.trim();
  if (!q) return nodes;
  return nodes.flatMap((n) => {
    if (!n.children) return n.label.includes(q) ? [n] : [];
    const children = filterTree(n.children, q);
    return children.length > 0 ? [{ ...n, children }] : [];
  });
}

/**
 * 트리 + 항목 선택 표 (IBSheet8 Tree 자리): 그룹 줄(1Depth Neutral 200 · 2Depth Neutral 100, 화살표로 펼침)
 * → 끝 메뉴 줄 [메뉴 | 현재 보유(회색 Badge) | 고를 항목 체크박스]. 줄 42 · 메뉴 칸 남는 폭 · 160 · 250.
 * Figma KWPC02020002 메뉴 권한 신청. TODO(IBSheet) 실제 화면은 IBSheet8 Tree로 바꿀 수 있다
 */
export const TreeOptionTable = forwardRef<HTMLDivElement, TreeOptionTableProps>(
  (
    {
      nodes,
      expandedIds,
      onExpandedChange,
      value,
      onChange,
      headers = ['메뉴', '현재 보유 권한', '신청 가능 권한(선택)'],
      toolbar,
      empty = '검색 결과가 없습니다.',
      className,
      ...rest
    },
    ref,
  ) => {
    const toggleGroup = (id: string) =>
      onExpandedChange(
        expandedIds.includes(id) ? expandedIds.filter((x) => x !== id) : [...expandedIds, id],
      );
    const toggleOption = (nodeId: string, option: string, checked: boolean) => {
      const list = value[nodeId] ?? [];
      const nextList = checked ? [...list, option] : list.filter((v) => v !== option);
      const next = { ...value };
      if (nextList.length > 0) next[nodeId] = nextList;
      else delete next[nodeId];
      onChange(next);
    };

    const rows: ReactNode[] = [];
    const walk = (list: TreeOptionNode[], depth: number) => {
      for (const node of list) {
        if (node.children) {
          const open = expandedIds.includes(node.id);
          rows.push(
            <div
              key={node.id}
              role="row"
              className={clsx(styles.row, depth === 1 ? styles.group1 : styles.group2)}
            >
              <button
                type="button"
                className={styles.groupToggle}
                aria-expanded={open}
                onClick={() => toggleGroup(node.id)}
              >
                <Icon name={open ? 'chevron-down' : 'chevron-right'} size={12} />
                {node.label}
              </button>
            </div>,
          );
          if (open) walk(node.children, depth + 1);
        } else {
          rows.push(
            <div key={node.id} role="row" className={clsx(styles.row, styles.leaf)}>
              <span className={styles.menuCell}>{node.label}</span>
              <span className={styles.currentCell}>
                {node.current?.map((c) => (
                  <Badge key={c} size="sm">
                    {c}
                  </Badge>
                ))}
              </span>
              <span className={styles.optionCell}>
                {node.options?.map((o) => (
                  <span key={o.value} className={styles.option}>
                    <Checkbox
                      label={o.label}
                      disabled={o.disabled}
                      checked={(value[node.id] ?? []).includes(o.value)}
                      onChange={(e) => toggleOption(node.id, o.value, e.target.checked)}
                    />
                    {o.addon}
                  </span>
                ))}
              </span>
            </div>,
          );
        }
      }
    };
    walk(nodes, 1);

    return (
      <div {...rest} ref={ref} className={clsx(styles.table, className)}>
        {toolbar && <div className={styles.toolbar}>{toolbar}</div>}
        <div role="row" className={clsx(styles.row, styles.head)}>
          <span className={clsx(styles.menuCell, styles.headMenu)}>{headers[0]}</span>
          <span className={styles.currentCell}>{headers[1]}</span>
          <span className={styles.optionCell}>{headers[2]}</span>
        </div>
        {rows.length > 0 ? rows : <p className={styles.empty}>{empty}</p>}
      </div>
    );
  },
);
TreeOptionTable.displayName = 'TreeOptionTable';

export interface SelectedOptionGroup {
  key: string;
  /** 메뉴 경로 */
  title: ReactNode;
  items: { value: string; label: ReactNode }[];
}

export interface SelectedOptionListProps extends HTMLAttributes<HTMLDivElement> {
  /** 위 요약 (예: 2개 메뉴 · 3개 권한) */
  summary: ReactNode;
  groups: SelectedOptionGroup[];
  /** 체크를 풀면 — 고른 항목에서 뺀다 */
  onRemove: (groupKey: string, value: string) => void;
  emptyTitle?: ReactNode;
  emptyDescription?: ReactNode;
}

/**
 * 고른 항목 확인 목록: 요약 줄(Neutral 100 · Primary 13 Bold) → 메뉴별 묶음(경로 13 Bold + 체크된 항목, 풀면 빠짐).
 * 높이는 내용만큼 (Figma 신청 예정 권한 확인 · Compact List / Hug)
 */
export const SelectedOptionList = forwardRef<HTMLDivElement, SelectedOptionListProps>(
  (
    {
      summary,
      groups,
      onRemove,
      emptyTitle = '선택한 항목이 없습니다.',
      emptyDescription,
      className,
      ...rest
    },
    ref,
  ) => (
    <div {...rest} ref={ref} className={clsx(styles.selected, className)}>
      <p className={styles.selectedSummary}>{summary}</p>
      {groups.length === 0 ? (
        <div className={styles.selectedEmpty}>
          <p className={styles.selectedEmptyTitle}>{emptyTitle}</p>
          {emptyDescription && <p className={styles.selectedEmptyText}>{emptyDescription}</p>}
        </div>
      ) : (
        groups.map((g) => (
          <div key={g.key} className={styles.selectedGroup}>
            <p className={styles.selectedTitle}>{g.title}</p>
            {g.items.map((item) => (
              <div key={item.value} className={styles.selectedItem}>
                <Checkbox label={item.label} checked onChange={() => onRemove(g.key, item.value)} />
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  ),
);
SelectedOptionList.displayName = 'SelectedOptionList';
