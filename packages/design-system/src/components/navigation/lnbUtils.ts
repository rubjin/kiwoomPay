import type { IconName } from '../Icon';

export interface LnbMenuItem {
  /** 메뉴 고유 값 (activeId · favoriteIds에 쓴다) */
  id: string;
  label: string;
  /** 1Depth 아이콘 (접은 모드에서도 이 아이콘이 남는다) */
  icon?: IconName;
  /** 이동할 주소. 있으면 링크(a)로 그린다. 하위 메뉴가 있는 항목에는 쓰지 않는다 */
  href?: string;
  /** 외부(새 창) 이동 메뉴 */
  external?: boolean;
  children?: LnbMenuItem[];
}

export interface LnbSearchResult {
  item: LnbMenuItem;
  /** 상위 메뉴들 (1Depth → …) */
  ancestors: LnbMenuItem[];
}

/** id까지의 경로 [1Depth, 2Depth, …, 자신]. 없으면 빈 배열 */
export function findPath(items: LnbMenuItem[], id?: string): LnbMenuItem[] {
  if (!id) return [];
  for (const item of items) {
    if (item.id === id) return [item];
    if (item.children) {
      const sub = findPath(item.children, id);
      if (sub.length) return [item, ...sub];
    }
  }
  return [];
}

/** 하위 메뉴가 없는(실제 화면으로 이동하는) 메뉴 중 이름에 검색어가 들어간 것 */
export function searchMenu(items: LnbMenuItem[], query: string): LnbSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: LnbSearchResult[] = [];
  const walk = (list: LnbMenuItem[], ancestors: LnbMenuItem[]) => {
    for (const item of list) {
      if (item.children?.length) walk(item.children, [...ancestors, item]);
      else if (item.label.toLowerCase().includes(q)) results.push({ item, ancestors });
    }
  };
  walk(items, []);
  return results;
}

/** 검색어와 일치하는 부분을 나눈다: [{ text, match }] */
export function splitByQuery(
  label: string,
  query: string,
): Array<{ text: string; match: boolean }> {
  const q = query.trim().toLowerCase();
  if (!q) return [{ text: label, match: false }];
  const parts: Array<{ text: string; match: boolean }> = [];
  const lower = label.toLowerCase();
  let from = 0;
  let index = lower.indexOf(q, from);
  while (index !== -1) {
    if (index > from) parts.push({ text: label.slice(from, index), match: false });
    parts.push({ text: label.slice(index, index + q.length), match: true });
    from = index + q.length;
    index = lower.indexOf(q, from);
  }
  if (from < label.length) parts.push({ text: label.slice(from), match: false });
  return parts;
}
