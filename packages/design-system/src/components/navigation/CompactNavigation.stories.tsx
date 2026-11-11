import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { CompactNavigation } from './CompactNavigation';

const row: CSSProperties = { display: 'flex', gap: 'var(--kp-space-24)', alignItems: 'center' };

const meta = {
  title: 'Components/Compact Navigation',
  component: CompactNavigation,
  args: { total: 3, defaultPage: 1 },
  argTypes: {
    total: { control: { type: 'number', min: 1 } },
    defaultPage: { control: { type: 'number', min: 1 } },
    loop: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof CompactNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** 처음(이전 비활성) · 중간 · 마지막(다음 비활성) */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <CompactNavigation total={3} page={1} />
      <CompactNavigation total={3} page={2} />
      <CompactNavigation total={3} page={3} />
    </div>
  ),
};

/** 카드 머리글 오른쪽에 두는 예시 (controlled) */
export const InCard: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const notices = ['정산 일정이 변경되었습니다.', '시스템 점검 안내', '수수료 정책 변경 안내'];
    const [page, setPage] = useState(1);
    return (
      <div
        style={{
          width: 360,
          padding: 'var(--kp-space-16)',
          background: 'var(--kp-color-bg-surface)',
          border: '1px solid var(--kp-color-line-default)',
          borderRadius: 8,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>공지사항</strong>
          <CompactNavigation total={notices.length} page={page} onChange={setPage} />
        </div>
        <p style={{ marginTop: 'var(--kp-space-12)' }}>{notices[page - 1]}</p>
      </div>
    );
  },
};
