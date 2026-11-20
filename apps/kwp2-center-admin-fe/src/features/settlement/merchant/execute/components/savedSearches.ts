import { summarizeSearch } from '@kiwoompay/design-system';
import type { SavedSearch } from '@/components/popups/SavedSearchModal';
import type { MerchantSettlementParams } from '@/features/settlement/merchantSettlement.types';
import { QUICK_PERIODS } from '@/utils/period';
import { SEARCH_FIELDS } from './searchFields';

/** 가맹점 정산 실행/처리 내 검색조건 1건 */
export type SettlementSavedSearch = SavedSearch<MerchantSettlementParams>;

/** 저장된 조건 요약 (적용 조건 칩과 같은 항목) */
export function summaryRows(params: MerchantSettlementParams) {
  return summarizeSearch(SEARCH_FIELDS, params).map(({ label, value }) => ({ label, value }));
}

/** 카드 한 줄 요약 (임의 작업 — 통합 거래내역과 같은 방식: 기간 · 정산주기 · 가맹점) */
export function cardSummary(params: MerchantSettlementParams) {
  const rows = summarizeSearch(SEARCH_FIELDS, params);
  const value = (key: string) => rows.find((row) => row.key === key)?.value;
  const period = QUICK_PERIODS.find((p) => p.value === params.quickPeriod)?.label;
  const cycles = value('cycles');
  return [
    period ?? value('payDate') ?? '전체 기간',
    cycles === '전체' ? '전체 정산주기' : cycles,
    value('merchantName') ?? value('bizNo'),
  ]
    .filter(Boolean)
    .join(' · ');
}
