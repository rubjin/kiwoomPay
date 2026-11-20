// 예시 데이터: 내 검색조건 5개
// transaction/integrated/IntegratedTransactionPage.tsx가 쓴다. TODO(API) 실제 API로 바꾸면 이 파일을 지운다
import type { IntegratedTransactionParams } from '@/features/transaction/integratedTransaction.types';
import { rangeOfQuickPeriod } from '@/utils/period';
import { createInitialParams } from '@/features/transaction/integrated/components/initialParams';
import type { TransactionSavedSearch as SavedSearch } from '@/features/transaction/integrated/components/savedSearches';

function preset(
  id: string,
  name: string,
  quickPeriod: '1w' | '1m' | '2m',
  patch: Partial<IntegratedTransactionParams>,
): SavedSearch {
  const range = rangeOfQuickPeriod(quickPeriod);
  return {
    id,
    name,
    params: {
      ...createInitialParams(),
      quickPeriod,
      startDate: range.start,
      endDate: range.end,
      ...patch,
    },
  };
}

/** (임의 작업) 예시 저장 조건 — TODO(API) */
export const TRANSACTION_SAVED_SEARCHES: SavedSearch[] = [
  preset('s1', 'PG 승인 거래', '1w', { source: 'PG', txType: 'approve' }),
  preset('s2', 'VAN 승인 거래', '1m', { source: 'VAN', txType: 'approve' }),
  preset('s3', '취소 거래 확인', '1w', { txType: 'cancel' }),
  preset('s4', '최근 1개월 전체 거래', '1m', {}),
  preset('s5', '2개월 전체 거래', '2m', {}),
];
