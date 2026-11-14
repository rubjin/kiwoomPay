/** 마이페이지 Hub (KWPC2000) 요약 */
export interface MypageHub {
  account: {
    userName: string;
    loginId: string;
    department: string;
    /** 계정 상태 */
    accountStatus: { label: string; tone: 'success' | 'error' | 'warning' | 'neutral' };
    /** 로그인 상태 */
    loginStatus: { label: string; tone: 'success' | 'error' | 'warning' | 'neutral' };
    lastLoginAt: string;
    passwordChangedAt: string;
    /** 비밀번호 변경 후 지난 일수 */
    passwordAgeDays: number;
  };
  permission: {
    menuCount: number;
    template: string;
    dataScope: string;
    /** 사용 중 특수권한 (이름 · 만료일) */
    specials: { name: string; until: string }[];
    /** 처리 중인 권한 신청 건수 */
    pendingRequests: number;
  };
  notification: {
    /** 미확인 전체 건수 */
    unread: number;
    /** 업무유형별 미확인 건수 */
    counts: { type: string; label: string; count: number }[];
    /** 최근 알림 (최대 5건) */
    recent: HubNotification[];
  };
}

export interface HubNotification {
  id: string;
  type: string;
  typeLabel: string;
  title: string;
  createdAt: string;
  unread: boolean;
}
