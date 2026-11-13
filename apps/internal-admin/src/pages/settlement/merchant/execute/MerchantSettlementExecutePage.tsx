import {
  ControlGroup,
  AppliedFilters,
  Button,
  DateRangeField,
  Field,
  GridPlaceholder,
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
  useDialog,
  toAppliedFilters,
  useSearchResult,
  useLookup,
} from '@kiwoompay/design-system';
import { useState } from 'react';
import { fetchSettlementLedgers } from '@/api/settlement/merchantSettlement';
import { BizFinderModal } from '@/components/popups/BizFinderModal';
import type { BizLookupResult } from '@/types/common/bizLookup';
import type { SettlementLedger } from '@/types/settlement/merchantSettlement';
import { useCodeOptions } from '@/hooks/useCodeOptions';
import type { MerchantSettlementSummary } from '@/types/settlement/merchantSettlement';
import { QUICK_PERIODS, rangeOfQuickPeriod } from '@/utils/period';
import { createInitialParams } from './components/initialParams';
import { createLedgerColumns } from './components/ledgerColumns';
import { LedgerDetailModal, type LedgerDetailAction } from './components/detail/LedgerDetailModal';
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
  const [selected, setSelected] = useState<string[]>([]);
  const bizLookup = useLookup<BizLookupResult>();
  const [popup, setPopup] = useState<LedgerPopup | null>(null);
  // 원장 상세 팝업 · 상세에서 연 처리 팝업의 대상(이 원장 하나). 없으면 선택한 원장
  const [detailLedger, setDetailLedger] = useState<SettlementLedger | null>(null);
  const [popupTarget, setPopupTarget] = useState<SettlementLedger[] | null>(null);
  // 지급예정일 일괄 변경 → 저장·재산출: 재조회로 선택이 풀리므로 적용한 원장 · 날짜를 따로 둔다
  const [payDateSave, setPayDateSave] = useState<{ rows: LedgerActionRow[]; date: string } | null>(
    null,
  );
  const result = useSearchResult({
    initialParams: createInitialParams(),
    fetch: async (request) => {
      setSelected([]);
      return fetchSettlementLedgers(request);
    },
  });
  const { params, setParam, setParams } = result;
  const ready = result.status === 'success';
  const disabled = !ready;

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

  const notReady = (name: string) => dialog.alert(`${name}은(는) 준비 중입니다.`);
  const line = { size: 'sm', variant: 'neutral', appearance: 'line', disabled } as const;

  return (
    <>
      <PageLayout.Title
        title="가맹점 정산 실행/처리"
        actions={
          <>
            {/* TODO(P07 V03) 내 검색조건 저장 · 불러오기 */}
            <SelectBox
              options={[]}
              placeholder="내 검색조건 선택"
              emptyText="저장된 검색조건이 없습니다."
            />
            <Button
              variant="neutral"
              appearance="line"
              onClick={() => notReady('내 검색조건 관리')}
            >
              내 검색조건 관리
            </Button>
          </>
        }
      />

      <SearchPanel
        onSearch={result.search}
        onReset={result.reset}
        loading={result.loading}
        detail={<span>TODO(시안) 상세 검색 조건</span>}
      >
        {/* 사업자 찾기 (P03) → 사업자번호 · CPID 조회 범위 반영 */}
        <Button variant="neutral" appearance="line" onClick={() => void findBiz()}>
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
        <Field label="정산주기" style={{ width: 273 }}>
          <MultiSelect
            fullWidth
            options={settlementCycles}
            value={params.cycles}
            onChange={(cycles) => setParam('cycles', cycles)}
            placeholder="선택해주세요"
          />
        </Field>
      </SearchPanel>

      <AppliedFilters items={toAppliedFilters(SEARCH_FIELDS, result.appliedParams)} />
      <ResultSummary items={toSummaryItems(result.summary)} />

      <ResultPanel
        status={result.status}
        titleActions={
          <>
            {/* TODO(P07 V02) 표시항목설정 · 엑셀 다운로드 설정 (ColumnPicker) */}
            <Button {...line} onClick={() => notReady('표시항목설정')}>
              표시항목설정
            </Button>
            <Button {...line} onClick={() => notReady('엑셀 다운로드')}>
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
        {/* TODO(IBSheet) IBSheet8 본체 · 라이선스를 받으면 GridPlaceholder를 IBSheet로 교체 */}
        <GridPlaceholder
          columns={createLedgerColumns(setDetailLedger)}
          rows={ready ? result.items : []}
          rowKey={(row) => row.ledgerId}
          selectable
          selectedKeys={selected}
          onSelectionChange={setSelected}
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
        onClose={() => setPayDateSave(null)}
        onDone={() => result.refresh()}
      />
      <LedgerDetailModal
        ledger={detailLedger}
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
    </>
  );
}
