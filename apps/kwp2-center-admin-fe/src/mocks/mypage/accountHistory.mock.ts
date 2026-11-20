// 예시 데이터: 로그인 이력 120건 · 계정 상태 이력 6건
// mypage/accountHistory.api.ts가 쓴다. TODO(API) 실제 API로 바꾸면 이 파일을 지운다
import type {
  AccountStatusHistory,
  LoginHistory,
  LoginResult,
  LoginState,
} from '@/features/mypage/accountHistory.types';
import { toYmdHms, HOUR } from '@/mocks/utils';

// ── 로그인 이력 ──────────────────────────────────────
type LoginRow = [LoginResult, LoginState, string | null];

const LOGIN_PATTERN: LoginRow[] = [
  ['SUCCESS', 'NORMAL', null],
  ['FAIL', 'NORMAL', '비밀번호 불일치'],
  ['FAIL', 'NORMAL', '비밀번호 불일치'],
  ['SUCCESS', 'NORMAL', null],
  ['UNLOCK', 'NORMAL', '잠금 해제 (SYSTEM관리자계정)'],
  ['FAIL', 'LOCKED', '인증번호 불일치'],
  ['SUCCESS', 'NORMAL', null],
  ['SUCCESS', 'NORMAL', null],
  ['UNLOCK', 'NORMAL', '잠금 해제 (SYSTEM관리자계정)'],
  ['FAIL', 'LOCKED', '인증번호 불일치'],
];

/** 지금부터 9시간 간격으로 거슬러 올라간 120건 (최근 30일 안 · 최신순) */
export const LOGIN_HISTORY: LoginHistory[] = Array.from({ length: 120 }, (_, i) => {
  const [result, state, reason] = LOGIN_PATTERN[i % LOGIN_PATTERN.length] as LoginRow;
  return {
    id: `LH-${String(i + 1).padStart(4, '0')}`,
    loggedAt: toYmdHms(new Date(Date.now() - i * 9 * HOUR)),
    result,
    ip: '123.456.78.90',
    authMethod: 'ID/PW + SMS',
    state,
    reason,
  };
});

// ── 계정 상태 이력 ───────────────────────────────────
export const STATUS_HISTORY: AccountStatusHistory[] = [
  ['SUSPENDED', 'NORMAL', '관리자 잠금해제', '관리자A'],
  ['NORMAL', 'SUSPENDED', '인증 실패 횟수 초과', 'SYSTEM'],
  ['SUSPENDED', 'NORMAL', '계정 사용 재개', '관리자B'],
  ['NORMAL', 'SUSPENDED', '장기 미사용 계정 처리', 'SYSTEM'],
  ['TEMP', 'NORMAL', '최초 로그인 및 비밀번호 변경', 'SYSTEM'],
  [null, 'TEMP', '계정 생성', '관리자A'],
].map(([before, after, reason, processor], i) => ({
  id: `AS-${i + 1}`,
  // 최신순: 열흘 간격으로 거슬러 올라감
  changedAt: toYmdHms(new Date(Date.now() - (i * 240 + 2) * HOUR)),
  before: before as AccountStatusHistory['before'],
  after: after as AccountStatusHistory['after'],
  reason: reason as string,
  processor: processor as string,
}));
