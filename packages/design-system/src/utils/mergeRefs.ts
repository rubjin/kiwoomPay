import type { MutableRefObject, Ref, RefCallback } from 'react';

/** 여러 ref(콜백/객체)를 하나로 합친다 */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as MutableRefObject<T | null>).current = node;
    }
  };
}
