import {
  // 화면 틀
  PageLayout,
  // 검색 조건 영역
  SearchPanel,
  Field,
  DateRangeField,
  Segmented,
  SelectBox,
  TextField,
  // 적용 조건 · 요약
  AppliedFilters,
  ResultSummary,
  // 결과 영역
  ResultPanel,
  GridPlaceholder,
  ResultFooter,
  Pagination,
  // 공통 UI
  Badge,
  Button,
  // 흐름 훅 · 확인/안내 창
  useSearchResult,
  useDialog,
  // 검색 조건 → 칩 문구
  optionLabel,
  toAppliedFilters,
  // 타입
  type DateRange,
  type GridPlaceholderColumn,
  type SearchFieldDef,
  type SearchRequest,
  type SearchResultPage,
} from '@kiwoompay/design-system';
import { useState } from 'react';
import { QUICK_PERIODS, rangeOfQuickPeriod } from '@/utils/period';

/**
 * 레이아웃 패턴 P01 Search → Result 템플릿 (화면 확인용, 임의 작업).
 * 새 조회 화면은 이 구성을 복사해 시작한다: 화면명 → 검색 조건 → 적용 조건 → 요약 → 결과 → Total · Pagination.
 * 가이드: Storybook Patterns/P01 Search Result
 */

interface Params {
  period: DateRange;
  quick: string;
  status: string;
  keyword: string;
}

interface Row {
  id: string;
  status: '정상' | '대기' | '오류';
  name: string;
  date: string;
  amount: number;
}

interface Summary {
  total: number;
  ok: number;
  waiting: number;
  error: number;
}

const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: '정상', label: '정상' },
  { value: '대기', label: '대기' },
  { value: '오류', label: '오류' },
];

const STATUS_TONE = { 정상: 'success', 대기: 'info', 오류: 'error' } as const;

const createInitialParams = (): Params => ({
  period: rangeOfQuickPeriod('1w'),
  quick: '1w',
  status: 'all',
  keyword: '',
});

const SEARCH_FIELDS: SearchFieldDef<Params>[] = [
  { key: 'period', label: '조회기간', format: (p) => `${p.period.start} ~ ${p.period.end}` },
  { key: 'status', label: '상태', format: (p) => optionLabel(STATUS_OPTIONS, p.status) },
  { key: 'keyword', label: '검색어', format: (p) => p.keyword || null },
];

const COLUMNS: GridPlaceholderColumn<Row>[] = [
  {
    key: 'status',
    header: '상태',
    width: 90,
    render: (r) => (
      <Badge size="sm" tone={STATUS_TONE[r.status]}>
        {r.status}
      </Badge>
    ),
  },
  { key: 'id', header: 'ID', width: 140 },
  { key: 'name', header: '이름', width: 240, align: 'left' },
  { key: 'date', header: '일자', width: 120 },
  {
    key: 'amount',
    header: '금액',
    width: 140,
    align: 'right',
    render: (r) => r.amount.toLocaleString('ko-KR'),
  },
];

// 예시 데이터 (임의 작업)
const ALL_ROWS: Row[] = Array.from({ length: 27 }, (_, i) => ({
  id: `ROW-${String(i + 1).padStart(4, '0')}`,
  status: (['정상', '대기', '오류'] as const)[i % 3]!,
  name: `예시 항목 ${i + 1}`,
  date: `2026-11-${String((i % 12) + 1).padStart(2, '0')}`,
  amount: (i + 1) * 12500,
}));

async function fetchRows({
  params,
  page,
  pageSize,
}: SearchRequest<Params>): Promise<SearchResultPage<Row, Summary>> {
  await new Promise((r) => setTimeout(r, 300));
  const rows = ALL_ROWS.filter(
    (r) =>
      (params.status === 'all' || r.status === params.status) &&
      (!params.keyword || r.name.includes(params.keyword) || r.id.includes(params.keyword)),
  );
  const count = (s: Row['status']) => rows.filter((r) => r.status === s).length;
  return {
    items: rows.slice((page - 1) * pageSize, page * pageSize),
    total: rows.length,
    summary: {
      total: rows.length,
      ok: count('정상'),
      waiting: count('대기'),
      error: count('오류'),
    },
  };
}

export function SearchResultPatternPage() {
  const dialog = useDialog();
  const [selected, setSelected] = useState<string[]>([]);
  const result = useSearchResult({ initialParams: createInitialParams(), fetch: fetchRows });
  const { params, setParam } = result;
  const ready = result.status === 'success';
  const s = result.summary;

  const runAction = async () => {
    if (!(await dialog.confirm(`선택한 ${selected.length}건을 처리할까요?`))) return;
    setSelected([]);
    await result.refresh();
    await dialog.alert('처리가 완료되었습니다.');
  };

  return (
    <>
      <PageLayout.Title title="P01 Search → Result (레이아웃 패턴)" />

      <SearchPanel onSearch={result.search} onReset={result.reset} loading={result.loading}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Field label="조회기간">
            <DateRangeField
              value={params.period}
              onChange={(period) => result.setParams({ period, quick: '' })}
            />
          </Field>
          <Segmented
            size="md"
            value={params.quick}
            onChange={(quick) => result.setParams({ quick, period: rangeOfQuickPeriod(quick) })}
            aria-label="조회 기간"
          >
            {QUICK_PERIODS.map((p) => (
              <Segmented.Item key={p.value} value={p.value}>
                {p.label}
              </Segmented.Item>
            ))}
          </Segmented>
        </div>
        <Field label="상태" style={{ width: 200 }}>
          <SelectBox
            fullWidth
            options={STATUS_OPTIONS}
            value={params.status}
            onChange={(status) => setParam('status', status)}
          />
        </Field>
        <Field label="검색어" style={{ flex: '1 1 0' }}>
          <TextField
            fullWidth
            placeholder="ID 또는 이름"
            value={params.keyword}
            onChange={(e) => setParam('keyword', e.target.value)}
          />
        </Field>
      </SearchPanel>

      <AppliedFilters items={toAppliedFilters(SEARCH_FIELDS, result.appliedParams)} />

      <ResultSummary
        items={[
          { label: '전체', value: s?.total, unit: '건' },
          { label: '정상', value: s?.ok, unit: '건' },
          { label: '대기', value: s?.waiting, unit: '건' },
          { label: '오류', value: s?.error, unit: '건' },
        ]}
      />

      <ResultPanel
        status={result.status}
        titleActions={
          <Button size="sm" variant="neutral" appearance="line" disabled={!ready}>
            엑셀 다운로드
          </Button>
        }
        actions={
          <Button
            size="sm"
            variant="dark"
            disabled={!ready || selected.length === 0}
            onClick={runAction}
          >
            선택 처리
          </Button>
        }
      >
        <GridPlaceholder
          columns={COLUMNS}
          rows={ready ? result.items : []}
          rowKey={(r) => r.id}
          selectable
          selectedKeys={selected}
          onSelectionChange={setSelected}
        />
      </ResultPanel>

      <ResultFooter total={result.total}>
        <Pagination
          totalPages={result.totalPages}
          page={result.page}
          onChange={result.setPage}
          disabled={!ready}
        />
      </ResultFooter>
    </>
  );
}
