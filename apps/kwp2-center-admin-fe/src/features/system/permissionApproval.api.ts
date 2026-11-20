import type { SearchRequest, SearchResultPage } from '@kiwoompay/design-system';
import { paginate, wait, maskId, maskAccount } from '@/mocks/utils';
import type {
  GeneralRequestDetail,
  RequestedPermission,
  GeneralPermissionRequest,
  GeneralRequestSearchParams,
} from './permissionApproval.types';
import { GeneralRequestRow, GENERAL_REQUESTS } from '@/mocks/system/permissionApproval.mock';

// TODO(API) 권한 신청 승인 API가 정해지면 axios 호출로 바꾼다.
// 지금은 화면 확인용 예시 데이터 (임의 작업: 신청 · 부서 · 처리자 — 화면설계서 예시 28건 중 10건 + 반복). 메모리에만 저장한다

/** 일반 메뉴 · 기능 권한 신청 목록 (신청일시 최신순) */
export async function fetchGeneralRequests({
  params,
  page,
  pageSize,
}: SearchRequest<GeneralRequestSearchParams>): Promise<SearchResultPage<GeneralPermissionRequest>> {
  await wait(300);
  const applicant = params.applicant.trim().toLowerCase();
  const requestNo = params.requestNo.trim();
  const { start, end } = params.period;
  const list = GENERAL_REQUESTS.filter(
    (r) =>
      (!applicant || r.rawId.toLowerCase().includes(applicant) || r.rawName.includes(applicant)) &&
      (params.status === 'all' || r.status === params.status) &&
      (params.type === 'all' || r.type === params.type) &&
      (!requestNo || r.no.includes(requestNo)) &&
      (!start || r.requestedAt.slice(0, 10) >= start) &&
      (!end || r.requestedAt.slice(0, 10) <= end) &&
      (params.department === 'all' || r.department === params.department),
  )
    .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))
    .map(({ rawId: _id, rawName: _name, opinion: _opinion, ...r }) => r);
  return paginate(list, { page, pageSize });
}

/** 신청 항목 요약(예: 정산내역 > 통합 정산 내역 외 2건)으로 신청 권한 줄을 만든다 — 예시 데이터용 */
function permissionsOf(r: GeneralRequestRow): RequestedPermission[] {
  const [, base = r.items, extra = '0'] = r.items.match(/^(.*?)(?: 외 (\d+)건)?$/) ?? [];
  const first: RequestedPermission[] =
    r.type === 'MENU'
      ? [{ menuPath: base, kind: '메뉴', permission: '메뉴 접근' }]
      : r.type === 'FUNCTION'
        ? [{ menuPath: base, kind: '기능', permission: '엑셀 다운로드' }]
        : [
            { menuPath: base, kind: '메뉴', permission: '메뉴 접근' },
            { menuPath: base, kind: '기능', permission: '엑셀 다운로드' },
          ];
  const more = Array.from({ length: Number(extra) - (first.length - 1) }, (_, i) => ({
    menuPath: `${base.split(' > ')[0]} > 정산스케줄${i ? ` ${i + 1}` : ''}`,
    kind: '메뉴' as const,
    permission: '메뉴 접근',
  }));
  return [...first, ...more.filter(() => Number(extra) > 0)];
}

/** 신청 처리 팝업 상세 */
export async function fetchGeneralRequestDetail(no: string): Promise<GeneralRequestDetail> {
  await wait(200);
  const r = GENERAL_REQUESTS.find((x) => x.no === no);
  if (!r) throw new Error(`신청 없음: ${no}`);
  const { rawId, rawName: _name, opinion, ...rest } = r;
  return { ...rest, accountId: maskAccount(rawId), permissions: permissionsOf(r), opinion };
}

/** 처리 — 승인대기만. 승인은 대상 계정에 개별 추가 권한으로 반영(템플릿은 그대로), 반려는 사유 필수 · 권한 반영 없음 */
async function process(no: string, status: 'APPROVED' | 'REJECTED', opinion: string) {
  await wait(400);
  const r = GENERAL_REQUESTS.find((x) => x.no === no);
  if (!r || r.status !== 'PENDING') throw new Error('이미 처리된 신청');
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  Object.assign(r, {
    status,
    processor: maskId('admin01'), // TODO(API) 처리자 = 로그인 사용자
    processedAt: `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`,
    opinion: opinion.trim() || null,
  });
}

export const approveGeneralRequest = (no: string, opinion: string) =>
  process(no, 'APPROVED', opinion);
export const rejectGeneralRequest = (no: string, opinion: string) =>
  process(no, 'REJECTED', opinion);
