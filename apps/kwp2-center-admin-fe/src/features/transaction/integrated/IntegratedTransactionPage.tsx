/**
 * 화면ID: [KWPC04010100] 통합 거래내역
 * 위치: 거래내역 > 통합 거래 및 예외 관리 > 통합 거래내역 · /transaction/integrated/list
 */
import {
  AppliedFilters,
  Button,
  PageLayout,
  Pagination,
  ResultFooter,
  ResultPanel,
  ResultSummary,
  SelectBox,
  toAppliedFilters,
  useLookup,
  useSearchResult,
} from '@kiwoompay/design-system';
import { IbsheetGrid } from '@kiwoompay/design-system/ibsheet';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { BizLookupResult } from '@/api/bizLookup.types';
import { BizFinderModal } from '@/components/popups/BizFinderModal';
import { ColumnSettingsModal } from '@/components/popups/ColumnSettingsModal';
import { ExcelDownloadModal } from '@/components/popups/ExcelDownloadModal';
import { SavedSearchModal } from '@/components/popups/SavedSearchModal';
import { fetchIntegratedTransactions } from '@/features/transaction/integratedTransaction.api';
import type { IntegratedTransactionSummary } from '@/features/transaction/integratedTransaction.types';
import { useColumnSettings } from '@/hooks/useColumnSettings';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { TRANSACTION_SAVED_SEARCHES } from '@/mocks/transaction/savedSearches.mock';
import { EXCEL_DEFAULT_KEYS, EXCEL_ITEMS, EXCEL_TYPES } from './components/excelItems';
import { createInitialParams } from './components/initialParams';
import { cardSummary, summaryRows } from './components/savedSearches';
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
  // (임의 작업) ?example=empty → 저장된 조건 없음 예시
  const [searchParams] = useSearchParams();
  const saved = useSavedSearches(
    searchParams.get('example') === 'empty' ? [] : TRANSACTION_SAVED_SEARCHES,
    result.setParams,
  );
  const view = useColumnSettings(transactionColumns);
  const bizLookup = useLookup<BizLookupResult>();

  // 사업자 · CPID 찾기 (P03) — 정산 실행/처리와 같음. 전체 CPID면 CPID 조건은 비운다
  // TODO(정책) 여러 CPID를 조회 조건으로 넘기는 방식(지금은 쉼표로 이어 붙임)
  const findBiz = async () => {
    const found = await bizLookup.open();
    if (!found) return;
    result.setParams({ bizNo: found.bizNo, cpid: found.allCpids ? '' : found.cpids.join(',') });
  };

  const line = { size: 'sm', variant: 'neutral', appearance: 'line', disabled: !ready } as const;

  return (
    <>
      <PageLayout.Title
        title="통합 거래내역"
        actions={
          <>
            <SelectBox
              options={saved.options}
              value={saved.appliedId ?? ''}
              onChange={saved.apply}
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
        onFindBiz={() => void findBiz()}
      />

      <AppliedFilters items={toAppliedFilters(SEARCH_FIELDS, result.appliedParams)} />
      <ResultSummary items={toSummaryItems(result.summary)} />

      <ResultPanel
        status={result.status}
        statusProps={result.status === 'idle' ? { title: '거래내역을 조회해주세요' } : undefined}
        titleActions={
          <>
            <Button {...line} onClick={view.open}>
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
        <IbsheetGrid
          columns={view.columns}
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

      <ExcelDownloadModal
        open={modal === 'excel'}
        items={EXCEL_ITEMS}
        defaultKeys={EXCEL_DEFAULT_KEYS}
        typeOptions={EXCEL_TYPES}
        onClose={() => setModal(null)}
      />
      <SavedSearchModal
        open={modal === 'saved'}
        saved={saved.list}
        appliedId={saved.appliedId}
        currentParams={result.params}
        summaryRows={summaryRows}
        cardSummary={cardSummary}
        onSave={saved.save}
        onClose={() => setModal(null)}
      />
      <ColumnSettingsModal {...view.modalProps} />
      <BizFinderModal
        open={bizLookup.isOpen}
        onSelect={bizLookup.select}
        onCancel={bizLookup.cancel}
      />
    </>
  );
}
