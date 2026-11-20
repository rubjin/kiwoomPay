import type { MenuNode } from '@/features/system/menu.types';
import type {
  FunctionInput,
  FunctionItem,
  FunctionSearchParams,
} from '@/features/system/functionCode.types';

/** 기능을 등록하는 메뉴 단계 (3Depth) */
export const FUNCTION_MENU_LEVEL = 3;

/** 기능 검색 초기값 ([초기화] 기준) — 그룹별 모두 선택(전체) */
export function createInitialParams(): FunctionSearchParams {
  return {
    code: '',
    name: '',
    types: ['TAB', 'BUTTON'],
    kinds: ['NORMAL', 'SPECIAL'],
    uses: ['Y', 'N'],
  };
}

/** 체크박스 그룹: 켜면 넣고 끄면 뺀다 */
export const toggleIn = <V>(list: V[], value: V, on: boolean) =>
  on ? [...list, value] : list.filter((v) => v !== value);

export function findMenu(node: MenuNode, id: string): MenuNode | undefined {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const found = findMenu(child, id);
    if (found) return found;
  }
  return undefined;
}

/** 기능 → 입력값 */
export const toInput = (f: FunctionItem): FunctionInput => ({
  code: f.code,
  menuId: f.menuId,
  name: f.name,
  type: f.type,
  tabCode: f.tabCode ?? '',
  kind: f.kind,
  key: f.key,
  specialCode: f.specialCode ?? '',
  specialApply: f.specialApply ?? '',
  sortOrder: String(f.sortOrder),
  use: f.use,
});

/** 기능 추가 입력값 — 버튼·기능 · 일반 · 사용 (TODO(정책) 기본값) */
export const newInput = (menuId: string): FunctionInput => ({
  code: null,
  menuId,
  name: '',
  type: 'BUTTON',
  tabCode: '',
  kind: 'NORMAL',
  key: '',
  specialCode: '',
  specialApply: '',
  sortOrder: '',
  use: true,
});
