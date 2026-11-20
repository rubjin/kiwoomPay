/** 다우오피스 결재 상태 (공통코드 APPROVAL_STATUS) — 다우오피스 회신 기준, KWP에서 승인 · 반려하지 않음 */
export type ApprovalStatus = 'WAITING' | 'APPROVED' | 'REJECTED';

/** 특수권한 부여 상태 (공통코드 GRANT_STATUS) — 결재 상태와 별개 */
export type GrantStatus = 'PENDING' | 'SCHEDULED' | 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'NONE';

/** 특수권한 신청 · 결재 한 줄 (마이페이지 신청 → 다우오피스 결재 → 시스템관리자 최종 부여) */
export interface SpecialApproval {
  /** 신청번호 */
  no: string;
  /** 신청자 (마스킹) */
  applicant: string;
  specialCode: string;
  specialName: string;
  /** YYYY-MM-DD HH:mm */
  requestedAt: string;
  /** 신청 희망 기간 (YYYY-MM-DD) */
  wishPeriod: { start: string; end: string };
  approvalStatus: ApprovalStatus;
  approvedAt: string | null;
  /** 다우오피스 결재번호 */
  approvalNo: string | null;
  /** 결재 승인자 */
  approver: string | null;
  grantStatus: GrantStatus;
  /** 최종 부여 기간 — 부여 처리 후 */
  grantPeriod: { start: string; end: string } | null;
  /** 부여 처리자 (마스킹) */
  grantedBy: string | null;
  reason: string;
}

export interface SpecialApprovalSearchParams {
  /** 계정 ID 또는 이름 (부분일치) */
  applicant: string;
  specialCode: string;
  approvalStatus: string;
  grantStatus: string;
  period: { start: string; end: string };
  requestNo: string;
  approvalNo: string;
}

/** 조회 요약 (검색 조건 기준 건수) */
export interface SpecialApprovalSummary {
  waiting: number;
  grantPending: number;
  active: number;
}

/** 특수권한 부여 처리 팝업 상세 */
export interface SpecialApprovalDetail extends SpecialApproval {
  /** 신청자 계정 ID (마스킹, 예: kw*****01) */
  accountId: string;
}

export type GrantErrorCode = 'NOT_GRANTABLE' | 'OUT_OF_RANGE' | 'OVERLAP';

/** 부여 처리 서버 검증 실패 */
export class GrantError extends Error {
  constructor(readonly code: GrantErrorCode) {
    super(code);
  }
}
