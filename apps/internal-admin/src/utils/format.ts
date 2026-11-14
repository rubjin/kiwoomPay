// 화면 표기 규칙 (금액 · 건수 · 빈 값). 표 · 팝업 · 안내 문구가 모두 여기서 만든다

const NUMBER = new Intl.NumberFormat('ko-KR');

/** 천 단위 쉼표: 1234567 → '1,234,567' (표의 금액 칸 — 단위는 열 이름에) */
export const formatNumber = (n: number) => NUMBER.format(n);

/** 금액 + 원: 1234 → '1,234원', signed면 양수에 + ('+1,234원') */
export const formatWon = (n: number, { signed = false } = {}) =>
  `${signed && n > 0 ? '+' : ''}${formatNumber(n)}원`;

/** 수 + 단위: (3, '건') → '3건' */
export const formatCount = (n: number, unit: string) => `${formatNumber(n)}${unit}`;

/** 값이 없으면(null · undefined) '-'. 숫자는 천 단위 쉼표 */
export function orDash(value: number | null | undefined): string;
export function orDash<T>(value: T | null | undefined): T | '-';
export function orDash(value: unknown) {
  if (value === null || value === undefined) return '-';
  return typeof value === 'number' ? formatNumber(value) : value;
}
