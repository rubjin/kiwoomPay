import type { MenuNode } from '@/features/system/menu.types';
import type {
  PermissionTemplate,
  TemplateInput,
  TemplateSearchParams,
} from '@/features/system/permissionTemplate.types';

/** 템플릿 검색 초기값 ([초기화] 기준) — 사용여부 모두(전체) */
export const createInitialParams = (): TemplateSearchParams => ({ name: '', uses: ['Y', 'N'] });

export const toggleIn = <V>(list: V[], value: V, on: boolean) =>
  on ? [...list, value] : list.filter((v) => v !== value);

export const toInput = (t: PermissionTemplate): TemplateInput => ({
  id: t.id,
  name: t.name,
  description: t.description,
  use: t.use,
  menuIds: [...t.menuIds].sort(),
  functionCodes: [...t.functionCodes].sort(),
});

export const newInput = (): TemplateInput => ({
  id: null,
  name: '',
  description: '',
  use: true,
  menuIds: [],
  functionCodes: [],
});

/** 바뀐 것 확인 — 권한 순서는 상관없게 정렬해 비교 */
export const sameInput = (a: TemplateInput | null, b: TemplateInput | null) => {
  const norm = (v: TemplateInput | null) =>
    v && { ...v, menuIds: [...v.menuIds].sort(), functionCodes: [...v.functionCodes].sort() };
  return JSON.stringify(norm(a)) === JSON.stringify(norm(b));
};

/** 메뉴와 그 아래 모든 메뉴 id */
export const selfAndDescendants = (node: MenuNode): string[] => [
  node.id,
  ...(node.children ?? []).flatMap(selfAndDescendants),
];
