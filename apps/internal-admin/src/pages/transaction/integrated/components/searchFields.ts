import { optionLabel, textValue, type SearchFieldDef } from '@kiwoompay/design-system';
import type { IntegratedTransactionParams } from '@/types/transaction/integratedTransaction';
import { QUICK_PERIODS, rangeOfQuickPeriod } from '@/utils/period';

// ── 선택지 ─────────────────────────────────────────────
// TODO(코드) 거래구분 · 결제수단 · 거래상태 코드는 공통코드 API로 바꾼다
const ALL = { value: 'all', label: '전체' };
type DateBasis = IntegratedTransactionParams['dateBasis'];
export const DATE_BASIS: { value: DateBasis; label: string }[] = [
  { value: 'pay', label: '결제일' },
  { value: 'cancel', label: '취소일' },
];
/** RadioGroup onChange(string) → 조회기준일 값인지 확인 (타입 단언 대신) */
export const isDateBasis = (value: string): value is DateBasis =>
  DATE_BASIS.some((o) => o.value === value);
export const TX_TYPES = [
  ALL,
  { value: 'approve', label: '승인' },
  { value: 'cancel', label: '취소' },
];
export const PAY_METHODS = [
  ALL,
  { value: 'card', label: '신용카드' },
  { value: 'easy', label: '간편결제' },
  { value: 'phone', label: '휴대폰결제' },
  { value: 'account', label: '계좌이체' },
];
export const TX_STATUSES = [
  ALL,
  { value: 'done', label: '정상' },
  { value: 'cancelled', label: '취소' },
  { value: 'failed', label: '실패' },
];
export const SOURCES = [
  { value: 'all', label: '전체' },
  { value: 'PG', label: 'PG' },
  { value: 'VAN', label: 'VAN' },
];

const hours = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`);
export const START_TIMES = hours.map((t) => ({ value: t, label: t }));
export const END_TIMES = [
  ...hours.slice(1).map((t) => ({ value: t, label: t })),
  { value: '23:59', label: '23:59' },
];

// ── 기본값 (초기화 · 신규 저장 기준) ────────────────────
const week = rangeOfQuickPeriod('1w');
export const INITIAL_PARAMS: IntegratedTransactionParams = {
  bizNo: '',
  cpid: '',
  dateBasis: 'pay',
  startDate: week.start,
  startTime: '00:00',
  endDate: week.end,
  endTime: '23:59',
  quickPeriod: '',
  txNo: '',
  orderNo: '',
  txType: 'all',
  payMethod: 'all',
  txStatus: 'all',
  source: 'all',
  customerName: '',
  buyerId: '',
  cardNo: '',
  approvalNo: '',
  phone: '',
  depositor: '',
  virtualAccountNo: '',
  giftCard: '',
  payRequestCode: '',
  includePersonal: true,
};

/**
 * 통합 거래내역 검색 조건 정의 (화면 순서).
 * 적용된 검색 조건 칩(toAppliedFilters) · 내 검색조건 요약(summarizeSearch)이 이 목록을 같이 쓴다.
 * Figma: 적용 조건 칩은 "조회기간 … · 거래구분 전체 …", 내 검색조건 요약은 "조회기준일 · 조회기간(1주일) · 조회일시 …"
 */
export const SEARCH_FIELDS: SearchFieldDef<IntegratedTransactionParams>[] = [
  { key: 'bizNo', label: '사업자번호', format: (p) => textValue(p.bizNo) },
  { key: 'cpid', label: 'CPID', format: (p) => textValue(p.cpid) },
  {
    key: 'dateBasis',
    label: '조회기준일',
    applied: false,
    format: (p) => optionLabel(DATE_BASIS, p.dateBasis),
  },
  {
    key: 'quickPeriod',
    label: '조회기간',
    applied: false,
    format: (p) => (p.quickPeriod ? optionLabel([...QUICK_PERIODS], p.quickPeriod) : '직접 입력'),
  },
  {
    key: 'period',
    label: '조회기간',
    format: (p) => `${p.startDate} ${p.startTime} ~ ${p.endDate} ${p.endTime}`,
  },
  { key: 'txNo', label: '거래번호', format: (p) => textValue(p.txNo) },
  { key: 'orderNo', label: '주문번호', format: (p) => textValue(p.orderNo) },
  { key: 'txType', label: '거래구분', format: (p) => optionLabel(TX_TYPES, p.txType) },
  { key: 'payMethod', label: '결제수단', format: (p) => optionLabel(PAY_METHODS, p.payMethod) },
  { key: 'txStatus', label: '거래상태', format: (p) => optionLabel(TX_STATUSES, p.txStatus) },
  { key: 'source', label: '거래원천', format: (p) => optionLabel(SOURCES, p.source) },
  // 상세 검색
  {
    key: 'customerName',
    label: '고객명',
    group: 'detail',
    format: (p) => textValue(p.customerName),
  },
  { key: 'buyerId', label: '구매자 ID', group: 'detail', format: (p) => textValue(p.buyerId) },
  { key: 'cardNo', label: '카드번호', group: 'detail', format: (p) => textValue(p.cardNo) },
  { key: 'approvalNo', label: '승인번호', group: 'detail', format: (p) => textValue(p.approvalNo) },
  { key: 'phone', label: '전화번호', group: 'detail', format: (p) => textValue(p.phone) },
  { key: 'depositor', label: '예금주명', group: 'detail', format: (p) => textValue(p.depositor) },
  {
    key: 'virtualAccountNo',
    label: '가상계좌번호',
    group: 'detail',
    format: (p) => textValue(p.virtualAccountNo),
  },
  { key: 'giftCard', label: '상품권', group: 'detail', format: (p) => textValue(p.giftCard) },
  {
    key: 'payRequestCode',
    label: '결제요청코드',
    group: 'detail',
    format: (p) => textValue(p.payRequestCode),
  },
  {
    key: 'includePersonal',
    label: '개인정보 포함 검색',
    group: 'detail',
    // 기본(포함)은 칩에 보이지 않고, 제외했을 때만 보인다
    format: (p) => (p.includePersonal ? null : '제외'),
  },
];
