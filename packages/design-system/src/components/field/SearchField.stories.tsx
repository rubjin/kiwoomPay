import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { Button } from '../Button';
import { SearchField } from './SearchField';

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--kp-space-16)',
  alignItems: 'flex-start',
};

const meta = {
  title: 'Components/Field/SearchField',
  component: SearchField,
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <SearchField size="md" />
      <SearchField size="sm" />
    </div>
  ),
};

/** Default · Filled(지우기 버튼) · Disabled. Focus / Typing은 직접 입력해 확인한다. */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <SearchField />
      <SearchField defaultValue="입력값" />
      <SearchField disabled />
    </div>
  ),
};

function WithButtonExample() {
  const [keyword, setKeyword] = useState('');
  const [searched, setSearched] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kp-space-16)' }}>
      <div style={{ display: 'flex', gap: 'var(--kp-space-8)' }}>
        <SearchField
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onClear={() => setKeyword('')}
          onSearch={setSearched}
        />
        <Button variant="neutral" onClick={() => setSearched(keyword)}>
          조회
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 'var(--kp-space-8)' }}>
        <SearchField size="sm" />
        <Button variant="neutral" size="sm">
          조회
        </Button>
      </div>
      <span>조회어: {searched || '(없음)'}</span>
    </div>
  );
}

/** 조회 버튼과 함께: 필드와 버튼은 같은 size를 쓰고 간격은 8px이다. */
export const WithButton: Story = {
  parameters: { controls: { disable: true } },
  render: () => <WithButtonExample />,
};
