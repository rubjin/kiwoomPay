import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { Icon } from '../Icon';
import { TextField } from './TextField';

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--kp-space-16)',
  alignItems: 'flex-start',
};

const meta = {
  title: 'Components/Field/TextField',
  component: TextField,
  args: { placeholder: '입력해주세요' },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    feedback: { control: 'inline-radio', options: [undefined, 'positive', 'negative'] },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    clearable: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Default 40 · Small 32. 폭은 고정 variant 없이 내용(또는 부모) 기준이다. */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <TextField size="md" placeholder="Default 40" />
      <TextField size="sm" placeholder="Small 32" />
    </div>
  ),
};

/** Default · Filled · Disabled · Readonly. Focus는 입력창을 클릭해 확인한다. */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <TextField placeholder="입력해주세요" />
      <TextField defaultValue="입력완료" />
      <TextField disabled placeholder="비활성화" />
      <TextField readOnly defaultValue="읽기전용, 편집불가" />
    </div>
  ),
};

/** Positive · Negative: 테두리 2px. 안내 문구는 Field의 helperText로 함께 쓴다. */
export const Feedback: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <TextField feedback="positive" defaultValue="입력값" />
      <TextField feedback="negative" defaultValue="입력값" />
    </div>
  ),
};

/** Leading Icon · Trailing(지우기) · Suffix */
export const Content: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <TextField
        leadingIcon={<Icon name="search" size={20} />}
        placeholder="검색어를 입력해주세요"
      />
      <TextField clearable defaultValue="검색어" />
      <TextField suffix="원" defaultValue="1,234,000" />
    </div>
  ),
};

export const FullWidth: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 360 }}>
      <TextField fullWidth placeholder="부모 폭을 채웁니다" />
    </div>
  ),
};
