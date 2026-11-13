/** 로그인 1단계 결과: SMS 인증으로 넘어갈 때 필요한 값 */
export interface LoginChallenge {
  /** 2차 인증 요청 ID (인증번호 확인 · 재발송에 쓴다) */
  challengeId: string;
  /** 마스킹된 등록 휴대전화번호 (예: 010-****-5678) */
  maskedPhone: string;
  /** 인증번호 유효 시간(초) */
  expiresIn: number;
}

/** 로그인 실패 사유 */
export type LoginErrorCode = 'MISMATCH' | 'LOCKED' | 'CODE_MISMATCH' | 'CODE_EXPIRED';

export class LoginError extends Error {
  constructor(
    readonly code: LoginErrorCode,
    /** 연속 실패 횟수 (5회면 잠김) */
    readonly failCount = 0,
  ) {
    super(code);
  }
}
