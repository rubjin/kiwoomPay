import type { DateRange } from '@kiwoompay/design-system';

/** 마이페이지 권한 신청 현황 팝업 — 조회 조건 ('all'은 전체) */
export interface PermissionRequestParams {
  /** 신청기간 */
  period: DateRange;
  /** 구분 (공통코드 PERMISSION_REQUEST_TYPE) */
  type: string;
  /** 상태 (PERMISSION_REQUEST_STATUS) */
  status: string;
}

export type PermissionRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

/** 권한 신청 이력 1행 */
export interface PermissionRequest {
  id: string;
  requestedAt: string;
  /** 구분 코드 */
  type: string;
  /** 신청 권한 (메뉴 경로 · 권한명 · 범위 변경) */
  permission: string;
  status: PermissionRequestStatus;
  /** 처리 전은 null */
  processor: string | null;
  processedAt: string | null;
  /** 비고 (반려 사유 등) */
  note: string | null;
}
