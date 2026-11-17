/** 검색 조건 퀵 기간 (Segmented 1주일 · 1개월 · 2개월 · 3개월) */
export const QUICK_PERIODS = [
  { value: '1w', label: '1주일', days: 7 },
  { value: '1m', label: '1개월', months: 1 },
  { value: '2m', label: '2개월', months: 2 },
  { value: '3m', label: '3개월', months: 3 },
] as const;

/** Date → 'YYYY-MM-DD' (로컬 날짜) */
export const toYmd = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/** 오늘 기준 이전 기간. TODO(정책) 기준일 · 종료일 포함 여부는 화면설계서 확인 */
export function rangeOfQuickPeriod(value: string) {
  const period = QUICK_PERIODS.find((p) => p.value === value);
  const end = new Date();
  const start = new Date(end);
  if (period && 'days' in period) start.setDate(start.getDate() - period.days);
  if (period && 'months' in period) start.setMonth(start.getMonth() - period.months);
  return { start: toYmd(start), end: toYmd(end) };
}
