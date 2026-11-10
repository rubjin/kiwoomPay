import { useEffect, type RefObject } from 'react';

/** ref 요소 바깥을 누르면 handler를 호출한다 (enabled일 때만 리스너 등록) */
export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  handler: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) handler();
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [ref, handler, enabled]);
}
