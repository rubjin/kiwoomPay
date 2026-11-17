/** KWPC04010100 통합 거래내역 — 검색 조건 */
export interface IntegratedTransactionParams {
  bizNo: string;
  cpid: string;
  /** 조회기준일: 결제일 · 취소일 */
  dateBasis: 'pay' | 'cancel';
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  /** 퀵 기간 (1w · 1m · 2m · 3m). 직접 입력하면 '' */
  quickPeriod: string;
  txNo: string;
  orderNo: string;
  /** 'all' = 전체 */
  txType: string;
  payMethod: string;
  txStatus: string;
  /** 거래원천: all · PG · VAN */
  source: string;
  // ── 상세 검색 ──
  customerName: string;
  buyerId: string;
  cardNo: string;
  approvalNo: string;
  phone: string;
  depositor: string;
  virtualAccountNo: string;
  /** 상품권 발행사 / ID / 핀번호 */
  giftCard: string;
  payRequestCode: string;
  /** 개인정보 포함 검색 */
  includePersonal: boolean;
}

/** 거래 1행 */
export interface IntegratedTransaction {
  txNo: string;
  complaint: boolean;
  cancelled: 'full' | 'partial' | null;
  paidAt: string;
  cpName: string;
  cpid: string;
  payService: string;
  orderNo: string;
  buyerId: string;
  customerName: string;
  issuer: string;
  authCode: string;
  cardNo: string;
  productName: string;
}

/** 조회 요약: 건수 · 금액 */
export interface IntegratedTransactionSummary {
  totalCount: number;
  totalAmount: number;
  approvedCount: number;
  approvedAmount: number;
  cancelledCount: number;
  cancelledAmount: number;
}
