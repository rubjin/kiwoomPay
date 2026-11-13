import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseLookupResult<T> {
  /** Lookup Modal 열림 여부 → `<Modal open={lookup.isOpen}>` */
  isOpen: boolean;
  /** Modal을 열고, 행을 고르면 그 값 · 닫으면 null로 끝나는 Promise */
  open: () => Promise<T | null>;
  /** 결과 행 [선택] → 값을 넘기고 닫는다 */
  select: (value: T) => void;
  /** 닫기(X) · Esc → null로 끝내고 닫는다. 호출 화면의 값은 그대로 */
  cancel: () => void;
}

/**
 * P03 Lookup → Apply 흐름 훅. 조회 · 결과(API · 그리드)는 화면이 하고, 이 훅은 열기 → 선택/취소 → 반영만 맡는다.
 *
 * ```tsx
 * const lookup = useLookup<Industry>();
 * const find = async () => {
 *   const picked = await lookup.open();
 *   if (picked) setParams({ industryCode: picked.code, industryName: picked.name });
 * };
 * <Modal open={lookup.isOpen} onClose={lookup.cancel}>… onClick={() => lookup.select(row)} …</Modal>
 * ```
 */
export function useLookup<T>(): UseLookupResult<T> {
  const [isOpen, setOpen] = useState(false);
  const resolver = useRef<((value: T | null) => void) | null>(null);

  const finish = useCallback((value: T | null) => {
    resolver.current?.(value);
    resolver.current = null;
    setOpen(false);
  }, []);

  const open = useCallback(() => {
    resolver.current?.(null); // 이미 열려 있으면 앞의 호출은 취소로 끝낸다
    setOpen(true);
    return new Promise<T | null>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const select = useCallback((value: T) => finish(value), [finish]);
  const cancel = useCallback(() => finish(null), [finish]);

  // 화면이 닫히면(언마운트) 기다리던 호출을 취소로 끝낸다
  useEffect(() => () => resolver.current?.(null), []);

  return { isOpen, open, select, cancel };
}
