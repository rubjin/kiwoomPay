import { Button, Icon, TextLink, type GridPlaceholderColumn } from '@kiwoompay/design-system';
import type { DownloadRequest } from '@/features/main/downloadCenter.types';
import { codeLabel } from '@/utils/code';
import { ACTION_LABEL, actionOf, type DownloadAction } from './downloadActions';
import { DownloadStatusBadge, FileStatusBadge } from './statusBadges';
import { orDash } from '@/utils/format';

/**
 * 다운로드 요청 표 열 (IbsheetGrid). 파일명 링크 · 작업요청 버튼은 컴포넌트 그대로 칸에 그린다
 */
export function createDownloadColumns(handlers: {
  onOpenDetail: (row: DownloadRequest) => void;
  onAction: (row: DownloadRequest, action: DownloadAction) => void;
}): GridPlaceholderColumn<DownloadRequest>[] {
  return [
    { key: 'no', header: '', width: 65 },
    {
      key: 'area',
      header: '업무영역',
      width: 120,
      render: (row) => codeLabel('DOWNLOAD_AREA', row.area),
    },
    {
      key: 'fileName',
      header: '파일명',
      width: 286,
      align: 'left',
      render: (row) => (
        <TextLink
          href="#"
          title={row.fileName}
          onClick={(e) => {
            e.preventDefault();
            handlers.onOpenDetail(row);
          }}
        >
          {row.fileName}
        </TextLink>
      ),
    },
    { key: 'requestedAt', header: '요청일', width: 180 },
    {
      key: 'completedAt',
      header: '처리완료일',
      width: 180,
      render: (row) => orDash(row.completedAt),
    },
    {
      key: 'status',
      header: '처리상태',
      width: 107,
      render: (row) => <DownloadStatusBadge status={row.status} />,
    },
    {
      key: 'fileStatus',
      header: '파일상태',
      width: 107,
      render: (row) => <FileStatusBadge status={row.fileStatus} />,
    },
    { key: 'expiresAt', header: '만료일', width: 180, render: (row) => orDash(row.expiresAt) },
    {
      key: 'action',
      header: '작업요청',
      width: 120,
      render: (row) => {
        const action = actionOf(row);
        if (!action) return '-';
        return action === 'download' ? (
          <Button size="sm" variant="dark" onClick={() => handlers.onAction(row, action)}>
            {ACTION_LABEL[action]}
          </Button>
        ) : (
          <Button
            size="sm"
            variant="neutral"
            appearance="line"
            leadingIcon={<Icon name="refresh" size={16} />}
            onClick={() => handlers.onAction(row, action)}
          >
            {ACTION_LABEL[action]}
          </Button>
        );
      },
    },
    { key: 'note', header: '비고', align: 'left', render: (row) => orDash(row.note) },
  ];
}
