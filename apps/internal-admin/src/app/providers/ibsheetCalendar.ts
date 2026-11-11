import type { CalendarAdapter } from '@kiwoompay/design-system';

/**
 * IBSheet 캘린더를 디자인 시스템 날짜 필드(DateField · DateRangeField)에 연결한다.
 * null을 돌려주면 디자인 시스템 기본 Date Picker로 동작한다.
 *
 * TODO(IBSheet): IBSheet8 라이브러리 · 라이선스 파일을 받은 뒤 아래처럼 IBSheet 캘린더 API로 채운다.
 *   return {
 *     open(options) {
 *       // options.anchor 아래에 IBSheet 캘린더를 띄운다
 *       //   - options.mode: 'single' | 'range' (range는 options.maxRangeDays로 최대 기간)
 *       //   - options.value · min · max를 IBSheet 옵션으로 넘긴다
 *       //   - 고르면 options.onSelect('YYYY-MM-DD' 또는 { start, end }), 고르지 않고 닫히면 options.onClose()
 *       return () => { 달력 닫기 };
 *     },
 *   };
 */
export function createIbsheetCalendarAdapter(): CalendarAdapter | null {
  return null;
}
