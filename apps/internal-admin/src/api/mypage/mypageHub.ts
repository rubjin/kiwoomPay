import type { MypageHub } from '@/types/mypage/mypageHub';

// TODO(API) 마이페이지 요약 · 알림 읽음 API가 정해지면 axios 호출로 바꾼다.
// 지금은 화면 확인용 예시 (Figma KWPC2000_마이페이지_GUI_최초진입)
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** example: 'empty' → 특수권한 없음 · 알림 없음 예시 (Figma 28815:71127, 화면 목록에서 `?example=empty`) */
export async function fetchMypageHub(example?: string | null): Promise<MypageHub> {
  await wait(200);
  const data: MypageHub = {
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
  if (example !== 'empty') return data;
  return {
    ...data,
    permission: { ...data.permission, specials: [] },
    notification: {
      unread: 0,
      counts: data.notification.counts.map((c) => ({ ...c, count: 0 })),
      recent: [],
    },
  };
}

/** 알림 읽음 (id 없으면 모두 읽음) */
export async function markNotificationsRead(id?: string): Promise<void> {
  void id;
  await wait(300);
}
