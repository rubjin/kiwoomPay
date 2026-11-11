import type { CalendarAdapter, DateRange } from '@kiwoompay/design-system';
import type { IBCalendar, IBSheetGlobal } from '@ibsheet/interface';

// IBSheet 캘린더를 디자인 시스템 날짜 필드(DateField · DateRangeField)에 연결한다.
// API: IBSheet8 매뉴얼 static/show-calendar · appx/position
//   IBSheet.showCalendar(calOption, position, callback) → 달력 객체(.Close())
//   callback: 단일 → ms 숫자, Range → "시작ms~종료ms"
// IBSheet 스크립트(ibsheet.js + ibleaders.js 라이선스)가 페이지에 없으면 null → 기본 Date Picker로 동작한다.

const FORMAT = 'yyyy-MM-dd';
const GAP = 8; // 필드 ↔ 달력 (디자인 시스템 Date Picker와 같은 간격)

const getIBSheet = () => (window as unknown as { IBSheet?: IBSheetGlobal }).IBSheet;

const toDate = (ibsheet: IBSheetGlobal, ms: string | number) =>
  ibsheet.dateToString(Number(ms), FORMAT);

/** 'YYYY-MM-DD' → 그 날 0시 Date */
const parse = (value: string) => {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y ?? 0, (m ?? 1) - 1, d ?? 1);
};

const DAY = 24 * 60 * 60 * 1000;

export function createIbsheetCalendarAdapter(): CalendarAdapter | null {
  const ibsheet = getIBSheet();
  if (!ibsheet) return null;

  return {
    open(options) {
      const rect = options.anchor.getBoundingClientRect();
      let picked = false;
      let calendar: IBCalendar | null = null;

      const minDate = options.min ? parse(options.min) : null;
      const maxDate = options.max ? parse(options.max) : null;

      const calOption: IBCalendar & Record<string, unknown> = {
        Format: FORMAT,
        Date:
          options.mode === 'single' ? options.value || undefined : options.value.start || undefined,
        Range: options.mode === 'range' ? 1 : 0,
        Texts: { Ok: '선택', Clear: '지우기', Today: '오늘', Yesterday: '어제' },
        // 선택 가능 기간 (min · max)
        OnCanEditDate: (date: Date) =>
          (!minDate || date >= minDate) && (!maxDate || date <= maxDate),
        OnClose: () => {
          if (!picked) options.onClose();
        },
      };

      const position = { X: rect.left + window.scrollX, Y: rect.bottom + window.scrollY + GAP };

      const callback = (value: string | number) => {
        if (value === '' || value === undefined) return;
        picked = true;
        if (options.mode === 'single') {
          options.onSelect(toDate(ibsheet, value));
          return;
        }
        // Range: "시작ms~종료ms" (여러 구간이면 ';'로 이어짐 → 첫 구간만 사용)
        const [first = ''] = String(value).split(';');
        const [startMs, endMs = startMs] = first.split('~');
        if (!startMs) return;
        const range: DateRange = { start: toDate(ibsheet, startMs), end: toDate(ibsheet, endMs!) };
        if (options.maxRangeDays) {
          const days = Math.round((Number(endMs) - Number(startMs)) / DAY) + 1;
          // TODO(IBSheet): 최대 기간 초과 안내 방식(얼럿 · 필드 피드백)은 화면 정책으로 정함
          if (days > options.maxRangeDays) return;
        }
        options.onSelect(range);
      };

      calendar = ibsheet.showCalendar(calOption, position, callback);
      return () => {
        picked = true; // 필드에서 닫는 경우 onClose를 다시 부르지 않는다
        calendar?.Close?.();
      };
    },
  };
}
