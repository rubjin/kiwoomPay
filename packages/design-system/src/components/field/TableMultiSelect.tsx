import clsx from 'clsx';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useControllableState, useFloatingPosition, useOutsideClick } from '../../hooks';
import { Icon } from '../Icon';
import { Checkbox } from '../selection/Checkbox';
import { FieldContext, useFieldControl, type FieldFeedback, type FieldSize } from './fieldContext';
import { FieldBox } from './FieldBox';
import { SearchField } from './SearchField';
import styles from './TableMultiSelect.module.scss';

export interface TableMultiSelectColumn<T> {
  key: string;
  header: ReactNode;
  /** 열 폭(px). 없으면 남는 폭을 나눈다 */
  width?: number;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => ReactNode;
}

export interface TableMultiSelectProps<T> {
  /** 고를 줄 */
  rows: T[];
  rowKey: (row: T) => string;
  columns: TableMultiSelectColumn<T>[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (keys: string[], rows: T[]) => void;
  /** 패널 제목 (예: CPID 선택) */
  title?: ReactNode;
  searchPlaceholder?: string;
  /** 검색에 쓸 글자. 기본: 각 열 값을 이어 붙임 */
  searchText?: (row: T) => string;
  /** 전체 선택 이름 — 지금 보이는(검색된) 줄만 대상 */
  allLabel?: ReactNode;
  /** 한 번에 보이는 줄 수 (넘으면 표 안에서 스크롤) */
  visibleRows?: number;
  /** 트리거 요약. 기본: 전체 선택이면 "전체 N개", 아니면 "N개 선택", 없으면 placeholder */
  renderValue?: (selected: T[], total: number) => ReactNode;
  placeholder?: ReactNode;
  emptyText?: ReactNode;
  noResultText?: ReactNode;
  size?: FieldSize;
  feedback?: FieldFeedback;
  disabled?: boolean;
  fullWidth?: boolean;
  /** 패널 폭 (트리거보다 넓으면 트리거 오른쪽 끝에 맞춘다) */
  panelWidth?: CSSProperties['width'];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

const defaultSummary = (count: number, total: number) =>
  count === 0
    ? null
    : count === total
      ? `전체 ${total.toLocaleString('ko-KR')}개`
      : `${count}개 선택`;

/**
 * 표로 보며 여러 개를 고르는 드롭다운 (Figma 사업자 찾기 팝업 · CPID 선택).
 * 패널: 제목 + Total(N건 · M행 표시) → 검색 → 전체(검색결과) → 표(체크 열 + 열들, M행 넘으면 스크롤) → 스크롤 안내 · 선택 N개.
 * 선택은 바로 반영되고(확인 버튼 없음) 패널은 열린 채로 유지된다. 동작은 MultiSelect와 같다
 */
export function TableMultiSelect<T>({
  rows,
  rowKey,
  columns,
  value,
  defaultValue,
  onChange,
  title,
  searchPlaceholder = '검색',
  searchText,
  allLabel = '전체(검색결과)',
  visibleRows = 6,
  renderValue,
  placeholder = '선택해주세요',
  emptyText = '선택 가능한 항목이 없습니다.',
  noResultText = '검색 결과가 없습니다.',
  size,
  feedback,
  disabled,
  fullWidth,
  panelWidth,
  open,
  defaultOpen = false,
  onOpenChange,
  id,
  className,
  style,
  'aria-label': ariaLabel,
}: TableMultiSelectProps<T>) {
  const field = useFieldControl({ id, size, feedback, disabled });
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [scrollable, setScrollable] = useState(false);

  const [selected = [], setSelected] = useControllableState<string[] | undefined>(
    value,
    defaultValue ?? [],
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
    align: 'end',
  });

  const textOf = useCallback(
    (row: T) =>
      searchText
        ? searchText(row)
        : columns.map((c) => String((row as Record<string, unknown>)[c.key] ?? '')).join(' '),
    [columns, searchText],
  );
  const visible = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return keyword ? rows.filter((row) => textOf(row).toLowerCase().includes(keyword)) : rows;
  }, [rows, query, textOf]);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    setScrollable(opened && !!body && body.scrollHeight > body.clientHeight);
  }, [opened, visible]);

  const selectedSet = new Set(selected);
  // 선택 순서와 상관없이 줄 순서대로 돌려준다
  const commit = (next: Set<string>) => {
    const nextRows = rows.filter((row) => next.has(rowKey(row)));
    const nextKeys = nextRows.map(rowKey);
    setSelected(nextKeys);
    onChange?.(nextKeys, nextRows);
  };
  const toggle = (key: string) => {
    const next = new Set(selectedSet);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    commit(next);
  };
  const visibleKeys = visible.map(rowKey);
  const checkedCount = visibleKeys.filter((key) => selectedSet.has(key)).length;
  const allChecked = visibleKeys.length > 0 && checkedCount === visibleKeys.length;
  const toggleAll = () => {
    const next = new Set(selectedSet);
    visibleKeys.forEach((key) => (allChecked ? next.delete(key) : next.add(key)));
    commit(next);
  };

  const selectedRows = rows.filter((row) => selectedSet.has(rowKey(row)));
  const summary = renderValue
    ? selectedRows.length > 0
      ? renderValue(selectedRows, rows.length)
      : null
    : defaultSummary(selectedRows.length, rows.length);
  const shownRows = Math.min(visible.length, visibleRows);
  const rest = visible.length - shownRows;

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
      ref={rootRef}
      className={clsx(styles.root, fullWidth && styles.fullWidth, className)}
      style={style}
    >
      <FieldBox
        size={field.size}
        feedback={field.feedback}
        disabled={field.disabled}
        fullWidth={fullWidth}
        active={opened}
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
          aria-haspopup="dialog"
          aria-label={ariaLabel}
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

      {opened &&
        createPortal(
          <FieldContext.Provider value={null}>
            <div
              ref={panelRef}
              role="dialog"
              aria-label={typeof title === 'string' ? title : ariaLabel}
              className={styles.panel}
              style={{
                ...panelPosition,
                width: panelWidth,
                ['--tms-visible-rows' as string]: visibleRows,
              }}
            >
              <div className={styles.head}>
                <span className={styles.title}>{title}</span>
                <span className={styles.total}>
                  Total:{' '}
                  <strong className={styles.totalValue}>
                    {visible.length.toLocaleString('ko-KR')}건 · {shownRows}행 표시
                  </strong>
                </span>
              </div>
              <SearchField
                size="sm"
                fullWidth
                placeholder={searchPlaceholder}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onClear={() => setQuery('')}
                aria-label={searchPlaceholder}
              />
              {rows.length === 0 || visible.length === 0 ? (
                <div className={styles.status}>{rows.length === 0 ? emptyText : noResultText}</div>
              ) : (
                <>
                  <Checkbox
                    size="sm"
                    className={styles.all}
                    label={allLabel}
                    checked={allChecked}
                    indeterminate={checkedCount > 0 && !allChecked}
                    onChange={toggleAll}
                  />
                  <div ref={bodyRef} className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th className={clsx(styles.head1, styles.check)} aria-label="선택" />
                          {columns.map((c) => (
                            <th key={c.key} className={styles.head1} style={{ width: c.width }}>
                              {c.header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {visible.map((row) => {
                          const key = rowKey(row);
                          return (
                            <tr key={key}>
                              <td className={clsx(styles.cell, styles.check)}>
                                <Checkbox
                                  size="sm"
                                  aria-label="선택"
                                  checked={selectedSet.has(key)}
                                  onChange={() => toggle(key)}
                                />
                              </td>
                              {columns.map((c) => (
                                <td
                                  key={c.key}
                                  className={styles.cell}
                                  style={{ textAlign: c.align ?? 'center' }}
                                >
                                  {c.render
                                    ? c.render(row)
                                    : String((row as Record<string, unknown>)[c.key] ?? '')}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              <div className={styles.foot}>
                <span>{scrollable && rest > 0 && <>↓ 스크롤하여 나머지 {rest}건 보기</>}</span>
                <span>선택 {selectedRows.length}개</span>
              </div>
            </div>
          </FieldContext.Provider>,
          document.body,
        )}
    </div>
  );
}
