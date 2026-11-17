import type { SearchRequest, SearchResultPage } from '@kiwoompay/design-system';
import type {
  Notification,
  NotificationParams,
  NotificationUnreadSummary,
} from '@/features/mypage/notification.types';
import { paginate, wait } from '@/api/mock';
import { MENU } from '@/constants/menu';

// TODO(API) 알림센터 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터(읽음 처리는 이 모듈 안 상태)

const SETTLE_PATH = '정산내역 > 가맹점 정산 관리 > 자동정산 실행/처리';
const settle = { path: SETTLE_PATH, label: '자동정산 결과 조회', to: MENU.KWPC0601 };

type Row = [string, string, string, string, boolean, string];
// [업무유형, 제목, 내용, 알림유형, 미확인, 날짜(시안 기준일 09-16에서 며칠 전 · 시각)]
const ROWS: Row[] = [
  [
    'SETTLEMENT',
    '자동정산 처리가 완료되었습니다.',
    '2026-09-16 자동정산 대상 312건 중 308건이 정상 처리되었습니다.\n예외 4건은 처리 결과를 확인해 주세요.',
    '자동정산 완료',
    true,
    '0 09:05',
  ],
  [
    'SETTLEMENT',
    '자동정산 처리 중 예외 4건이 발생했습니다.',
    '자동정산 처리 중 예외 4건이 발생했습니다.\n예외 사유를 확인하고 재처리해 주세요.',
    '자동정산 예외',
    true,
    '11 13:42',
  ],
  [
    'SETTLEMENT',
    '자동정산 대상 거래 6건의 확인이 필요합니다.',
    '자동정산 대상 거래 중 금액 확인이 필요한 거래 6건이 있습니다.',
    '자동정산 확인 필요',
    true,
    '12 13:42',
  ],
  [
    'PAYOUT',
    '자동정산 지급 요청 1건이 실패했습니다.',
    '자동정산 지급 요청 1건이 은행 응답 오류로 실패했습니다.',
    '지급 실패',
    false,
    '13 13:42',
  ],
  [
    'SETTLEMENT',
    '자동정산 검증 결과 금액 불일치 2건이 확인되었습니다.',
    '자동정산 검증 결과 금액 불일치 2건이 확인되었습니다.',
    '자동정산 검증',
    false,
    '14 13:42',
  ],
  [
    'SETTLEMENT',
    '자동정산 대상 데이터 생성이 완료되었습니다.',
    '자동정산 대상 데이터 생성이 완료되었습니다.',
    '자동정산 데이터 생성',
    false,
    '15 08:10',
  ],
  [
    'RISK',
    'ABC상점이 고위험 가맹점으로 판정되었습니다.',
    'FDS 점검 결과 ABC상점이 고위험 가맹점으로 판정되었습니다.\n거래 모니터링을 확인해 주세요.',
    '고위험 판정',
    true,
    '1 13:42',
  ],
  [
    'RISK',
    '이상 거래 의심 건 3건이 탐지되었습니다.',
    '최근 24시간 이상 거래 의심 건 3건이 탐지되었습니다.',
    'FDS 탐지',
    true,
    '2 10:20',
  ],
  [
    'RISK',
    '고위험 가맹점 재심사 대상이 등록되었습니다.',
    '고위험 가맹점 재심사 대상 1건이 등록되었습니다.',
    '재심사 등록',
    true,
    '3 15:00',
  ],
  [
    'PAYOUT',
    'CPID KWP12345 지급이 실패했습니다.',
    'CPID KWP12345 지급이 계좌 오류로 실패했습니다.',
    '지급 실패',
    true,
    '4 13:42',
  ],
  [
    'PAYOUT',
    '지급 보류 해제 요청 1건이 승인되었습니다.',
    '지급 보류 해제 요청 1건이 승인되었습니다.',
    '지급 보류 해제',
    true,
    '5 11:00',
  ],
  [
    'REVIEW',
    '신규 가맹점 심사 6건이 배정되었습니다.',
    '신규 가맹점 심사 6건이 배정되었습니다.',
    '심사 배정',
    true,
    '6 13:42',
  ],
  [
    'CS',
    '미답변 가맹점 문의가 5건 남아 있습니다.',
    '미답변 가맹점 문의가 5건 남아 있습니다.',
    '미답변 문의',
    true,
    '7 13:42',
  ],
  [
    'CS',
    '민원 처리 기한이 1일 남았습니다.',
    '접수된 민원 1건의 처리 기한이 1일 남았습니다.',
    '민원 기한',
    true,
    '8 09:30',
  ],
  [
    'SETTLEMENT',
    '정산 스케줄 생성이 완료되었습니다.',
    '이번 달 정산 스케줄 생성이 완료되었습니다.',
    '정산 스케줄',
    true,
    '9 08:10',
  ],
  [
    'REVIEW',
    '계약 변경 요청 2건이 접수되었습니다.',
    '가맹점 계약 변경 요청 2건이 접수되었습니다.',
    '계약 변경',
    false,
    '20 14:00',
  ],
  [
    'CS',
    '가맹점 문의 3건에 답변이 등록되었습니다.',
    '가맹점 문의 3건에 답변이 등록되었습니다.',
    '문의 답변',
    false,
    '30 16:30',
  ],
];

const pad = (n: number) => String(n).padStart(2, '0');
const DAY = 24 * 60 * 60 * 1000;
/** 시안 기준일(09-16)을 오늘로: "며칠 전 시각" → 오늘 기준 날짜 */
const dateOf = (spec: string) => {
  const [days, time] = spec.split(' ');
  const d = new Date(Date.now() - Number(days) * DAY);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${time}`;
};

const SAMPLE: Notification[] = ROWS.map((r, i) => ({
  id: `N-${i + 1}`,
  type: r[0],
  title: r[1],
  message: r[2],
  alertType: r[3],
  unread: r[4],
  createdAt: dateOf(r[5]),
  alertNo: `ALM-${dateOf(r[5]).slice(0, 10).replace(/-/g, '')}-${String(21 + i).padStart(5, '0')}`,
  related: r[0] === 'SETTLEMENT' || r[0] === 'PAYOUT' ? settle : undefined,
})).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

const TYPES = ['SETTLEMENT', 'RISK', 'PAYOUT', 'REVIEW', 'CS'];

export async function fetchUnreadSummary(): Promise<NotificationUnreadSummary> {
  await wait(150);
  const unread = SAMPLE.filter((n) => n.unread);
  return {
    unread: unread.length,
    counts: TYPES.map((type) => ({ type, count: unread.filter((n) => n.type === type).length })),
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
  const rows = SAMPLE.filter(
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
  for (const n of SAMPLE) if (!id || n.id === id) n.unread = false;
}
