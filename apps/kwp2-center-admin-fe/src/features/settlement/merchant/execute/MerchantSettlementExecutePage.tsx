/**
 * 화면ID: [KWPC06010201] 가맹점 정산 실행/처리
 *         [KWPC06010202] 가맹점 정산 실행/처리 · 조회결과 (화면설계서 v0.4)
 * 위치: 정산내역 > 가맹점 정산 관리 > 정산 실행/처리 · /settlement/merchant/execute
 */
import {
  ControlGroup,
  AppliedFilters,
  Button,
  DateRangeField,
  Field,
  Icon,
  MultiSelect,
  PageLayout,
  Pagination,
  ResultFooter,
  ResultPanel,
  ResultSummary,
  SearchPanel,
  Segmented,
  SelectBox,
  TextField,
  useAction,
  useDialog,
  toAppliedFilters,
  useSearchResult,
  useLookup,
} from '@kiwoompay/design-system';
import { IbsheetGrid } from '@kiwoompay/design-system/ibsheet';
import { useState, type ReactNode } from 'react';
import {
  fetchSettlementLedgers,
  requestLedgerAction,
} from '@/features/settlement/merchantSettlement.api';
import { BizFinderModal } from '@/components/popups/BizFinderModal';
import { ColumnSettingsModal } from '@/components/popups/ColumnSettingsModal';
import { ExcelDownloadModal } from '@/components/popups/ExcelDownloadModal';
import { SavedSearchModal } from '@/components/popups/SavedSearchModal';
import type { BizLookupResult } from '@/api/bizLookup.types';
import type { SettlementLedger } from '@/features/settlement/merchantSettlement.types';
import { useCodeOptions } from '@/hooks/useCodeOptions';
import { useColumnSettings } from '@/hooks/useColumnSettings';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import type { MerchantSettlementSummary } from '@/features/settlement/merchantSettlement.types';
import { SETTLEMENT_SAVED_SEARCHES } from '@/mocks/settlement/savedSearches.mock';
import { QUICK_PERIODS, rangeOfQuickPeriod } from '@/utils/period';
import { createInitialParams } from './components/initialParams';
import { createLedgerColumns, isAdjustLedger } from './components/ledgerColumns';
import { cardSummary, summaryRows } from './components/savedSearches';
import {
  LedgerDetailModal,
  type LedgerDetailAction,
  type LedgerDetailTab,
} from './components/detail/LedgerDetailModal';
import { SEARCH_FIELDS } from './components/searchFields';
import {
  HoldReleaseModal,
  PayDateChangeModal,
  PayHoldModal,
} from './components/actions/LedgerActionModals';
import { toActionRows, type LedgerActionRow } from './components/actions/ledgerActionRows';
import {
  PayConfirmModal,
  PayDateSaveModal,
  RecalcModal,
} from './components/actions/LedgerConfirmModals';

/** 멀티셀렉트 표시 — 모두 고르면 "전체" (Figma 정산주기 "전체") */
const allOrNames =
  (total: number) =>
  (picked: { label: ReactNode }[]): ReactNode =>
    picked.length === total ? '전체' : picked.map((o) => o.label).join(', ');

function toSummaryItems(summary?: MerchantSettlementSummary) {
  return [
    { label: '조회 대상', value: summary?.target },
    { label: '조치 필요', value: summary?.actionRequired },
    { label: '검증대기', value: summary?.verifying },
    { label: '지급대기', value: summary?.waiting },
    { label: '지급보류', value: summary?.hold },
    { label: '지급완료', value: summary?.paid },
    { label: '지급실패', value: summary?.failed },
  ];
}

/** 선택한 원장에 대해 처리하는 업무 Action — 모두 정산원장 일괄 처리 팝업 (시안 처리_실행 팝업 · 팝업2) */
type LedgerPopup = 'payDate' | 'recalc' | 'hold' | 'release' | 'confirm';
const LEDGER_ACTIONS: { label: string; popup: LedgerPopup }[] = [
  { label: '지급예정일 일괄 변경', popup: 'payDate' },
  { label: '선택 원장 재산출', popup: 'recalc' },
  { label: '지급보류', popup: 'hold' },
  { label: '보류해제', popup: 'release' },
];

/** KWPC06010201 가맹점 정산 실행/처리 — 페이지 패턴 P01 Search → Result (V04 적용 조건 · 요약, V05 선택 Action) */
export function MerchantSettlementExecutePage() {
  const dialog = useDialog();
  const settlementCycles = useCodeOptions('SETTLEMENT_CYCLE');
  const payMethods = useCodeOptions('SETTLEMENT_PAY_METHOD');
  const settlementTypes = useCodeOptions('SETTLEMENT_TYPE');
  const reasons = useCodeOptions('SETTLEMENT_REASON');
  const [selected, setSelected] = useState<string[]>([]);
  const bizLookup = useLookup<BizLookupResult>();
  const [popup, setPopup] = useState<LedgerPopup | null>(null);
  // 원장 상세 팝업 · 상세에서 연 처리 팝업의 대상(이 원장 하나). 없으면 선택한 원장
  const [detailLedger, setDetailLedger] = useState<SettlementLedger | null>(null);
  const [detailTab, setDetailTab] = useState<LedgerDetailTab>('basis');
  // 표에서 고친 칸 (원장 ID → 바뀐 값). 저장 전 임시 표시, 다시 조회하면 비운다 (화면설계서 ③)
  const [edits, setEdits] = useState<Record<string, Partial<SettlementLedger>>>({});
  const [popupTarget, setPopupTarget] = useState<SettlementLedger[] | null>(null);
  // 지급예정일 일괄 변경 → 저장·재산출: 재조회로 선택이 풀리므로 적용한 원장 · 날짜를 따로 둔다
  // 칸 편집에서 열었으면 fromCell = 그 원장 ID (취소하면 임시 값을 되돌린다)
  const [payDateSave, setPayDateSave] = useState<{
    rows: LedgerActionRow[];
    date: string;
    fromCell?: string;
  } | null>(null);
  const result = useSearchResult({
    initialParams: createInitialParams(),
    fetch: async (request) => {
      setSelected([]);
      setEdits({});
      return fetchSettlementLedgers(request);
    },
  });
  const { params, setParam, setParams } = result;
  const ready = result.status === 'success';
  const disabled = !ready;
  const [modal, setModal] = useState<'excel' | 'saved' | null>(null);
  const saved = useSavedSearches(SETTLEMENT_SAVED_SEARCHES, setParams);
  const openDetail = (ledger: SettlementLedger, tab: LedgerDetailTab = 'basis') => {
    setDetailTab(tab);
    setDetailLedger(ledger);
  };
  const notReady = (name: string) => dialog.alert(`${name}은(는) 준비 중입니다.`);
  const ledgerColumns = createLedgerColumns({
    onOpenDetail: openDetail,
    // 원천원장 ID → 그 원장 상세 (지금 페이지에 있을 때). TODO(API) 원장 ID로 상세 조회
    onOpenSource: (id) => {
      const source = result.items.find((l) => l.ledgerId === id);
      if (source) openDetail(source);
      else void dialog.alert(`${id} 원장은 현재 목록에 없습니다.`);
    },
    onNotReady: (name) => void notReady(name),
  });
  const view = useColumnSettings(ledgerColumns);
  // 엑셀 출력 항목 = 표 열 전체 (TODO(API) 엑셀 전용 항목이 따로 있으면 교체)
  const excelItems = ledgerColumns.map((col) => ({
    key: col.key,
    label: String(col.header).replace(/\n/g, ' '),
  }));
  const rows = result.items.map((l) => (edits[l.ledgerId] ? { ...l, ...edits[l.ledgerId] } : l));

  // 칸 편집 — 지급예정일은 저장·재산출 팝업(사유 · 검증)으로, 정산담당자 · 처리메모는 바로 저장 (TODO(API))
  const saveNote = useAction({
    run: (ledgerId: string) => requestLedgerAction('note', [ledgerId]),
    failure: '저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  });
  const editCell = (ledger: SettlementLedger, key: string, value: string) => {
    setEdits((prev) => ({
      ...prev,
      [ledger.ledgerId]: { ...prev[ledger.ledgerId], [key]: value },
    }));
    if (key === 'payDate') {
      setPayDateSave({ rows: toActionRows([ledger]), date: value, fromCell: ledger.ledgerId });
      return;
    }
    void saveNote.execute(ledger.ledgerId);
  };

  // 전체 CPID면 CPID 조건은 비운다. TODO(정책) 여러 CPID를 조회 조건으로 넘기는 방식(지금은 쉼표로 이어 붙임)
  const findBiz = async () => {
    const found = await bizLookup.open();
    if (!found) return;
    setParams({ bizNo: found.bizNo, cpid: found.allCpids ? '' : found.cpids.join(',') });
  };

  // 선택 확인 후 팝업. 팝업 안에서 [제외] · 입력 · 검증 → 처리 → 재조회 → 완료 안내
  const openPopup = async (target: LedgerPopup) => {
    if (selected.length === 0) {
      await dialog.alert('처리할 정산원장을 선택해주세요.');
      return;
    }
    setPopup(target);
  };
  const popupRows = toActionRows(
    popupTarget ?? result.items.filter((l) => selected.includes(l.ledgerId)),
  );
  // 상세 팝업 처리 버튼 → 같은 일괄 처리 팝업을 이 원장 하나로 (상세는 뒤에 열린 채)
  const fromDetail = (action: LedgerDetailAction, ledger: SettlementLedger) => {
    setPopupTarget([ledger]);
    setPopup(action);
  };
  const popupProps = {
    rows: popupRows,
    onClose: () => {
      setPopup(null);
      setPopupTarget(null);
    },
    onDone: () => result.refresh(),
  };

  const line = { size: 'sm', variant: 'neutral', appearance: 'line', disabled } as const;

  return (
    <>
      <PageLayout.Title
        title="가맹점 정산 실행/처리"
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

      <SearchPanel
        onSearch={result.search}
        onReset={result.reset}
        loading={result.loading}
        detail={
          // 상세 검색: 결제수단 · 정산구분 · 처리사유 (선택지 Figma Multi-select 29620:102092).
          // (임의 작업) TODO(시안) 상세 검색 배치 시안 없음 — 통합 거래내역처럼 격자
          <SearchPanel.Grid columns={5}>
            <Field label="결제수단">
              <MultiSelect
                fullWidth
                options={payMethods}
                value={params.payMethods}
                onChange={(payMethods) => setParam('payMethods', payMethods)}
                renderValue={allOrNames(payMethods.length)}
                placeholder="전체"
              />
            </Field>
            <Field label="정산구분">
              <MultiSelect
                fullWidth
                options={settlementTypes}
                value={params.types}
                onChange={(types) => setParam('types', types)}
                renderValue={allOrNames(settlementTypes.length)}
                placeholder="전체"
              />
            </Field>
            <Field label="처리사유">
              <MultiSelect
                fullWidth
                options={reasons}
                value={params.reasons}
                onChange={(picked) => setParam('reasons', picked)}
                renderValue={allOrNames(reasons.length)}
                placeholder="전체"
              />
            </Field>
          </SearchPanel.Grid>
        }
      >
        {/* 사업자 찾기 (P03) → 사업자번호 · CPID 조회 범위 반영 */}
        <Button variant="neutral" appearance="line" onClick={() => void findBiz()}>
          사업자 찾기
        </Button>
        <Field label="CPID">
          <TextField
            fieldWidth="sm"
            placeholder="CPID 입력"
            value={params.cpid}
            onChange={(e) => setParam('cpid', e.target.value)}
          />
        </Field>
        <Field label="사업자번호">
          <TextField
            fieldWidth="sm"
            placeholder="사업자번호 입력"
            value={params.bizNo}
            onChange={(e) => setParam('bizNo', e.target.value)}
          />
        </Field>
        <Field label="가맹점명" grow>
          <TextField
            fullWidth
            placeholder="가맹점명을 입력해주세요"
            value={params.merchantName}
            onChange={(e) => setParam('merchantName', e.target.value)}
          />
        </Field>
        <ControlGroup>
          <Field label="지급예정일">
            <DateRangeField
              value={params.payDate}
              onChange={(payDate) => setParams({ payDate, quickPeriod: '' })}
            />
          </Field>
          <Segmented
            size="md"
            aria-label="지급예정일 기간"
            value={params.quickPeriod}
            onChange={(quickPeriod) =>
              setParams({ quickPeriod, payDate: rangeOfQuickPeriod(quickPeriod) })
            }
          >
            {QUICK_PERIODS.map((p) => (
              <Segmented.Item key={p.value} value={p.value}>
                {p.label}
              </Segmented.Item>
            ))}
          </Segmented>
        </ControlGroup>
        <Field label="정산주기">
          <MultiSelect
            fieldWidth="md"
            options={settlementCycles}
            value={params.cycles}
            onChange={(cycles) => setParam('cycles', cycles)}
            renderValue={allOrNames(settlementCycles.length)}
            placeholder="전체"
          />
        </Field>
      </SearchPanel>

      <AppliedFilters items={toAppliedFilters(SEARCH_FIELDS, result.appliedParams)} />
      <ResultSummary items={toSummaryItems(result.summary)} />

      <ResultPanel
        status={result.status}
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
          <>
            {LEDGER_ACTIONS.map(({ label, popup: target }) => (
              <Button key={label} {...line} onClick={() => void openPopup(target)}>
                {label}
              </Button>
            ))}
            <Button
              size="sm"
              variant="dark"
              disabled={disabled}
              onClick={() => void openPopup('confirm')}
            >
              지급확정
            </Button>
            <Button
              size="sm"
              variant="dark"
              disabled={disabled}
              leadingIcon={<Icon name="plus" size={20} />}
              onClick={() => notReady('상계 원장 등록')}
            >
              상계 원장 등록
            </Button>
            <Button
              size="sm"
              disabled={disabled}
              leadingIcon={<Icon name="plus" size={20} />}
              onClick={() => notReady('조정 원장 등록')}
            >
              조정 원장 등록
            </Button>
          </>
        }
      >
        <IbsheetGrid
          columns={view.columns}
          rows={ready ? rows : []}
          rowKey={(row) => row.ledgerId}
          selectable
          // 일반 원장만 체크박스 — 조정 원장은 일괄 처리 대상에서 제외 (화면설계서 ②)
          isRowSelectable={(row) => !isAdjustLedger(row)}
          selectedKeys={selected}
          onSelectionChange={setSelected}
          filterable
          sortable
          // 두 줄 열 이름 (정산대상 거래건수 · 차액정산 대상금액 · 최종지급 예정금액) — Figma 머리 56
          headerHeight={56}
          // 열이 많고 내용이 긴 표라 글자 13 (다른 데이터 표는 14 — 확정 결정 "데이터 표 글자")
          textSize="sm"
          onCellEdit={editCell}
        />
      </ResultPanel>

      <ResultFooter total={result.total}>
        <Pagination
          totalPages={result.totalPages}
          page={result.page}
          onChange={(page) => {
            setSelected([]);
            result.setPage(page);
          }}
          disabled={!ready}
        />
      </ResultFooter>
      <PayDateChangeModal
        open={popup === 'payDate'}
        {...popupProps}
        onApplied={(rows, date) => setPayDateSave({ rows, date })}
      />
      <PayDateSaveModal
        open={payDateSave !== null}
        rows={payDateSave?.rows ?? []}
        newPayDate={payDateSave?.date ?? ''}
        onClose={() => {
          // 칸 편집에서 열었는데 저장하지 않고 닫으면 임시 값을 되돌린다 (저장하면 재조회가 비운다)
          const id = payDateSave?.fromCell;
          if (id) {
            setEdits((prev) => {
              const next = { ...prev };
              if (next[id]) {
                const { payDate: _payDate, ...rest } = next[id];
                next[id] = rest;
              }
              return next;
            });
          }
          setPayDateSave(null);
        }}
        onDone={() => result.refresh()}
      />
      <LedgerDetailModal
        ledger={detailLedger}
        initialTab={detailTab}
        onClose={() => setDetailLedger(null)}
        onAction={fromDetail}
      />
      <RecalcModal open={popup === 'recalc'} {...popupProps} />
      <PayConfirmModal open={popup === 'confirm'} {...popupProps} />
      <PayHoldModal open={popup === 'hold'} {...popupProps} />
      <HoldReleaseModal open={popup === 'release'} {...popupProps} />
      <BizFinderModal
        open={bizLookup.isOpen}
        onSelect={bizLookup.select}
        onCancel={bizLookup.cancel}
      />
      <ColumnSettingsModal {...view.modalProps} />
      <ExcelDownloadModal
        open={modal === 'excel'}
        items={excelItems}
        defaultKeys={excelItems.map((item) => item.key)}
        onClose={() => setModal(null)}
      />
      <SavedSearchModal
        open={modal === 'saved'}
        saved={saved.list}
        appliedId={saved.appliedId}
        currentParams={params}
        summaryRows={summaryRows}
        cardSummary={cardSummary}
        onSave={saved.save}
        onClose={() => setModal(null)}
      />
    </>
  );
}
