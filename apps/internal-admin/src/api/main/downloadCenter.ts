import type { SearchRequest, SearchResultPage } from '@kiwoompay/design-system';
import type {
  DownloadCenterParams,
  DownloadRequest,
  DownloadRequestDetail,
} from '@/types/main/downloadCenter';
import { paginate, wait } from '@/api/mock';

// TODO(API) 다운로드 센터 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터 (시안 다운로드센터.png)
type Row = Omit<DownloadRequest, 'id' | 'no'>;
const row = (
  area: string,
  fileName: string,
  requestedAt: string,
  completedAt: string | null,
  status: DownloadRequest['status'],
  fileStatus: DownloadRequest['fileStatus'],
  expiresAt: string | null,
  note: string | null = null,
): Row => ({ area, fileName, requestedAt, completedAt, status, fileStatus, expiresAt, note });

const FAILED_NOTE = '데이터 추출 중 오류';
const ROWS: Row[] = [
  row(
    'TRANSACTION',
    '20260831통합거래내역listdown',
    '2026-08-31 09:31:26',
    null,
    'GENERATING',
    null,
    null,
  ),
  row(
    'SETTLEMENT',
    '20260831통합정산내역조회_거래건별listdown',
    '2026-08-31 09:12:04',
    '2026-08-31 09:18:45',
    'DONE',
    'AVAILABLE',
    '2026-09-07 09:18:45',
  ),
  row(
    'ADDON',
    '20260830부가세신고자료listdown',
    '2026-08-30 16:42:17',
    '2026-08-30 16:43:05',
    'FAILED',
    null,
    null,
    FAILED_NOTE,
  ),
  row(
    'MERCHANT',
    '20260829상점계약관리',
    '2026-08-29 11:20:10',
    '2026-08-29 11:24:32',
    'DONE',
    'AVAILABLE',
    '2026-09-05 11:24:32',
  ),
  row(
    'TRANSACTION',
    '20260819통합거래내역listdown',
    '2026-08-19 14:02:53',
    '2026-08-19 14:06:21',
    'DONE',
    'EXPIRED',
    '2026-08-26 14:06:21',
  ),
  row(
    'SETTLEMENT',
    '20260818통합정산내역조회_승인내역listdown',
    '2026-08-18 16:05:30',
    '2026-08-18 16:06:21',
    'FAILED',
    null,
    null,
    FAILED_NOTE,
  ),
  row(
    'ADDON',
    '20260816부가세신고자료listdown',
    '2026-08-16 09:51:12',
    '2026-08-16 09:56:40',
    'DONE',
    'EXPIRED',
    '2026-08-23 09:56:40',
  ),
  row(
    'MERCHANT',
    '20260813상점계약관리',
    '2026-08-13 13:18:09',
    '2026-08-13 13:23:58',
    'DONE',
    'EXPIRED',
    '2026-08-20 13:23:58',
  ),
  row(
    'TRANSACTION',
    '20260812CMS 거래 내역listdown',
    '2026-08-12 10:42:16',
    '2026-08-12 10:43:02',
    'FAILED',
    null,
    null,
    FAILED_NOTE,
  ),
  row(
    'TRANSACTION',
    '20260811통합거래내역listdown',
    '2026-08-11 08:33:49',
    '2026-08-11 08:39:02',
    'DONE',
    'EXPIRED',
    '2026-08-18 08:39:02',
  ),
];

const pad = (n: number) => String(n).padStart(2, '0');
const toDateTime = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const parse = (s: string) => new Date(s.replace(' ', 'T'));

/**
 * 24건: 시안의 10건을 반복하고, 날짜는 이번 달 1일 ~ 오늘 안에 고르게 옮긴다 (기본 검색 기간에 모두 보이게).
 * 시각 · 처리 소요 시간 · 만료(완료 + 7일)는 시안 값 그대로
 */
const today = new Date();
let SAMPLE: DownloadRequest[] = Array.from({ length: 24 }, (_, i) => {
  const no = 24 - i;
  const base = ROWS[i % ROWS.length] as Row;
  const baseRequested = parse(base.requestedAt);
  const requested = new Date(today);
  requested.setDate(today.getDate() - Math.round((i * (today.getDate() - 1)) / 23));
  requested.setHours(
    baseRequested.getHours(),
    baseRequested.getMinutes(),
    baseRequested.getSeconds(),
  );
  const moved = (s: string | null) =>
    s && toDateTime(new Date(requested.getTime() + (parse(s).getTime() - baseRequested.getTime())));
  const requestedAt = toDateTime(requested);
  return {
    ...base,
    requestedAt,
    completedAt: moved(base.completedAt),
    expiresAt: moved(base.expiresAt),
    no,
    id: `DL-${requestedAt.slice(0, 10).replace(/-/g, '')}-${String(no).padStart(4, '0')}`,
  };
});

export async function fetchDownloadRequests({
  params,
  page,
  pageSize,
}: SearchRequest<DownloadCenterParams>): Promise<SearchResultPage<DownloadRequest>> {
  await wait(300);
  const keyword = params.keyword.trim();
  const { start, end } = params.requestDate;
  const rows = SAMPLE.filter(
    (r) =>
      (params.area === 'all' || r.area === params.area) &&
      (params.status === 'all' || r.status === params.status) &&
      (params.fileStatus === 'all' || r.fileStatus === params.fileStatus) &&
      (!start || r.requestedAt.slice(0, 10) >= start) &&
      (!end || r.requestedAt.slice(0, 10) <= end) &&
      (!keyword || r.fileName.includes(keyword)),
  );
  return paginate(rows, { page, pageSize });
}

export async function fetchDownloadRequestDetail(id: string): Promise<DownloadRequestDetail> {
  await wait(200);
  const found = SAMPLE.find((r) => r.id === id);
  if (!found) throw new Error(`다운로드 요청 없음: ${id}`);
  const done = found.status === 'DONE';
  const history = [
    {
      at: found.requestedAt,
      actor: 'SYSTEM',
      result: '생성 시작',
      note: '다운로드 파일 생성 시작',
    },
  ];
  if (found.completedAt) {
    history.unshift({
      at: found.completedAt,
      actor: 'SYSTEM',
      result: done ? '생성 완료' : '생성 실패',
      note: done ? '파일 생성 완료' : (found.note ?? '-'),
    });
  }
  return {
    ...found,
    requester: '홍*동',
    sourceScreen: '통합 정산 내역',
    targetCount: 123456,
    startedAt: found.requestedAt,
    fileSize: done ? '24.8 MB' : null,
    remaining: found.fileStatus === 'AVAILABLE' ? '6일 23시간' : null,
    conditions: [
      { label: '거래일', value: '2026-08-01 ~ 2026-08-31' },
      { label: '거래상태', value: '승인' },
      { label: '결제수단', value: '전체' },
      { label: '가맹점', value: '전체' },
    ],
    history,
  };
}

/** 파일 내려받기. TODO(API) 서버 파일 주소로 내려받기 (a[download] 또는 Blob) */
export async function downloadFile(id: string) {
  await wait(200);
  return { id };
}

/** 재시도(실패) · 재요청(만료): 같은 조건으로 파일을 다시 만든다 → 처리상태 생성중 */
export async function requestRegenerate(id: string) {
  await wait(300);
  SAMPLE = SAMPLE.map((r) =>
    r.id === id
      ? {
          ...r,
          status: 'GENERATING',
          fileStatus: null,
          completedAt: null,
          expiresAt: null,
          note: null,
        }
      : r,
  );
  return { id };
}
