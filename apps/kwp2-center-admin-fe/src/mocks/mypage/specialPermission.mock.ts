// 예시 데이터: 특수권한 선택지 4종
// mypage/specialPermission.api.ts가 쓴다. TODO(API) 실제 API로 바꾸면 이 파일을 지운다
import type { SpecialPermissionOption } from '@/features/mypage/specialPermission.types';

export const SPECIAL_PERMISSION_OPTIONS: SpecialPermissionOption[] = [
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
  // (임의 작업) 상태 Badge 4종을 모두 보이게 넣은 예시 — 시안은 사용 중 · 미보유 2줄
  {
    id: 'BULK_INQUIRY',
    name: '개인정보 다운로드',
    description: '개인정보가 포함된 파일을 다운로드할 수 있는 권한',
    state: 'PENDING',
    period: null,
  },
  {
    id: 'CARD_NO_FULL',
    name: '개인정보 다운로드',
    description: '개인정보가 포함된 파일을 다운로드할 수 있는 권한',
    state: 'EXPIRED',
    period: '2026-06-01 ~ 2026-08-31',
  },
];
