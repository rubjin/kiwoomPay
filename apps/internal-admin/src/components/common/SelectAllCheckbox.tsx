import { Checkbox } from '@kiwoompay/design-system';

interface SelectAllCheckboxProps {
  /** 선택 대상 줄 (key로 구분) */
  rows: readonly { key: string }[];
  selected: readonly string[];
  onChange: (keys: string[]) => void;
}

/** 목록형 표 머리의 전체 선택 체크박스 — 일부만 고르면 indeterminate. 줄 체크는 toggleKey(utils/selection) */
export function SelectAllCheckbox({ rows, selected, onChange }: SelectAllCheckboxProps) {
  const all = rows.length > 0 && rows.every((r) => selected.includes(r.key));
  return (
    <Checkbox
      aria-label="전체 선택"
      checked={all}
      indeterminate={!all && selected.length > 0}
      onChange={() => onChange(all ? [] : rows.map((r) => r.key))}
    />
  );
}
