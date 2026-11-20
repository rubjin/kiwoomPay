/** 기능유형 (공통코드 FUNCTION_TYPE): 탭 · 버튼·기능 */
export type FunctionType = 'TAB' | 'BUTTON';

/** 권한구분 (공통코드 PERMISSION_KIND): 일반 · 특수 */
export type PermissionKind = 'NORMAL' | 'SPECIAL';

/** 특수권한 적용 방식 (공통코드 SPECIAL_APPLY): 버튼 노출 · 옵션 노출 · 실행 시 검증 */
export type SpecialApply = 'BUTTON' | 'OPTION' | 'EXECUTE';

/** 3Depth 메뉴의 기능 (4Depth 탭 · 버튼 · 업무 기능) */
export interface FunctionItem {
  /** 기능코드 (F1001 …). 등록 시 서버가 만든다 */
  code: string;
  menuId: string;
  name: string;
  type: FunctionType;
  /** 소속 탭 기능코드 — 버튼·기능만 */
  tabCode: string | null;
  kind: PermissionKind;
  /** 기능 식별키 (MENU_DELETE …) — 같은 메뉴 안 중복 불가 */
  key: string;
  /** 특수권한 코드 · 적용 방식 — 특수만 */
  specialCode: string | null;
  specialApply: SpecialApply | null;
  sortOrder: number;
  use: boolean;
}

/** 기능 목록 검색 조건 — 같은 그룹 여러 개는 OR, 그룹끼리는 AND */
export interface FunctionSearchParams {
  code: string;
  name: string;
  types: FunctionType[];
  kinds: PermissionKind[];
  /** 사용 · 미사용 */
  uses: ('Y' | 'N')[];
}

/** 기능 정보 입력값. code가 null이면 신규(기능 추가) */
export interface FunctionInput {
  code: string | null;
  menuId: string;
  name: string;
  type: FunctionType;
  tabCode: string;
  kind: PermissionKind;
  key: string;
  specialCode: string;
  specialApply: string;
  /** 입력 그대로 (빈 값이면 마지막 순서) */
  sortOrder: string;
  use: boolean;
}

export type FunctionErrorCode = 'DUPLICATE_KEY' | 'IN_USE';

/** 저장 · 삭제 서버 검증 실패 */
export class FunctionError extends Error {
  constructor(readonly code: FunctionErrorCode) {
    super(code);
  }
}
