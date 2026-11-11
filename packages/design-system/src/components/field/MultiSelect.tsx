import clsx from 'clsx';
import {
  Fragment,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useControllableState, useFloatingPosition, useOutsideClick } from '../../hooks';
import { mergeRefs } from '../../utils';
import { Icon } from '../Icon';
import { Checkbox } from '../selection/Checkbox';
import { FieldContext, useFieldControl, type FieldFeedback, type FieldSize } from './fieldContext';
import { FieldBox } from './FieldBox';
import styles from './MultiSelect.module.scss';
import { SearchField } from './SearchField';
import type { SelectOption } from './SelectBox';
import { Spinner } from './Spinner';

export interface MultiSelectOption extends SelectOption {
  /** 옵션 검색에 쓸 글자. 없으면 label(문자열일 때) 또는 value로 찾는다 */
  searchText?: string;
}

export interface MultiSelectProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  options: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[], options: MultiSelectOption[]) => void;
  placeholder?: string;
  size?: FieldSize;
  feedback?: FieldFeedback;
  disabled?: boolean;
  /** 패널 위쪽 옵션 검색 (기본 표시) */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** 전체 선택 항목 (기본 표시) */
  selectAll?: boolean;
  allLabel?: string;
  /** 트리거에 보일 선택 요약. 기본: 선택한 이름을 쉼표로 나열(넘치면 말줄임) */
  renderValue?: (selected: MultiSelectOption[]) => ReactNode;
  loading?: boolean;
  loadingText?: string;
  /** 옵션이 하나도 없을 때 */
  emptyText?: string;
  /** 검색 결과가 없을 때 */
  noResultText?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** form 전송용 name. 선택값마다 hidden input이 하나씩 제출된다 */
  name?: string;
  id?: string;
  fullWidth?: boolean;
}

const textOf = (option: MultiSelectOption) =>
  option.searchText ?? (typeof option.label === 'string' ? option.label : option.value);

/**
 * 목록에서 여러 개를 고르는 드롭다운. 옵션 검색 · 전체 선택을 포함한다.
 * 선택은 바로 반영되고(확인 버튼 없음) 패널은 열린 채로 유지된다.
 */
export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>((props, ref) => {
  const {
    options,
    value,
    defaultValue = [],
    onChange,
    placeholder = '선택해주세요',
    size,
    feedback,
    disabled,
    searchable = true,
    searchPlaceholder = '옵션 검색',
    selectAll = true,
    allLabel = '전체',
    renderValue,
    loading,
    loadingText = '불러오는 중',
    emptyText = '선택 가능한 항목이 없습니다.',
    noResultText = '검색 결과가 없습니다.',
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
  const [query, setQuery] = useState('');
  const listId = useId();

  const [selected = [], setSelected] = useControllableState<string[] | undefined>(
    value,
    defaultValue,
  );
  const [isOpen, setOpenState] = useControllableState(open, defaultOpen, onOpenChange);
  const opened = isOpen && !field.disabled;

  const setOpen = useCallback(
    (next: boolean) => {
      setOpenState(next);
      if (!next) setQuery('');
    },
    [setOpenState],
  );
  const close = useCallback(() => setOpen(false), [setOpen]);
  useOutsideClick([rootRef, panelRef], close, opened);
  const panelPosition = useFloatingPosition(rootRef, panelRef, opened, {
    offsetVar: '--kp-select-panel-offset',
    matchWidth: true,
  });

  const visible = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return keyword
      ? options.filter((option) => textOf(option).toLowerCase().includes(keyword))
      : options;
  }, [options, query]);

  useLayoutEffect(() => {
    const list = listRef.current;
    setScrollable(opened && !loading && !!list && list.scrollHeight > list.clientHeight);
  }, [opened, loading, visible]);

  const strong = opened && (loading || options.length === 0 || scrollable);

  const selectedSet = new Set(selected);
  // 선택 순서와 상관없이 옵션 순서대로 돌려준다
  const commit = (next: Set<string>) => {
    const nextOptions = options.filter((option) => next.has(option.value));
    const nextValue = nextOptions.map((option) => option.value);
    setSelected(nextValue);
    onChange?.(nextValue, nextOptions);
  };

  const toggle = (option: MultiSelectOption) => {
    if (option.disabled) return;
    const next = new Set(selectedSet);
    if (next.has(option.value)) next.delete(option.value);
    else next.add(option.value);
    commit(next);
  };

  // 전체 선택은 지금 보이는(검색된) 항목 중 선택 가능한 것만 대상으로 한다
  const targets = visible.filter((option) => !option.disabled);
  const checkedCount = targets.filter((option) => selectedSet.has(option.value)).length;
  const allChecked = targets.length > 0 && checkedCount === targets.length;
  const toggleAll = () => {
    const next = new Set(selectedSet);
    targets.forEach((option) => (allChecked ? next.delete(option.value) : next.add(option.value)));
    commit(next);
  };

  const selectedOptions = options.filter((option) => selectedSet.has(option.value));
  const summary = (() => {
    if (selectedOptions.length === 0) return null;
    if (renderValue) return renderValue(selectedOptions);
    return selectedOptions.map((option, index) => (
      <Fragment key={option.value}>
        {index > 0 && ', '}
        {option.label}
      </Fragment>
    ));
  })();

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

  const renderBody = () => {
    if (loading) {
      return (
        <div className={styles.status} role="status">
          <Spinner />
          <span>{loadingText}</span>
        </div>
      );
    }
    if (options.length === 0) {
      return <div className={clsx(styles.status, styles.empty)}>{emptyText}</div>;
    }
    if (visible.length === 0) {
      return <div className={clsx(styles.status, styles.empty)}>{noResultText}</div>;
    }
    return (
      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        aria-multiselectable="true"
        className={styles.list}
      >
        {selectAll && (
          <li className={styles.option}>
            <Checkbox
              size="sm"
              className={styles.check}
              label={allLabel}
              checked={allChecked}
              indeterminate={checkedCount > 0 && !allChecked}
              disabled={targets.length === 0}
              onChange={toggleAll}
            />
          </li>
        )}
        {visible.map((option) => {
          const isSelected = selectedSet.has(option.value);
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
            >
              <Checkbox
                size="sm"
                className={styles.check}
                label={option.label}
                checked={isSelected}
                disabled={option.disabled}
                onChange={() => toggle(option)}
              />
            </li>
          );
        })}
      </ul>
    );
  };

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
          <span className={clsx(styles.value, !summary && styles.placeholder)}>
            {summary ?? placeholder}
          </span>
          <span className={styles.chevron}>
            <Icon name={opened ? 'chevron-up' : 'chevron-down'} size={20} />
          </span>
        </button>
      </FieldBox>

      {name && selected.map((item) => <input key={item} type="hidden" name={name} value={item} />)}

      {opened &&
        createPortal(
          // 패널 안 검색 필드는 바깥 Field(라벨 id · 피드백)와 연결하지 않는다
          <FieldContext.Provider value={null}>
            <div ref={panelRef} className={styles.panel} style={panelPosition}>
              {searchable && (
                <SearchField
                  size="sm"
                  fullWidth
                  className={styles.search}
                  placeholder={searchPlaceholder}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onClear={() => setQuery('')}
                  aria-label={searchPlaceholder}
                />
              )}
              {renderBody()}
            </div>
          </FieldContext.Provider>,
          document.body,
        )}
    </div>
  );
});

MultiSelect.displayName = 'MultiSelect';
