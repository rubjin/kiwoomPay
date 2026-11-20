import type { SearchRequest, SearchResultPage } from '@kiwoompay/design-system';
import type {
  IntegratedTransaction,
  IntegratedTransactionParams,
  IntegratedTransactionSummary,
} from '@/features/transaction/integratedTransaction.types';
import { wait } from '@/mocks/utils';
import { TRANSACTIONS } from '@/mocks/transaction/integratedTransaction.mock';

// TODO(API) 통합 거래내역 조회 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터

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
  const rows = TRANSACTIONS.filter(
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
