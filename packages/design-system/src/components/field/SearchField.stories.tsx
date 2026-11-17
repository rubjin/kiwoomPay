import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ControlGroup, Stack } from '../layout';
import { SearchField } from './SearchField';

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
    <ControlGroup spacing="lg">
      <SearchField size="md" />
      <SearchField size="sm" />
    </ControlGroup>
  ),
};

/** Default · Filled(지우기 버튼) · Disabled. Focus / Typing은 직접 입력해 확인한다. */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ControlGroup spacing="lg">
      <SearchField />
      <SearchField defaultValue="입력값" />
      <SearchField disabled />
    </ControlGroup>
  ),
};

function WithButtonExample() {
  const [keyword, setKeyword] = useState('');
  const [searched, setSearched] = useState('');
  return (
    <Stack>
      <SearchField
        searchLabel="조회"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onClear={() => setKeyword('')}
        onSearch={setSearched}
      />
      <SearchField size="sm" searchLabel="조회" />
      <span>조회어: {searched || '(없음)'}</span>
    </Stack>
  );
}

/**
 * 조회 버튼과 함께: `searchLabel`을 주면 [검색 입력][버튼]이 한 묶음(사이 8)으로 그려진다.
 * 버튼은 같은 size · Neutral, 누르면 Enter와 같이 onSearch. 옆에 Button을 따로 두지 않는다
 */
export const WithButton: Story = {
  parameters: { controls: { disable: true } },
  render: () => <WithButtonExample />,
};
