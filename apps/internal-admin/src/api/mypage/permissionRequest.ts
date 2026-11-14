import type { SearchRequest, SearchResultPage } from '@kiwoompay/design-system';
import type {
  PermissionRequest,
  PermissionRequestParams,
  PermissionRequestStatus,
} from '@/types/mypage/permissionRequest';
import { paginate, wait } from '@/api/mock';

// TODO(API) 권한 신청 이력 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터 (시안 권한신청팝업.png)
type Row = [
  string, // 신청일시
  string, // 구분
  string, // 신청 권한
  PermissionRequestStatus,
  string | null, // 처리자
  string | null, // 처리일시
  string | null, // 비고
];
const MOCKUP: Row[] = [
  ['2026-09-14 10:20', 'MENU', '정산내역 > 지급 및 예외 정산 관리', 'PENDING', null, null, null],
  [
    '2026-09-10 15:30',
    'SPECIAL',
    '개인정보 다운로드',
    'APPROVED',
    '관리자A',
    '2026-09-11 09:20',
    null,
  ],
  [
    '2026-09-08 14:10',
    'DATA_SCOPE',
    '선택 CPID 42건 → 전체 CPID',
    'APPROVED',
    '관리자A',
    '2026-09-09 10:05',
    '업무범위 확대',
  ],
  [
    '2026-09-05 11:20',
    'MENU',
    '정산내역 > 원천사 입금 & 차액 정산',
    'REJECTED',
    '관리자B',
    '2026-09-05 14:10',
    '업무범위 불일치',
  ],
  ['2026-08-29 16:45', 'SPECIAL', '마스킹 해제', 'APPROVED', '관리자A', '2026-08-30 09:15', null],
  ['2026-08-28 10:25', 'SPECIAL', '마스킹 해제', 'APPROVED', '관리자A', '2026-08-28 10:25', null],
  [
    '2026-08-28 16:40',
    'DATA_SCOPE',
    '추가 CPID 접근 범위',
    'APPROVED',
    '관리자B',
    '2026-08-28 16:40',
    null,
  ],
  [
    '2026-08-27 10:25',
    'MENU',
    '운영관리 > 가맹점 기본/계약 정보 관리',
    'REJECTED',
    '관리자A',
    '2026-08-27 10:25',
    '신청 사유 보완',
  ],
  [
    '2026-08-27 16:40',
    'MENU',
    '정산내역 > 통합 정산 내역',
    'APPROVED',
    '관리자A',
    '2026-08-27 16:40',
    null,
  ],
  ['2026-08-26 10:25', 'SPECIAL', '마스킹 해제', 'APPROVED', '관리자B', '2026-08-26 10:25', null],
];

const pad = (n: number) => String(n).padStart(2, '0');
const toYmdHm = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
const parse = (s: string) => new Date(s.replace(' ', 'T'));

/**
 * 23건 (시안 Total 23): 시안 10건 + 그 앞 13건(시안 줄 반복, 8/25 ~ 8/15).
 * 날짜는 시안의 기준일(2026-09-15)을 오늘로 옮긴다 — 기본 신청기간(최근 1개월)에 모두 보이게
 */
const DAY = 24 * 60 * 60 * 1000;
// 일 단위로만 옮긴다 (시각은 시안 그대로)
const shift = Math.round((Date.now() - parse('2026-09-15 12:00').getTime()) / DAY) * DAY;
const moved = (s: string | null) => s && toYmdHm(new Date(parse(s).getTime() + shift));
const older: Row[] = Array.from({ length: 13 }, (_, i) => {
  const base = MOCKUP[i % MOCKUP.length] as Row;
  const day = 25 - Math.floor((i * 10) / 12);
  const at = `2026-08-${pad(day)} ${base[0].slice(11)}`;
  return [at, base[1], base[2], base[3], base[4], base[5] && at, base[6]];
});
const SAMPLE: PermissionRequest[] = [...MOCKUP, ...older].map((r, i) => ({
  id: `PR-${String(i + 1).padStart(4, '0')}`,
  requestedAt: moved(r[0]) as string,
  type: r[1],
  permission: r[2],
  status: r[3],
  processor: r[4],
  processedAt: moved(r[5]),
  note: r[6],
}));

export async function fetchPermissionRequests({
  params,
  page,
  pageSize,
}: SearchRequest<PermissionRequestParams>): Promise<SearchResultPage<PermissionRequest>> {
  await wait(300);
  const { start, end } = params.period;
  const rows = SAMPLE.filter(
    (r) =>
      (params.type === 'all' || r.type === params.type) &&
      (params.status === 'all' || r.status === params.status) &&
      (!start || r.requestedAt.slice(0, 10) >= start) &&
      (!end || r.requestedAt.slice(0, 10) <= end),
  );
  return paginate(rows, { page, pageSize });
}
