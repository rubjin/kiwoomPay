import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { Pagination } from './Pagination';

const col: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--kp-space-24)',
  alignItems: 'flex-start',
};

const meta = {
  title: 'Components/Navigation/Pagination',
  component: Pagination,
  args: { totalPages: 10, defaultPage: 1 },
  argTypes: {
    totalPages: { control: { type: 'number', min: 0 } },
    siblingCount: { control: { type: 'number', min: 0 } },
    boundaryCount: { control: { type: 'number', min: 0 } },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function ControlledExample() {
  const [page, setPage] = useState(1);
  return (
    <div style={col}>
      <Pagination totalPages={10} page={page} onChange={setPage} />
      <span>현재 페이지: {page}</span>
    </div>
  );
}

/** 이전 → 번호 → 생략(…) → 다음. 현재 페이지 1개만 Active로 표시한다. */
export const Structure: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ControlledExample />,
};

/** 현재 위치에 따라 생략(…) 위치가 바뀐다. 칸 수는 일정하게 유지된다. */
export const Ellipsis: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={col}>
      <Pagination totalPages={10} defaultPage={1} />
      <Pagination totalPages={10} defaultPage={5} />
      <Pagination totalPages={10} defaultPage={10} />
      <Pagination totalPages={120} defaultPage={58} />
    </div>
  ),
};

/** 페이지가 적으면 생략 없이 모두 보여준다. */
export const FewPages: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={col}>
      <Pagination totalPages={1} />
      <Pagination totalPages={5} defaultPage={3} />
      <Pagination totalPages={7} defaultPage={4} />
    </div>
  ),
};

/** 첫·마지막 페이지에서는 이동할 수 없는 방향이 Disabled. 조회 중에는 전체를 disabled로 막는다. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={col}>
      <Pagination totalPages={10} defaultPage={1} />
      <Pagination totalPages={10} defaultPage={10} />
      <Pagination totalPages={10} defaultPage={3} disabled />
    </div>
  ),
};
