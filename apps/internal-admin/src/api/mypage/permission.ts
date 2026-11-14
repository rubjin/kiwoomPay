import type { PermissionOverview } from '@/types/mypage/permission';
import { wait } from '@/api/mock';

// TODO(API) 권한 현황 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터 (시안 권한관리.png)
const SAMPLE: PermissionOverview = {
  template: '운영관리 기본형',
  menuCount: 12,
  cpidScope: '전체 CPID',
  specialInUse: 2,
  specialTotal: 2,
  pendingRequests: 1,
  department: '사업기획팀',
  userType: '내부관리자',
  templateAppliedAt: '2026-07-05',
  specials: [
    {
      name: '마스킹 해제',
      status: { label: '사용중', tone: 'success' },
      period: '2026-10-01 ~ 2026-11-30',
    },
    {
      name: '개인정보 다운로드',
      status: { label: '사용중', tone: 'success' },
      period: '2026-10-01 ~ 2026-11-30',
    },
  ],
};

export async function fetchPermissionOverview(): Promise<PermissionOverview> {
  await wait(200);
  return SAMPLE;
}
