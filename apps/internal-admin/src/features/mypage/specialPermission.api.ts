import type {
  SpecialPermissionOption,
  SpecialPermissionRequest,
} from '@/features/mypage/specialPermission.types';
import { wait } from '@/api/mock';

// TODO(API) 특수권한 목록 · 신청 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터
const OPTIONS: SpecialPermissionOption[] = [
  {
    id: 'MASKING_OFF',
    name: '마스킹 해제',
    description: '개인정보 마스킹 값을 실제 값으로 조회할 수 있는 권한',
    state: 'IN_USE',
    period: '2026-09-01 ~ 2026-09-30',
  },
  {
    id: 'PERSONAL_DOWNLOAD',
    name: '개인정보 다운로드',
    description: '개인정보가 포함된 파일을 다운로드할 수 있는 권한',
    state: 'NONE',
    period: null,
  },
];

export async function fetchSpecialPermissionOptions(): Promise<SpecialPermissionOption[]> {
  await wait(200);
  return OPTIONS;
}

export async function requestSpecialPermission(request: SpecialPermissionRequest): Promise<void> {
  await wait(500);
  void request;
}
