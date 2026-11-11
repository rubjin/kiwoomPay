import { createContext, useContext, type ReactNode } from 'react';
import type { DateRange } from './dateUtils';

interface CalendarOpenBase {
  /** 달력을 붙일 기준 요소 (필드 박스) */
  anchor: HTMLElement;
  /** 선택 가능한 첫 · 마지막 날짜 (YYYY-MM-DD) */
  min?: string;
  max?: string;
  /** 사용자가 고르지 않고 닫았을 때 (바깥 클릭 · Esc 등) */
  onClose: () => void;
}

export interface CalendarOpenSingle extends CalendarOpenBase {
  mode: 'single';
  /** 현재 값 (YYYY-MM-DD 또는 '') */
  value: string;
  onSelect: (value: string) => void;
}

export interface CalendarOpenRange extends CalendarOpenBase {
  mode: 'range';
  value: DateRange;
  /** 최대 조회 기간(일) */
  maxRangeDays?: number;
  onSelect: (value: DateRange) => void;
}

export type CalendarOpenOptions = CalendarOpenSingle | CalendarOpenRange;

/**
 * 외부 달력(예: IBSheet 캘린더)을 날짜 필드에 연결하는 어댑터.
 * `open`은 달력을 띄우고, 달력을 닫는 함수를 돌려준다(필드가 사라지거나 다시 누를 때 호출).
 */
export interface CalendarAdapter {
  open: (options: CalendarOpenOptions) => () => void;
}

const CalendarContext = createContext<CalendarAdapter | null>(null);

export interface CalendarProviderProps {
  /** null이면 디자인 시스템 기본 DatePicker를 쓴다 */
  adapter: CalendarAdapter | null;
  children: ReactNode;
}

/** 앱 최상단에서 한 번 감싸면 하위의 DateField · DateRangeField가 이 달력을 연다 */
export function CalendarProvider({ adapter, children }: CalendarProviderProps) {
  return <CalendarContext.Provider value={adapter}>{children}</CalendarContext.Provider>;
}

export const useCalendarAdapter = () => useContext(CalendarContext);
