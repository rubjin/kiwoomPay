import type { DateRange } from '@kiwoompay/design-system';

/** KWPC0104 다운로드 센터 — 검색 조건 ('all'은 전체) */
export interface DownloadCenterParams {
  /** 업무영역 (공통코드 DOWNLOAD_AREA) */
  area: string;
  /** 처리상태 (DOWNLOAD_STATUS) */
  status: string;
  /** 파일상태 (DOWNLOAD_FILE_STATUS) */
  fileStatus: string;
  /** 요청일 */
  requestDate: DateRange;
  /** 파일명 또는 요청명 */
  keyword: string;
}

export type DownloadStatus = 'GENERATING' | 'DONE' | 'FAILED';
export type DownloadFileStatus = 'AVAILABLE' | 'EXPIRED';

/** 다운로드 요청 1행 */
export interface DownloadRequest {
  /** 요청번호 */
  id: string;
  /** 목록 번호 */
  no: number;
  /** 업무영역 코드 */
  area: string;
  fileName: string;
  requestedAt: string;
  completedAt: string | null;
  status: DownloadStatus;
  /** 처리 완료 전 · 실패는 null */
  fileStatus: DownloadFileStatus | null;
  expiresAt: string | null;
  /** 비고 (실패 사유 등) */
  note: string | null;
}

export interface DownloadHistory {
  at: string;
  actor: string;
  result: string;
  note: string;
}

/** 다운로드 요청 상세 (팝업) */
export interface DownloadRequestDetail extends DownloadRequest {
  requester: string;
  /** 원천 화면 (요청한 화면명) */
  sourceScreen: string;
  /** 대상 건수 */
  targetCount: number;
  /** 생성 시작일시 */
  startedAt: string | null;
  /** 파일 용량 (예: 24.8 MB) */
  fileSize: string | null;
  /** 잔여기간 (예: 6일 23시간). TODO(API) 서버가 내려줄지, 만료일시로 화면에서 계산할지 */
  remaining: string | null;
  /** 요청 당시 조회조건 */
  conditions: { label: string; value: string }[];
  history: DownloadHistory[];
}
