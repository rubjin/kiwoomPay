import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SearchField } from '../components/field/SearchField';
import msStyles from '../components/field/MultiSelect.module.scss';
import { FieldContext } from '../components/field/fieldContext';
import { Checkbox } from '../components/selection';
import { useFloatingPosition, useOutsideClick } from '../hooks';
import styles from './IbsheetFilterPanel.module.scss';

export interface IbsheetFilterPanelProps {
  /** 머리 칸의 깔때기 아이콘 (패널 기준 위치) */
  anchor: HTMLElement;
  /** 이 열의 값 (조회된 행에서 모은 것) */
  options: string[];
  /** 고른 값. undefined면 전체(필터 없음) */
  value: string[] | undefined;
  onChange: (value: string[] | undefined) => void;
  onClose: () => void;
}

/**
 * IbsheetGrid 머리 필터 — 열 값 고르기 (MultiSelect 패널과 같은 모양: 옵션 검색 · 전체 · 체크 목록).
 * 고르면 바로 표에 반영한다. 모두 고르면 필터 없음.
 */
export function IbsheetFilterPanel({
  anchor,
  options,
  value,
  onChange,
  onClose,
}: IbsheetFilterPanelProps) {
  const anchorRef = useRef<HTMLElement | null>(anchor);
  anchorRef.current = anchor;
  const panelRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const position = useFloatingPosition(anchorRef, panelRef, true, {
    offsetVar: '--kp-select-panel-offset',
  });
  useOutsideClick([anchorRef, panelRef], onClose, true);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onClose();
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [onClose]);

  const selected = new Set(value ?? options);
  const visible = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return keyword ? options.filter((o) => o.toLowerCase().includes(keyword)) : options;
  }, [options, query]);
  const checkedCount = visible.filter((o) => selected.has(o)).length;
  const allChecked = visible.length > 0 && checkedCount === visible.length;

  const commit = (next: Set<string>) => {
    const list = options.filter((o) => next.has(o));
    onChange(list.length === options.length ? undefined : list);
  };
  const toggle = (option: string) => {
    const next = new Set(selected);
    if (next.has(option)) next.delete(option);
    else next.add(option);
    commit(next);
  };
  const toggleAll = () => {
    const next = new Set(selected);
    visible.forEach((o) => (allChecked ? next.delete(o) : next.add(o)));
    commit(next);
  };

  return createPortal(
    <FieldContext.Provider value={null}>
      <div ref={panelRef} className={clsx(msStyles.panel, styles.panel)} style={position}>
        <SearchField
          size="sm"
          fullWidth
          className={msStyles.search}
          placeholder="옵션 검색"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery('')}
          aria-label="옵션 검색"
        />
        {visible.length === 0 ? (
          <div className={clsx(msStyles.status, msStyles.empty)}>검색 결과가 없습니다.</div>
        ) : (
          <ul role="listbox" aria-multiselectable="true" className={msStyles.list}>
            <li className={msStyles.option}>
              <Checkbox
                size="sm"
                className={msStyles.check}
                label="전체"
                checked={allChecked}
                indeterminate={checkedCount > 0 && !allChecked}
                onChange={toggleAll}
              />
            </li>
            {visible.map((option) => (
              <li
                key={option}
                role="option"
                aria-selected={selected.has(option)}
                className={clsx(msStyles.option, selected.has(option) && msStyles.optionSelected)}
              >
                <Checkbox
                  size="sm"
                  className={msStyles.check}
                  label={option || '(빈 값)'}
                  checked={selected.has(option)}
                  onChange={() => toggle(option)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </FieldContext.Provider>,
    document.body,
  );
}
