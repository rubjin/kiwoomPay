import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';

export interface DialogOptions {
  /** 제목 (기본: alert '알림' · confirm '확인') */
  title?: ReactNode;
  /** 확인 버튼 문구 (기본 '확인') */
  confirmText?: ReactNode;
  /** confirm 취소 버튼 문구 (기본 '취소') */
  cancelText?: ReactNode;
  /** 확인 버튼 색: 금액 · 계약 등 되돌리기 어려운 처리는 danger */
  variant?: 'primary' | 'danger';
}

export interface DialogApi {
  /** 결과 · 안내 (확인 버튼 1개). 닫히면 resolve */
  alert: (message: ReactNode, options?: DialogOptions) => Promise<void>;
  /** 실행 전 확인 (취소 · 확인). 확인이면 true */
  confirm: (message: ReactNode, options?: DialogOptions) => Promise<boolean>;
}

interface DialogState extends DialogOptions {
  id: number;
  type: 'alert' | 'confirm';
  message: ReactNode;
  resolve: (ok: boolean) => void;
}

const DialogContext = createContext<DialogApi | null>(null);

/**
 * 앱 최상위에 한 번 둔다. 성공 · 실패 안내는 Toast 없이 Alert로 통일한다 (페이지 패턴 P-1).
 *
 * ```tsx
 * const dialog = useDialog();
 * if (!(await dialog.confirm('선택한 원장을 지급확정할까요?'))) return;
 * await dialog.alert('지급확정되었습니다.');
 * ```
 */
export function DialogProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<DialogState[]>([]);
  const seq = useRef(0);

  const open = useCallback(
    (type: DialogState['type'], message: ReactNode, options: DialogOptions = {}) =>
      new Promise<boolean>((resolve) => {
        seq.current += 1;
        setQueue((prev) => [...prev, { ...options, id: seq.current, type, message, resolve }]);
      }),
    [],
  );

  const api = useMemo<DialogApi>(
    () => ({
      alert: async (message, options) => {
        await open('alert', message, options);
      },
      confirm: (message, options) => open('confirm', message, options),
    }),
    [open],
  );

  const current = queue[0];
  const close = (ok: boolean) => {
    if (!current) return;
    current.resolve(ok);
    setQueue((prev) => prev.slice(1));
  };

  return (
    <DialogContext.Provider value={api}>
      {children}
      {current && (
        <Modal key={current.id} open onClose={() => close(false)}>
          <Modal.Header title={current.title ?? (current.type === 'alert' ? '알림' : '확인')} />
          <Modal.Body>
            <Modal.Description>{current.message}</Modal.Description>
          </Modal.Body>
          <Modal.Footer>
            {current.type === 'confirm' && (
              <Button size="lg" variant="neutral" appearance="line" onClick={() => close(false)}>
                {current.cancelText ?? '취소'}
              </Button>
            )}
            <Button
              size="lg"
              variant={current.variant === 'danger' ? 'danger' : 'primary'}
              onClick={() => close(true)}
            >
              {current.confirmText ?? '확인'}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </DialogContext.Provider>
  );
}

/** DialogProvider 안에서 alert · confirm을 Promise로 쓴다 */
export function useDialog(): DialogApi {
  const api = useContext(DialogContext);
  if (!api) throw new Error('useDialog는 DialogProvider 안에서만 사용할 수 있습니다.');
  return api;
}
