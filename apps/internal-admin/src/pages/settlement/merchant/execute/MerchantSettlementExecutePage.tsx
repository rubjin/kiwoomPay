import {
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
  useSearchResult,
  type AppliedFilter,
} from '@kiwoompay/design-system';
import { useState } from 'react';
import { fetchSettlementLedgers, requestLedgerAction } from '@/api/settlement/merchantSettlement';
import type {
  MerchantSettlementParams,
  MerchantSettlementSummary,
} from '@/types/settlement/merchantSettlement';
import { QUICK_PERIODS, rangeOfQuickPeriod } from '@/utils/period';
import { ledgerColumns } from './components/ledgerColumns';

const CYCLE_OPTIONS = [
  { value: 'D1', label: 'D+1' },
  { value: 'D5', label: 'D+5' },
  { value: 'M1_END', label: 'M+1 월말' },
  { value: 'M1_START', label: 'M+1 월초' },
];

const INITIAL_PARAMS: MerchantSettlementParams = {
  cpid: '',
  bizNo: '',
  merchantName: '',
  payDate: { start: '', end: '' },
  quickPeriod: '',
  cycles: [],
};

function toAppliedFilters(params: MerchantSettlementParams | null): AppliedFilter[] {
  if (!params) return [];
  const items: AppliedFilter[] = [];
  const { start, end } = params.payDate;
  if (start || end) items.push({ label: '지급예정일', value: `${start} ~ ${end}` });
  const cycles = CYCLE_OPTIONS.filter((o) => params.cycles.includes(o.value));
  items.push({
    label: '정산주기',
    value:
      cycles.length === 0 || cycles.length === CYCLE_OPTIONS.length
        ? '전체'
        : cycles.map((o) => o.label).join(', '),
  });
  if (params.cpid) items.push({ label: 'CPID', value: params.cpid });
  if (params.bizNo) items.push({ label: '사업자번호', value: params.bizNo });
  if (params.merchantName) items.push({ label: '가맹점명', value: params.merchantName });
  return items;
}

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

/** 선택한 원장에 대해 처리하는 업무 Action (P04: 선택 확인 → Confirm → 처리 → Alert) */
const LEDGER_ACTIONS = ['지급예정일 일괄 변경', '선택 원장 재산출', '지급보류', '보류해제'];

/** KWPC06010201 가맹점 정산 실행/처리 — 페이지 패턴 P01 Search → Result (V04 적용 조건 · 요약, V05 선택 Action) */
export function MerchantSettlementExecutePage() {
  const dialog = useDialog();
  const [selected, setSelected] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const result = useSearchResult({
    initialParams: INITIAL_PARAMS,
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
      await dialog.alert(`${action} 처리가 완료되었습니다.`);
      void result.setPage(result.page);
    } catch {
      await dialog.alert(`${action} 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.`);
    } finally {
      setProcessing(false);
    }
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
        {/* TODO(P03) 사업자 찾기 Lookup → 사업자번호 반영 */}
        <Button variant="neutral" appearance="line" onClick={() => notReady('사업자 찾기')}>
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
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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
        </div>
        <Field label="정산주기" style={{ width: 273 }}>
          <MultiSelect
            fullWidth
            options={CYCLE_OPTIONS}
            value={params.cycles}
            onChange={(cycles) => setParam('cycles', cycles)}
            placeholder="선택해주세요"
          />
        </Field>
      </SearchPanel>

      <AppliedFilters items={toAppliedFilters(result.appliedParams)} />
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
            {LEDGER_ACTIONS.map((action) => (
              <Button key={action} {...line} onClick={() => runLedgerAction(action)}>
                {action}
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
    </>
  );
}
