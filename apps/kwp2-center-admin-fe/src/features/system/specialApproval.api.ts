import type { SearchRequest, SearchResultPage } from '@kiwoompay/design-system';
import { paginate, wait, maskId, pad, maskAccount } from '@/mocks/utils';
import {
  GrantError,
  type SpecialApprovalDetail,
  type SpecialApproval,
  type SpecialApprovalSearchParams,
  type SpecialApprovalSummary,
} from './specialApproval.types';
import { SPECIAL_APPROVALS } from '@/mocks/system/specialApproval.mock';

// TODO(API) 특수권한 결재 현황 API(다우오피스 결재 회신 포함)가 정해지면 axios 호출로 바꾼다.
// 지금은 화면 확인용 예시 데이터 (임의 작업: 화면설계서 예시 10건을 반복해 32건, 날짜는 오늘 기준으로 옮김). 메모리에만 저장한다

/** 특수권한 신청 · 결재 목록 (신청일시 최신순) + 조회 요약(검색 조건 기준 건수) */
export async function fetchSpecialApprovals({
  params,
  page,
  pageSize,
}: SearchRequest<SpecialApprovalSearchParams>): Promise<
  SearchResultPage<SpecialApproval, SpecialApprovalSummary>
> {
  await wait(300);
  const applicant = params.applicant.trim().toLowerCase();
  const { start, end } = params.period;
  const list = SPECIAL_APPROVALS.filter(
    (r) =>
      (!applicant || r.rawId.toLowerCase().includes(applicant) || r.rawName.includes(applicant)) &&
      (params.specialCode === 'all' || r.specialCode === params.specialCode) &&
      (params.approvalStatus === 'all' || r.approvalStatus === params.approvalStatus) &&
      (params.grantStatus === 'all' || r.grantStatus === params.grantStatus) &&
      (!start || r.requestedAt.slice(0, 10) >= start) &&
      (!end || r.requestedAt.slice(0, 10) <= end) &&
      (!params.requestNo.trim() || r.no.includes(params.requestNo.trim())) &&
      (!params.approvalNo.trim() ||
        (r.approvalNo ?? '').toLowerCase().includes(params.approvalNo.trim().toLowerCase())),
  )
    .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))
    .map(({ rawId: _id, rawName: _name, ...r }) => r);
  return {
    ...paginate(list, { page, pageSize }),
    summary: {
      waiting: list.filter((r) => r.approvalStatus === 'WAITING').length,
      grantPending: list.filter((r) => r.grantStatus === 'PENDING').length,
      active: list.filter((r) => r.grantStatus === 'ACTIVE').length,
    },
  };
}

/** 특수권한 부여 처리 팝업 상세 */
export async function fetchSpecialApprovalDetail(no: string): Promise<SpecialApprovalDetail> {
  await wait(200);
  const r = SPECIAL_APPROVALS.find((x) => x.no === no);
  if (!r) throw new Error(`신청 없음: ${no}`);
  const { rawId, rawName: _name, ...rest } = r;
  return { ...rest, accountId: maskAccount(rawId) };
}

/**
 * 최종 권한 부여 — 결재 승인완료 + 부여 대기만. 신청 · 결재 범위(신청 희망 기간) 안, 같은 계정 · 특수권한 기간 중복 불가.
 * 시작일이 오늘 이전이면 사용 중, 미래면 사용 예정. 만료 이후 사용은 자동 차단(서버)
 */
export async function grantSpecialPermission(
  no: string,
  period: { start: string; end: string },
): Promise<void> {
  await wait(400);
  const r = SPECIAL_APPROVALS.find((x) => x.no === no);
  if (!r || r.approvalStatus !== 'APPROVED' || r.grantStatus !== 'PENDING') {
    throw new GrantError('NOT_GRANTABLE');
  }
  if (period.start < r.wishPeriod.start || period.end > r.wishPeriod.end) {
    throw new GrantError('OUT_OF_RANGE');
  }
  const overlap = SPECIAL_APPROVALS.some(
    (x) =>
      x !== r &&
      x.rawId === r.rawId &&
      x.specialCode === r.specialCode &&
      (x.grantStatus === 'ACTIVE' || x.grantStatus === 'SCHEDULED') &&
      x.grantPeriod &&
      x.grantPeriod.start <= period.end &&
      x.grantPeriod.end >= period.start,
  );
  if (overlap) throw new GrantError('OVERLAP');
  const now = new Date();
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  Object.assign(r, {
    grantStatus: period.start <= today ? 'ACTIVE' : 'SCHEDULED',
    grantPeriod: { ...period },
    grantedBy: maskId('admin01'), // TODO(API) 처리자 = 로그인 사용자
  });
}
