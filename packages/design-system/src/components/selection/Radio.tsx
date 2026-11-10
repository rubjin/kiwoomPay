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
import styles from './Radio.module.scss';
import { SelectionGroup } from './SelectionGroup';
import { SelectionItem, type SelectionSize } from './SelectionItem';

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  size?: SelectionSize;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'value'
> {
  /** 이 라디오가 나타내는 값 */
  value: string;
  /** md 20 (기본) · sm 16. RadioGroup 안에서는 그룹의 size를 따른다 */
  size?: SelectionSize;
  label?: ReactNode;
  /** 라벨 아래 부가 설명 */
  helperText?: ReactNode;
}

/**
 * 하나만 선택하는 라디오. RadioGroup 안에서 쓰면 그룹이 선택값을 관리한다.
 * 단독으로 쓸 때는 `name` + `checked` / `defaultChecked` 같은 native 속성을 그대로 쓴다.
 * className · style은 바깥 요소에, 나머지 속성은 input에 적용된다.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ value, size, label, helperText, className, style, disabled, onChange, ...rest }, ref) => {
    const group = useContext(RadioGroupContext);
    const resolvedSize = size ?? group?.size ?? 'md';
    const isDisabled = disabled ?? group?.disabled;

    const groupProps = group
      ? {
          name: group.name,
          checked: group.value === value,
          onChange: (event: ChangeEvent<HTMLInputElement>) => {
            group.onChange(value);
            onChange?.(event);
          },
        }
      : { onChange };

    return (
      <SelectionItem
        size={resolvedSize}
        disabled={isDisabled}
        label={label}
        helperText={helperText}
        className={className}
        style={style}
      >
        <input
          {...rest}
          {...groupProps}
          ref={ref}
          type="radio"
          value={value}
          disabled={isDisabled}
          className={styles.input}
        />
        <span className={clsx(styles.box, styles[resolvedSize])} aria-hidden="true" />
      </SelectionItem>
    );
  },
);

Radio.displayName = 'Radio';

export interface RadioGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** form 전송용 name. 생략하면 자동 생성된다 */
  name?: string;
  size?: SelectionSize;
  disabled?: boolean;
  /** vertical(기본) · horizontal */
  direction?: 'vertical' | 'horizontal';
}

/** 같은 그룹에서는 하나의 항목만 선택한다. controlled(`value`) · uncontrolled(`defaultValue`) 모두 지원한다. */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ value, defaultValue, onChange, name, size, disabled, direction, children, ...rest }, ref) => {
    const autoName = useId();
    const [current, setCurrent] = useControllableState<string | undefined>(
      value,
      defaultValue,
      (next) => next !== undefined && onChange?.(next),
    );

    const context = useMemo(
      () => ({ name: name ?? autoName, value: current, onChange: setCurrent, disabled, size }),
      [name, autoName, current, setCurrent, disabled, size],
    );

    return (
      <RadioGroupContext.Provider value={context}>
        <SelectionGroup {...rest} ref={ref} role="radiogroup" direction={direction}>
          {children}
        </SelectionGroup>
      </RadioGroupContext.Provider>
    );
  },
);

RadioGroup.displayName = 'RadioGroup';
