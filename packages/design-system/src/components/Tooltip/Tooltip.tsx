import clsx from 'clsx';
import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';
import { useControllableState } from '../../hooks';
import { mergeRefs } from '../../utils';
import styles from './Tooltip.module.scss';

export type TooltipPlacement = 'bottom' | 'top' | 'left' | 'right';

// 선호 위치에서 공간이 모자라면 다음 순서로 바꾼다 (Tooltip Guide 05)
const FALLBACK: Record<TooltipPlacement, TooltipPlacement[]> = {
  bottom: ['bottom', 'top', 'left', 'right'],
  top: ['top', 'bottom', 'left', 'right'],
  left: ['left', 'right', 'bottom', 'top'],
  right: ['right', 'left', 'bottom', 'top'],
};

interface Position {
  placement: TooltipPlacement;
  top: number;
  left: number;
  /** 포인터 위치: 위·아래 배치는 left, 좌·우 배치는 top (몸체 기준 px) */
  arrow: number;
}

const readPx = (name: string) =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;

/** 기준 요소 · 몸체 크기로 위치를 계산한다. 아이콘 끝과 포인터 끝 간격은 0 */
function computePosition(
  anchor: DOMRect,
  width: number,
  height: number,
  preferred: TooltipPlacement,
): Position {
  const arrowW = readPx('--kp-tooltip-arrow-width');
  // 기준 요소 ↔ 포인터 끝 간격 + 포인터 높이 (Figma: 아이콘 바깥 8px)
  const arrowH = readPx('--kp-tooltip-arrow-height') + readPx('--kp-tooltip-offset');
  const inset = readPx('--kp-tooltip-arrow-inset');
  const radius = readPx('--kp-tooltip-radius');
  const margin = readPx('--kp-tooltip-viewport-margin');
  const viewW = document.documentElement.clientWidth;
  const viewH = window.innerHeight;
  const centerX = anchor.left + anchor.width / 2;
  const centerY = anchor.top + anchor.height / 2;

  const place = (placement: TooltipPlacement) => {
    switch (placement) {
      case 'bottom':
        return { top: anchor.bottom + arrowH, left: centerX - inset - arrowW / 2 };
      case 'top':
        return { top: anchor.top - arrowH - height, left: centerX - inset - arrowW / 2 };
      case 'left':
        return { top: centerY - height / 2, left: anchor.left - arrowH - width };
      default:
        return { top: centerY - height / 2, left: anchor.right + arrowH };
    }
  };
  const fits = ({ top, left }: { top: number; left: number }) =>
    top >= margin &&
    left >= margin &&
    top + height <= viewH - margin &&
    left + width <= viewW - margin;

  const order = FALLBACK[preferred];
  const placement = order.find((p) => fits(place(p))) ?? preferred;
  let { top, left } = place(placement);
  // 어디에도 다 들어가지 않으면 화면 안으로 밀어 넣는다
  left = Math.min(Math.max(left, margin), Math.max(margin, viewW - margin - width));
  top = Math.min(Math.max(top, margin), Math.max(margin, viewH - margin - height));

  const vertical = placement === 'bottom' || placement === 'top';
  const along = vertical ? centerX - left : centerY - top;
  const size = vertical ? width : height;
  const arrow = Math.min(Math.max(along - arrowW / 2, radius), size - radius - arrowW);
  return { placement, top, left, arrow };
}

type TriggerProps = {
  ref?: Ref<HTMLElement>;
  onMouseEnter?: (event: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  'aria-describedby'?: string;
};

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content' | 'children'> {
  /** 보조 설명 문구 (텍스트만. 입력창 · 버튼 등 Action은 넣지 않는다) */
  content: ReactNode;
  /** 기준 요소 1개. ref와 마우스 · 포커스 이벤트를 받을 수 있어야 한다 (button, Icon 버튼 등) */
  children: ReactElement;
  /** 선호 위치 (기본 bottom). 공간이 모자라면 top → left → right 순서로 바꾼다 */
  placement?: TooltipPlacement;
  /** Hover 후 표시까지 지연 (기본 200ms). 키보드 Focus는 즉시 */
  delay?: number;
  /** 표시 여부 (controlled) */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 표시하지 않음 */
  disabled?: boolean;
}

/**
 * 기준 요소에 Hover(200ms) · 키보드 Focus 시 보조 설명을 띄운다.
 * 몸체는 document.body(Overlay)에 그려 카드 · 모달의 잘림(clip) 영향을 받지 않는다.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      placement = 'bottom',
      delay = 200,
      open,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      className,
      style,
      id,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const tooltipId = id ?? autoId;
    const anchorRef = useRef<HTMLElement | null>(null);
    const bubbleRef = useRef<HTMLDivElement>(null);
    const timer = useRef<number | undefined>(undefined);
    const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange);
    const [position, setPosition] = useState<Position | null>(null);
    const shown = isOpen && !disabled;

    const clearTimer = () => window.clearTimeout(timer.current);
    useEffect(() => clearTimer, []);

    const show = useCallback(
      (wait: number) => {
        clearTimer();
        if (wait <= 0) setOpen(true);
        else timer.current = window.setTimeout(() => setOpen(true), wait);
      },
      [setOpen],
    );
    const hide = useCallback(() => {
      clearTimer();
      setOpen(false);
    }, [setOpen]);

    // 위치 계산: 그려진 몸체 크기를 재서 정한다. 스크롤 · 크기 변경 시 다시 계산
    useLayoutEffect(() => {
      if (!shown) {
        setPosition(null);
        return;
      }
      const update = () => {
        const anchor = anchorRef.current?.getBoundingClientRect();
        // offsetWidth는 정수로 반올림되어 왼쪽 배치에서 포인터가 아이콘과 어긋나므로 실제 크기를 쓴다
        const bubble = bubbleRef.current?.getBoundingClientRect();
        if (!anchor || !bubble) return;
        setPosition(computePosition(anchor, bubble.width, bubble.height, placement));
      };
      update();
      window.addEventListener('scroll', update, true);
      window.addEventListener('resize', update);
      return () => {
        window.removeEventListener('scroll', update, true);
        window.removeEventListener('resize', update);
      };
    }, [shown, placement, content]);

    // Esc로 닫기. 캡처 단계에서 먼저 처리해 모달의 Esc보다 앞선다 (툴팁만 닫힘)
    useEffect(() => {
      if (!shown) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        hide();
      };
      document.addEventListener('keydown', onKeyDown, true);
      return () => document.removeEventListener('keydown', onKeyDown, true);
    }, [shown, hide]);

    if (!isValidElement<TriggerProps>(children)) return children;
    const childProps = children.props;
    // React 18: 요소의 ref는 element.ref에 있다
    const childRef = (children as unknown as { ref?: Ref<HTMLElement> }).ref;

    const trigger = cloneElement(children, {
      ref: mergeRefs(childRef, anchorRef),
      'aria-describedby': shown
        ? clsx(childProps['aria-describedby'], tooltipId)
        : childProps['aria-describedby'],
      onMouseEnter: (event: MouseEvent<HTMLElement>) => {
        childProps.onMouseEnter?.(event);
        if (!disabled) show(delay);
      },
      onMouseLeave: (event: MouseEvent<HTMLElement>) => {
        childProps.onMouseLeave?.(event);
        hide();
      },
      onFocus: (event: FocusEvent<HTMLElement>) => {
        childProps.onFocus?.(event);
        // 키보드 Focus만 즉시 표시 (마우스 클릭 Focus는 Hover 규칙을 따른다)
        if (!disabled && event.currentTarget.matches(':focus-visible')) show(0);
      },
      onBlur: (event: FocusEvent<HTMLElement>) => {
        childProps.onBlur?.(event);
        hide();
      },
    });

    const placed = position?.placement ?? placement;
    const bubbleStyle: CSSProperties = position
      ? { ...style, top: position.top, left: position.left }
      : { ...style, top: 0, left: 0, visibility: 'hidden' };
    const vertical = placed === 'bottom' || placed === 'top';

    return (
      <>
        {trigger}
        {shown &&
          createPortal(
            <div
              {...rest}
              ref={mergeRefs(ref, bubbleRef)}
              id={tooltipId}
              role="tooltip"
              className={clsx(styles.tooltip, styles[placed], className)}
              style={bubbleStyle}
            >
              {content}
              <span
                className={styles.arrow}
                style={
                  position
                    ? vertical
                      ? { left: position.arrow }
                      : { top: position.arrow }
                    : undefined
                }
              />
            </div>,
            document.body,
          )}
      </>
    );
  },
);
Tooltip.displayName = 'Tooltip';
