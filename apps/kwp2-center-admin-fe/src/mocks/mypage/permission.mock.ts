// 예시 데이터: 권한 현황 1건
// mypage/permission.api.ts가 쓴다. TODO(API) 실제 API로 바꾸면 이 파일을 지운다
import type { PermissionOverview } from '@/features/mypage/permission.types';

export const PERMISSION_OVERVIEW: PermissionOverview = {
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
