import { summarizeSearch } from '@kiwoompay/design-system';
import type { IntegratedTransactionParams } from '@/types/transaction/integratedTransaction';
import { rangeOfQuickPeriod } from '@/utils/period';
import { createInitialParams } from './initialParams';
import { SEARCH_FIELDS } from './searchFields';

/** 내 검색조건 1건 (TODO(API) 저장 · 조회 · 삭제) */
export interface SavedSearch {
  id: string;
  name: string;
  params: IntegratedTransactionParams;
}

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
export const EXAMPLE_SAVED_SEARCHES: SavedSearch[] = [
  preset('s1', 'PG 승인 거래', '1w', { source: 'PG', txType: 'approve' }),
  preset('s2', 'VAN 승인 거래', '1m', { source: 'VAN', txType: 'approve' }),
  preset('s3', '취소 거래 확인', '1w', { txType: 'cancel' }),
  preset('s4', '최근 1개월 전체 거래', '1m', {}),
  preset('s5', '2개월 전체 거래', '2m', {}),
];
