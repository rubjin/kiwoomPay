/** 권한 템플릿 (계정에 지정하면 권한을 복사 — 이후 템플릿 수정은 기존 계정에 반영 안 됨) */
export interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  use: boolean;
  /** 이 템플릿이 지정된 계정 수 (권한 항목 수와 별도) */
  linkedAccounts: number;
  /** 1~3Depth 메뉴 접근권한 — 메뉴ID */
  menuIds: string[];
  /** 4Depth 탭 · 버튼 · 업무 일반 기능권한 — 기능코드 (특수권한은 템플릿에서 부여하지 않음) */
  functionCodes: string[];
}

export interface TemplateSearchParams {
  name: string;
  /** 사용 · 미사용 — 둘 다면 전체 */
  uses: ('Y' | 'N')[];
}

/** 템플릿 입력값. id가 null이면 신규(추가) */
export interface TemplateInput {
  id: string | null;
  name: string;
  description: string;
  use: boolean;
  menuIds: string[];
  functionCodes: string[];
}

export type TemplateErrorCode = 'DUPLICATE_NAME' | 'IN_USE';

export class TemplateError extends Error {
  constructor(readonly code: TemplateErrorCode) {
    super(code);
  }
}

/** 변경유형 (공통코드 TEMPLATE_CHANGE_TYPE) */
export type TemplateChangeType = 'CREATE' | 'INFO' | 'USE' | 'PERMISSION';

/** 템플릿 변경 이력 한 줄 (조회 전용 — 수정 · 삭제 없음) */
export interface TemplateHistoryItem {
  id: string;
  /** YYYY-MM-DD HH:mm */
  changedAt: string;
  changedBy: string;
  type: TemplateChangeType;
  /** 변경항목 (예: 템플릿 설명 · 통합 거래 내역 / 엑셀) */
  item: string;
  before: string;
  after: string;
}

export interface TemplateHistoryParams {
  /** 변경일시 기간 (YYYY-MM-DD) */
  period: { start: string; end: string };
  /** 변경유형 — 'all'이면 전체 */
  type: string;
}
