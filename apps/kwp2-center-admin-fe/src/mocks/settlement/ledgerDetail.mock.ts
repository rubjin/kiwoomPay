// 예시 데이터: 원장 상세 · 정산대상 거래 건 (고른 원장으로 만들어 냄, 거래 기본 830건)
// settlement/ledgerDetail.api.ts가 쓴다. TODO(API) 실제 API로 바꾸면 이 파일을 지운다
import type { LedgerDetail, LedgerTx } from '@/features/settlement/ledgerDetail.types';
import type { SettlementLedger } from '@/features/settlement/merchantSettlement.types';

/** 원장 상세 — 고른 원장 정보에 산출 근거 예시를 붙인다 */
export const ledgerDetailOf = (ledger: SettlementLedger): LedgerDetail => ({
  ledger,
  typeCode: `01 ${ledger.type}`,
  offsetGroupId: 'SG0831-002',
  payAccount: '국민은행 123-******-67890',
  holder: ledger.merchantName,
  holderVerified: false,
  summary: {
    txCount: ledger.txCount ?? 830,
    afterFee: 7_900_000,
    limitAdjust: -900_000,
    offsetAdjust: -200_000,
    payAmount: 6_800_000,
  },
  basis: [
    {
      key: 'approve',
      label: '승인금액',
      amount: 8_700_000,
      signed: true,
      linkedIds: [],
      reference: '-',
      note: '',
    },
    {
      key: 'cancel',
      label: '취소금액',
      amount: -300_000,
      linkedIds: [],
      reference: '-',
      note: '',
    },
    {
      key: 'target',
      label: '정산대상금액',
      amount: 8_400_000,
      linkedIds: [],
      reference: '-',
      note: '',
    },
    { key: 'fee', label: '수수료', amount: -454_545, linkedIds: [], reference: '-', note: '' },
    { key: 'vat', label: '부가세', amount: -45_455, linkedIds: [], reference: '-', note: '' },
    {
      key: 'afterFee',
      label: '수수료 차감 후 정산금액',
      amount: 7_900_000,
      linkedIds: [],
      reference: '-',
      note: '',
    },
    {
      key: 'offset',
      label: '연결 조정 원장 반영액 · 상계',
      amount: -200_000,
      linkedIds: ['ADJ-02-01', 'ADJ-02-02'],
      reference: 'ADJ-OFF-01 · 상계 반영액 1회 포함',
      note: '',
    },
    {
      key: 'limit',
      label: '연결 조정 원장 반영액 · 한도초과',
      amount: -900_000,
      linkedIds: ['ADJ-02-01', 'ADJ-02-02'],
      reference: 'ADJ-02-01 -169,750원 / ADJ-02-02 -730,250원 합계',
      note: '',
    },
    {
      key: 'pay',
      label: '최종 지급예정금액',
      amount: 6_800_000,
      linkedIds: [],
      reference: '7,900,000 − 900,000 − 200,000 = 6,800,000원',
      note: '',
    },
  ],
});

const ISSUERS = [
  '신한카드',
  '삼성카드',
  'KB국민카드',
  '현대카드',
  '롯데카드',
  '하나카드',
  'BC카드',
  '우리카드',
  'NH농협카드',
];

const PRODUCTS = [
  '스테인리스 밀폐용기 3종 세트',
  '프리미엄 수건 5매 세트',
  '무선 전기주전자 1.5L',
  '데일리 머그컵 2개 세트',
  '접이식 수납박스 40L',
];

const NAMES = [
  '김*진',
  '이*연',
  '박*수',
  '최*은',
  '정*호',
  '윤*지',
  '강*민',
  '한*영',
  '오*준',
  '임*희',
];

/** 정산대상 거래 건 전체 수 (원장에 없으면 830건) */
export const ledgerTxTotal = (ledger: SettlementLedger) => ledger.txCount ?? 830;

/** 정산대상 거래 i번째 건 */
export function ledgerTxAt(ledger: SettlementLedger, i: number): LedgerTx {
  const minutes = 9 * 60 + 12 - i * 7;
  const hh = String(Math.max(0, Math.floor(minutes / 60))).padStart(2, '0');
  const mm = String(((minutes % 60) + 60) % 60).padStart(2, '0');
  return {
    txNo: `CTS2608310${String(9123045870 - i * 41_602).padStart(10, '0')}`,
    paidAt: `2026-08-31 ${hh}:${mm}:${String((30 + i * 13) % 60).padStart(2, '0')}`,
    serviceName: `${ledger.merchantName} 온라인몰`,
    issuer: ISSUERS[i % ISSUERS.length] as string,
    orderNo: `KW260831-${104872 - i * 11}`,
    buyerId: `${String.fromCharCode(97 + (i % 26))}${String.fromCharCode(97 + ((i * 7) % 26))}****${String(10 + ((i * 13) % 90))}`,
    customerName: NAMES[i % NAMES.length] as string,
    productName: PRODUCTS[i % PRODUCTS.length] as string,
  };
}
