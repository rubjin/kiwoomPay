import clsx from 'clsx';
import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { useControllableState } from '../../hooks';
import { NumberBadge } from '../Badge';
import styles from './Tab.module.scss';

export type TabVariant = 'line' | 'button' | 'title';
export type TabSize = 'md' | 'sm';

interface TabContextValue {
  value?: string;
  onSelect: (value: string) => void;
  variant: TabVariant;
  size: TabSize;
}

const TabContext = createContext<TabContextValue | null>(null);

export interface TabProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /** 선택된 Tab 값 (controlled) */
  value?: string;
  /** 처음 선택할 Tab 값 (uncontrolled) */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** line(기본): 밑줄 Tab / button: 동급 View를 버튼형으로 전환 / title: 섹션 제목처럼 쓰는 Tab(14 · Active Bold + 굵은 밑줄 4) */
  variant?: TabVariant;
  /** md(기본) 40 · sm 32. Button Tab도 md 40 · sm 32, Title Tab은 크기 하나(34) */
  size?: TabSize;
  /** Equal Width: 부모 폭을 Item 수만큼 같은 비율로 나눈다 */
  fullWidth?: boolean;
  children: ReactNode;
}

const TabRoot = forwardRef<HTMLDivElement, TabProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      variant = 'line',
      size = 'md',
      fullWidth = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const [current, setCurrent] = useControllableState<string | undefined>(
      value,
      defaultValue,
      (next) => next !== undefined && onChange?.(next),
    );

    const context = useMemo(
      () => ({ value: current, onSelect: setCurrent, variant, size }),
      [current, setCurrent, variant, size],
    );

    return (
      <TabContext.Provider value={context}>
        <div
          {...rest}
          ref={ref}
          role="tablist"
          className={clsx(
            styles.tabs,
            styles[variant],
            variant === 'line' && styles[size],
            variant === 'button' && size === 'sm' && styles.buttonSm,
            fullWidth && styles.fullWidth,
            className,
          )}
        >
          {children}
        </div>
      </TabContext.Provider>
    );
  },
);
TabRoot.displayName = 'Tab';

export interface TabItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** 이 Tab이 나타내는 값 */
  value: string;
  /** 건수. 넘기면 Label 옆에 Number Badge를 보여준다 (0도 표시) */
  count?: number;
  /** 건수 최대 표시값 (기본 99 → 99+) */
  max?: number;
  children: ReactNode;
}

const TabItem = forwardRef<HTMLButtonElement, TabItemProps>(
  ({ value, count, max, disabled, className, children, onClick, ...rest }, ref) => {
    const group = useContext(TabContext);
    if (!group) throw new Error('Tab.Item은 Tab 안에서만 사용할 수 있습니다.');
    const selected = group.value === value;

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) group.onSelect(value);
    };

    return (
      <button
        {...rest}
        ref={ref}
        type="button"
        role="tab"
        aria-selected={selected}
        disabled={disabled}
        className={clsx(styles.item, selected && styles.active, className)}
        onClick={handleClick}
      >
        <span className={styles.label}>{children}</span>
        {count !== undefined && (
          <NumberBadge
            count={count}
            max={max}
            showZero
            appearance="soft"
            className={styles.count}
          />
        )}
      </button>
    );
  },
);
TabItem.displayName = 'Tab.Item';

/**
 * 동일 화면 · 동일 영역 안에서 콘텐츠 View를 전환한다. 업무 화면 열기 · 닫기는 Work Tab을 쓴다.
 *
 * ```tsx
 * <Tab value={view} onChange={setView}>
 *   <Tab.Item value="all">전체</Tab.Item>
 *   <Tab.Item value="wait" count={10}>승인대기</Tab.Item>
 * </Tab>
 * {view === 'all' ? <AllList /> : <WaitList />}
 * ```
 */
export const Tab = Object.assign(TabRoot, { Item: TabItem });
