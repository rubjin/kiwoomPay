import { useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';

interface Options {
  /** 기준 요소와 띄울 간격을 담은 CSS 변수 (예: '--kp-select-panel-offset') */
  offsetVar?: string;
  /** 기준 요소와 같은 폭으로 맞출지 (SelectBox) */
  matchWidth?: boolean;
}

const HIDDEN: CSSProperties = { position: 'fixed', top: 0, left: 0, visibility: 'hidden' };

/**
 * 팝업(드롭다운·달력)을 document.body에 띄울 때 기준 요소 바로 아래에 붙는 위치를 계산한다.
 * 모달 Body처럼 스크롤·overflow가 있는 영역 안에서도 잘리지 않는다.
 * 아래 공간이 모자라고 위 공간이 충분하면 위로 펼친다. 스크롤·크기 변경 시 다시 계산한다.
 */
export function useFloatingPosition(
  anchorRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  open: boolean,
  { offsetVar, matchWidth = false }: Options = {},
): CSSProperties {
  const [style, setStyle] = useState<CSSProperties>(HIDDEN);

  useLayoutEffect(() => {
    if (!open) {
      setStyle(HIDDEN);
      return;
    }
    const update = () => {
      const anchor = anchorRef.current?.getBoundingClientRect();
      if (!anchor) return;
      const offset = offsetVar
        ? parseFloat(getComputedStyle(document.documentElement).getPropertyValue(offsetVar)) || 0
        : 0;
      const height = floatingRef.current?.offsetHeight ?? 0;
      const below = anchor.bottom + offset;
      const above = anchor.top - offset - height;
      const top = below + height > window.innerHeight && above >= 0 ? above : below;
      setStyle({
        position: 'fixed',
        top,
        left: anchor.left,
        ...(matchWidth ? { width: anchor.width } : null),
      });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, anchorRef, floatingRef, offsetVar, matchWidth]);

  return style;
}
