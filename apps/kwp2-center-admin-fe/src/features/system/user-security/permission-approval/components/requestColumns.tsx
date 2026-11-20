import {
  Badge,
  TextLink,
  type BadgeTone,
  type GridPlaceholderColumn,
} from '@kiwoompay/design-system';
import type {
  GeneralPermissionRequest,
  RequestStatus,
} from '@/features/system/permissionApproval.types';
import { codeLabel } from '@/utils/code';
import { orDash } from '@/utils/format';

const STATUS_TONE: Record<RequestStatus, BadgeTone> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
};

/**
 * 일반 권한 신청 목록 열 (화면설계서 KWPC10010501 ②). 신청번호 · [상세보기]는 신청 처리 팝업(KWPC10010502).
 * 폭은 기획서 비율 — TODO(시안)
 */
export const createRequestColumns = (
  onOpenDetail: (row: GeneralPermissionRequest) => void,
): GridPlaceholderColumn<GeneralPermissionRequest>[] => {
  const link = (row: GeneralPermissionRequest, text: string) => (
    <TextLink
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onOpenDetail(row);
      }}
    >
      {text}
    </TextLink>
  );
  return [
    { key: 'no', header: '신청번호', width: 80, render: (r) => link(r, r.no) },
    { key: 'applicant', header: '신청자', width: 80 },
    {
      key: 'type',
      header: '권한유형',
      width: 90,
      render: (r) => codeLabel('GENERAL_PERMISSION_TYPE', r.type),
    },
    { key: 'items', header: '신청 항목', width: 260, align: 'left' },
    // 신청 사유는 길면 말줄임, 마우스를 올리면 전체 사유
    {
      key: 'reason',
      header: '신청 사유',
      align: 'left',
      render: (r) => <span title={r.reason}>{r.reason}</span>,
    },
    { key: 'requestedAt', header: '신청일시', width: 130 },
    {
      key: 'status',
      header: '상태',
      width: 90,
      render: (r) => (
        <Badge size="sm" tone={STATUS_TONE[r.status]}>
          {codeLabel('PERMISSION_REQUEST_STATUS', r.status)}
        </Badge>
      ),
    },
    { key: 'processor', header: '처리자', width: 90, render: (r) => orDash(r.processor) },
    { key: 'processedAt', header: '처리일시', width: 130, render: (r) => orDash(r.processedAt) },
    { key: 'detail', header: '상세', width: 80, render: (r) => link(r, '상세보기') },
  ];
};
