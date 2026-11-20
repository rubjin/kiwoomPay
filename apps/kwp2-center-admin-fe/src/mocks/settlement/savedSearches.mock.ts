// 예시 데이터: 내 검색조건 3개 (임의 작업)
// settlement/merchant/execute/MerchantSettlementExecutePage.tsx가 쓴다. TODO(API) 실제 API로 바꾸면 이 파일을 지운다
import { createInitialParams } from '@/features/settlement/merchant/execute/components/initialParams';
import type { SettlementSavedSearch } from '@/features/settlement/merchant/execute/components/savedSearches';
import type { MerchantSettlementParams } from '@/features/settlement/merchantSettlement.types';
import { rangeOfQuickPeriod } from '@/utils/period';

function preset(
  id: string,
  name: string,
  quickPeriod: '' | '1w' | '1m',
  patch: Partial<MerchantSettlementParams>,
): SettlementSavedSearch {
  return {
    id,
    name,
    params: {
      ...createInitialParams(),
      quickPeriod,
      payDate: quickPeriod ? rangeOfQuickPeriod(quickPeriod) : { start: '', end: '' },
      ...patch,
    },
  };
}

export const SETTLEMENT_SAVED_SEARCHES: SettlementSavedSearch[] = [
  preset('st1', 'D+1 정산 이번 주', '1w', { cycles: ['D1'] }),
  preset('st2', '월 정산 최근 1개월', '1m', { cycles: ['M1_END', 'M1_START'] }),
  preset('st3', '테스트상사 전체', '', { bizNo: '000-00-00000' }),
];
