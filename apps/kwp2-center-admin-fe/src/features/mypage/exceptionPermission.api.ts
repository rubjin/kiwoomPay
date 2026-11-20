import type { SearchRequest, SearchResultPage } from '@kiwoompay/design-system';
import type {
  ExceptionFilter,
  ExceptionPermission,
  ExceptionPermissionOverview,
} from '@/features/mypage/exceptionPermission.types';
import { paginate, wait } from '@/mocks/utils';
import { EXCEPTION_PERMISSIONS } from '@/mocks/mypage/exceptionPermission.mock';

// TODO(API) 개별 예외 권한 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터 (Figma 13건)

const sum = (key: 'addedActions' | 'excludedActions') =>
  EXCEPTION_PERMISSIONS.reduce((n, r) => n + r[key].length, 0);

export async function fetchExceptionOverview(): Promise<ExceptionPermissionOverview> {
  await wait(200);
  return {
    templateName: '운영관리 기본형',
    addedCount: sum('addedActions'),
    excludedCount: sum('excludedActions'),
  };
}

export async function fetchExceptionPermissions({
  params,
  page,
  pageSize,
}: SearchRequest<{ filter: ExceptionFilter }>): Promise<SearchResultPage<ExceptionPermission>> {
  await wait(300);
  const rows = EXCEPTION_PERMISSIONS.filter(
    (r) =>
      params.filter === 'all' ||
      (params.filter === 'added' ? r.addedActions.length > 0 : r.excludedActions.length > 0),
  );
  return paginate(rows, { page, pageSize });
}
