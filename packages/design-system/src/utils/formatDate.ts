/** 입력값에서 숫자만 남겨 YYYY-MM-DD 형태로 맞춘다 (최대 8자리). 예: "20260813" → "2026-08-13" */
export function formatDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}
