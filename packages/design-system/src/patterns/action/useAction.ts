import { useCallback, useRef, useState, type ReactNode } from 'react';
import { useDialog, type DialogOptions } from '../common';

type Message<A extends unknown[]> = ReactNode | ((...args: A) => ReactNode);

export interface UseActionOptions<A extends unknown[], R> {
  /** Check: 문제가 있으면 안내 문구를 돌려준다 → Alert 후 중단 (입력은 그대로) */
  validate?: (...args: A) => ReactNode | null | undefined | false;
  /** Confirm: 있으면 실행 전에 묻는다. 취소하면 중단 */
  confirm?: Message<A>;
  confirmOptions?: DialogOptions;
  /** Process: 실제 처리 (API). 처리 중에는 loading이 true, 다시 눌러도 무시 */
  run: (...args: A) => Promise<R>;
  /** 성공 직후 (Modal 닫기 · 재조회 등). 완료 안내보다 먼저 실행된다 */
  onSuccess?: (result: R, ...args: A) => void | Promise<void>;
  /** Result: 성공 안내 (Alert). 없으면 안내 없이 끝 */
  success?: ReactNode | ((result: R) => ReactNode);
  /** Result: 실패 안내 (Alert). 입력과 Modal은 그대로 두어 다시 시도할 수 있게 한다 */
  failure?: ReactNode | ((error: unknown) => ReactNode);
}

export interface UseActionResult<A extends unknown[]> {
  /** Check → Confirm → Process → Result. 끝까지 성공하면 true */
  execute: (...args: A) => Promise<boolean>;
  /** 처리 중 → 실행 버튼 loading */
  loading: boolean;
}

const DEFAULT_FAILURE = '처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

const resolve = <A extends unknown[]>(message: Message<A>, args: A): ReactNode =>
  typeof message === 'function' ? (message as (...a: A) => ReactNode)(...args) : message;

/**
 * P04 Action → Feedback 흐름 훅. DialogProvider 안에서 쓴다 (Confirm · 결과 안내는 Alert, Toast 없음).
 *
 * ```tsx
 * const save = useAction({
 *   validate: () => (!reason ? '변경 사유를 입력해주세요.' : null),
 *   confirm: '사업자번호를 변경할까요?',
 *   run: () => api.changeBizNo(next, reason),
 *   onSuccess: () => setOpen(false),
 *   success: '사업자번호가 변경되었습니다.',
 * });
 * <Button loading={save.loading} onClick={() => save.execute()}>확인</Button>
 * ```
 */
export function useAction<A extends unknown[] = [], R = unknown>(
  options: UseActionOptions<A, R>,
): UseActionResult<A> {
  const dialog = useDialog();
  const [loading, setLoading] = useState(false);
  const running = useRef(false);
  const latest = useRef(options);
  latest.current = options;

  const execute = useCallback(
    async (...args: A) => {
      if (running.current) return false; // 중복 실행 방지
      const o = latest.current;

      const problem = o.validate?.(...args);
      if (problem) {
        await dialog.alert(problem);
        return false;
      }
      if (
        o.confirm !== undefined &&
        !(await dialog.confirm(resolve(o.confirm, args), o.confirmOptions))
      ) {
        return false;
      }

      running.current = true;
      setLoading(true);
      let result: R;
      try {
        result = await o.run(...args);
      } catch (error) {
        running.current = false;
        setLoading(false);
        await dialog.alert(
          o.failure === undefined
            ? DEFAULT_FAILURE
            : typeof o.failure === 'function'
              ? o.failure(error)
              : o.failure,
        );
        return false;
      }
      running.current = false;
      setLoading(false);

      await o.onSuccess?.(result, ...args);
      if (o.success !== undefined) {
        await dialog.alert(typeof o.success === 'function' ? o.success(result) : o.success);
      }
      return true;
    },
    [dialog],
  );

  return { execute, loading };
}
