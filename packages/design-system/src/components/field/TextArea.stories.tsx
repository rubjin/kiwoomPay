import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { TextArea } from './TextArea';

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--kp-space-16)',
  alignItems: 'flex-start',
};
const cell: CSSProperties = { width: 240 };

const meta = {
  title: 'Components/Input/Field/TextArea',
  component: TextArea,
  args: { placeholder: '내용을 입력해주세요', fullWidth: true },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    feedback: { control: 'inline-radio', options: [undefined, 'positive', 'negative'] },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    showCounter: { control: 'boolean' },
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const narrow: Story['decorators'] = [
  (Story) => (
    <div style={cell}>
      <Story />
    </div>
  ),
];

export const Playground: Story = { decorators: narrow };

/** Default + Counter(우측 하단, 12px Regular) · Small */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <div style={cell}>
        <TextArea fullWidth showCounter maxLength={200} placeholder="내용을 입력해주세요" />
      </div>
      <div style={cell}>
        <TextArea fullWidth size="sm" placeholder="내용을 입력해주세요" />
      </div>
    </div>
  ),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <div style={cell}>
        <TextArea fullWidth placeholder="내용을 입력해주세요" />
      </div>
      <div style={cell}>
        <TextArea fullWidth defaultValue="입력완료" />
      </div>
      <div style={cell}>
        <TextArea fullWidth disabled placeholder="비활성화" />
      </div>
      <div style={cell}>
        <TextArea fullWidth readOnly defaultValue="읽기전용, 편집불가" />
      </div>
    </div>
  ),
};

export const Feedback: Story = {
  decorators: narrow,
  args: { feedback: 'negative', defaultValue: '입력값' },
};
