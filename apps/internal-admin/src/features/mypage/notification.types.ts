import type { DateRange } from '@kiwoompay/design-system';

/** 알림센터 조회 조건 ('all'은 전체) */
export interface NotificationParams {
  /** 수신기간 */
  period: DateRange;
  /** 업무유형 (공통코드 NOTIFICATION_TYPE) */
  type: string;
  /** 확인상태: all · unread · read */
  readState: string;
  /** 검색어 (제목 · 내용) */
  keyword: string;
}

/** 알림 1건 */
export interface Notification {
  id: string;
  /** 업무유형 코드 */
  type: string;
  title: string;
  /** 상세 내용 (줄바꿈 \n) */
  message: string;
  /** 발생일시 (YYYY-MM-DD HH:mm) */
  createdAt: string;
  unread: boolean;
  /** 알림유형 (예: 자동정산 완료) */
  alertType: string;
  /** 알림ID */
  alertNo: string;
  /** 관련 업무: 메뉴 경로 · 이동 버튼 이름 · 앱 경로 */
  related?: { path: string; label: string; to: string };
}

/** 미확인 알림 요약 */
export interface NotificationUnreadSummary {
  unread: number;
  counts: { type: string; count: number }[];
}
