import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox } from './Checkbox';
import { SelectAllCheckbox, toggleKey } from './SelectAllCheckbox';

const ROWS = [
  { key: 'c1', name: '홍길동 · 계약' },
  { key: 'c2', name: '김키움 · 정산' },
  { key: 'c3', name: '이페이 · 개발' },
];

const meta = {
  title: 'Components/Selection/Select All Checkbox',
  component: SelectAllCheckbox,
  args: { rows: ROWS, selected: ['c1'], onChange: () => undefined },
} satisfies Meta<typeof SelectAllCheckbox>;
export default meta;
type Story = StoryObj<typeof meta>;

/** 머리 전체 선택 + 줄 체크 (목록형 표 — 담당자 정보 등). 선택 상태는 화면이 가진다 */
export const ListTable: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [selected, setSelected] = useState<string[]>(['c1']);
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <SelectAllCheckbox
          rows={ROWS}
          selected={selected}
          onChange={setSelected}
          label="전체 선택"
        />
        {ROWS.map((r) => (
          <Checkbox
            key={r.key}
            label={r.name}
            checked={selected.includes(r.key)}
            onChange={() => setSelected((s) => toggleKey(s, r.key))}
          />
        ))}
      </div>
    );
  },
};

/** 상태: 없음 · 일부(–) · 모두 */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <SelectAllCheckbox rows={ROWS} selected={[]} onChange={() => undefined} label="없음" />
      <SelectAllCheckbox rows={ROWS} selected={['c1']} onChange={() => undefined} label="일부" />
      <SelectAllCheckbox
        rows={ROWS}
        selected={['c1', 'c2', 'c3']}
        onChange={() => undefined}
        label="모두"
      />
    </div>
  ),
};
