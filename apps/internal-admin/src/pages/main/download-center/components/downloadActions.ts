import type { DownloadRequest } from '@/types/main/downloadCenter';

/** 행에서 할 수 있는 작업 — 목록 [작업요청] 칸과 상세 팝업 Footer가 같은 규칙을 쓴다 */
export type DownloadAction = 'download' | 'retry' | 'rerequest';

/**
 * 완료 + 다운로드 가능 → 다운로드, 실패 → 재시도, 완료 + 만료 → 재요청, 생성중 → 없음.
 * TODO(정책) 재시도 · 재요청 횟수 제한, 다른 사람 요청 처리 권한은 화면설계서 확인
 */
export function actionOf(
  row: Pick<DownloadRequest, 'status' | 'fileStatus'>,
): DownloadAction | null {
  if (row.status === 'FAILED') return 'retry';
  if (row.status !== 'DONE') return null;
  return row.fileStatus === 'AVAILABLE' ? 'download' : 'rerequest';
}

export const ACTION_LABEL: Record<DownloadAction, string> = {
  download: '다운로드',
  retry: '재시도',
  rerequest: '재요청',
};
