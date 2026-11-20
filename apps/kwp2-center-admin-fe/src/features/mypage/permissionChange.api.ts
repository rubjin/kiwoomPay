import type { SearchRequest, SearchResultPage } from '@kiwoompay/design-system';
import type {
  PermissionChange,
  PermissionChangeParams,
} from '@/features/mypage/permissionChange.types';
import { paginate, wait } from '@/mocks/utils';
import { PERMISSION_CHANGES } from '@/mocks/mypage/permissionChange.mock';

// TODO(API) 권한 변경 이력 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터

export async function fetchPermissionChanges({
  params,
  page,
  pageSize,
}: SearchRequest<PermissionChangeParams>): Promise<SearchResultPage<PermissionChange>> {
  await wait(300);
  const { start, end } = params.period;
  const rows = PERMISSION_CHANGES.filter(
    (r) =>
      (params.type === 'all' || r.type === params.type) &&
      (params.kind === 'all' || r.kind === params.kind) &&
      (!start || r.changedAt.slice(0, 10) >= start) &&
      (!end || r.changedAt.slice(0, 10) <= end),
  );
  return paginate(rows, { page, pageSize });
}
