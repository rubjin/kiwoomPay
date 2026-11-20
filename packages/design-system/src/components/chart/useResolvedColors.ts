import { useEffect, useState } from 'react';

const VAR = /^var\((--[\w-]+)\)$/;

function resolve(colors: readonly string[]): string[] {
  if (typeof window === 'undefined') return [...colors];
  const style = getComputedStyle(document.documentElement);
  return colors.map((color) => {
    const name = VAR.exec(color)?.[1];
    return name ? style.getPropertyValue(name).trim() || color : color;
  });
}

/**
 * `var(--kp-…)` 색을 실제 값으로 바꾼다 — Recharts는 색을 SVG 속성(fill · stroke)으로 쓰는데,
 * 속성에서는 CSS 변수가 풀리지 않는다. 시스템 키컬러(<html data-system>)가 바뀌면 다시 읽는다
 */
export function useResolvedColors(colors: readonly string[]): string[] {
  const key = colors.join('|');
  const [resolved, setResolved] = useState(() => resolve(colors));
  useEffect(() => {
    const list = key.split('|');
    setResolved(resolve(list));
    const observer = new MutationObserver(() => setResolved(resolve(list)));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-system'],
    });
    return () => observer.disconnect();
  }, [key]);
  return resolved;
}
