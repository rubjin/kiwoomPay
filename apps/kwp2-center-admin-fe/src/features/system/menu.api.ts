import { wait } from '@/mocks/utils';
import { MenuError, type MenuInput, type MenuNode } from './menu.types';
import { MENU_ROOT, USED_MENU_IDS } from '@/mocks/system/menu.mock';

export { SYSTEM_MENU_ID } from './menu.types';

// TODO(API) 메뉴 관리 API(GET /menus/tree · POST · PUT · DELETE)가 정해지면 axios 호출로 바꾼다.
// 지금은 화면 확인용 예시 데이터 (임의 작업: 메뉴 목록 · 이동 경로 · 사용 이력). 메모리에만 저장한다

const clone = (node: MenuNode): MenuNode => structuredClone(node);

const findNode = (node: MenuNode, id: string): MenuNode | undefined => {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return undefined;
};

const sortChildren = (node: MenuNode) => node.children?.sort((a, b) => a.sortOrder - b.sortOrder);

let nextSeq = 9000;

/** 메뉴 트리 전체 (시스템 줄 하나). 검색은 화면에서 거른다 — TODO(API) 서버 검색이면 조건을 넘긴다 */
export async function fetchMenuTree(): Promise<MenuNode> {
  await wait(300);
  return clone(MENU_ROOT);
}

/** 저장 (신규 · 수정) → 저장된 메뉴ID. 같은 상위메뉴 안 메뉴명 중복이면 DUPLICATE_NAME */
export async function saveMenu(input: MenuInput): Promise<string> {
  await wait(400);
  const parent = findNode(MENU_ROOT, input.parentId);
  if (!parent) throw new Error('상위메뉴 없음');
  const name = input.name.trim();
  if (parent.children?.some((c) => c.id !== input.id && c.name === name)) {
    throw new MenuError('DUPLICATE_NAME');
  }

  const siblings = (parent.children ??= []);
  const sortOrder = input.sortOrder.trim()
    ? Number(input.sortOrder)
    : Math.max(0, ...siblings.map((c) => c.sortOrder)) + 1;
  const fields = {
    name,
    description: parent.level + 1 === 3 ? input.description.trim() : '',
    type: input.type,
    progLink: input.type === 'GROUP' ? '' : input.progLink.trim(),
    sortOrder,
    use: input.use,
  };

  let node = input.id ? findNode(MENU_ROOT, input.id) : undefined;
  if (node) {
    // 상위메뉴가 바뀌면 옮긴다 (하위는 같이)
    if (node.parentId !== parent.id) {
      const before = findNode(MENU_ROOT, node.parentId!);
      before!.children = before!.children!.filter((c) => c.id !== node!.id);
      siblings.push(node);
    }
    Object.assign(node, fields, { parentId: parent.id });
    const relevel = (n: MenuNode, level: number) => {
      n.level = level;
      n.children?.forEach((c) => relevel(c, level + 1));
    };
    relevel(node, parent.level + 1);
  } else {
    node = { id: `M${nextSeq++}`, level: parent.level + 1, parentId: parent.id, ...fields };
    siblings.push(node);
  }
  sortChildren(parent);
  return node.id;
}

/** 삭제. 하위 메뉴가 있으면 HAS_CHILDREN, 사용 이력이 있으면 IN_USE */
export async function deleteMenu(id: string): Promise<void> {
  await wait(300);
  const node = findNode(MENU_ROOT, id);
  if (!node || !node.parentId) throw new Error('메뉴 없음');
  if (node.children?.length) throw new MenuError('HAS_CHILDREN');
  if (USED_MENU_IDS.has(id)) throw new MenuError('IN_USE');
  const parent = findNode(MENU_ROOT, node.parentId)!;
  parent.children = parent.children!.filter((c) => c.id !== id);
}
