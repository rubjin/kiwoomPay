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
  Badge,
  type BadgeTone,
  type GridPlaceholderColumn,
} from '@kiwoompay/design-system';
import { fetchLoginHistory } from '@/features/mypage/accountHistory.api';
import type {
  LoginHistory,
  LoginHistoryParams,
  LoginResult,
  LoginState,
} from '@/features/mypage/accountHistory.types';
import { useCodeOptions } from '@/hooks/useCodeOptions';
import { codeLabel } from '@/utils/code';
import { orDash } from '@/utils/format';
import { toYmd } from '@/utils/period';

const RESULT_TONE: Record<LoginResult, BadgeTone> = {
  SUCCESS: 'success',
  FAIL: 'error',
  UNLOCK: 'info',
};

const STATE_TONE: Record<LoginState, BadgeTone> = {
  NORMAL: 'success',
  LOCKED: 'error',
};

/** 로그인 이력 열 (Figma 폭 154 · 107 × 4 · 사유 나머지). TODO(IBSheet) IBSheet8 연결 시 같은 순서 · 폭으로 */
const COLUMNS: GridPlaceholderColumn<LoginHistory>[] = [
  { key: 'loggedAt', header: '로그인 일시', width: 154 },
  {
    key: 'result',
    header: '로그인 결과',
    width: 107,
    render: (r) => (
      <Badge tone={RESULT_TONE[r.result]}>{codeLabel('LOGIN_RESULT', r.result)}</Badge>
    ),
  },
  { key: 'ip', header: '접속 IP', width: 107 },
  { key: 'authMethod', header: '인증방식', width: 107 },
  {
    key: 'state',
    header: '로그인 상태',
    width: 107,
    render: (r) => <Badge tone={STATE_TONE[r.state]}>{codeLabel('LOGIN_STATE', r.state)}</Badge>,
  },
  { key: 'reason', header: '사유', align: 'left', render: (r) => orDash(r.reason) },
];

/** 기본 조회기간: 최근 30일 (Figma 안내 문구) */
function createInitialParams(): LoginHistoryParams {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 30);
  return { period: { start: toYmd(start), end: toYmd(end) }, result: 'all' };
}

// 로그인 결과 칸 (라벨 + 8 + 셀렉트 = Figma 301)
const RESULT_FIELD = { width: 301 };

function LoginHistoryBody() {
  const results = useCodeOptions('LOGIN_RESULT', { withAll: true });
  // 내 로그인 이력이라 팝업을 열면 바로 조회 (권한 신청 현황과 같은 예외, TODO(정책))
  const result = useSearchResult({
    initialParams: createInitialParams(),
    fetch: fetchLoginHistory,
    autoSearch: true,
  });
  const { params, setParam } = result;
  const ready = result.status === 'success';

  return (
    <Stack>
      <SearchPanel
        variant="box"
        title="조회 조건"
        description="기본 조회기간은 최근 30일이며, 로그인 일시 기준 최신순으로 정렬됩니다."
        onSearch={result.search}
        onReset={result.reset}
        loading={result.loading}
      >
        <Field label="조회기간">
          <DateRangeField value={params.period} onChange={(period) => setParam('period', period)} />
        </Field>
        <Field label="로그인 결과" style={RESULT_FIELD}>
          <SelectBox
            fullWidth
            options={results}
            value={params.result}
            onChange={(value) => setParam('result', value)}
          />
        </Field>
      </SearchPanel>

      <Modal.Section title="로그인 이력">
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
 * 마이페이지 계정관리 · 로그인 이력 팝업 (Figma 28960:83084) — [로그인 이력]에서 연다.
 * 조회 조건(상자형 SearchPanel + 안내) → 로그인 이력 → Total · Pagination. 처리 버튼 없음 — 제목 줄 닫기(X)로 닫는다.
 * 폭: Figma 922 → Modal lg 880 (표준 크기)
 */
export function LoginHistoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <Modal.Header title="로그인 이력" closeButton />
      <Modal.Body>{open && <LoginHistoryBody />}</Modal.Body>
    </Modal>
  );
}
