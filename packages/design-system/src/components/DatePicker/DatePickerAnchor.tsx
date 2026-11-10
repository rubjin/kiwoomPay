import clsx from 'clsx';
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useFloatingPosition, useOutsideClick } from '../../hooks';
import styles from './DatePicker.module.scss';

interface DatePickerAnchorProps {
  open: boolean;
  onClose: () => void;
  fullWidth?: boolean;
  /** 열렸을 때 필드 아래에 띄울 패널 */
  panel: ReactNode;
  /** 필드 */
  children: ReactNode;
}

// DateField · DateRangeField가 쓰는 팝오버 틀. 패널은 document.body에 띄워 모달 안에서도 잘리지 않는다.
// 바깥 클릭·Esc로 닫는다. 패키지 내부용이다.
export function DatePickerAnchor({
  open,
  onClose,
  fullWidth,
  panel,
  children,
}: DatePickerAnchorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useOutsideClick([rootRef, panelRef], onClose, open);
  const position = useFloatingPosition(rootRef, panelRef, open, {
    offsetVar: '--kp-date-picker-popover-offset',
  });

  useEffect(() => {
    if (!open) return;
    // 캡처 단계에서 먼저 처리해 모달의 Esc보다 앞선다 (팝업만 닫힘)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onClose();
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [open, onClose]);

  return (
    <div ref={rootRef} className={clsx(styles.anchor, fullWidth && styles.anchorFull)}>
      {children}
      {open &&
        createPortal(
          <div ref={panelRef} className={styles.popover} style={position}>
            {panel}
          </div>,
          document.body,
        )}
    </div>
  );
}
