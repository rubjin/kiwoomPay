import type { DateRange } from '@kiwoompay/design-system';

/** KWPC06010201 가맹점 정산 실행/처리 — 검색 조건 */
export interface MerchantSettlementParams {
  cpid: string;
  bizNo: string;
  merchantName: string;
  /** 지급예정일 */
  payDate: DateRange;
  /** 지급예정일 퀵 기간 (1w · 1m · 2m · 3m). 직접 입력하면 '' */
  quickPeriod: string;
  /** 정산주기 (비어 있으면 전체) */
  cycles: string[];
  /** 상세 검색 — 결제수단 · 정산구분 · 처리사유 (비어 있으면 전체) */
  payMethods: string[];
  types: string[];
  reasons: string[];
}

export type LedgerStatus =
  '조치 필요' | '검증대기' | '지급대기' | '지급보류' | '지급완료' | '지급실패';

/** 정산원장 1행 */
export interface SettlementLedger {
  ledgerId: string;
  status: LedgerStatus;
  type: string;
  sourceLedgerId: string | null;
  closedAt: string;
  payDate: string;
  cpid: string;
  merchantName: string;
  bizNo: string;
  payMethod: string;
  cycle: string;
  /** 정산기간 (없으면 null) */
  period: string | null;
  /** 정산대상 거래건수 (없으면 null — 조정 원장) */
  txCount: number | null;
  /** 취소건수 (없으면 null — 조정 원장) */
  cancelCount: number | null;
  /** 금액 (원). 조정 원장은 원천 거래 금액이 없어 null */
  approveAmount: number | null;
  cancelAmount: number | null;
  receiveAmount: number | null;
  reserveAmount: number | null;
  targetAmount: number | null;
  diffAmount: number | null;
  /** 수수료율 (%) */
  feeRate: number | null;
  fee: number | null;
  vat: number | null;
  /** 조정원장 금액 — 조정 원장에만 */
  adjustAmount: number | null;
  /** 상계그룹 ID (없으면 null) */
  offsetGroupId: string | null;
  linkedOffsetAmount: number | null;
  holdAmount: number | null;
  finalPayAmount: number | null;
  costFee: number | null;
  costVat: number | null;
  profit: number | null;
  payBank: string | null;
  /** 예금주 (마스킹) */
  accountHolder: string | null;
  /** 처리사유 */
  reason: string;
  /** 정산담당자 (칸 편집) */
  manager: string;
  /** 처리메모 (칸 편집) */
  memo: string;
  lastProcessedAt: string;
}

/** 조회 요약 (건수) */
export interface MerchantSettlementSummary {
  target: number;
  actionRequired: number;
  verifying: number;
  waiting: number;
  hold: number;
  paid: number;
  failed: number;
}
