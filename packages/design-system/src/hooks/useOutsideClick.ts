import { useEffect, type RefObject } from 'react';

type Refs = RefObject<HTMLElement | null> | Array<RefObject<HTMLElement | null>>;

/**
 * ref 요소(들) 바깥을 누르면 handler를 호출한다 (enabled일 때만 리스너 등록).
 * 팝업을 document.body에 띄우는 경우 기준 요소와 팝업을 함께 넘긴다.
 */
export function useOutsideClick(refs: Refs, handler: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const list = Array.isArray(refs) ? refs : [refs];
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (list.some((ref) => ref.current?.contains(target))) return;
      handler();
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
    // refs 배열은 렌더마다 새로 만들어지므로 enabled·handler 변화에만 반응한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handler, enabled]);
}
