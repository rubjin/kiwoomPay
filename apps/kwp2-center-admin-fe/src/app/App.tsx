import { CalendarProvider, DialogProvider } from '@kiwoompay/design-system';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/router';
import { config } from './config';
import { createIbsheetCalendarAdapter } from './providers/ibsheetCalendar';

// 날짜 필드는 IBSheet 캘린더를 쓴다 (IBSheet가 없으면 기본 Date Picker)
const calendarAdapter = createIbsheetCalendarAdapter();

export function App() {
  return (
    <CalendarProvider adapter={calendarAdapter}>
      {/* 성공 · 실패 안내는 Alert로 통일 (Toast 없음) */}
      <DialogProvider>
        <BrowserRouter basename={config.basename}>
          <AppRoutes />
        </BrowserRouter>
      </DialogProvider>
    </CalendarProvider>
  );
}
