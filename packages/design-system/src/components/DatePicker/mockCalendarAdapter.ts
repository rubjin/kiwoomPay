import type { CalendarAdapter } from './CalendarProvider';

// Storybook 예시용 가짜 외부 달력. 실제 앱은 IBSheet 캘린더 어댑터를 넣는다 (docs: DatePicker 가이드 "외부 달력")
export const mockCalendarAdapter: CalendarAdapter = {
  open(options) {
    const box = document.createElement('div');
    const rect = options.anchor.getBoundingClientRect();
    box.dataset.mockCalendar = options.mode;
    box.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.bottom + 8}px;z-index:1100;padding:12px;background:#fff;border:1px dashed #8C98A6;border-radius:8px;font:13px sans-serif;display:flex;gap:8px;align-items:center`;
    const label = document.createElement('span');
    label.textContent = '외부 달력(예: IBSheet) 자리';
    const pick = document.createElement('button');
    pick.type = 'button';
    pick.textContent =
      options.mode === 'single' ? '2026-11-20 선택' : '2026-11-01 ~ 2026-11-20 선택';
    pick.onclick = () => {
      if (options.mode === 'single') options.onSelect('2026-11-20');
      else options.onSelect({ start: '2026-11-01', end: '2026-11-20' });
    };
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = '닫기';
    cancel.onclick = () => options.onClose();
    box.append(label, pick, cancel);
    document.body.append(box);
    return () => box.remove();
  },
};
