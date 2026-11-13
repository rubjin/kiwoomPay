import { useCallback, useState } from 'react';

export interface UseConfigDraftResult<T> {
  /** 편집 중인 값 (Modal 안에서 바꾸는 값) */
  draft: T;
  setDraft: (next: T) => void;
  /** 저장값과 다른지 → 닫을 때 확인 · [저장] 활성 */
  dirty: boolean;
  /** 편집을 시작할 때 저장값으로 초안을 맞춘다 (Modal 열 때) */
  begin: () => void;
  /** 초안을 저장값으로 되돌린다 */
  reset: () => void;
}

const sameJson = <T>(a: T, b: T) => JSON.stringify(a) === JSON.stringify(b);

/**
 * P07 Selection & Configuration: 저장값 ↔ 편집 초안. 저장(API) · 결과 안내는 P04 `useAction`으로.
 *
 * ```tsx
 * const config = useConfigDraft(favoriteIds);
 * const open = () => { config.begin(); setOpen(true); };
 * <FavoriteMenuPicker value={config.draft} onChange={config.setDraft} />
 * ```
 */
export function useConfigDraft<T>(
  saved: T,
  isEqual: (a: T, b: T) => boolean = sameJson,
): UseConfigDraftResult<T> {
  const [draft, setDraft] = useState<T>(saved);
  const begin = useCallback(() => setDraft(saved), [saved]);
  return { draft, setDraft, dirty: !isEqual(draft, saved), begin, reset: begin };
}
