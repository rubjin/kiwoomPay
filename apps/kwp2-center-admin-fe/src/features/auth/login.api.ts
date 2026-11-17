import { LoginError, type LoginChallenge } from '@/features/auth/login.types';
import { wait } from '@/api/mock';

// TODO(API) 로그인 · SMS 인증 API가 정해지면 axios 호출로 바꾼다.
// 지금은 화면 확인용 예시 (임의 작업) — 상태별 문구 확인용 아이디 · 인증번호:
//   비밀번호 password (5회 연속 틀리면 잠김) · 잠긴 계정 locked · 사용 불가 disabled · 시스템 오류 error · 통신 오류 network
//   휴대전화번호 없음 nophone · 첫 발송 실패 sendfail
//   인증번호 123456 (5회 연속 틀리면 잠김) · 재발송은 30초 대기 · 3회까지
//   로그인 인증 세션은 로그인 후 10분 — 지나서 [완료] · [재발송]을 누르면 세션 만료 (인증번호 3분보다 길다)
const MAX_FAILS = 5;
const RESEND_WAIT = 30;
const RESEND_MAX = 3;
const SESSION_SECONDS = 600;

let passwordFails = 0;
let codeFails = 0;
let resendCount = 0;
let lastSentAt = 0;
let loginAt = 0;
const sessionExpired = () => Date.now() - loginAt > SESSION_SECONDS * 1000;
const lockedIds = new Set(['locked']);

/** 1단계: 아이디 · 비밀번호 확인 → SMS 인증번호 발송 */
export async function requestLogin(id: string, password: string): Promise<LoginChallenge> {
  await wait(500);
  if (id === 'network') throw new Error('network');
  if (id === 'error') throw new LoginError('SYSTEM');
  if (id === 'disabled') throw new LoginError('UNAVAILABLE');
  if (lockedIds.has(id)) throw new LoginError('LOCKED');
  if (password !== 'password') {
    passwordFails += 1;
    if (passwordFails >= MAX_FAILS) {
      passwordFails = 0;
      lockedIds.add(id);
      throw new LoginError('LOCK_EXCEEDED');
    }
    throw new LoginError('MISMATCH');
  }
  passwordFails = 0;
  codeFails = 0;
  resendCount = 0;
  lastSentAt = Date.now();
  loginAt = lastSentAt;
  if (id === 'nophone') return { challengeId: 'challenge-1', maskedPhone: null, expiresIn: 0 };
  return {
    challengeId: `challenge-${id}`,
    maskedPhone: '010-****-5678',
    expiresIn: 180,
    sendFailed: id === 'sendfail',
  };
}

/** 인증번호 재발송 → 새 유효 시간 */
export async function resendSmsCode(challengeId: string): Promise<{ expiresIn: number }> {
  await wait(400);
  if (sessionExpired()) throw new LoginError('SESSION_EXPIRED');
  if (resendCount >= RESEND_MAX) throw new LoginError('RESEND_LIMIT');
  const waited = Math.floor((Date.now() - lastSentAt) / 1000);
  if (waited < RESEND_WAIT) throw new LoginError('RESEND_WAIT', RESEND_WAIT - waited);
  resendCount += 1;
  lastSentAt = Date.now();
  void challengeId;
  return { expiresIn: 180 };
}

/** 2단계: 인증번호 확인 → 토큰 */
export async function verifySmsCode(
  challengeId: string,
  code: string,
): Promise<{ accessToken: string }> {
  void challengeId;
  await wait(500);
  if (sessionExpired()) throw new LoginError('SESSION_EXPIRED');
  if (code !== '123456') {
    codeFails += 1;
    if (codeFails >= MAX_FAILS) {
      codeFails = 0;
      throw new LoginError('CODE_LOCK_EXCEEDED');
    }
    throw new LoginError('CODE_MISMATCH');
  }
  return { accessToken: 'example-token' };
}
