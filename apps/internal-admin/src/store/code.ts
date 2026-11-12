import { create } from 'zustand';
import { fetchCodes } from '@/api/common/code';
import { CODE_FALLBACK, type CodeGroup } from '@/constants/codes';
import type { Option } from '@/constants/options';

interface CodeState {
  /** 받아 온 공통코드 (그룹별 캐시 — 앱을 쓰는 동안 유지) */
  codes: Partial<Record<CodeGroup, Option[]>>;
  /** 그룹을 한 번만 받는다 (요청 중이거나 받았으면 건너뜀) */
  load: (group: CodeGroup) => void;
}

const pending = new Set<CodeGroup>();

export const useCodeStore = create<CodeState>((set, get) => ({
  codes: {},
  load: (group) => {
    if (get().codes[group] || pending.has(group)) return;
    pending.add(group);
    fetchCodes(group)
      .then((options) => set((s) => ({ codes: { ...s.codes, [group]: options } })))
      // 실패하면 임시값을 계속 쓰고, 다음에 다시 요청한다
      .catch(() => undefined)
      .finally(() => pending.delete(group));
  },
}));

/** 그룹의 선택지 (받기 전 · 실패 시 임시값) — React 밖(searchFields 등)에서도 쓴다 */
export const getCodeOptions = (group: CodeGroup): Option[] =>
  useCodeStore.getState().codes[group] ?? CODE_FALLBACK[group];
