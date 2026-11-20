import type { PermissionOverview } from '@/features/mypage/permission.types';
import { wait } from '@/mocks/utils';
import { PERMISSION_OVERVIEW } from '@/mocks/mypage/permission.mock';

// TODO(API) 권한 현황 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터

export async function fetchPermissionOverview(): Promise<PermissionOverview> {
  await wait(200);
  return PERMISSION_OVERVIEW;
}
