import type { SettlementLedger } from './merchantSettlement';

/** 일반 원장 상세 (KWPC06010209~) — 기본정보 · 요약 · 산출 근거 */
export interface LedgerDetail {
  ledger: SettlementLedger;
  /** 기본정보 추가 항목 */
  typeCode: string;
  offsetGroupId: string | null;
  payAccount: string;
  holder: string;
  /** 예금주 검증 결과 (불일치면 빨간 글자 + 배지) */
  holderVerified: boolean;
  /** 원장 요약 */
  summary: {
    txCount: number;
    afterFee: number;
    limitAdjust: number;
    offsetAdjust: number;
    payAmount: number;
  };
  /** 원장 산출 근거 */
  basis: LedgerBasisItem[];
}

export interface LedgerBasisItem {
  key: string;
  label: string;
  /** 부호 포함 금액 */
  amount: number;
  /** +를 붙여 보일지 (승인금액) */
  signed?: boolean;
  linkedIds: string[];
  reference: string;
  note: string;
}

/** 정산대상 거래 건 */
export interface LedgerTx {
  txNo: string;
  paidAt: string;
  serviceName: string;
  issuer: string;
  orderNo: string;
  buyerId: string;
  customerName: string;
  productName: string;
}
