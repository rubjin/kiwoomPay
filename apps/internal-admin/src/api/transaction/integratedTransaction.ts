import type { SearchRequest, SearchResultPage } from '@kiwoompay/design-system';
import type {
  IntegratedTransaction,
  IntegratedTransactionParams,
  IntegratedTransactionSummary,
} from '@/types/transaction/integratedTransaction';
import { wait } from '@/api/mock';

// TODO(API) 통합 거래내역 조회 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터
const CP = [
  ['키움쇼핑(키움몰)', 'CP000101', '신용카드', '신한카드'],
  ['다우커머스(다우샵)', 'CP000102', '간편결제', '카카오페이'],
  ['새봄리테일(새봄)', 'CP000104', '신용카드', '국민카드'],
  ['온누리마켓(온누리)', 'CP000105', '휴대폰결제', 'SKT'],
] as const;

const SAMPLE: IntegratedTransaction[] = Array.from({ length: 23 }, (_, i) => {
  const [cpName, cpid, payService, issuer] = CP[i % CP.length]!;
  const day = String(30 - (i % 7)).padStart(2, '0');
  return {
    txNo: `T2026103${i % 10}${String(100000 + i * 37)}`,
    complaint: i % 9 === 4,
    cancelled: i % 6 === 2 ? 'full' : i % 8 === 5 ? 'partial' : null,
    paidAt: `2026-10-${day} ${String(9 + (i % 9)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}:00`,
    cpName,
    cpid,
    payService,
    orderNo: `ORD-${20261000 + i * 13}`,
    buyerId: `user${String(i + 1).padStart(3, '0')}`,
    customerName: ['김*준', '이*연', '박*훈', '최*진'][i % 4]!,
    issuer,
    authCode: String(30000000 + i * 4211).slice(0, 8),
    cardNo: payService === '신용카드' ? `9410-****-****-${String(1000 + i * 3)}` : '-',
    productName: ['정기구독 1개월', '생활용품 세트', '모바일 쿠폰', '도서 2권'][i % 4]!,
  };
});

const has = (text: string, keyword: string) => !keyword.trim() || text.includes(keyword.trim());

/** 통합 거래내역 조회 (페이지 단위) */
export async function fetchIntegratedTransactions({
  params,
  page,
  pageSize,
}: SearchRequest<IntegratedTransactionParams>): Promise<
  SearchResultPage<IntegratedTransaction, IntegratedTransactionSummary>
> {
  await wait(300);
  const rows = SAMPLE.filter(
    (row) =>
      has(row.cpid, params.cpid) && has(row.txNo, params.txNo) && has(row.orderNo, params.orderNo),
  );
  const cancelled = rows.filter((row) => row.cancelled);
  return {
    items: rows.slice((page - 1) * pageSize, page * pageSize),
    total: rows.length,
    summary: {
      totalCount: rows.length,
      totalAmount: rows.length * 32500,
      approvedCount: rows.length - cancelled.length,
      approvedAmount: (rows.length - cancelled.length) * 32500,
      cancelledCount: cancelled.length,
      cancelledAmount: cancelled.length * 32500,
    },
  };
}

/** 선택 거래 취소 요청 */
export async function cancelTransactions(txNos: string[], type: string, reason: string) {
  await wait(300);
  return { count: txNos.length, type, reason };
}
