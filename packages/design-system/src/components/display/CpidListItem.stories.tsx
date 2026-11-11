import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Badge } from '../Badge';
import { CpidListItem } from './CpidListItem';

const active = (
  <Badge tone="success" size="sm" dot>
    사용중
  </Badge>
);
const stopped = (
  <Badge tone="error" size="sm" dot>
    중지
  </Badge>
);

const list = { display: 'grid', gap: 'var(--kp-space-8)', width: 288 };

const meta = {
  title: 'Components/CPID List Item',
  component: CpidListItem,
  args: { cpid: 'CPID', merchantName: '가맹점명', selected: false },
  argTypes: { selected: { control: 'boolean' }, disabled: { control: 'boolean' } },
  render: (args) => (
    <div style={{ width: 288 }}>
      <CpidListItem {...args} status={active} />
    </div>
  ),
} satisfies Meta<typeof CpidListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Default · Selected × 사용중 · 중지 */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={list}>
      <CpidListItem cpid="CPID" merchantName="가맹점명" status={active} />
      <CpidListItem cpid="CPID" merchantName="가맹점명" status={active} selected />
      <CpidListItem cpid="CPID" merchantName="가맹점명" status={stopped} />
      <CpidListItem cpid="CPID" merchantName="가맹점명" status={stopped} selected />
    </div>
  ),
};

/** 하나를 골라 선택 상태로 표시하는 목록 (화면이 선택값을 관리) */
export const SelectableList: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const items = [
      { cpid: 'CP0012345', name: '키움페이 강남점', on: true },
      { cpid: 'CP0012346', name: '키움페이 여의도점', on: true },
      {
        cpid: 'CP0012347',
        name: '아주 긴 가맹점명이 들어가는 경우에는 한 줄로 표시하고 넘치는 부분은 말줄임합니다',
        on: false,
      },
    ];
    const [selected, setSelected] = useState(items[0]!.cpid);
    return (
      <div style={list}>
        {items.map((item) => (
          <CpidListItem
            key={item.cpid}
            cpid={item.cpid}
            merchantName={item.name}
            status={item.on ? active : stopped}
            selected={selected === item.cpid}
            onClick={() => setSelected(item.cpid)}
          />
        ))}
      </div>
    );
  },
};
