/** 로그인 1단계 결과: SMS 인증으로 넘어갈 때 필요한 값 */
export interface LoginChallenge {
  /** 2차 인증 요청 ID (인증번호 확인 · 재발송에 쓴다) */
  challengeId: string;
  /** 마스킹된 등록 휴대전화번호 (예: 010-****-5678). 없으면 null → SMS 인증 불가 안내 */
  maskedPhone: string | null;
  /** 인증번호 유효 시간(초) */
  expiresIn: number;
  /** 첫 인증번호 발송 실패 → SMS 모달에 발송 오류 안내 (재발송으로 다시 시도) */
  sendFailed?: boolean;
}

/**
 * 로그인 · SMS 인증 실패 사유 (Figma LOGIN STATE & FEEDBACK RULE 28721:69202)
 * - 로그인: MISMATCH 불일치 · LOCK_EXCEEDED 5회 실패로 잠김 · LOCKED 잠금 상태 계정 · UNAVAILABLE 사용 불가 계정 · SYSTEM 시스템 오류
 * - SMS 인증: CODE_MISMATCH 불일치 · CODE_EXPIRED 유효시간 만료 · CODE_LOCK_EXCEEDED 5회 실패로 잠김 · SEND_FAILED 발송 실패 ·
 *   RESEND_WAIT 재발송 대기시간 미경과 · RESEND_LIMIT 재발송 횟수 초과 · SESSION_EXPIRED 로그인 인증 세션 만료
 * - LoginError가 아닌 오류는 서버/통신 오류(공통)로 본다
 */
export type LoginErrorCode =
  | 'MISMATCH'
  | 'LOCK_EXCEEDED'
  | 'LOCKED'
  | 'UNAVAILABLE'
  | 'SYSTEM'
  | 'CODE_MISMATCH'
  | 'CODE_EXPIRED'
  | 'CODE_LOCK_EXCEEDED'
  | 'SEND_FAILED'
  | 'RESEND_WAIT'
  | 'RESEND_LIMIT'
  | 'SESSION_EXPIRED';

export class LoginError extends Error {
  constructor(
    readonly code: LoginErrorCode,
    /** RESEND_WAIT: 다시 요청할 수 있을 때까지 남은 초 */
    readonly retryAfter = 0,
  ) {
    super(code);
  }
}
