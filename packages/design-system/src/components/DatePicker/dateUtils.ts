// 날짜는 모두 'YYYY-MM-DD' 문자열로 다룬다 (시간대 영향 없음, 문자열 비교로 대소 판단 가능)

export interface DateRange {
  /** YYYY-MM-DD */
  start: string;
  /** YYYY-MM-DD */
  end: string;
}

export interface MonthKey {
  year: number;
  /** 1~12 */
  month: number;
}

export interface CalendarCell {
  date: string;
  day: number;
  /** 0(일) ~ 6(토) */
  weekday: number;
  /** 지난달 날짜 (회색, 선택 불가) */
  outside: boolean;
}

const pad = (n: number) => String(n).padStart(2, '0');

export const formatDate = (year: number, month: number, day: number) =>
  `${year}-${pad(month)}-${pad(day)}`;

const fromUTC = (d: Date) => formatDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());

/** 존재하는 날짜면 {year, month, day}, 아니면 null (2026-02-30 같은 값도 걸러낸다) */
export function parseDate(
  value?: string | null,
): { year: number; month: number; day: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const d = new Date(Date.UTC(year, month - 1, day));
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day)
    return null;
  return { year, month, day };
}

export const isValidDate = (value?: string | null) => parseDate(value) !== null;

/** 사용자 PC 기준 오늘 */
export function todayString(): string {
  const now = new Date();
  return formatDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function addDays(value: string, days: number): string {
  const p = parseDate(value);
  if (!p) return value;
  return fromUTC(new Date(Date.UTC(p.year, p.month - 1, p.day + days)));
}

export function addMonths({ year, month }: MonthKey, count: number): MonthKey {
  const total = year * 12 + (month - 1) + count;
  return { year: Math.floor(total / 12), month: (((total % 12) + 12) % 12) + 1 };
}

export function monthOf(value?: string | null): MonthKey | null {
  const p = parseDate(value);
  return p ? { year: p.year, month: p.month } : null;
}

/**
 * 달력 한 달치 칸. 일요일 시작이고, 첫 주의 빈칸은 지난달 날짜(outside)로 채운다.
 * 마지막 주의 남는 칸은 null(빈칸)이다. 결과는 7칸씩 끊어서 쓴다.
 */
export function buildMonthCells({ year, month }: MonthKey): Array<CalendarCell | null> {
  const startWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: Array<CalendarCell | null> = [];

  for (let i = startWeekday; i > 0; i--) {
    const d = new Date(Date.UTC(year, month - 1, 1 - i));
    cells.push({ date: fromUTC(d), day: d.getUTCDate(), weekday: d.getUTCDay(), outside: true });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      date: formatDate(year, month, day),
      day,
      weekday: (startWeekday + day - 1) % 7,
      outside: false,
    });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
