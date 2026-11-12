import { Badge, type BadgeTone } from '@kiwoompay/design-system';
import type { DownloadFileStatus, DownloadStatus } from '@/types/main/downloadCenter';
import { codeLabel } from '@/utils/code';

const STATUS_TONE: Record<DownloadStatus, BadgeTone> = {
  GENERATING: 'info',
  DONE: 'success',
  FAILED: 'error',
};

const FILE_STATUS_TONE: Record<DownloadFileStatus, BadgeTone> = {
  AVAILABLE: 'primary',
  EXPIRED: 'neutral',
};

/** 처리상태 배지 (생성중 · 완료 · 실패) */
export function DownloadStatusBadge({ status }: { status: DownloadStatus }) {
  return (
    <Badge size="sm" tone={STATUS_TONE[status]}>
      {codeLabel('DOWNLOAD_STATUS', status)}
    </Badge>
  );
}

/** 파일상태 배지 (다운로드 가능 · 만료). 없으면 - */
export function FileStatusBadge({ status }: { status: DownloadFileStatus | null }) {
  if (!status) return <>-</>;
  return (
    <Badge size="sm" tone={FILE_STATUS_TONE[status]}>
      {codeLabel('DOWNLOAD_FILE_STATUS', status)}
    </Badge>
  );
}
