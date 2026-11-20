import type { SearchRequest, SearchResultPage } from '@kiwoompay/design-system';
import type {
  DownloadCenterParams,
  DownloadRequest,
  DownloadRequestDetail,
} from '@/features/main/downloadCenter.types';
import { paginate, wait } from '@/mocks/utils';
import { DOWNLOAD_REQUESTS } from '@/mocks/main/downloadCenter.mock';

// TODO(API) 다운로드 센터 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터

export async function fetchDownloadRequests({
  params,
  page,
  pageSize,
}: SearchRequest<DownloadCenterParams>): Promise<SearchResultPage<DownloadRequest>> {
  await wait(300);
  const keyword = params.keyword.trim();
  const { start, end } = params.requestDate;
  const rows = DOWNLOAD_REQUESTS.filter(
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
  const found = DOWNLOAD_REQUESTS.find((r) => r.id === id);
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
  const i = DOWNLOAD_REQUESTS.findIndex((r) => r.id === id);
  if (i >= 0) {
    DOWNLOAD_REQUESTS[i] = {
      ...DOWNLOAD_REQUESTS[i]!,
      status: 'GENERATING',
      fileStatus: null,
      completedAt: null,
      expiresAt: null,
      note: null,
    };
  }
  return { id };
}
