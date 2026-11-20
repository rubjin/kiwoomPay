import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/Button';
import { Stack } from '../../components/layout';
import { Pagination } from '../../components/Pagination';
import { IbsheetGrid, type IbsheetColumn } from '../../ibsheet';
import { AppliedFilters } from './AppliedFilters';
import { GridPlaceholder, type GridPlaceholderColumn } from './GridPlaceholder';
import { ResultFooter } from './ResultFooter';
import { ResultPanel } from './ResultPanel';
import { ResultSummary } from './ResultSummary';

const meta = {
  title: 'Composites/Result/Result Parts',
  parameters: { layout: 'padded' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const bg = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 12,
  padding: 12,
  background: 'var(--kp-color-bg-page)',
};

/** 적용된 검색 조건: 조회 전 안내 · 조회 후 칩 (조회에 사용한 조건) */
export const AppliedFilter: Story = {
  name: 'AppliedFilters',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={bg}>
      <AppliedFilters items={[]} />
      <AppliedFilters
        items={[
          { label: '조회기간', value: '2026-08-25 00:00 ~ 2026-08-31 23:59' },
          { label: '거래구분', value: '전체' },
          { label: '결제수단', value: '신용카드, 간편결제' },
        ]}
      />
    </div>
  ),
};

/** 조회 요약: 값 1개 (건) · 값 여러 개 (건 • 원) · 조회 전 '-' */
export const Summary: Story = {
  name: 'ResultSummary',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={bg}>
      <ResultSummary
        items={[
          { label: '조회 대상', value: 28 },
          { label: '조치 필요', value: 4 },
          { label: '지급완료', value: null },
        ]}
      />
      <ResultSummary
        items={[
          { label: '전체 거래', values: [{ value: 11080 }, { value: 918900000, unit: '원' }] },
          { label: '승인', values: [{ value: 9842 }, { value: 842560000, unit: '원' }] },
          { label: '취소', values: [{ value: undefined }, { value: undefined, unit: '원' }] },
        ]}
      />
    </div>
  ),
};

const PANEL_COLUMNS: GridPlaceholderColumn<{ id: string; name: string }>[] = [
  { key: 'id', header: '거래번호', width: 200 },
  { key: 'name', header: '가맹점명', width: 200 },
];
const PANEL_ROWS = [
  { id: 'T001', name: '키움쇼핑' },
  { id: 'T002', name: '다우커머스' },
];

/** 조회 결과 카드 + Total · Pagination. Grid는 IBSheet8 (여기서는 GridPlaceholder 미리보기) */
export const Panel: Story = {
  name: 'ResultPanel · ResultFooter',
  parameters: {
    controls: { disable: true },
    tempWork: 'GridPlaceholder 미리보기 + 아래 IBSheet 적용 (비교)',
  },
  render: () => (
    <div style={bg}>
      <ResultPanel
        titleActions={
          <Button size="sm" variant="neutral" appearance="line">
            엑셀 다운로드
          </Button>
        }
        actions={<Button size="sm">등록</Button>}
      >
        <Stack gap={24}>
          <GridPlaceholder
            columns={PANEL_COLUMNS}
            rows={PANEL_ROWS}
            rowKey={(r) => r.id}
            selectable
          />
          {/* IBSheet 적용 (기존 표 아래, vendor/ibsheet가 없으면 그리지 않음) */}
          <IbsheetGrid columns={PANEL_COLUMNS} rows={PANEL_ROWS} rowKey={(r) => r.id} selectable />
        </Stack>
      </ResultPanel>
      <ResultFooter total={2}>
        <Pagination totalPages={1} page={1} />
      </ResultFooter>
    </div>
  ),
};

interface LedgerRow {
  id: string;
  type: string;
  status: string;
  payDate: string;
  amount: number;
  memo: string;
}
const LEDGER_ROWS: LedgerRow[] = [
  {
    id: 'STL-0831-01',
    type: '일반',
    status: '조치 필요',
    payDate: '2026-09-02',
    amount: 11800000,
    memo: '계좌 확인 필요',
  },
  {
    id: 'STL-0831-02',
    type: '일반',
    status: '검증대기',
    payDate: '2026-09-01',
    amount: 6800000,
    memo: '한도초과액 이월',
  },
  {
    id: 'ADJ-02-01',
    type: '조정',
    status: '검증대기',
    payDate: '2026-09-01',
    amount: -169750,
    memo: '원장 반영 완료',
  },
  {
    id: 'STL-0830-04',
    type: '당사환불',
    status: '지급완료',
    payDate: '2026-08-31',
    amount: 4900000,
    memo: '정정 확인 완료',
  },
];
const LEDGER_COLUMNS: IbsheetColumn<LedgerRow>[] = [
  { key: 'status', header: '정산상태', width: 93 },
  { key: 'type', header: '정산구분', width: 89 },
  { key: 'id', header: '정산원장 ID', width: 140 },
  {
    key: 'payDate',
    header: '지급예정일',
    width: 120,
    // 지급완료가 아니면 고칠 수 있음 (머리 이름 옆 연필, 칸은 평소 글자 · 마우스 올린 줄에 달력)
    edit: { type: 'date', value: (r) => r.payDate, canEdit: (r) => r.status !== '지급완료' },
  },
  {
    key: 'amount',
    header: '최종지급\n예정금액',
    width: 118,
    align: 'right',
    render: (r) => r.amount.toLocaleString('ko-KR'),
  },
  {
    key: 'memo',
    header: '처리메모',
    width: 220,
    align: 'left',
    edit: { type: 'text', value: (r) => r.memo },
  },
];

/**
 * IbsheetGrid 옵션 (vendor/ibsheet가 없으면 같은 props로 GridPlaceholder).
 * 머리: 연필(edit 열) · 깔때기(filterable) · 정렬(sortable, 맨 오른쪽 · 칸 끝 20 · 필터와 4) — 머리가 다 보이게 열 폭 자동 확대.
 * 선택: isRowSelectable false(조정 원장)는 비활성 체크박스. 두 줄 열 이름(\n)은 headerHeight 56.
 * 글자: 기본 14, 열이 많고 내용이 긴 표만 textSize="sm"(13 — 정산 원장)
 */
export const GridOptions: Story = {
  name: 'IbsheetGrid 옵션',
  parameters: {
    controls: { disable: true },
    tempWork: '머리 필터 패널 · 정렬 안 함 아이콘(sort-asc 회색) 시안 없음',
  },
  render: () => (
    <div style={bg}>
      {(['md', 'sm'] as const).map((size) => (
        <ResultPanel
          key={size}
          title={size === 'md' ? '조회 결과 (textSize md · 14)' : '정산 원장 (textSize sm · 13)'}
        >
          <IbsheetGrid
            columns={LEDGER_COLUMNS}
            rows={LEDGER_ROWS}
            rowKey={(r) => r.id}
            selectable
            isRowSelectable={(r) => r.type !== '조정'}
            filterable
            sortable
            headerHeight={56}
            textSize={size}
            onCellEdit={(row, key, value) => console.info('onCellEdit', row.id, key, value)}
          />
        </ResultPanel>
      ))}
    </div>
  ),
};

/** 결과 상태: success 외에는 Grid 머리 아래에 StatusView */
export const PanelStates: Story = {
  name: 'ResultPanel 상태',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ ...bg, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
      <ResultPanel status="idle" statusProps={{ title: '거래내역을 조회해주세요' }} />
      <ResultPanel status="empty" />
    </div>
  ),
};
