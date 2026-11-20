import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Badge } from '../../components/Badge';
import type { GridPlaceholderColumn } from './GridPlaceholder';
import { TreeTable, filterTreeTable, treeTableGroupIds, type TreeTableNode } from './TreeTable';

const meta = {
  title: 'Composites/Result/Tree Table',
  component: TreeTable,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TreeTable>;
export default meta;
type Story = StoryObj<typeof meta>;

interface Menu extends TreeTableNode {
  name: string;
  use: boolean;
}

const NODES: Menu[] = [
  {
    id: 'M',
    name: '내부관리자',
    use: true,
    children: [
      {
        id: 'M1000',
        name: '시스템관리',
        use: true,
        children: [
          {
            id: 'M1010',
            name: '사용자·권한·보안 관리',
            use: true,
            children: [
              { id: 'M1011', name: '계정관리', use: true },
              { id: 'M1013', name: '메뉴·기능 관리', use: true },
              { id: 'M1014', name: '권한 템플릿 관리', use: false },
            ],
          },
        ],
      },
      {
        id: 'M2000',
        name: '운영관리',
        use: true,
        children: [{ id: 'M2011', name: '가맹점 관리', use: true }],
      },
    ],
  },
];

const COLUMNS: GridPlaceholderColumn<Menu>[] = [
  { key: 'name', header: '메뉴명' },
  { key: 'id', header: '메뉴ID', width: 128 },
  {
    key: 'use',
    header: '상태',
    width: 80,
    render: (m) => (
      <Badge size="sm" tone={m.use ? 'success' : 'neutral'}>
        {m.use ? '사용' : '미사용'}
      </Badge>
    ),
  },
];

function SelectDemo() {
  const [expanded, setExpanded] = useState(['M', 'M1000', 'M1010']);
  const [selected, setSelected] = useState<string | null>('M1013');
  return (
    <TreeTable
      columns={COLUMNS}
      nodes={NODES}
      expandedIds={expanded}
      onExpandedChange={setExpanded}
      selectedId={selected}
      onSelect={(m) => setSelected(m.id)}
    />
  );
}

const FILTERED = filterTreeTable(NODES, (m) => m.name.includes('권한'));

function FilterDemo() {
  const [expanded, setExpanded] = useState(FILTERED.expandedIds);
  return (
    <TreeTable
      columns={COLUMNS}
      nodes={FILTERED.nodes}
      expandedIds={expanded}
      onExpandedChange={setExpanded}
    />
  );
}

/** 펼침 · 접기 + 줄 선택 (선택한 줄 Primary 50 · Primary 글자) */
export const Default: Story = {
  args: { columns: [], nodes: [], expandedIds: [], onExpandedChange: () => {} },
  parameters: { controls: { disable: true } },
  render: () => <SelectDemo />,
};

/** 검색: filterTreeTable로 맞는 줄과 상위 경로만 남기고 그 경로를 펼친다 */
export const Filtered: Story = {
  args: Default.args,
  parameters: { controls: { disable: true } },
  render: () => <FilterDemo />,
};

/** 줄 없음 */
export const Empty: Story = {
  args: Default.args,
  parameters: { controls: { disable: true } },
  render: () => (
    <TreeTable
      columns={COLUMNS}
      nodes={[]}
      expandedIds={treeTableGroupIds(NODES)}
      onExpandedChange={() => {}}
      empty="검색 결과가 없습니다."
    />
  ),
};
