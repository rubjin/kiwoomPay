import { Checkbox, FormTable, SelectBox, TextField } from '@kiwoompay/design-system';
import type { MerchantContact } from '@/types/operation/merchantBasic';
import { useCodeOptions } from '@/hooks/useCodeOptions';

interface Props {
  rows: MerchantContact[];
  onChange: (rows: MerchantContact[]) => void;
  selected: string[];
  onSelectedChange: (keys: string[]) => void;
}

const COLUMNS = '36px repeat(5, minmax(0, 1fr))'; // Figma 체크 36 + 5칸 같은 폭
const FIELDS: [keyof MerchantContact, string][] = [
  ['name', '담당자명'],
  ['mobile', '휴대폰번호'],
  ['extension', '내선번호'],
  ['email', '이메일'],
];

/** 담당자 정보 표 (Figma: 머리 44 + 행 52, 업무구분 Select + 입력 4칸) */
export function ContactTable({ rows, onChange, selected, onSelectedChange }: Props) {
  const contactRoles = useCodeOptions('CONTACT_ROLE');
  const all = rows.length > 0 && rows.every((r) => selected.includes(r.key));
  const set = (key: string, patch: Partial<MerchantContact>) =>
    onChange(rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  return (
    <FormTable template={COLUMNS} aria-label="담당자 정보">
      <FormTable.Row>
        <FormTable.Head>
          <Checkbox
            aria-label="전체 선택"
            checked={all}
            indeterminate={!all && selected.length > 0}
            onChange={() => onSelectedChange(all ? [] : rows.map((r) => r.key))}
          />
        </FormTable.Head>
        <FormTable.Head>업무구분</FormTable.Head>
        {FIELDS.map(([, label]) => (
          <FormTable.Head key={label}>{label}</FormTable.Head>
        ))}
      </FormTable.Row>
      {rows.map((row) => (
        <FormTable.Row key={row.key}>
          <FormTable.Cell center>
            <Checkbox
              aria-label="선택"
              checked={selected.includes(row.key)}
              onChange={() =>
                onSelectedChange(
                  selected.includes(row.key)
                    ? selected.filter((k) => k !== row.key)
                    : [...selected, row.key],
                )
              }
            />
          </FormTable.Cell>
          <FormTable.Cell>
            <SelectBox
              aria-label="업무구분"
              fullWidth
              placeholder="선택"
              options={contactRoles}
              value={row.role}
              onChange={(role) => set(row.key, { role })}
            />
          </FormTable.Cell>
          {FIELDS.map(([field, label]) => (
            <FormTable.Cell key={field}>
              <TextField
                aria-label={label}
                fullWidth
                value={row[field]}
                onChange={(e) => set(row.key, { [field]: e.target.value })}
              />
            </FormTable.Cell>
          ))}
        </FormTable.Row>
      ))}
    </FormTable>
  );
}
