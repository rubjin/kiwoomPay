// 예시 데이터: 다운로드 요청 24건 (처리상태 · 파일상태 섞음, 요청일은 오늘 기준)
// main/downloadCenter.api.ts가 쓴다. TODO(API) 실제 API로 바꾸면 이 파일을 지운다
import type { DownloadRequest } from '@/features/main/downloadCenter.types';
import { toYmdHms, parseDateTime } from '@/mocks/utils';

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

/**
 * 24건: 시안의 10건을 반복하고, 날짜는 이번 달 1일 ~ 오늘 안에 고르게 옮긴다 (기본 검색 기간에 모두 보이게).
 * 시각 · 처리 소요 시간 · 만료(완료 + 7일)는 시안 값 그대로
 */
const today = new Date();

export const DOWNLOAD_REQUESTS: DownloadRequest[] = Array.from({ length: 24 }, (_, i) => {
  const no = 24 - i;
  const base = ROWS[i % ROWS.length] as Row;
  const baseRequested = parseDateTime(base.requestedAt);
  const requested = new Date(today);
  requested.setDate(today.getDate() - Math.round((i * (today.getDate() - 1)) / 23));
  requested.setHours(
    baseRequested.getHours(),
    baseRequested.getMinutes(),
    baseRequested.getSeconds(),
  );
  const moved = (s: string | null) =>
    s &&
    toYmdHms(
      new Date(requested.getTime() + (parseDateTime(s).getTime() - baseRequested.getTime())),
    );
  const requestedAt = toYmdHms(requested);
  return {
    ...base,
    requestedAt,
    completedAt: moved(base.completedAt),
    expiresAt: moved(base.expiresAt),
    no,
    id: `DL-${requestedAt.slice(0, 10).replace(/-/g, '')}-${String(no).padStart(4, '0')}`,
  };
});
