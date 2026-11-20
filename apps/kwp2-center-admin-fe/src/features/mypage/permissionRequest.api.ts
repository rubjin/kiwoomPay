import type { SearchRequest, SearchResultPage } from '@kiwoompay/design-system';
import type {
  PermissionRequest,
  PermissionRequestParams,
} from '@/features/mypage/permissionRequest.types';
import { paginate, wait } from '@/mocks/utils';
import { PERMISSION_REQUESTS } from '@/mocks/mypage/permissionRequest.mock';

// TODO(API) 권한 신청 이력 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터

export async function fetchPermissionRequests({
  params,
  page,
  pageSize,
}: SearchRequest<PermissionRequestParams>): Promise<SearchResultPage<PermissionRequest>> {
  await wait(300);
  const { start, end } = params.period;
  const rows = PERMISSION_REQUESTS.filter(
    (r) =>
      (params.type === 'all' || r.type === params.type) &&
      (params.status === 'all' || r.status === params.status) &&
      (!start || r.requestedAt.slice(0, 10) >= start) &&
      (!end || r.requestedAt.slice(0, 10) <= end),
  );
  return paginate(rows, { page, pageSize });
}
