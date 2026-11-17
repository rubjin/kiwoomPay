import { WORK_TAB_LIMIT } from '@kiwoompay/design-system';
import { create } from 'zustand';

/** 열린 업무 화면 하나 (Work Tab) */
export interface WorkTabEntry {
  /** 화면 경로 (pathname) — Tab 구분 값 */
  path: string;
  title: string;
  /** 고정 Tab: 닫을 수 없고 앞쪽에 모인다 */
  fixed?: boolean;
}

interface WorkTabsState {
  tabs: WorkTabEntry[];
  /** 없으면 추가. 최대 개수를 넘으면 false */
  open: (tab: WorkTabEntry) => boolean;
  close: (path: string) => void;
  /** 고정 · 해제 (고정 Tab은 앞쪽 고정 묶음 끝으로) */
  togglePin: (path: string) => void;
  /** 조건에 맞는 Tab만 남긴다 (고정 Tab은 항상 남김) */
  keep: (predicate: (tab: WorkTabEntry, index: number) => boolean) => void;
}

export const useWorkTabs = create<WorkTabsState>((set, get) => ({
  // 처음에는 비어 있음 — 대시보드도 다른 화면처럼 들어가면 생기고 닫을 수 있다
  tabs: [],
  open: (tab) => {
    const { tabs } = get();
    if (tabs.some((t) => t.path === tab.path)) return true;
    if (tabs.length >= WORK_TAB_LIMIT) return false;
    set({ tabs: [...tabs, tab] });
    return true;
  },
  close: (path) => set(({ tabs }) => ({ tabs: tabs.filter((t) => t.path !== path || t.fixed) })),
  togglePin: (path) =>
    set(({ tabs }) => {
      const target = tabs.find((t) => t.path === path);
      if (!target) return { tabs };
      const toggled = { ...target, fixed: !target.fixed };
      const rest = tabs.filter((t) => t.path !== path);
      const fixedCount = rest.filter((t) => t.fixed).length;
      return { tabs: [...rest.slice(0, fixedCount), toggled, ...rest.slice(fixedCount)] };
    }),
  keep: (predicate) =>
    set(({ tabs }) => ({ tabs: tabs.filter((t, i) => t.fixed || predicate(t, i)) })),
}));
