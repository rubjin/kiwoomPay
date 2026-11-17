import type { SearchRequest, SearchResultPage } from '@kiwoompay/design-system';
import type {
  AccountStatusHistory,
  AccountStatusSummary,
  LoginHistory,
  LoginHistoryParams,
  LoginResult,
  LoginState,
} from '@/features/mypage/accountHistory.types';
import { paginate, wait } from '@/api/mock';
import { toYmd } from '@/utils/period';

// TODO(API) 로그인 이력 · 계정 상태 이력 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터

const pad = (n: number) => String(n).padStart(2, '0');
const toYmdHms = (d: Date) =>
  `${toYmd(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const HOUR = 60 * 60 * 1000;

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
const LOGIN_SAMPLE: LoginHistory[] = Array.from({ length: 120 }, (_, i) => {
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

export async function fetchLoginHistory({
  params,
  page,
  pageSize,
}: SearchRequest<LoginHistoryParams>): Promise<SearchResultPage<LoginHistory>> {
  await wait(300);
  const { start, end } = params.period;
  const rows = LOGIN_SAMPLE.filter(
    (r) =>
      (params.result === 'all' || r.result === params.result) &&
      (!start || r.loggedAt.slice(0, 10) >= start) &&
      (!end || r.loggedAt.slice(0, 10) <= end),
  );
  return paginate(rows, { page, pageSize });
}

// ── 계정 상태 이력 ───────────────────────────────────
const STATUS_SAMPLE: AccountStatusHistory[] = [
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

export async function fetchAccountStatusSummary(): Promise<AccountStatusSummary> {
  await wait(200);
  const latest = STATUS_SAMPLE[0] as AccountStatusHistory;
  return { status: latest.after, changedAt: latest.changedAt, reason: '관리자 잠금 해제' };
}

export async function fetchAccountStatusHistory({
  page,
  pageSize,
}: SearchRequest<Record<string, never>>): Promise<SearchResultPage<AccountStatusHistory>> {
  await wait(300);
  return paginate(STATUS_SAMPLE, { page, pageSize });
}
