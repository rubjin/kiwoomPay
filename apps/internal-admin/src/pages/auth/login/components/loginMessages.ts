import { LoginError } from '@/types/auth/login';

/** 로그인 실패 안내 문구 (Alert). TODO(정책) 문구 확정 — 임의 작업 */
export function loginErrorMessage(error: unknown): string {
  if (!(error instanceof LoginError))
    return '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
  switch (error.code) {
    case 'LOCKED':
      return '계정이 잠겼습니다. 마스터 관리자에게 잠금 해제를 요청해 주세요.';
    case 'CODE_MISMATCH':
      return `인증번호가 일치하지 않습니다. (${error.failCount}/5)`;
    case 'CODE_EXPIRED':
      return '인증 시간이 만료되었습니다. [재발송]을 눌러 주세요.';
    default:
      return `아이디 또는 비밀번호가 일치하지 않습니다. (${error.failCount}/5)`;
  }
}

/** 로그인 화면 아래 보안 안내 (Figma KWPC3000) */
export const LOGIN_NOTICES = [
  '아이디 또는 비밀번호를 5회 연속 잘못 입력하면 계정이 잠깁니다.',
  'SMS 인증번호를 5회 연속 잘못 입력해도 계정이 잠깁니다.',
  '계정 잠금 해제는 마스터 관리자에게 요청해 주세요.',
  '로그인 버튼을 누른 후 SMS 인증까지 완료해 주세요.',
  '아이디, 비밀번호 및 인증번호는 타인과 공유하지 마세요.',
];
