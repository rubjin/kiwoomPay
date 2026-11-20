import { filterTreeTable } from '@kiwoompay/design-system';
import type { Option } from '@/constants/options';
import type { MenuInput, MenuNode, MenuSearchParams } from '@/features/system/menu.types';

/** 메뉴 최대 단계 (4Depth 탭 · 팝업은 메뉴 등록 대상 아님) */
export const MAX_MENU_LEVEL = 3;

/** 메뉴 검색 초기값 ([초기화] 기준) — 사용여부 둘 다 체크(전체) */
export function createInitialParams(): MenuSearchParams {
  return { menuId: '', menuName: '', use: true, unused: true };
}

export function findMenu(node: MenuNode, id: string): MenuNode | undefined {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const found = findMenu(child, id);
    if (found) return found;
  }
  return undefined;
}

/** 시스템 줄을 뺀 상위 경로 이름 (예: 시스템관리 > 사용자·권한·보안 관리) */
export function menuPath(root: MenuNode, id: string): string {
  const names: string[] = [];
  let node = findMenu(root, id);
  while (node && node.level > 0) {
    names.unshift(node.name);
    node = node.parentId ? findMenu(root, node.parentId) : undefined;
  }
  return names.join(' > ');
}

/** 아래로 몇 단계가 더 있는지 (하위 없음 0) */
const subtreeHeight = (node: MenuNode): number =>
  node.children?.length ? 1 + Math.max(...node.children.map(subtreeHeight)) : 0;

/**
 * 상위메뉴 선택지: 시스템 · 1 · 2Depth 중 자기 자신 · 하위는 빼고,
 * 옮긴 뒤 하위까지 3Depth를 넘지 않는 것만
 */
export function parentOptions(root: MenuNode, editing: MenuNode | undefined): Option[] {
  const height = editing ? subtreeHeight(editing) : 0;
  const options: Option[] = [];
  const walk = (node: MenuNode) => {
    if (editing && node.id === editing.id) return;
    if (node.level + 1 + height <= MAX_MENU_LEVEL) {
      options.push({
        value: node.id,
        label: node.level === 0 ? `${node.name} (최상위)` : menuPath(root, node.id),
      });
    }
    node.children?.forEach(walk);
  };
  walk(root);
  return options;
}

/** 검색 조건으로 거른 트리 + 펼칠 줄. 조건이 없으면 전체 트리 · 1Depth까지 펼침 */
export function searchMenuTree(
  root: MenuNode,
  params: MenuSearchParams,
): { nodes: MenuNode[]; expandedIds: string[] } {
  const id = params.menuId.trim().toLowerCase();
  const name = params.menuName.trim();
  const allStatus = params.use && params.unused;
  if (!id && !name && allStatus) return { nodes: [root], expandedIds: [root.id] };

  return filterTreeTable(
    [root],
    (node) =>
      node.level > 0 &&
      (!id || node.id.toLowerCase().includes(id)) &&
      (!name || node.name.includes(name)) &&
      (node.use ? params.use : params.unused),
  );
}

/** 메뉴 → 입력값 */
export const toInput = (node: MenuNode): MenuInput => ({
  id: node.id,
  parentId: node.parentId ?? '',
  name: node.name,
  description: node.description,
  type: node.type,
  progLink: node.progLink,
  sortOrder: String(node.sortOrder),
  use: node.use,
});

/** 하위 메뉴 추가 입력값 — 3Depth면 업무 화면, 아니면 그룹 메뉴 (TODO(정책) 기본 메뉴유형) */
export const newChildInput = (parent: MenuNode): MenuInput => ({
  id: null,
  parentId: parent.id,
  name: '',
  description: '',
  type: parent.level + 1 === MAX_MENU_LEVEL ? 'PAGE' : 'GROUP',
  progLink: '',
  sortOrder: '',
  use: true,
});
