import type { DateRange } from '@kiwoompay/design-system';

/** 마이페이지 계정관리 · 로그인 이력 팝업 — 조회 조건 ('all'은 전체) */
export interface LoginHistoryParams {
  /** 조회기간 (로그인 일시) */
  period: DateRange;
  /** 로그인 결과 (공통코드 LOGIN_RESULT) */
  result: string;
}

export type LoginResult = 'SUCCESS' | 'FAIL' | 'UNLOCK';
export type LoginState = 'NORMAL' | 'LOCKED';

/** 로그인 이력 1행 */
export interface LoginHistory {
  id: string;
  /** 로그인 일시 (YYYY-MM-DD HH:mm:ss) */
  loggedAt: string;
  result: LoginResult;
  ip: string;
  /** 인증방식 (예: ID/PW + SMS) */
  authMethod: string;
  /** 로그인 뒤 계정 상태 */
  state: LoginState;
  /** 사유 (실패 · 해제). 없으면 null */
  reason: string | null;
}

/** 계정 상태 (공통코드 ACCOUNT_STATUS) */
export type AccountStatus = 'TEMP' | 'NORMAL' | 'SUSPENDED';

/** 계정 상태 변경 이력 1행 */
export interface AccountStatusHistory {
  id: string;
  /** 변경일시 (YYYY-MM-DD HH:mm:ss) */
  changedAt: string;
  /** 변경 전 상태 (계정 생성은 null) */
  before: AccountStatus | null;
  after: AccountStatus;
  reason: string;
  /** 처리자 (관리자 이름 · SYSTEM) */
  processor: string;
}

/** 계정 상태 이력 팝업 위쪽 "현재 계정 상태" */
export interface AccountStatusSummary {
  status: AccountStatus;
  changedAt: string;
  reason: string;
}
