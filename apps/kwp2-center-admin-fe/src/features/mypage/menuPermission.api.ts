import type { TreeOptionNode } from '@kiwoompay/design-system';
import { wait } from '@/mocks/utils';
import { MENU_PERMISSION_TREE } from '@/mocks/mypage/menuPermission.mock';

// TODO(API) 메뉴 권한 트리 · 신청 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터 (Figma 메뉴 권한 신청)

/** 신청할 수 있는 메뉴 권한 트리 — 승인대기 권한은 pending */
export interface MenuPermissionNode extends Omit<TreeOptionNode, 'options' | 'children'> {
  children?: MenuPermissionNode[];
  options?: { value: string; label: string; pending?: boolean }[];
}

export async function fetchMenuPermissionTree(): Promise<MenuPermissionNode[]> {
  await wait(200);
  return MENU_PERMISSION_TREE;
}

export async function requestMenuPermissions(request: {
  items: Record<string, string[]>;
  reason: string;
}): Promise<void> {
  await wait(500);
  void request;
}
