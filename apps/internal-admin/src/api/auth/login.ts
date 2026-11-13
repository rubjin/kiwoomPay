import { LoginError, type LoginChallenge } from '@/types/auth/login';

// TODO(API) 로그인 · SMS 인증 API가 정해지면 axios 호출로 바꾼다.
// 지금은 화면 확인용 예시 (임의 작업): 비밀번호 password · 인증번호 123456 · 잠긴 아이디 locked · 휴대전화번호 없는 아이디 nophone
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
let passwordFails = 0;
let codeFails = 0;

/** 1단계: 아이디 · 비밀번호 확인 → SMS 인증번호 발송 */
export async function requestLogin(id: string, password: string): Promise<LoginChallenge> {
  await wait(500);
  if (id === 'locked') throw new LoginError('LOCKED');
  if (password !== 'password') throw new LoginError('MISMATCH', ++passwordFails);
  passwordFails = 0;
  codeFails = 0;
  if (id === 'nophone') return { challengeId: 'challenge-1', maskedPhone: null, expiresIn: 0 };
  return { challengeId: 'challenge-1', maskedPhone: '010-****-5678', expiresIn: 180 };
}

/** 인증번호 재발송 → 새 유효 시간 */
export async function resendSmsCode(challengeId: string): Promise<{ expiresIn: number }> {
  void challengeId;
  await wait(400);
  return { expiresIn: 180 };
}

/** 2단계: 인증번호 확인 → 토큰 */
export async function verifySmsCode(
  challengeId: string,
  code: string,
): Promise<{ accessToken: string }> {
  void challengeId;
  await wait(500);
  if (code !== '123456') throw new LoginError('CODE_MISMATCH', ++codeFails);
  return { accessToken: 'example-token' };
}
