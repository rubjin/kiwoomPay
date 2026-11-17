import { LoginError, type LoginErrorCode } from '@/features/auth/login.types';

/**
 * 로그인 · SMS 인증 상태별 문구 (Figma LOGIN STATE & FEEDBACK RULE 28721:69202).
 * 표시 위치는 화면이 정한다 — 입력 아래 문구 · SMS 모달 안 · Alert (LoginPage · SmsVerifyModal 참고)
 */
export const LOGIN_MESSAGES: Record<LoginErrorCode, string> = {
  // 로그인
  MISMATCH: '아이디 또는 비밀번호가 일치하지 않습니다. 다시 확인해 주세요.', // 비밀번호 Input 하단
  LOCK_EXCEEDED:
    '로그인 실패 횟수를 초과하여 계정이 잠겼습니다.\n잠금 해제는 마스터 관리자에게 요청해 주세요.', // Alert
  LOCKED:
    '잠금 상태인 계정으로 로그인할 수 없습니다.\n잠금 해제는 마스터 관리자에게 요청해 주세요.', // Alert
  UNAVAILABLE: '현재 로그인할 수 없는 계정입니다. 마스터 관리자에게 문의해 주세요.', // Alert
  SYSTEM: '로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', // Alert
  // SMS 인증
  CODE_MISMATCH: '인증번호가 일치하지 않습니다. 다시 확인해 주세요.', // 인증번호 Input 하단
  CODE_EXPIRED: '인증번호가 만료되었습니다. 인증번호를 재발송해 주세요.', // 인증번호 Input 하단
  CODE_LOCK_EXCEEDED:
    '인증 실패 횟수를 초과하여 계정이 잠겼습니다.\n잠금 해제는 마스터 관리자에게 요청해 주세요.', // SMS 모달 닫고 로그인 화면 Alert
  SEND_FAILED: '인증번호 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.', // SMS 모달 안
  RESEND_WAIT: '잠시 후 인증번호를 다시 요청해 주세요.', // 재발송 영역 하단
  RESEND_LIMIT: '인증번호 재발송 가능 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요.', // 재발송 영역 하단
  SESSION_EXPIRED: '로그인 인증 시간이 만료되었습니다.\n다시 로그인해 주세요.', // SMS 모달 위 Alert
};

/** 서버/통신 오류 (공통) — 오류가 난 화면에 Alert, [확인] 후 그 단계 유지 */
export const COMMON_ERROR_MESSAGE = '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';

/** 오류 → 문구. LoginError가 아니면 서버/통신 오류 */
export function loginErrorMessage(error: unknown): string {
  return error instanceof LoginError ? LOGIN_MESSAGES[error.code] : COMMON_ERROR_MESSAGE;
}

/** 오류 코드 (LoginError가 아니면 undefined) */
export const loginErrorCode = (error: unknown): LoginErrorCode | undefined =>
  error instanceof LoginError ? error.code : undefined;

/** 로그인 화면 아래 보안 안내 (Figma KWPC3000) */
export const LOGIN_NOTICES = [
  '아이디 또는 비밀번호를 5회 연속 잘못 입력하면 계정이 잠깁니다.',
  'SMS 인증번호를 5회 연속 잘못 입력해도 계정이 잠깁니다.',
  '계정 잠금 해제는 마스터 관리자에게 요청해 주세요.',
  '로그인 버튼을 누른 후 SMS 인증까지 완료해 주세요.',
  '아이디, 비밀번호 및 인증번호는 타인과 공유하지 마세요.',
];
