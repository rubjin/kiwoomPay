// 예시 데이터: 마이페이지 요약 — 기본 · 빈 상태(특수권한 · 알림 없음)
// mypage/mypageHub.api.ts가 쓴다. TODO(API) 실제 API로 바꾸면 이 파일을 지운다
import type { MypageHub } from '@/features/mypage/mypageHub.types';

/** Figma KWPC2000_마이페이지_GUI_최초진입 */
export const MYPAGE_HUB: MypageHub = {
  account: {
    userName: '홍길동',
    loginId: 'kwpay1234',
    department: 'PG운영팀',
    accountStatus: { label: '정상', tone: 'success' },
    loginStatus: { label: '계정잠김', tone: 'error' },
    lastLoginAt: '2026-08-29 15:30',
    passwordChangedAt: '2026-07-05',
    passwordAgeDays: 47,
  },
  permission: {
    menuCount: 12,
    template: '정산운영 기본형',
    dataScope: '전체 CPID',
    specials: [
      { name: '마스킹 해제', until: '2027-03-31' },
      { name: '개인정보 다운로드', until: '2026-12-31' },
    ],
    pendingRequests: 1,
  },
  notification: {
    unread: 12,
    counts: [
      { type: 'SETTLEMENT', label: '정산', count: 4 },
      { type: 'RISK', label: '리스크/FDS', count: 3 },
      { type: 'PAYOUT', label: '지급', count: 2 },
      { type: 'REVIEW', label: '심사/계약', count: 1 },
      { type: 'CS', label: '문의/민원', count: 2 },
    ],
    recent: [
      {
        id: 'n1',
        type: 'SETTLEMENT',
        typeLabel: '정산',
        title: '대사 차액 대상 3건이 발생했습니다.',
        createdAt: '2026-09-07 13:42',
        unread: true,
      },
      {
        id: 'n2',
        type: 'RISK',
        typeLabel: '리스크/FDS',
        title: 'ABC상점이 고위험 가맹점으로 판정되었습니다.',
        createdAt: '2026-09-05 13:42',
        unread: true,
      },
      {
        id: 'n3',
        type: 'RISK',
        typeLabel: '리스크/FDS',
        title: '신규 가맹점 심사 6건이 배정되었습니다.',
        createdAt: '2026-09-04 13:42',
        unread: true,
      },
      {
        id: 'n4',
        type: 'PAYOUT',
        typeLabel: '지급',
        title: 'CPID KWP12345 지급이 실패했습니다.',
        createdAt: '2026-09-03 13:42',
        unread: false,
      },
      {
        id: 'n5',
        type: 'CS',
        typeLabel: '문의/민원',
        title: '미답변 가맹점 문의가 5건 남아 있습니다.',
        createdAt: '2026-09-02 13:42',
        unread: false,
      },
    ],
  },
};

/** 특수권한 없음 · 알림 없음 (Figma 28815:71127, 화면 목록에서 `?example=empty`) */
export const MYPAGE_HUB_EMPTY: MypageHub = {
  ...MYPAGE_HUB,
  permission: { ...MYPAGE_HUB.permission, specials: [] },
  notification: {
    unread: 0,
    counts: MYPAGE_HUB.notification.counts.map((c) => ({ ...c, count: 0 })),
    recent: [],
  },
};
