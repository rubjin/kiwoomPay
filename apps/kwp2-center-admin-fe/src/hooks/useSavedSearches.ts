import { useState } from 'react';
import type { SavedSearch } from '@/components/popups/SavedSearchModal';

/**
 * 조회 화면의 내 검색조건 상태 — 목록 · 적용 중인 조건 · 적용 · [저장] 반영.
 * components/popups/SavedSearchModal과 쓴다. 적용하면 검색 조건 입력만 바꾸고 조회는 사용자가 [조회].
 * TODO(API) 내 검색조건 목록 · 적용 중인 조건
 */
export function useSavedSearches<P>(initial: SavedSearch<P>[], setParams: (params: P) => void) {
  const [list, setList] = useState(initial);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const applyFrom = (items: SavedSearch<P>[], id: string | null) => {
    setAppliedId(id);
    const found = items.find((s) => s.id === id);
    if (found) setParams(found.params);
  };

  return {
    list,
    appliedId,
    /** 상단 "내 검색조건 선택" SelectBox 선택지 */
    options: list.map((s) => ({ value: s.id, label: s.name })),
    /** SelectBox에서 고름 */
    apply: (id: string | null) => applyFrom(list, id),
    /** 관리 팝업 [저장] */
    save: (next: SavedSearch<P>[], applied: string | null) => {
      setList(next);
      if (applied !== appliedId) applyFrom(next, applied);
    },
  };
}
