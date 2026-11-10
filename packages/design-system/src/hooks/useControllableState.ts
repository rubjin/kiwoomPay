import { useCallback, useState } from 'react';

/**
 * controlled / uncontrolled 겸용 상태.
 * `controlled`가 undefined가 아니면 부모가 값을 관리하고, 아니면 내부 상태를 쓴다.
 */
export function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
) {
  const [inner, setInner] = useState<T>(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? (controlled as T) : inner;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInner(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [value, setValue] as const;
}
