import { forwardRef } from 'react';
import { Checkbox, type CheckboxProps } from './Checkbox';

export interface SelectAllCheckboxProps extends Omit<
  CheckboxProps,
  'checked' | 'defaultChecked' | 'indeterminate' | 'onChange'
> {
  /** 선택 대상 줄 (key로 구분) */
  rows: readonly { key: string }[];
  /** 고른 줄 key 목록 (선택 상태는 화면이 가진다) */
  selected: readonly string[];
  onChange: (keys: string[]) => void;
}

/**
 * 목록형 표 머리의 전체 선택 체크박스 — 모두 고르면 체크, 일부만 고르면 indeterminate(–).
 * 누르면 모두 선택 ↔ 모두 해제. 줄 체크박스는 `toggleKey`로 key를 넣고 뺀다.
 */
export const SelectAllCheckbox = forwardRef<HTMLInputElement, SelectAllCheckboxProps>(
  ({ rows, selected, onChange, 'aria-label': ariaLabel = '전체 선택', ...rest }, ref) => {
    const all = rows.length > 0 && rows.every((r) => selected.includes(r.key));
    return (
      <Checkbox
        {...rest}
        ref={ref}
        aria-label={ariaLabel}
        checked={all}
        indeterminate={!all && selected.length > 0}
        onChange={() => onChange(all ? [] : rows.map((r) => r.key))}
      />
    );
  },
);
SelectAllCheckbox.displayName = 'SelectAllCheckbox';

/** 고른 key 목록에서 key를 넣거나 뺀다 (줄 체크박스) */
export const toggleKey = (list: readonly string[], key: string) =>
  list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
