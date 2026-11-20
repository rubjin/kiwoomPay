import type { SearchRequest, SearchResultPage } from '@kiwoompay/design-system';
import type {
  Notification,
  NotificationParams,
  NotificationUnreadSummary,
} from '@/features/mypage/notification.types';
import { paginate, wait } from '@/mocks/utils';
import { NOTIFICATIONS, NOTIFICATION_TYPES } from '@/mocks/mypage/notification.mock';

// TODO(API) 알림센터 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터(읽음 처리는 이 모듈 안 상태)

export async function fetchUnreadSummary(): Promise<NotificationUnreadSummary> {
  await wait(150);
  const unread = NOTIFICATIONS.filter((n) => n.unread);
  return {
    unread: unread.length,
    counts: NOTIFICATION_TYPES.map((type) => ({
      type,
      count: unread.filter((n) => n.type === type).length,
    })),
  };
}

export async function fetchNotifications({
  params,
  page,
  pageSize,
}: SearchRequest<NotificationParams>): Promise<SearchResultPage<Notification>> {
  await wait(300);
  const { start, end } = params.period;
  const keyword = params.keyword.trim();
  const rows = NOTIFICATIONS.filter(
    (n) =>
      (params.type === 'all' || n.type === params.type) &&
      (params.readState === 'all' || (params.readState === 'unread') === n.unread) &&
      (!keyword || n.title.includes(keyword) || n.message.includes(keyword)) &&
      (!start || n.createdAt.slice(0, 10) >= start) &&
      (!end || n.createdAt.slice(0, 10) <= end),
  ).map((n) => ({ ...n }));
  return paginate(rows, { page, pageSize });
}

/** 읽음 처리 (id 없으면 모두) */
export async function readNotifications(id?: string): Promise<void> {
  await wait(200);
  for (const n of NOTIFICATIONS) if (!id || n.id === id) n.unread = false;
}
