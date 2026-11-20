/** 시스템(최상위) — 내부관리자. 메뉴 코드가 아니라 고칠 수 없다 */
export const SYSTEM_MENU_ID = 'M';

/** 메뉴유형 (공통코드 MENU_TYPE) */
export type MenuType = 'GROUP' | 'PAGE' | 'TAB';

/** 메뉴 트리 줄. level 0 = 시스템(최상위, 메뉴 코드 아님) · 1~3 = Depth */
export interface MenuNode {
  /** 메뉴ID (M1000 …). 등록 시 서버가 만든다 */
  id: string;
  name: string;
  level: number;
  parentId: string | null;
  type: MenuType;
  /** 페이지 설명 — 3Depth만. 화면 제목 옆 안내문 */
  description: string;
  /** 실제 화면 이동 경로 (업무 · 탭 화면) */
  progLink: string;
  /** 같은 상위메뉴 안 순서 */
  sortOrder: number;
  use: boolean;
  children?: MenuNode[];
}

/** 메뉴 목록 검색 조건 */
export interface MenuSearchParams {
  menuId: string;
  menuName: string;
  /** 사용여부 체크박스 — 둘 다 체크면 전체 */
  use: boolean;
  unused: boolean;
}

/** 메뉴 정보 입력값. id가 null이면 신규(하위 메뉴 추가) */
export interface MenuInput {
  id: string | null;
  parentId: string;
  name: string;
  description: string;
  type: MenuType;
  progLink: string;
  /** 입력 그대로 (빈 값이면 마지막 순서) */
  sortOrder: string;
  use: boolean;
}

export type MenuErrorCode = 'DUPLICATE_NAME' | 'HAS_CHILDREN' | 'IN_USE';

/** 저장 · 삭제 서버 검증 실패 */
export class MenuError extends Error {
  constructor(public code: MenuErrorCode) {
    super(code);
  }
}
