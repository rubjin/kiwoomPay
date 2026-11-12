import {
  ActionBar,
  AppliedFilters,
  Button,
  Checkbox,
  DateField,
  Field,
  GridPlaceholder,
  LookupField,
  PageLayout,
  Pagination,
  Radio,
  RadioGroup,
  ResultFooter,
  ResultPanel,
  ResultSummary,
  SearchPanel,
  Segmented,
  SelectBox,
  TextField,
  useDialog,
  useSearchResult,
  optionLabel,
  toAppliedFilters,
} from '@kiwoompay/design-system';
import { useState } from 'react';
import {
  cancelTransactions,
  fetchIntegratedTransactions,
} from '@/api/transaction/integratedTransaction';
import type {
  IntegratedTransactionParams,
  IntegratedTransactionSummary,
} from '@/types/transaction/integratedTransaction';
import { QUICK_PERIODS, rangeOfQuickPeriod } from '@/utils/period';
import {
  END_TIMES,
  INITIAL_PARAMS,
  PAY_METHODS,
  SEARCH_FIELDS,
  SOURCES,
  START_TIMES,
  TX_STATUSES,
  TX_TYPES,
} from './components/searchFields';
import { transactionColumns } from './components/transactionColumns';

const CANCEL_TYPES = [
  { value: 'normal', label: '일반취소' },
  { value: 'offset', label: '상계취소' },
  { value: 'force', label: '강제취소' },
];

type TextKey = {
  [K in keyof IntegratedTransactionParams]: IntegratedTransactionParams[K] extends string
    ? K
    : never;
}[keyof IntegratedTransactionParams];

/** 상세 검색 (Figma KWPC04010100 상세검색): 1줄은 같은 폭, 2줄은 306 고정 + 오른쪽 개인정보 포함 검색 */
const DETAIL_ROW1: [TextKey, string][] = [
  ['customerName', '고객명'],
  ['buyerId', '구매자 ID'],
  ['cardNo', '카드번호'],
  ['approvalNo', '승인번호'],
  ['phone', '전화번호'],
];
const DETAIL_ROW2: [TextKey, string, string][] = [
  ['depositor', '예금주명', '예금주명 입력'],
  ['virtualAccountNo', '가상계좌번호', '가상계좌번호 입력'],
  ['giftCard', '상품권', '발행사/ID/핀번호 입력'],
  ['payRequestCode', '결제요청코드', '결제요청코드 입력'],
];

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
 * 검색 조건 정의(라벨 · 표시 형식)는 components/searchFields — 적용 조건 칩 · 내 검색조건 요약이 같이 쓴다
 */
export function IntegratedTransactionPage() {
  const dialog = useDialog();
  const [selected, setSelected] = useState<string[]>([]);
  const [cancelType, setCancelType] = useState('normal');
  const [cancelReason, setCancelReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const result = useSearchResult({
    initialParams: INITIAL_PARAMS,
    fetch: async (request) => {
      setSelected([]);
      return fetchIntegratedTransactions(request);
    },
  });
  const { params, setParam, setParams } = result;
  const ready = result.status === 'success';
  const disabled = !ready || processing;
  // 취소사유 바는 행을 선택해야 활성 (Figma 목록: 비활성 · 상세검색: 1건 선택 시 활성)
  const cancelDisabled = disabled || selected.length === 0;

  const notReady = (name: string) => dialog.alert(`${name}은(는) 준비 중입니다.`);

  const cancelSelected = async () => {
    if (selected.length === 0) {
      await dialog.alert('취소할 거래를 선택해주세요.');
      return;
    }
    if (!cancelReason.trim()) {
      await dialog.alert('취소사유를 입력해주세요.');
      return;
    }
    const typeLabel = optionLabel(CANCEL_TYPES, cancelType);
    // TODO(정책) 취소 가능 상태 · 부분취소 금액 · 금액 영향 미리보기(P04 V04 · V05)는 화면설계서 확인 후
    const ok = await dialog.confirm(`선택한 거래 ${selected.length}건을 ${typeLabel}할까요?`, {
      confirmText: typeLabel,
      variant: 'danger',
    });
    if (!ok) return;
    setProcessing(true);
    try {
      await cancelTransactions(selected, cancelType, cancelReason);
      await dialog.alert(`${typeLabel} 요청이 완료되었습니다.`);
      setCancelReason('');
      result.setPage(result.page);
    } catch {
      await dialog.alert('취소 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setProcessing(false);
    }
  };

  const line = { size: 'sm', variant: 'neutral', appearance: 'line', disabled } as const;

  return (
    <>
      <PageLayout.Title
        title="통합 거래내역"
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

      {/* 최초진입: 검색 조건 접힘 (Figma 최초진입_검색조건접힘) */}
      <SearchPanel
        defaultCollapsed
        onSearch={result.search}
        onReset={result.reset}
        loading={result.loading}
        detail={
          <>
            <SearchPanel.Row>
              {DETAIL_ROW1.map(([key, label]) => (
                <Field key={key} label={label} style={{ flex: '1 1 0' }}>
                  <TextField
                    fullWidth
                    placeholder={`${label} 입력`}
                    value={params[key]}
                    onChange={(e) => setParam(key, e.target.value)}
                  />
                </Field>
              ))}
            </SearchPanel.Row>
            <SearchPanel.Row>
              {DETAIL_ROW2.map(([key, label, placeholder]) => (
                <Field key={key} label={label} style={{ width: 306 }}>
                  <TextField
                    fullWidth
                    placeholder={placeholder}
                    value={params[key]}
                    onChange={(e) => setParam(key, e.target.value)}
                  />
                </Field>
              ))}
              <Checkbox
                size="sm"
                label="개인정보 포함 검색"
                style={{ marginLeft: 'auto' }}
                checked={params.includePersonal}
                onChange={(e) => setParam('includePersonal', e.target.checked)}
              />
            </SearchPanel.Row>
          </>
        }
      >
        <SearchPanel.Row>
          {/* TODO(P03) 사업자 · CPID 찾기 Lookup 팝업 연결 */}
          <Field label="사업자번호">
            <LookupField
              placeholder="사업자번호를 입력해주세요"
              inputWidth={210}
              value={params.bizNo}
              onChange={(bizNo) => setParam('bizNo', bizNo)}
              onFind={() => notReady('사업자 찾기')}
            />
          </Field>
          <Field label="CPID">
            <LookupField
              placeholder="CPID를 입력해주세요"
              inputWidth={185}
              value={params.cpid}
              onChange={(cpid) => setParam('cpid', cpid)}
              onFind={() => notReady('CPID 찾기')}
            />
          </Field>
          <Field label="조회기준일">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', whiteSpace: 'nowrap' }}>
              <RadioGroup
                direction="horizontal"
                aria-label="조회기준일"
                value={params.dateBasis}
                onChange={(v) =>
                  setParam('dateBasis', v as IntegratedTransactionParams['dateBasis'])
                }
              >
                <Radio value="pay" label="결제일" />
                <Radio value="cancel" label="취소일" />
              </RadioGroup>
              <DateField
                aria-label="시작일"
                value={params.startDate}
                onChange={(startDate) => setParams({ startDate, quickPeriod: '' })}
              />
              <SelectBox
                aria-label="시작 시각"
                style={{ width: 96 }}
                options={START_TIMES}
                value={params.startTime}
                onChange={(startTime) => setParam('startTime', startTime)}
              />
              <span aria-hidden>~</span>
              <DateField
                aria-label="종료일"
                value={params.endDate}
                onChange={(endDate) => setParams({ endDate, quickPeriod: '' })}
              />
              <SelectBox
                aria-label="종료 시각"
                style={{ width: 96 }}
                options={END_TIMES}
                value={params.endTime}
                onChange={(endTime) => setParam('endTime', endTime)}
              />
            </div>
          </Field>
          <Segmented
            size="md"
            fullWidth
            style={{ flex: '1 1 0' }}
            aria-label="조회 기간"
            value={params.quickPeriod}
            onChange={(quickPeriod) => {
              const { start, end } = rangeOfQuickPeriod(quickPeriod);
              setParams({ quickPeriod, startDate: start, endDate: end });
            }}
          >
            {QUICK_PERIODS.map((p) => (
              <Segmented.Item key={p.value} value={p.value}>
                {p.label}
              </Segmented.Item>
            ))}
          </Segmented>
        </SearchPanel.Row>
        <SearchPanel.Row>
          <Field label="거래번호">
            <TextField
              placeholder="거래번호 입력"
              style={{ width: 200 }}
              value={params.txNo}
              onChange={(e) => setParam('txNo', e.target.value)}
            />
          </Field>
          <Field label="주문번호">
            <TextField
              placeholder="주문번호 입력"
              style={{ width: 200 }}
              value={params.orderNo}
              onChange={(e) => setParam('orderNo', e.target.value)}
            />
          </Field>
          <Field label="거래구분" style={{ flex: '1 1 0' }}>
            <SelectBox
              fullWidth
              options={TX_TYPES}
              value={params.txType}
              onChange={(v) => setParam('txType', v)}
            />
          </Field>
          <Field label="결제수단" style={{ flex: '1 1 0' }}>
            <SelectBox
              fullWidth
              options={PAY_METHODS}
              value={params.payMethod}
              onChange={(v) => setParam('payMethod', v)}
            />
          </Field>
          <Field label="거래상태" style={{ flex: '1 1 0' }}>
            <SelectBox
              fullWidth
              options={TX_STATUSES}
              value={params.txStatus}
              onChange={(v) => setParam('txStatus', v)}
            />
          </Field>
          <Field label="거래원천">
            <RadioGroup
              direction="horizontal"
              aria-label="거래원천"
              value={params.source}
              onChange={(v) => setParam('source', v)}
            >
              {SOURCES.map((s) => (
                <Radio key={s.value} value={s.value} label={s.label} />
              ))}
            </RadioGroup>
          </Field>
        </SearchPanel.Row>
      </SearchPanel>

      <AppliedFilters items={toAppliedFilters(SEARCH_FIELDS, result.appliedParams)} />
      <ResultSummary items={toSummaryItems(result.summary)} />

      <ResultPanel
        status={result.status}
        statusProps={result.status === 'idle' ? { title: '거래내역을 조회해주세요' } : undefined}
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
          <ActionBar label="취소사유" style={{ flex: '1 1 0' }}>
            <TextField
              size="sm"
              fullWidth
              style={{ flex: '1 1 0' }}
              placeholder="취소사유 입력"
              disabled={cancelDisabled}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <RadioGroup
              size="sm"
              direction="horizontal"
              aria-label="취소 구분"
              disabled={cancelDisabled}
              value={cancelType}
              onChange={setCancelType}
            >
              {CANCEL_TYPES.map((t) => (
                <Radio key={t.value} value={t.value} label={t.label} />
              ))}
            </RadioGroup>
            <Button size="sm" variant="dark" disabled={cancelDisabled} onClick={cancelSelected}>
              선택 취소
            </Button>
          </ActionBar>
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
