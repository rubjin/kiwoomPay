import clsx from 'clsx';
import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useMemo,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { useControllableState } from '../../hooks';
import styles from './Segmented.module.scss';

export type SegmentedSize = 'sm' | 'md';

interface SegmentedContextValue {
  name: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const SegmentedContext = createContext<SegmentedContextValue | null>(null);

export interface SegmentedProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** form 전송용 name. 생략하면 자동 생성된다 */
  name?: string;
  /** 모든 옵션을 비활성화한다 */
  disabled?: boolean;
  /** sm 32(기본) · md 40 (검색 조건 줄에서 필드 높이 40에 맞출 때) */
  size?: SegmentedSize;
  /** 부모 폭을 채우고 옵션을 같은 폭으로 나눈다 */
  fullWidth?: boolean;
  children: ReactNode;
}

const SegmentedRoot = forwardRef<HTMLDivElement, SegmentedProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      name,
      disabled,
      size = 'sm',
      fullWidth = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const autoName = useId();
    const [current, setCurrent] = useControllableState<string | undefined>(
      value,
      defaultValue,
      (next) => next !== undefined && onChange?.(next),
    );

    const context = useMemo(
      () => ({ name: name ?? autoName, value: current, onChange: setCurrent, disabled }),
      [name, autoName, current, setCurrent, disabled],
    );

    return (
      <SegmentedContext.Provider value={context}>
        <div
          {...rest}
          ref={ref}
          role="radiogroup"
          className={clsx(
            styles.root,
            size === 'md' && styles.md,
            fullWidth && styles.fullWidth,
            className,
          )}
        >
          {children}
        </div>
      </SegmentedContext.Provider>
    );
  },
);
SegmentedRoot.displayName = 'Segmented';

export interface SegmentedItemProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'size'
> {
  /** 이 옵션이 나타내는 값 */
  value: string;
  children: ReactNode;
}

const SegmentedItem = forwardRef<HTMLInputElement, SegmentedItemProps>(
  ({ value, children, className, style, disabled, onChange, ...rest }, ref) => {
    const group = useContext(SegmentedContext);
    if (!group) throw new Error('Segmented.Item은 Segmented 안에서만 사용할 수 있습니다.');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      group.onChange(value);
      onChange?.(event);
    };

    return (
      <label className={clsx(styles.item, className)} style={style}>
        <input
          {...rest}
          ref={ref}
          type="radio"
          name={group.name}
          value={value}
          checked={group.value === value}
          disabled={disabled ?? group.disabled}
          className={styles.input}
          onChange={handleChange}
        />
        <span className={styles.text}>
          <span className={styles.label}>{children}</span>
        </span>
      </label>
    );
  },
);
SegmentedItem.displayName = 'Segmented.Item';

/**
 * 동급 옵션을 한눈에 보여주고 하나를 고르는 컨트롤. 클릭 즉시 값이 바뀐다.
 *
 * ```tsx
 * <Segmented value={type} onChange={setType}>
 *   <Segmented.Item value="all">전체</Segmented.Item>
 *   <Segmented.Item value="normal">일반</Segmented.Item>
 * </Segmented>
 * ```
 */
export const Segmented = Object.assign(SegmentedRoot, { Item: SegmentedItem });
