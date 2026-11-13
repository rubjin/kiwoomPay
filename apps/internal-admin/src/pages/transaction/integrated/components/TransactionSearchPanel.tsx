import {
  ControlGroup,
  Checkbox,
  DateField,
  Field,
  LookupField,
  Radio,
  RadioGroup,
  SearchPanel,
  Segmented,
  SelectBox,
  TextField,
} from '@kiwoompay/design-system';
import { DATE_BASIS, END_TIMES, START_TIMES, isDateBasis } from '@/constants/options';
import { useCodeOptions } from '@/hooks/useCodeOptions';
import type { IntegratedTransactionParams } from '@/types/transaction/integratedTransaction';
import { QUICK_PERIODS, rangeOfQuickPeriod } from '@/utils/period';

type Params = IntegratedTransactionParams;

type TextKey = {
  [K in keyof Params]: Params[K] extends string ? K : never;
}[keyof Params];

/** 상세 검색 칸 순서 (5칸 격자 · 왼쪽 위부터). 마지막 칸은 개인정보 포함 검색 */
const DETAIL_FIELDS: [TextKey, string, string?][] = [
  ['customerName', '고객명'],
  ['buyerId', '구매자 ID'],
  ['cardNo', '카드번호'],
  ['approvalNo', '승인번호'],
  ['phone', '전화번호'],
  ['depositor', '예금주명'],
  ['virtualAccountNo', '가상계좌번호'],
  ['giftCard', '상품권', '발행사/ID/핀번호 입력'],
  ['payRequestCode', '결제요청코드'],
];

/** 줄 안에서 남는 폭을 나눠 채운다 */
const GROW = { flex: '1 1 0' };
const TIME_WIDTH = { width: 96 };
const TEXT_WIDTH = { width: 200 };

export interface TransactionSearchPanelProps {
  params: Params;
  setParam: <K extends keyof Params>(key: K, value: Params[K]) => void;
  setParams: (patch: Partial<Params>) => void;
  onSearch: () => void;
  onReset: () => void;
  loading: boolean;
  /** 아직 연결하지 않은 팝업 (사업자 · CPID 찾기) */
  onNotReady: (name: string) => void;
}

/**
 * 통합 거래내역 검색 조건 (Figma 최초진입 29406:101527 · 상세검색 29406:97669).
 * 접힘은 사용자가 ⌃로 접는 상태 (30056:104296)
 */
export function TransactionSearchPanel({
  params,
  setParam,
  setParams,
  onSearch,
  onReset,
  loading,
  onNotReady,
}: TransactionSearchPanelProps) {
  const txTypes = useCodeOptions('TX_TYPE', { withAll: true });
  const payMethods = useCodeOptions('PAY_METHOD', { withAll: true });
  const txStatuses = useCodeOptions('TX_STATUS', { withAll: true });
  const txSources = useCodeOptions('TX_SOURCE', { withAll: true });

  return (
    <SearchPanel
      onSearch={onSearch}
      onReset={onReset}
      loading={loading}
      detail={
        // 상세 검색: 5칸 격자 (Figma 칸 폭 306.8 = (1598 - 16 × 4) / 5). 두 줄의 칸이 위아래로 맞는다
        <SearchPanel.Grid columns={5}>
          {DETAIL_FIELDS.map(([key, label, placeholder]) => (
            <Field key={key} label={label}>
              <TextField
                fullWidth
                placeholder={placeholder ?? `${label} 입력`}
                value={params[key]}
                onChange={(e) => setParam(key, e.target.value)}
              />
            </Field>
          ))}
          <Checkbox
            size="sm"
            label="개인정보 포함 검색"
            style={{ justifySelf: 'end' }}
            checked={params.includePersonal}
            onChange={(e) => setParam('includePersonal', e.target.checked)}
          />
        </SearchPanel.Grid>
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
            onFind={() => onNotReady('사업자 찾기')}
          />
        </Field>
        <Field label="CPID">
          <LookupField
            placeholder="CPID를 입력해주세요"
            inputWidth={185}
            value={params.cpid}
            onChange={(cpid) => setParam('cpid', cpid)}
            onFind={() => onNotReady('CPID 찾기')}
          />
        </Field>
        <Field label="조회기준일">
          <ControlGroup>
            <RadioGroup
              direction="horizontal"
              aria-label="조회기준일"
              value={params.dateBasis}
              onChange={(v) => isDateBasis(v) && setParam('dateBasis', v)}
            >
              {DATE_BASIS.map((o) => (
                <Radio key={o.value} value={o.value} label={o.label} />
              ))}
            </RadioGroup>
            <DateField
              aria-label="시작일"
              value={params.startDate}
              onChange={(startDate) => setParams({ startDate, quickPeriod: '' })}
            />
            <SelectBox
              aria-label="시작 시각"
              style={TIME_WIDTH}
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
              style={TIME_WIDTH}
              options={END_TIMES}
              value={params.endTime}
              onChange={(endTime) => setParam('endTime', endTime)}
            />
          </ControlGroup>
        </Field>
        <Segmented
          size="md"
          fullWidth
          style={GROW}
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
            style={TEXT_WIDTH}
            value={params.txNo}
            onChange={(e) => setParam('txNo', e.target.value)}
          />
        </Field>
        <Field label="주문번호">
          <TextField
            placeholder="주문번호 입력"
            style={TEXT_WIDTH}
            value={params.orderNo}
            onChange={(e) => setParam('orderNo', e.target.value)}
          />
        </Field>
        <Field label="거래구분" style={GROW}>
          <SelectBox
            fullWidth
            options={txTypes}
            value={params.txType}
            onChange={(v) => setParam('txType', v)}
          />
        </Field>
        <Field label="결제수단" style={GROW}>
          <SelectBox
            fullWidth
            options={payMethods}
            value={params.payMethod}
            onChange={(v) => setParam('payMethod', v)}
          />
        </Field>
        <Field label="거래상태" style={GROW}>
          <SelectBox
            fullWidth
            options={txStatuses}
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
            {txSources.map((s) => (
              <Radio key={s.value} value={s.value} label={s.label} />
            ))}
          </RadioGroup>
        </Field>
      </SearchPanel.Row>
    </SearchPanel>
  );
}
