import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { DateRangeField, Field, MultiSelect, SelectBox, TextField } from '../../components/field';
import type { DateRange } from '../../components/DatePicker';
import { Icon } from '../../components/Icon';
import { PageLayout } from '../../components/layout';
import { Pagination } from '../../components/Pagination';
import { Segmented } from '../../components/selection';
import { DialogProvider, StatusView, useDialog } from '../common';
import { AppliedFilters } from './AppliedFilters';
import { GridPlaceholder, type GridPlaceholderColumn } from './GridPlaceholder';
import { ResultFooter } from './ResultFooter';
import { ResultPanel } from './ResultPanel';
import { ResultSummary } from './ResultSummary';
import { SearchPanel } from './SearchPanel';
import { useSearchResult, type SearchRequest, type SearchResultPage } from './useSearchResult';

const meta = {
  title: 'Patterns/P01 Search Result',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

// ── 예시 데이터 (KWPC06010201 가맹점 정산 실행/처리) ──────
interface Ledger {
  id: string;
  status: '조치 필요' | '검증대기';
  type: string;
  sourceId: string;
  closedAt: string;
  payDate: string;
  cpid: string;
  merchant: string;
  bizNo: string;
  method: string;
  cycle: string;
  period: string;
  count: number | null;
}

interface LedgerSummary {
  target: number;
  action: number;
  verify: number;
  waiting: number;
  hold: number;
  done: number;
  failed: number;
}

const ROWS: Ledger[] = [
  [
    'STL-0831-01',
    '조치 필요',
    '일반',
    '-',
    '2026-09-01',
    '2026-09-02',
    'CP000101',
    '다우커머스',
    '000-00-00001',
    '신용카드',
    'D+1 영',
    '2026-09-01~2026-09-01',
    1240,
  ],
  [
    'STL-0831-02',
    '검증대기',
    '일반',
    '-',
    '2026-08-31',
    '2026-09-01',
    'CP000102',
    '키움유통',
    '000-00-00002',
    '신용카드',
    'D+1 영',
    '2026-08-31~2026-08-31',
    830,
  ],
  [
    'ADJ-02-01',
    '검증대기',
    '조정',
    'STL-0831-02',
    '2026-08-31',
    '2026-09-01',
    'CP000102',
    '키움유통',
    '000-00-00002',
    '신용카드',
    'D+1 영',
    '-',
    null,
  ],
  [
    'ADJ-02-02',
    '검증대기',
    '조정',
    'STL-0831-02',
    '2026-08-31',
    '2026-09-01',
    'CP000102',
    '키움유통',
    '000-00-00002',
    '신용카드',
    'D+1 영',
    '-',
    null,
  ],
  [
    'ADJ-OFF-01',
    '검증대기',
    '조정',
    'STL-0831-02',
    '2026-08-31',
    '2026-09-01',
    'CP000102',
    '키움유통',
    '000-00-00002',
    '신용카드',
    'D+1 영',
    '-',
    null,
  ],
  [
    'STL-0901-03',
    '검증대기',
    '일반',
    '-',
    '2026-08-31',
    '2026-09-01',
    'CP000103',
    '키움유통',
    '000-00-00002',
    '신용카드',
    'D+1 영',
    '2026-08-31~2026-08-31',
    8,
  ],
  [
    'ADJ-OFF-02',
    '검증대기',
    '조정',
    'STL-0901-03',
    '2026-08-31',
    '2026-09-01',
    'CP000103',
    '키움유통',
    '000-00-00002',
    '신용카드',
    'D+1 영',
    '-',
    null,
  ],
  [
    'STL-0830-04',
    '검증대기',
    '당사환불',
    '-',
    '2026-07-31',
    '2026-08-31',
    'CP000104',
    '새봄리테일',
    '000-00-00004',
    '신용카드',
    'M+1월말',
    '2026-07-01~2026-07-31',
    480,
  ],
  [
    'STL-0829-05',
    '검증대기',
    '관리비',
    '-',
    '2026-08-31',
    '2026-09-01',
    'CP000105',
    '온누리마켓',
    '000-00-00005',
    '신용카드',
    'M+1월초',
    '2026-08-01~2026-08-31',
    390,
  ],
  [
    'STL-0828-06',
    '조치 필요',
    '분리정산',
    '-',
    '2026-09-03',
    '2026-09-10',
    'CP000106',
    '모아쇼핑',
    '000-00-00006',
    '휴대폰결제',
    'D+5 영',
    '2026-08-30~2026-09-03',
    320,
  ],
].map(
  ([
    id,
    status,
    type,
    sourceId,
    closedAt,
    payDate,
    cpid,
    merchant,
    bizNo,
    method,
    cycle,
    period,
    count,
  ]) =>
    ({
      id,
      status,
      type,
      sourceId,
      closedAt: `${closedAt} 00:00:00`,
      payDate,
      cpid,
      merchant,
      bizNo,
      method,
      cycle,
      period,
      count,
    }) as Ledger,
);

const COLUMNS: GridPlaceholderColumn<Ledger>[] = [
  {
    key: 'status',
    header: '정산상태',
    width: 93,
    render: (r) => (
      <Badge size="sm" tone={r.status === '조치 필요' ? 'error' : 'info'}>
        {r.status}
      </Badge>
    ),
  },
  { key: 'type', header: '정산구분', width: 89 },
  { key: 'id', header: '정산원장 ID', width: 140 },
  { key: 'sourceId', header: '원천원장 ID', width: 140 },
  { key: 'closedAt', header: '마감일시', width: 155 },
  { key: 'payDate', header: '지급예정일', width: 120 },
  { key: 'cpid', header: 'CPID', width: 120 },
  { key: 'merchant', header: '가맹점명', width: 120 },
  { key: 'bizNo', header: '사업자번호', width: 120 },
  { key: 'method', header: '결제수단', width: 90 },
  { key: 'cycle', header: '정산주기', width: 90 },
  { key: 'period', header: '정산기간', width: 180 },
  {
    key: 'count',
    header: '정산대상 거래건수',
    width: 118,
    render: (r) => (r.count === null ? '-' : r.count.toLocaleString('ko-KR')),
  },
];

const SUMMARY: LedgerSummary = {
  target: 28,
  action: 4,
  verify: 14,
  waiting: 6,
  hold: 4,
  done: 0,
  failed: 0,
};

const CYCLES = [
  { value: 'd1', label: 'D+1' },
  { value: 'd5', label: 'D+5' },
  { value: 'm1', label: 'M+1' },
];

interface Params {
  cpid: string;
  bizNo: string;
  merchant: string;
  payDate: DateRange;
  quick: string;
  cycles: string[];
}

const INITIAL: Params = {
  cpid: '',
  bizNo: '',
  merchant: '',
  payDate: { start: '', end: '' },
  quick: '',
  cycles: [],
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const mockFetch =
  (mode: 'data' | 'empty' | 'error') =>
  async ({
    page,
    pageSize,
  }: SearchRequest<Params>): Promise<SearchResultPage<Ledger, LedgerSummary>> => {
    await wait(400);
    if (mode === 'error') throw new Error('mock');
    if (mode === 'empty')
      return {
        items: [],
        total: 0,
        summary: { ...SUMMARY, target: 0, action: 0, verify: 0, waiting: 0, hold: 0 },
      };
    const start = (page - 1) * pageSize;
    return {
      items: ROWS.slice(start % ROWS.length, (start % ROWS.length) + pageSize),
      total: SUMMARY.target,
      summary: SUMMARY,
    };
  };

function summaryItems(s?: LedgerSummary) {
  return [
    { label: '조회 대상', value: s?.target },
    { label: '조치 필요', value: s?.action },
    { label: '검증대기', value: s?.verify },
    { label: '지급대기', value: s?.waiting },
    { label: '지급보류', value: s?.hold },
    { label: '지급완료', value: s?.done },
    { label: '지급실패', value: s?.failed },
  ];
}

function appliedItems(p: Params | null) {
  if (!p) return [];
  const items = [];
  if (p.payDate.start || p.payDate.end)
    items.push({ label: '지급예정일', value: `${p.payDate.start} ~ ${p.payDate.end}` });
  items.push({
    label: '정산주기',
    value:
      p.cycles.length === 0 || p.cycles.length === CYCLES.length
        ? '전체'
        : CYCLES.filter((c) => p.cycles.includes(c.value))
            .map((c) => c.label)
            .join(', '),
  });
  if (p.cpid) items.push({ label: 'CPID', value: p.cpid });
  if (p.bizNo) items.push({ label: '사업자번호', value: p.bizNo });
  if (p.merchant) items.push({ label: '가맹점명', value: p.merchant });
  return items;
}

function SettlementScreen({
  mode = 'data',
  autoSearch = false,
}: {
  mode?: 'data' | 'empty' | 'error';
  autoSearch?: boolean;
}) {
  const dialog = useDialog();
  const [selected, setSelected] = useState<string[]>([]);
  const sr = useSearchResult({
    initialParams: autoSearch
      ? { ...INITIAL, payDate: { start: '2026-08-25', end: '2026-09-01' }, quick: '1w' }
      : INITIAL,
    fetch: mockFetch(mode),
    autoSearch,
  });
  const { params, setParam } = sr;
  const ready = sr.status === 'success';

  const runAction = async (name: string) => {
    if (selected.length === 0) {
      await dialog.alert('처리할 원장을 선택해주세요.');
      return;
    }
    if (!(await dialog.confirm(`선택한 원장 ${selected.length}건을 ${name}할까요?`))) return;
    await dialog.alert(`${name} 요청이 완료되었습니다.`);
  };

  const sm = { size: 'sm' as const, variant: 'neutral' as const, appearance: 'line' as const };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '20px 24px',
        background: 'var(--kp-color-bg-page)',
      }}
    >
      <PageLayout.Title
        title="가맹점 정산 실행/처리"
        actions={
          <>
            <SelectBox
              options={[]}
              placeholder="내 검색조건 선택"
              emptyText="저장된 검색조건이 없습니다"
            />
            <Button variant="neutral" appearance="line">
              내 검색조건 관리
            </Button>
          </>
        }
      />
      <SearchPanel
        onSearch={sr.search}
        onReset={sr.reset}
        loading={sr.loading}
        detail={<span>TODO(시안) 상세 검색 조건</span>}
      >
        <Button
          variant="neutral"
          appearance="line"
          onClick={() => dialog.alert('사업자 찾기 (P03 Lookup)')}
        >
          사업자 찾기
        </Button>
        <Field label="CPID" style={{ width: 189 }}>
          <TextField
            fullWidth
            placeholder="CPID 입력"
            value={params.cpid}
            onChange={(e) => setParam('cpid', e.target.value)}
          />
        </Field>
        <Field label="사업자번호" style={{ width: 189 }}>
          <TextField
            fullWidth
            placeholder="사업자번호 입력"
            value={params.bizNo}
            onChange={(e) => setParam('bizNo', e.target.value)}
          />
        </Field>
        <Field label="가맹점명" style={{ flex: '1 1 120px' }}>
          <TextField
            fullWidth
            placeholder="가맹점명을 입력해주세요"
            value={params.merchant}
            onChange={(e) => setParam('merchant', e.target.value)}
          />
        </Field>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Field label="지급예정일">
            <DateRangeField
              value={params.payDate}
              onChange={(v) => sr.setParams({ payDate: v, quick: '' })}
            />
          </Field>
          <Segmented
            size="md"
            value={params.quick}
            onChange={(v) => setParam('quick', v)}
            aria-label="조회 기간"
          >
            <Segmented.Item value="1w">1주일</Segmented.Item>
            <Segmented.Item value="1m">1개월</Segmented.Item>
            <Segmented.Item value="2m">2개월</Segmented.Item>
            <Segmented.Item value="3m">3개월</Segmented.Item>
          </Segmented>
        </div>
        <Field label="정산주기" style={{ width: 273 }}>
          <MultiSelect
            fullWidth
            options={CYCLES}
            value={params.cycles}
            onChange={(v) => setParam('cycles', v)}
            placeholder="선택해주세요"
          />
        </Field>
      </SearchPanel>
      <AppliedFilters items={appliedItems(sr.appliedParams)} />
      <ResultSummary items={summaryItems(sr.summary)} />
      <ResultPanel
        status={sr.status}
        titleActions={
          <>
            <Button {...sm} disabled={!ready}>
              표시항목설정
            </Button>
            <Button {...sm} disabled={!ready}>
              엑셀 다운로드
            </Button>
          </>
        }
        actions={
          <>
            {['지급예정일 일괄 변경', '선택 원장 재산출', '지급보류', '보류해제'].map((name) => (
              <Button key={name} {...sm} disabled={!ready} onClick={() => runAction(name)}>
                {name}
              </Button>
            ))}
            <Button
              size="sm"
              variant="dark"
              disabled={!ready}
              onClick={() => runAction('지급확정')}
            >
              지급확정
            </Button>
            <Button
              size="sm"
              variant="dark"
              disabled={!ready}
              leadingIcon={<Icon name="plus" size={20} />}
            >
              상계 원장 등록
            </Button>
            <Button size="sm" disabled={!ready} leadingIcon={<Icon name="plus" size={20} />}>
              조정 원장 등록
            </Button>
          </>
        }
      >
        <GridPlaceholder
          columns={COLUMNS}
          rows={sr.status === 'success' ? sr.items : []}
          rowKey={(r) => r.id}
          selectable
          selectedKeys={selected}
          onSelectionChange={setSelected}
        />
      </ResultPanel>
      <ResultFooter total={sr.total}>
        <Pagination
          totalPages={sr.totalPages}
          page={sr.page}
          onChange={sr.setPage}
          disabled={!ready}
        />
      </ResultFooter>
    </div>
  );
}

/** 최초 진입: 조회 전 상태 (P-3). [조회]를 누르면 예시 데이터가 나온다 */
export const Initial: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DialogProvider>
      <SettlementScreen />
    </DialogProvider>
  ),
};

/** 조회 결과: 적용 조건 · 요약 · Grid · Pagination. 행을 선택하고 업무 Action을 누르면 Confirm → Alert */
export const Result: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DialogProvider>
      <SettlementScreen autoSearch />
    </DialogProvider>
  ),
};

/** 조회 결과 0건 */
export const Empty: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DialogProvider>
      <SettlementScreen mode="empty" autoSearch />
    </DialogProvider>
  ),
};

/** 결과 영역 상태 표시: 조회 전 · 조회 중 · 0건 · 오류 · 권한 없음 */
export const States: Story = {
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        background: 'var(--kp-color-bg-page)',
        padding: 12,
      }}
    >
      {(['idle', 'loading', 'empty', 'error', 'forbidden'] as const).map((status) => (
        <ResultPanel key={status} title={`조회 결과 · ${status}`} status={status} />
      ))}
      <ResultPanel
        title="문구 · Action 변경"
        status="error"
        statusProps={{
          description: '네트워크 상태를 확인해주세요',
          action: (
            <Button size="sm" variant="neutral">
              다시 시도
            </Button>
          ),
        }}
      />
    </div>
  ),
};

/** StatusView 단독 */
export const StatusViewOnly: Story = {
  name: 'StatusView',
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => <StatusView status="empty" />,
};
