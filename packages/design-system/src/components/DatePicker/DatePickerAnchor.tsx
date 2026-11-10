import clsx from 'clsx';
import { useEffect, useRef, type ReactNode } from 'react';
import { useOutsideClick } from '../../hooks';
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

// DateField · DateRangeField가 쓰는 팝오버 틀. 바깥 클릭·Esc로 닫는다. 패키지 내부용이다.
export function DatePickerAnchor({
  open,
  onClose,
  fullWidth,
  panel,
  children,
}: DatePickerAnchorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  useOutsideClick(rootRef, onClose, open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <div ref={rootRef} className={clsx(styles.anchor, fullWidth && styles.anchorFull)}>
      {children}
      {open && <div className={styles.popover}>{panel}</div>}
    </div>
  );
}
