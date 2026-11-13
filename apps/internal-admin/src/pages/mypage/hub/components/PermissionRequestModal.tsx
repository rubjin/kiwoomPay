import {
  Badge,
  DateRangeField,
  Field,
  GridPlaceholder,
  Modal,
  Pagination,
  ResultFooter,
  SearchPanel,
  SectionHeading,
  SelectBox,
  StatusView,
  useSearchResult,
  type BadgeTone,
  type GridPlaceholderColumn,
} from '@kiwoompay/design-system';
import { fetchPermissionRequests } from '@/api/mypage/permissionRequest';
import { useCodeOptions } from '@/hooks/useCodeOptions';
import type {
  PermissionRequest,
  PermissionRequestParams,
  PermissionRequestStatus,
} from '@/types/mypage/permissionRequest';
import { codeLabel } from '@/utils/code';
import { rangeOfQuickPeriod } from '@/utils/period';

const STATUS_TONE: Record<PermissionRequestStatus, BadgeTone> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
};

const dash = (value: string | null) => value ?? '-';

/** 권한 신청 이력 열 (시안 권한신청팝업.png). TODO(IBSheet) IBSheet8 연결 시 같은 순서 · 폭으로 */
const COLUMNS: GridPlaceholderColumn<PermissionRequest>[] = [
  { key: 'requestedAt', header: '신청일시', width: 170 },
  {
    key: 'type',
    header: '구분',
    width: 130,
    render: (r) => codeLabel('PERMISSION_REQUEST_TYPE', r.type),
  },
  { key: 'permission', header: '신청 권한', width: 426, align: 'left' },
  {
    key: 'status',
    header: '상태',
    width: 116,
    render: (r) => (
      <Badge size="sm" tone={STATUS_TONE[r.status]}>
        {codeLabel('PERMISSION_REQUEST_STATUS', r.status)}
      </Badge>
    ),
  },
  {
    key: 'processor',
    header: '처리자',
    width: 112,
    align: 'left',
    render: (r) => dash(r.processor),
  },
  {
    key: 'processedAt',
    header: '처리일시',
    width: 180,
    align: 'left',
    render: (r) => dash(r.processedAt),
  },
  { key: 'note', header: '비고', align: 'left', render: (r) => dash(r.note) },
];

/** 조회 조건 기본값: 신청기간 최근 1개월 (시안 08-15 ~ 09-15). TODO(정책) 기본 기간 확인 */
const createInitialParams = (): PermissionRequestParams => ({
  period: rangeOfQuickPeriod('1m'),
  type: 'all',
  status: 'all',
});

// 조회 조건 셀렉트 칸 (라벨 + 8 + 셀렉트, 시안 측정)
const SELECT_FIELD = { width: 300 };

function PermissionRequestBody() {
  const types = useCodeOptions('PERMISSION_REQUEST_TYPE', { withAll: true });
  const statuses = useCodeOptions('PERMISSION_REQUEST_STATUS', { withAll: true });
  // 내 신청 목록이라 팝업을 열면 바로 조회 (다운로드 센터와 같은 예외, TODO(정책))
  const result = useSearchResult({
    initialParams: createInitialParams(),
    fetch: fetchPermissionRequests,
    autoSearch: true,
  });
  const { params, setParam } = result;
  const ready = result.status === 'success';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kp-space-16)' }}>
      <SearchPanel
        variant="box"
        title="조회 조건"
        onSearch={result.search}
        onReset={result.reset}
        loading={result.loading}
      >
        <Field label="신청기간">
          <DateRangeField value={params.period} onChange={(period) => setParam('period', period)} />
        </Field>
        <Field label="구분" style={SELECT_FIELD}>
          <SelectBox
            fullWidth
            options={types}
            value={params.type}
            onChange={(type) => setParam('type', type)}
          />
        </Field>
        <Field label="상태" style={SELECT_FIELD}>
          <SelectBox
            fullWidth
            options={statuses}
            value={params.status}
            onChange={(status) => setParam('status', status)}
          />
        </Field>
      </SearchPanel>

      <SectionHeading size="md" as="h3" title="권한 신청 이력" />
      {result.status === 'success' ? (
        <GridPlaceholder columns={COLUMNS} rows={result.items} rowKey={(r) => r.id} />
      ) : (
        <StatusView status={result.status === 'idle' ? 'loading' : result.status} />
      )}

      <ResultFooter total={result.total}>
        <Pagination
          totalPages={result.totalPages}
          page={result.page}
          onChange={result.setPage}
          disabled={!ready}
        />
      </ResultFooter>
    </div>
  );
}

/**
 * 마이페이지 권한 신청 현황 팝업 (시안 temp/페이지/마이페이지/권한신청팝업.png) — 권한관리 카드의 [권한 신청 현황]에서 연다.
 * 조회 조건(상자형 SearchPanel) → 권한 신청 이력 → Total · Pagination. 처리 버튼 없음(Footer 없음).
 * 폭: 시안 1380 → Modal xl 1280 (표준 크기)
 */
export function PermissionRequestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} size="xl">
      <Modal.Header title="권한 신청 현황" />
      <Modal.Body>{open && <PermissionRequestBody />}</Modal.Body>
    </Modal>
  );
}
