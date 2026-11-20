/** 일반 권한유형 (공통코드 GENERAL_PERMISSION_TYPE): 메뉴 · 기능 · 메뉴·기능 */
export type GeneralPermissionType = 'MENU' | 'FUNCTION' | 'BOTH';

/** 처리상태 (공통코드 PERMISSION_REQUEST_STATUS) */
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

/**
 * 일반 메뉴 · 기능 권한 신청 (마이페이지 > 권한관리에서 접수). 특수권한 · 조회 CPID 범위 신청은 제외.
 * 개인정보(신청자 · 처리자)는 서버가 마스킹해서 준다
 */
export interface GeneralPermissionRequest {
  /** 신청번호 */
  no: string;
  /** 신청자 (마스킹, 예: 김*성) */
  applicant: string;
  department: string;
  type: GeneralPermissionType;
  /** 신청 항목 요약 (예: 정산내역 > 통합 정산 내역 외 2건) */
  items: string;
  reason: string;
  /** YYYY-MM-DD HH:mm */
  requestedAt: string;
  status: RequestStatus;
  /** 처리자 (마스킹) · 처리일시 — 승인대기면 없음 */
  processor: string | null;
  processedAt: string | null;
}

export interface GeneralRequestSearchParams {
  /** 계정 ID 또는 이름 (부분일치, 원문으로 비교) */
  applicant: string;
  status: string;
  type: string;
  requestNo: string;
  period: { start: string; end: string };
  department: string;
}

/** 신청 권한 한 줄 (신청번호 단위 전체 승인 · 반려 — 개별 선택 없음) */
export interface RequestedPermission {
  /** 메뉴 경로 (예: 정산내역 > 통합 정산 내역) */
  menuPath: string;
  /** 구분: 메뉴 · 기능 */
  kind: '메뉴' | '기능';
  /** 신청 권한 (예: 메뉴 접근 · 엑셀 다운로드) */
  permission: string;
}

/** 신청 처리 팝업 상세 */
export interface GeneralRequestDetail extends GeneralPermissionRequest {
  /** 신청자 계정 ID (마스킹, 예: kw*****01) */
  accountId: string;
  permissions: RequestedPermission[];
  /** 처리 의견 / 반려 사유 (처리 완료만) */
  opinion: string | null;
}
