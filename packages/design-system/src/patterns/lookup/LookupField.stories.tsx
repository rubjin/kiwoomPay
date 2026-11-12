import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Field } from '../../components/field';
import { LookupField } from './LookupField';

const meta = {
  title: 'Composites/Search/Lookup Field',
  component: LookupField,
  args: {
    placeholder: '사업자번호를 입력해주세요',
    findLabel: '찾기',
    size: 'md',
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof LookupField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** 크기 sm · md · lg — [찾기] 버튼이 같은 높이로 따라간다 */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <LookupField key={size} size={size} placeholder={`CPID (${size})`} />
      ))}
      <LookupField disabled placeholder="비활성" />
    </div>
  ),
};

/** Field 라벨과 함께 · 팝업에서 고른 값 채우기 (취소하면 값 유지) */
export const WithField: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [value, setValue] = useState('');
    return (
      <Field label="사업자번호">
        <LookupField
          placeholder="사업자번호를 입력해주세요"
          inputWidth={210}
          value={value}
          onChange={setValue}
          onFind={() => setValue('123-45-67890')}
        />
      </Field>
    );
  },
};
