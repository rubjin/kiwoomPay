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
  /** 정산대상 거래건수 (없으면 null) */
  txCount: number | null;
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
