import type { SearchRequest, SearchResultPage } from '@kiwoompay/design-system';
import type {
  AccountStatusHistory,
  AccountStatusSummary,
  LoginHistory,
  LoginHistoryParams,
} from '@/features/mypage/accountHistory.types';
import { paginate, wait } from '@/mocks/utils';
import { LOGIN_HISTORY, STATUS_HISTORY } from '@/mocks/mypage/accountHistory.mock';

// TODO(API) 로그인 이력 · 계정 상태 이력 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터

export async function fetchLoginHistory({
  params,
  page,
  pageSize,
}: SearchRequest<LoginHistoryParams>): Promise<SearchResultPage<LoginHistory>> {
  await wait(300);
  const { start, end } = params.period;
  const rows = LOGIN_HISTORY.filter(
    (r) =>
      (params.result === 'all' || r.result === params.result) &&
      (!start || r.loggedAt.slice(0, 10) >= start) &&
      (!end || r.loggedAt.slice(0, 10) <= end),
  );
  return paginate(rows, { page, pageSize });
}

export async function fetchAccountStatusSummary(): Promise<AccountStatusSummary> {
  await wait(200);
  const latest = STATUS_HISTORY[0] as AccountStatusHistory;
  return { status: latest.after, changedAt: latest.changedAt, reason: '관리자 잠금 해제' };
}

export async function fetchAccountStatusHistory({
  page,
  pageSize,
}: SearchRequest<Record<string, never>>): Promise<SearchResultPage<AccountStatusHistory>> {
  await wait(300);
  return paginate(STATUS_HISTORY, { page, pageSize });
}
