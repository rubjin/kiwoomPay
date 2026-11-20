import type {
  SpecialPermissionOption,
  SpecialPermissionRequest,
} from '@/features/mypage/specialPermission.types';
import { wait } from '@/mocks/utils';
import { SPECIAL_PERMISSION_OPTIONS } from '@/mocks/mypage/specialPermission.mock';

// TODO(API) 특수권한 목록 · 신청 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터

export async function fetchSpecialPermissionOptions(): Promise<SpecialPermissionOption[]> {
  await wait(200);
  return SPECIAL_PERMISSION_OPTIONS;
}

export async function requestSpecialPermission(request: SpecialPermissionRequest): Promise<void> {
  await wait(500);
  void request;
}
