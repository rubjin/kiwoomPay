import clsx from 'clsx';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useControllableState, useFloatingPosition, useOutsideClick } from '../../hooks';
import { mergeRefs } from '../../utils';
import { Icon } from '../Icon';
import { useFieldControl, type FieldFeedback, type FieldSize } from './fieldContext';
import { FieldBox } from './FieldBox';
import styles from './SelectBox.module.scss';
import { Spinner } from './Spinner';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectBoxProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, option: SelectOption) => void;
  placeholder?: string;
  size?: FieldSize;
  feedback?: FieldFeedback;
  disabled?: boolean;
  /** 옵션을 불러오는 중. 목록 대신 로딩 표시를 보여준다 */
  loading?: boolean;
  loadingText?: string;
  /** 옵션이 하나도 없을 때 안내 문구 */
  emptyText?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** form 전송용 name. 선택값이 hidden input으로 함께 제출된다 */
  name?: string;
  /** 라벨 연결용 id (트리거 버튼에 붙는다) */
  id?: string;
  fullWidth?: boolean;
}

/**
 * 목록에서 하나를 고르는 드롭다운. ref는 바깥 요소(div)에 연결되고,
 * className · style · 나머지 HTML 속성도 바깥 요소에 적용된다.
 */
export const SelectBox = forwardRef<HTMLDivElement, SelectBoxProps>((props, ref) => {
  const {
    options,
    value,
    defaultValue,
    onChange,
    placeholder = '선택해주세요',
    size,
    feedback,
    disabled,
    loading,
    loadingText = '불러오는 중',
    emptyText = '선택 가능한 항목이 없습니다.',
    open,
    defaultOpen = false,
    onOpenChange,
    name,
    id,
    fullWidth,
    className,
    'aria-describedby': ariaDescribedBy,
    ...rest
  } = props;

  const field = useFieldControl({
    id,
    size,
    feedback,
    disabled,
    'aria-describedby': ariaDescribedBy,
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);
  const listId = useId();

  const [selected, setSelected] = useControllableState<string | undefined>(value, defaultValue);
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange);
  const opened = isOpen && !field.disabled;

  const close = useCallback(() => setOpen(false), [setOpen]);
  // 패널은 document.body에 띄우므로(모달 안에서 잘리지 않게) 바깥 클릭 판정에 함께 넣는다
  useOutsideClick([rootRef, panelRef], close, opened);
  const panelPosition = useFloatingPosition(rootRef, panelRef, opened, {
    offsetVar: '--kp-select-panel-offset',
    matchWidth: true,
  });

  // 목록이 최대 높이를 넘어 스크롤되는지 확인한다 (트리거 테두리 강조용)
  useLayoutEffect(() => {
    const list = listRef.current;
    setScrollable(opened && !loading && !!list && list.scrollHeight > list.clientHeight);
  }, [opened, loading, options]);

  const strong = opened && (loading || options.length === 0 || scrollable);

  const selectedOption = options.find((option) => option.value === selected);

  const select = (option: SelectOption) => {
    if (option.disabled) return;
    setSelected(option.value);
    onChange?.(option.value, option);
    setOpen(false);
    triggerRef.current?.focus();
  };

  // Esc로 닫기. 항목을 눌러 포커스가 밖으로 나가도 동작하도록 문서 전체에서 듣는다.
  // 캡처 단계에서 먼저 처리해 모달의 Esc보다 앞선다 (드롭다운만 닫힘)
  useEffect(() => {
    if (!opened) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [opened, setOpen]);

  return (
    <div
      {...rest}
      ref={mergeRefs(ref, rootRef)}
      className={clsx(styles.root, fullWidth && styles.fullWidth, className)}
    >
      <FieldBox
        size={field.size}
        feedback={field.feedback}
        disabled={field.disabled}
        fullWidth={fullWidth}
        active={opened}
        strong={strong}
        onClick={() => !field.disabled && setOpen(!opened)}
      >
        <button
          ref={triggerRef}
          id={field.id}
          type="button"
          role="combobox"
          className={styles.trigger}
          disabled={field.disabled}
          aria-expanded={opened}
          aria-haspopup="listbox"
          aria-controls={opened ? listId : undefined}
          aria-invalid={field.invalid}
          aria-describedby={field.describedBy}
        >
          <span className={clsx(styles.value, !selectedOption && styles.placeholder)}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className={styles.chevron}>
            <Icon name={opened ? 'chevron-up' : 'chevron-down'} size={20} />
          </span>
        </button>
      </FieldBox>

      {name && <input type="hidden" name={name} value={selected ?? ''} />}

      {opened &&
        createPortal(
          <div ref={panelRef} className={styles.panel} style={panelPosition}>
            {loading ? (
              <div className={styles.status} role="status">
                <Spinner />
                <span>{loadingText}</span>
              </div>
            ) : options.length === 0 ? (
              <div className={clsx(styles.status, styles.empty)}>{emptyText}</div>
            ) : (
              <ul ref={listRef} id={listId} role="listbox" className={styles.list}>
                {options.map((option) => {
                  const isSelected = option.value === selected;
                  return (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled || undefined}
                      className={clsx(
                        styles.option,
                        isSelected && styles.optionSelected,
                        option.disabled && styles.optionDisabled,
                      )}
                      // 항목을 눌러도 트리거에서 포커스가 빠지지 않게 한다
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => select(option)}
                    >
                      {option.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
});

SelectBox.displayName = 'SelectBox';
