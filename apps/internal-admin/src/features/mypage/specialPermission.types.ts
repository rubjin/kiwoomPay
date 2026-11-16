/** 특수권한의 내 현재 상태 — 사용 중 · 승인대기면 다시 신청할 수 없다 */
export type SpecialPermissionState = 'IN_USE' | 'PENDING' | 'NONE';

/** 특수권한 신청 팝업의 신청 대상 1행 */
export interface SpecialPermissionOption {
  id: string;
  name: string;
  description: string;
  state: SpecialPermissionState;
  /** 유효기간 (사용 중일 때). 없으면 null */
  period: string | null;
}

/** 특수권한 신청 내용 */
export interface SpecialPermissionRequest {
  permissionId: string;
  start: string;
  end: string;
  reason: string;
}
