import clsx from 'clsx';
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { mergeRefs } from '../../utils';
import { Icon } from '../Icon';
import styles from './Modal.module.scss';

interface ModalContextValue {
  titleId: string;
  onClose?: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);
const useModal = () => useContext(ModalContext);

// 열린 모달 순서. Esc는 가장 위 모달만 처리하고, 배경 스크롤 잠금은 마지막 모달이 닫힐 때 푼다.
const openStack: string[] = [];
let savedOverflow = '';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean;
  /** Close(X) · 취소 · Esc가 호출한다. 미저장 이탈 정책은 여기서 처리한다 */
  onClose?: () => void;
  /** 기본 400. 결과 Grid가 있는 Lookup 등 넓은 경우에만 지정 */
  width?: number | string;
  /** Esc로 닫기 (기본 true, onClose가 있을 때) */
  closeOnEsc?: boolean;
  /** 딤 영역 클릭으로 닫기 (기본 false: 입력 중 실수로 닫히지 않게) */
  closeOnDimClick?: boolean;
  /** 열릴 때 포커스를 줄 요소. 생략하면 첫 번째 포커스 가능 요소 */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** 가이드·미리보기용: 딤·포털 없이 제자리에 패널만 그린다 */
  inline?: boolean;
}

const ModalRoot = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      width,
      closeOnEsc = true,
      closeOnDimClick = false,
      initialFocusRef,
      inline = false,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const titleId = useId();
    const stackId = useId();
    const panelRef = useRef<HTMLDivElement>(null);
    const active = open && !inline;

    // 배경 스크롤 잠금 · 포커스 이동/복귀 · Esc
    useEffect(() => {
      if (!active) return;
      const opener = document.activeElement as HTMLElement | null;
      if (openStack.length === 0) {
        savedOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      }
      openStack.push(stackId);

      const panel = panelRef.current;
      const target =
        initialFocusRef?.current ?? panel?.querySelector<HTMLElement>(FOCUSABLE) ?? panel;
      target?.focus();

      const onKeyDown = (event: KeyboardEvent) => {
        // 드롭다운·달력이 먼저 처리한 Esc(defaultPrevented)는 무시한다
        if (event.key !== 'Escape' || event.defaultPrevented || !closeOnEsc || !onClose) return;
        if (openStack[openStack.length - 1] !== stackId) return;
        event.stopPropagation();
        onClose();
      };
      document.addEventListener('keydown', onKeyDown);

      return () => {
        document.removeEventListener('keydown', onKeyDown);
        openStack.splice(openStack.indexOf(stackId), 1);
        if (openStack.length === 0) document.body.style.overflow = savedOverflow;
        opener?.focus?.();
      };
      // 열릴 때 한 번만 실행한다
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    if (!open) return null;

    const panelStyle: CSSProperties = { ...style, ...(width !== undefined ? { width } : null) };
    const panel = (
      <div
        {...rest}
        ref={mergeRefs(ref, panelRef)}
        role="dialog"
        aria-modal={inline ? undefined : true}
        aria-labelledby={titleId}
        tabIndex={-1}
        className={clsx(styles.modal, className)}
        style={panelStyle}
      >
        {children}
      </div>
    );

    return (
      <ModalContext.Provider value={{ titleId, onClose }}>
        {inline
          ? panel
          : createPortal(
              <div
                className={styles.dim}
                onMouseDown={(event) => {
                  if (closeOnDimClick && event.target === event.currentTarget) onClose?.();
                }}
              >
                {panel}
              </div>,
              document.body,
            )}
      </ModalContext.Provider>
    );
  },
);
ModalRoot.displayName = 'Modal';

export interface ModalHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 모달 목적을 즉시 알 수 있는 제목 */
  title: ReactNode;
  /** Close(X) 표시. Information · Form · Lookup은 표시, Alert · Confirm은 숨김 */
  closeButton?: boolean;
  closeLabel?: string;
}

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ title, closeButton = false, closeLabel = '닫기', className, ...rest }, ref) => {
    const modal = useModal();
    return (
      <div {...rest} ref={ref} className={clsx(styles.header, className)}>
        <h2 id={modal?.titleId} className={styles.title}>
          {title}
        </h2>
        {closeButton && (
          <button
            type="button"
            className={styles.close}
            aria-label={closeLabel}
            onClick={() => modal?.onClose?.()}
          >
            <Icon name="x-close" size={24} />
          </button>
        )}
      </div>
    );
  },
);
ModalHeader.displayName = 'Modal.Header';

/** 내용 영역. 내용이 최대 높이를 넘으면 이 영역만 세로로 스크롤된다 (Header · Footer 고정). */
const ModalBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.body, className)} />
  ),
);
ModalBody.displayName = 'Modal.Body';

/** 안내 문구 (14px, 보조색) */
const ModalDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...rest }, ref) => (
    <p {...rest} ref={ref} className={clsx(styles.description, className)} />
  ),
);
ModalDescription.displayName = 'Modal.Description';

export interface ModalInfoItem {
  label: ReactNode;
  value: ReactNode;
}

export interface ModalInfoListProps extends HTMLAttributes<HTMLDListElement> {
  items: ModalInfoItem[];
}

/** Information 모달의 정보 영역 (라벨 : 값) */
const ModalInfoList = forwardRef<HTMLDListElement, ModalInfoListProps>(
  ({ items, className, ...rest }, ref) => (
    <dl {...rest} ref={ref} className={clsx(styles.info, className)}>
      {items.map((item, index) => (
        <div key={index} className={styles.infoRow}>
          <dt className={styles.infoLabel}>{item.label}</dt>
          <dd className={styles.infoValue}>{item.value}</dd>
        </div>
      ))}
    </dl>
  ),
);
ModalInfoList.displayName = 'Modal.InfoList';

/** 처리 버튼 영역. 처리가 필요한 경우에만 둔다 (None이면 생략). 버튼은 size="lg", 최종 Action을 오른쪽에 둔다. */
const ModalFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.footer, className)} />
  ),
);
ModalFooter.displayName = 'Modal.Footer';

/**
 * 업무 팝업. Header · Body · Footer를 조합해 Alert · Confirm · Information · Form · Lookup을 만든다.
 * 브라우저 전체 화면 기준 가운데 배치, 딤은 LNB · Header를 포함한 전체 화면에 적용된다.
 */
export const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Body: ModalBody,
  Description: ModalDescription,
  InfoList: ModalInfoList,
  Footer: ModalFooter,
});
