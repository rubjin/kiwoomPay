/** 차트 계열 색 (Chart Category 01~09 토큰) — 순서대로 쓰고 넘치면 처음부터 */
export const CHART_COLORS = [
  'var(--kp-color-chart-category-01)',
  'var(--kp-color-chart-category-02)',
  'var(--kp-color-chart-category-03)',
  'var(--kp-color-chart-category-04)',
  'var(--kp-color-chart-category-05)',
  'var(--kp-color-chart-category-06)',
  'var(--kp-color-chart-category-07)',
  'var(--kp-color-chart-category-08)',
  'var(--kp-color-chart-category-09)',
] as const;

export const chartColor = (index: number): string =>
  CHART_COLORS[index % CHART_COLORS.length] ?? CHART_COLORS[0];
