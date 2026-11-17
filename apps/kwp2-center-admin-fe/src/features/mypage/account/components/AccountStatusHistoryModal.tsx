import {
  // 팝업 틀 · 배치
  Modal,
  Stack,
  // 현재 상태 · 이력 표
  InfoStrip,
  GridPlaceholder,
  StatusView,
  ResultFooter,
  Pagination,
  useSearchResult,
  Badge,
  type BadgeTone,
  type GridPlaceholderColumn,
} from '@kiwoompay/design-system';
import { useEffect, useState } from 'react';
import {
  fetchAccountStatusHistory,
  fetchAccountStatusSummary,
} from '@/features/mypage/accountHistory.api';
import type {
  AccountStatus,
  AccountStatusHistory,
  AccountStatusSummary,
} from '@/features/mypage/accountHistory.types';
import { codeLabel } from '@/utils/code';

const STATUS_TONE: Record<AccountStatus, BadgeTone> = {
  TEMP: 'warning',
  NORMAL: 'success',
  SUSPENDED: 'error',
};

const StatusBadge = ({ status }: { status: AccountStatus | null }) =>
  status ? <Badge tone={STATUS_TONE[status]}>{codeLabel('ACCOUNT_STATUS', status)}</Badge> : <>-</>;

/** 상태 변경 이력 열 (Figma 폭 154 · 107 · 107 · 사유 나머지 · 107). TODO(IBSheet) IBSheet8 연결 시 같은 순서 · 폭으로 */
const COLUMNS: GridPlaceholderColumn<AccountStatusHistory>[] = [
  { key: 'changedAt', header: '변경일시', width: 154 },
  {
    key: 'before',
    header: '변경 전 상태',
    width: 107,
    render: (r) => <StatusBadge status={r.before} />,
  },
  {
    key: 'after',
    header: '변경 후 상태',
    width: 107,
    render: (r) => <StatusBadge status={r.after} />,
  },
  { key: 'reason', header: '변경 사유', align: 'left' },
  { key: 'processor', header: '처리자', width: 107 },
];

function AccountStatusHistoryBody() {
  const [summary, setSummary] = useState<AccountStatusSummary | null>(null);
  useEffect(() => {
    void fetchAccountStatusSummary().then(setSummary);
  }, []);
  // 조회 조건 없음 — 팝업을 열면 바로 조회
  const result = useSearchResult({
    initialParams: {},
    fetch: fetchAccountStatusHistory,
    autoSearch: true,
  });
  const ready = result.status === 'success';

  return (
    <Stack>
      <Modal.Section title="현재 계정 상태">
        <InfoStrip
          items={[
            { label: '현재 상태', value: summary ? <StatusBadge status={summary.status} /> : '-' },
            { label: '최종 변경일시', value: summary?.changedAt ?? '-' },
            { label: '최근 변경사유', value: summary?.reason ?? '-' },
          ]}
        />
      </Modal.Section>

      <Modal.Section title="상태 변경 이력">
        {result.status === 'success' ? (
          <GridPlaceholder columns={COLUMNS} rows={result.items} rowKey={(r) => r.id} />
        ) : (
          <StatusView status={result.status === 'idle' ? 'loading' : result.status} />
        )}
      </Modal.Section>

      <ResultFooter total={result.total}>
        <Pagination
          totalPages={result.totalPages}
          page={result.page}
          onChange={result.setPage}
          disabled={!ready}
        />
      </ResultFooter>
    </Stack>
  );
}

/**
 * 마이페이지 계정관리 · 계정 상태 이력 팝업 (Figma 28960:84306) — 기본 계정정보 [계정 상태 이력]에서 연다.
 * 현재 계정 상태(요약 상자) → 상태 변경 이력 → Total · Pagination. 처리 버튼 없음 — 제목 줄 닫기(X)로 닫는다.
 * 폭: Figma 815 → Modal lg 880 (표준 크기)
 */
export function AccountStatusHistoryModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <Modal.Header title="계정 상태 이력" closeButton />
      <Modal.Body>{open && <AccountStatusHistoryBody />}</Modal.Body>
    </Modal>
  );
}
