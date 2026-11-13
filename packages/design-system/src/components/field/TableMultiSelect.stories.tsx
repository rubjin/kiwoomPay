import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Case, caseRow } from '../../stories/Case';
import { TableMultiSelect, type TableMultiSelectColumn } from './TableMultiSelect';

interface Cpid {
  cpid: string;
  serviceName: string;
  cycle: string;
  finalCpid: string;
}

const SERVICES = ['신용카드', '계좌이체', '가상계좌'];
const CYCLES = ['D+1', 'D+1', 'D+2', 'D+1', '주정산', '월 1회'];
const cpids: Cpid[] = Array.from({ length: 12 }, (_, i) => ({
  cpid: `CPID2${String(i + 1).padStart(5, '0')}`,
  serviceName: SERVICES[i % 3] as string,
  cycle: CYCLES[i % 6] as string,
  finalCpid: `CPID2${String(Math.floor(i / 3) * 3 + 1).padStart(5, '0')}`,
}));

const columns: TableMultiSelectColumn<Cpid>[] = [
  { key: 'cpid', header: 'CPID', width: 103 },
  { key: 'serviceName', header: '서비스명' },
  { key: 'cycle', header: '정산주기' },
  { key: 'finalCpid', header: '최종정산 CPID' },
];

const meta = {
  title: 'Components/Field/TableMultiSelect',
  parameters: {
    layout: 'padded',
    tempWork: '열 구성 · 예시 CPID (Figma 사업자 찾기 팝업 PNG 측정)',
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Example({ open }: { open?: boolean }) {
  const [value, setValue] = useState(['CPID200002', 'CPID200003', 'CPID200005']);
  return (
    <TableMultiSelect
      fullWidth
      title="CPID 선택"
      searchPlaceholder="CPID / 서비스명 / 정산주기 / 최종정산CPID 검색"
      panelWidth={591}
      rows={cpids}
      rowKey={(c) => c.cpid}
      columns={columns}
      value={value}
      onChange={setValue}
      defaultOpen={open}
    />
  );
}

/** 표로 보며 여러 개 고르기: 제목 · Total(N건 · M행 표시) · 검색 · 전체(검색결과) · 표(6행 넘으면 스크롤) · 선택 N개 */
export const Open: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ ...caseRow, minHeight: 520, justifyContent: 'flex-end' }}>
      <Case label="일부 선택" description="N개 선택, 패널은 트리거 오른쪽 끝에 맞춤" width={405}>
        <Example open />
      </Case>
    </div>
  ),
};

/** 트리거 요약: 전체면 "전체 N개", 일부면 "N개 선택", 비활성은 placeholder로 "전체 N개" */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={caseRow}>
      <Case label="일부 선택" width={300}>
        <Example />
      </Case>
      <Case label="전체 선택" width={300}>
        <TableMultiSelect
          fullWidth
          rows={cpids}
          rowKey={(c) => c.cpid}
          columns={columns}
          defaultValue={cpids.map((c) => c.cpid)}
        />
      </Case>
      <Case label="비활성" description="고르지 않은 사업자 줄" width={300}>
        <TableMultiSelect
          fullWidth
          disabled
          rows={[] as Cpid[]}
          rowKey={(c) => c.cpid}
          columns={columns}
          placeholder="전체 10,000개"
        />
      </Case>
    </div>
  ),
};
