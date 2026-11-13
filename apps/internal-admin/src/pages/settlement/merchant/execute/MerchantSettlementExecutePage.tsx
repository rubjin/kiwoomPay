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
import { fetchSettlementLedgers, requestLedgerAction } from '@/api/settlement/merchantSettlement';
import { BizFinderModal } from '@/components/popups/BizFinderModal';
import type { BizLookupResult } from '@/types/common/bizLookup';
import { useCodeOptions } from '@/hooks/useCodeOptions';
import type { MerchantSettlementSummary } from '@/types/settlement/merchantSettlement';
import { QUICK_PERIODS, rangeOfQuickPeriod } from '@/utils/period';
import { createInitialParams } from './components/initialParams';
import { ledgerColumns } from './components/ledgerColumns';
import { SEARCH_FIELDS } from './components/searchFields';
import {
  HoldReleaseModal,
  PayDateChangeModal,
  PayHoldModal,
} from './components/actions/LedgerActionModals';
import { toActionRows } from './components/actions/ledgerActionRows';

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

/** 선택한 원장에 대해 처리하는 업무 Action. 팝업이 있는 것은 팝업(정산원장 일괄 처리 틀), 나머지는 Confirm (P04) */
type LedgerPopup = 'payDate' | 'hold' | 'release';
const LEDGER_ACTIONS: { label: string; popup?: LedgerPopup }[] = [
  { label: '지급예정일 일괄 변경', popup: 'payDate' },
  // TODO(시안 처리_실행 팝업2.png) 선택 원장 재산출 · 지급확정 · 지급예정일 변경 저장·재산출 팝업 (같은 틀)
  { label: '선택 원장 재산출' },
  { label: '지급보류', popup: 'hold' },
  { label: '보류해제', popup: 'release' },
];

/** KWPC06010201 가맹점 정산 실행/처리 — 페이지 패턴 P01 Search → Result (V04 적용 조건 · 요약, V05 선택 Action) */
export function MerchantSettlementExecutePage() {
  const dialog = useDialog();
  const settlementCycles = useCodeOptions('SETTLEMENT_CYCLE');
  const [selected, setSelected] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const bizLookup = useLookup<BizLookupResult>();
  const [popup, setPopup] = useState<LedgerPopup | null>(null);
  const result = useSearchResult({
    initialParams: createInitialParams(),
    fetch: async (request) => {
      setSelected([]);
      return fetchSettlementLedgers(request);
    },
  });
  const { params, setParam, setParams } = result;
  const ready = result.status === 'success';
  const disabled = !ready || processing;

  const runLedgerAction = async (action: string) => {
    if (selected.length === 0) {
      await dialog.alert('처리할 정산원장을 선택해주세요.');
      return;
    }
    // TODO(정책) 상태별 처리 가능 여부 · 금액 영향 미리보기(P04 V05)는 화면설계서 확인 후
    const ok = await dialog.confirm(
      `선택한 정산원장 ${selected.length}건을 ${action} 처리할까요?`,
      {
        confirmText: action,
      },
    );
    if (!ok) return;
    setProcessing(true);
    try {
      await requestLedgerAction(action, selected);
    } catch {
      setProcessing(false);
      await dialog.alert(`${action} 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.`);
      return;
    }
    // 갱신된 목록 위에 완료 Alert를 띄운다
    await result.refresh();
    setProcessing(false);
    await dialog.alert(`${action} 처리가 완료되었습니다.`);
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
  const popupRows = toActionRows(result.items.filter((l) => selected.includes(l.ledgerId)));
  const popupProps = {
    rows: popupRows,
    onClose: () => setPopup(null),
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
              <Button
                key={label}
                {...line}
                onClick={() => (target ? void openPopup(target) : runLedgerAction(label))}
              >
                {label}
              </Button>
            ))}
            <Button
              size="sm"
              variant="dark"
              disabled={disabled}
              onClick={() => runLedgerAction('지급확정')}
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
          columns={ledgerColumns}
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
      <PayDateChangeModal open={popup === 'payDate'} {...popupProps} />
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
