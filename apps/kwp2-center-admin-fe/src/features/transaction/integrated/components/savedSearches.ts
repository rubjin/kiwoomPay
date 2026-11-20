import { summarizeSearch } from '@kiwoompay/design-system';
import type { SavedSearch } from '@/components/popups/SavedSearchModal';
import type { IntegratedTransactionParams } from '@/features/transaction/integratedTransaction.types';
import { SEARCH_FIELDS } from './searchFields';

/** 통합 거래내역 내 검색조건 1건 */
export type TransactionSavedSearch = SavedSearch<IntegratedTransactionParams>;

/** 저장된 조건 요약 (Figma: 조회기간 1주일 · 조회일시 범위) */
export function summaryRows(params: IntegratedTransactionParams) {
  return summarizeSearch(SEARCH_FIELDS, params).map(({ key, label, value }) => ({
    label: key === 'period' ? '조회일시' : label,
    value,
  }));
}

/** 카드 한 줄 요약 (Figma: 1주일 · PG · 승인 · 결제수단 / 1개월 · 전체 원천 · 전체 거래) */
export function cardSummary(params: IntegratedTransactionParams) {
  const rows = summarizeSearch(SEARCH_FIELDS, params);
  const value = (key: string) => rows.find((row) => row.key === key)?.value;
  const all = (v: unknown, whenAll: string | null) => (v === '전체' ? whenAll : v);
  return [
    value('quickPeriod'),
    all(value('source'), '전체 원천'),
    all(value('txType'), '전체 거래'),
    all(value('payMethod'), null),
  ]
    .filter(Boolean)
    .join(' · ');
}
