import {
  // 팝업 틀 · 배치
  Modal,
  Stack,
  // 조회 조건 · 결과 (P01)
  SearchPanel,
  Field,
  DateRangeField,
  SelectBox,
  GridPlaceholder,
  StatusView,
  ResultFooter,
  Pagination,
  useSearchResult,
  type GridPlaceholderColumn,
} from '@kiwoompay/design-system';
import { fetchPermissionChanges } from '@/features/mypage/permissionChange.api';
import type {
  PermissionChange,
  PermissionChangeParams,
} from '@/features/mypage/permissionChange.types';
import { useCodeOptions } from '@/hooks/useCodeOptions';
import { codeLabel } from '@/utils/code';
import { rangeOfQuickPeriod } from '@/utils/period';

/**
 * 권한 변경 이력 열 (Figma 폭 164 · 128 · 310 · 178 · 157 · 157 · 104 · 134 = 1332).
 * 팝업 xl 1280 안(1240)에 맞추려고 권한 대상은 남는 폭 · 변경일시 150 · 변경 전 / 후 140 (임의 작업). 권한관리 화면의 최근 변경 이력 표도 같은 열.
 * TODO(IBSheet) IBSheet8 연결 시 같은 순서 · 폭으로
 */
export const PERMISSION_CHANGE_COLUMNS: GridPlaceholderColumn<PermissionChange>[] = [
  { key: 'changedAt', header: '변경일시', width: 150 },
  {
    key: 'type',
    header: '구분',
    width: 128,
    render: (r) => codeLabel('PERMISSION_CHANGE_TYPE', r.type),
  },
  { key: 'target', header: '권한 대상', align: 'left' },
  {
    key: 'kind',
    header: '변경 내용',
    width: 178,
    render: (r) => codeLabel('PERMISSION_CHANGE_KIND', r.kind),
  },
  { key: 'before', header: '변경 전', width: 140 },
  { key: 'after', header: '변경 후', width: 140 },
  { key: 'processor', header: '처리자', width: 104 },
  { key: 'reason', header: '변경 사유', width: 134, align: 'left' },
];

/** 조회 조건 기본값: 변경기간 최근 1개월 (Figma 08-15 ~ 09-15) */
export const createPermissionChangeParams = (): PermissionChangeParams => ({
  period: rangeOfQuickPeriod('1m'),
  type: 'all',
  kind: 'all',
});

function PermissionChangeBody() {
  const types = useCodeOptions('PERMISSION_CHANGE_TYPE', { withAll: true });
  const kinds = useCodeOptions('PERMISSION_CHANGE_KIND', { withAll: true });
  // 내 권한 변경 이력이라 팝업을 열면 바로 조회 (권한 신청 현황과 같은 예외, TODO(정책))
  const result = useSearchResult({
    initialParams: createPermissionChangeParams(),
    fetch: fetchPermissionChanges,
    autoSearch: true,
  });
  const { params, setParam } = result;
  const ready = result.status === 'success';

  return (
    <Stack>
      <SearchPanel
        variant="plain"
        fieldWidth="lg"
        title="조회 조건"
        onSearch={result.search}
        onReset={result.reset}
        loading={result.loading}
      >
        <Field label="변경기간">
          <DateRangeField value={params.period} onChange={(period) => setParam('period', period)} />
        </Field>
        <Field label="구분">
          <SelectBox
            options={types}
            value={params.type}
            onChange={(type) => setParam('type', type)}
          />
        </Field>
        <Field label="변경 유형">
          <SelectBox
            options={kinds}
            value={params.kind}
            onChange={(kind) => setParam('kind', kind)}
          />
        </Field>
      </SearchPanel>

      <Modal.Section title="권한 변경 이력">
        {result.status === 'success' ? (
          <GridPlaceholder
            columns={PERMISSION_CHANGE_COLUMNS}
            rows={result.items}
            rowKey={(r) => r.id}
          />
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
 * 마이페이지 권한관리 · 권한 변경 이력 상세 팝업 (KWPC02020201, Figma 29158:74723) — 권한 변경 이력 탭 [상세보기]에서 연다.
 * 조회 조건(변경기간 · 구분 · 변경 유형) → 권한 변경 이력 → Total · Pagination. 조회 전용 — 제목 줄 닫기(X)로 닫는다.
 * 폭: Figma 1380 → Modal xl 1280 (표준 크기)
 */
export function PermissionChangeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} size="xl">
      <Modal.Header title="권한 변경 이력" closeButton />
      <Modal.Body>{open && <PermissionChangeBody />}</Modal.Body>
    </Modal>
  );
}
