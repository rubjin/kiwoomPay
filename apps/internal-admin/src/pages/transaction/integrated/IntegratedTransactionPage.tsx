import {
  AppliedFilters,
  Button,
  GridPlaceholder,
  PageLayout,
  Pagination,
  ResultFooter,
  ResultPanel,
  ResultSummary,
  SelectBox,
  toAppliedFilters,
  useDialog,
  useSearchResult,
} from '@kiwoompay/design-system';
import { useState } from 'react';
import { fetchIntegratedTransactions } from '@/api/transaction/integratedTransaction';
import type { IntegratedTransactionSummary } from '@/types/transaction/integratedTransaction';
import { ExcelDownloadModal } from './components/ExcelDownloadModal';
import { createInitialParams } from './components/initialParams';
import { EXAMPLE_SAVED_SEARCHES } from './components/savedSearches';
import { SavedSearchModal } from './components/SavedSearchModal';
import { SEARCH_FIELDS } from './components/searchFields';
import { TransactionCancelBar } from './components/TransactionCancelBar';
import { TransactionSearchPanel } from './components/TransactionSearchPanel';
import { transactionColumns } from './components/transactionColumns';

function toSummaryItems(s?: IntegratedTransactionSummary) {
  const pair = (count?: number, amount?: number) => [
    { value: count, unit: '건' },
    { value: amount, unit: '원' },
  ];
  return [
    { label: '전체 거래', values: pair(s?.totalCount, s?.totalAmount) },
    { label: '승인', values: pair(s?.approvedCount, s?.approvedAmount) },
    { label: '취소', values: pair(s?.cancelledCount, s?.cancelledAmount) },
  ];
}

/**
 * KWPC04010100 통합 거래내역 — 페이지 패턴 P01 (최초진입 검색 조건 접힘) + 선택 거래 취소(P04).
 * 검색 조건 정의(항목 · 순서 · 표시 형식)는 components/searchFields — 적용 조건 칩 · 내 검색조건 요약이 같이 쓴다.
 * 초기값은 components/initialParams, 선택지는 @/constants/options
 */
export function IntegratedTransactionPage() {
  const dialog = useDialog();
  const [selected, setSelected] = useState<string[]>([]);
  const result = useSearchResult({
    initialParams: createInitialParams(),
    fetch: async (request) => {
      setSelected([]);
      return fetchIntegratedTransactions(request);
    },
  });
  const ready = result.status === 'success';
  const [modal, setModal] = useState<'excel' | 'saved' | null>(null);
  // TODO(API) 내 검색조건 목록 · 적용 중인 조건
  const [savedSearches, setSavedSearches] = useState(EXAMPLE_SAVED_SEARCHES);
  const [appliedSearchId, setAppliedSearchId] = useState<string | null>(null);

  /** 저장된 조건을 검색 조건 입력에 넣는다 (조회는 사용자가 [조회]) */
  const applySavedSearch = (id: string | null) => {
    setAppliedSearchId(id);
    const found = savedSearches.find((s) => s.id === id);
    if (found) result.setParams(found.params);
  };

  const notReady = (name: string) => dialog.alert(`${name}은(는) 준비 중입니다.`);

  const line = { size: 'sm', variant: 'neutral', appearance: 'line', disabled: !ready } as const;

  return (
    <>
      <PageLayout.Title
        title="통합 거래내역"
        actions={
          <>
            <SelectBox
              options={savedSearches.map((s) => ({ value: s.id, label: s.name }))}
              value={appliedSearchId ?? ''}
              onChange={applySavedSearch}
              placeholder="내 검색조건 선택"
              emptyText="저장된 검색조건이 없습니다."
            />
            <Button variant="neutral" appearance="line" onClick={() => setModal('saved')}>
              내 검색조건 관리
            </Button>
          </>
        }
      />

      <TransactionSearchPanel
        params={result.params}
        setParam={result.setParam}
        setParams={result.setParams}
        onSearch={result.search}
        onReset={result.reset}
        loading={result.loading}
        onNotReady={notReady}
      />

      <AppliedFilters items={toAppliedFilters(SEARCH_FIELDS, result.appliedParams)} />
      <ResultSummary items={toSummaryItems(result.summary)} />

      <ResultPanel
        status={result.status}
        statusProps={result.status === 'idle' ? { title: '거래내역을 조회해주세요' } : undefined}
        titleActions={
          <>
            {/* TODO 표시항목설정 (ColumnPicker) */}
            <Button {...line} onClick={() => notReady('표시항목설정')}>
              표시항목설정
            </Button>
            <Button {...line} onClick={() => setModal('excel')}>
              엑셀 다운로드
            </Button>
          </>
        }
        actions={
          <TransactionCancelBar
            selected={selected}
            disabled={!ready}
            onCancelled={result.refresh}
          />
        }
      >
        {/* TODO(IBSheet) IBSheet8 본체 · 라이선스를 받으면 GridPlaceholder를 IBSheet로 교체 */}
        <GridPlaceholder
          columns={transactionColumns}
          rows={ready ? result.items : []}
          rowKey={(row) => row.txNo}
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

      <ExcelDownloadModal open={modal === 'excel'} onClose={() => setModal(null)} />
      <SavedSearchModal
        open={modal === 'saved'}
        saved={savedSearches}
        appliedId={appliedSearchId}
        currentParams={result.params}
        onSave={(list, applied) => {
          setSavedSearches(list);
          if (applied !== appliedSearchId) {
            setAppliedSearchId(applied);
            const found = list.find((s) => s.id === applied);
            if (found) result.setParams(found.params);
          }
        }}
        onClose={() => setModal(null)}
      />
    </>
  );
}
