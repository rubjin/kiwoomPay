import {
  Badge,
  Button,
  TextLink,
  type BadgeTone,
  type GridPlaceholderColumn,
} from '@kiwoompay/design-system';
import type {
  ApprovalStatus,
  GrantStatus,
  SpecialApproval,
} from '@/features/system/specialApproval.types';
import { codeLabel } from '@/utils/code';
import { orDash } from '@/utils/format';

export const APPROVAL_TONE: Record<ApprovalStatus, BadgeTone> = {
  WAITING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
};

export const GRANT_TONE: Record<GrantStatus, BadgeTone> = {
  PENDING: 'info',
  SCHEDULED: 'primary',
  ACTIVE: 'success',
  EXPIRED: 'neutral',
  REVOKED: 'error',
  NONE: 'neutral',
};

/** 기간 표시 MM/DD ~ MM/DD */
export const periodText = (p: { start: string; end: string } | null) =>
  p ? `${p.start.slice(5).replace('-', '/')} ~ ${p.end.slice(5).replace('-', '/')}` : '-';

/** [권한 부여]는 결재 승인완료 + 부여 대기일 때만 */
export const canGrant = (r: SpecialApproval) =>
  r.approvalStatus === 'APPROVED' && r.grantStatus === 'PENDING';

/**
 * 특수권한 신청 · 결재 목록 열 (화면설계서 KWPC10010403 ②). 신청번호 · 상세 → 아래 선택 신청 상세,
 * [권한 부여] → 특수권한 부여 처리 팝업(KWPC10010404). 폭은 기획서 비율 — TODO(시안)
 */
export const createSpecialApprovalColumns = (handlers: {
  onSelect: (row: SpecialApproval) => void;
  onGrant: (row: SpecialApproval) => void;
}): GridPlaceholderColumn<SpecialApproval>[] => {
  const link = (row: SpecialApproval, text: string) => (
    <TextLink
      href="#"
      onClick={(e) => {
        e.preventDefault();
        handlers.onSelect(row);
      }}
    >
      {text}
    </TextLink>
  );
  return [
    { key: 'no', header: '신청번호', width: 80, render: (r) => link(r, r.no) },
    { key: 'applicant', header: '신청자', width: 80 },
    { key: 'specialName', header: '특수권한명', align: 'left' },
    { key: 'requestedAt', header: '신청일시', width: 130 },
    {
      key: 'wishPeriod',
      header: '신청 희망 기간',
      width: 120,
      render: (r) => periodText(r.wishPeriod),
    },
    {
      key: 'approvalStatus',
      header: '결재 상태',
      width: 90,
      render: (r) => (
        <Badge size="sm" tone={APPROVAL_TONE[r.approvalStatus]}>
          {codeLabel('APPROVAL_STATUS', r.approvalStatus)}
        </Badge>
      ),
    },
    { key: 'approvedAt', header: '결재 처리일시', width: 130, render: (r) => orDash(r.approvedAt) },
    {
      key: 'grantStatus',
      header: '부여 상태',
      width: 90,
      render: (r) => (
        <Badge size="sm" tone={GRANT_TONE[r.grantStatus]}>
          {codeLabel('GRANT_STATUS', r.grantStatus)}
        </Badge>
      ),
    },
    {
      key: 'grantPeriod',
      header: '최종 부여 기간',
      width: 120,
      render: (r) => periodText(r.grantPeriod),
    },
    { key: 'grantedBy', header: '부여 처리자', width: 90, render: (r) => orDash(r.grantedBy) },
    { key: 'detail', header: '상세', width: 64, render: (r) => link(r, '상세') },
    {
      key: 'manage',
      header: '관리',
      width: 96,
      render: (r) =>
        canGrant(r) ? (
          <Button size="sm" variant="dark" onClick={() => handlers.onGrant(r)}>
            권한 부여
          </Button>
        ) : (
          '-'
        ),
    },
  ];
};
