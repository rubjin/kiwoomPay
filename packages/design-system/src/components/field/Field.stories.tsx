import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { DateField } from './DateField';
import { DateRangeField } from './DateRangeField';
import { Field } from './Field';
import { SelectBox } from './SelectBox';
import { TextArea } from './TextArea';
import { TextField } from './TextField';

const col: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 'var(--kp-space-24)' };

const industries = [
  { value: 'food', label: '음식점' },
  { value: 'retail', label: '도소매' },
];

const meta = {
  title: 'Components/Field/Field',
  component: Field,
  args: { label: 'Label Text', required: true, helperText: 'Helper Text', children: null },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    feedback: { control: 'inline-radio', options: [undefined, 'positive', 'negative'] },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Field {...args}>
      <TextField placeholder="입력해주세요" />
    </Field>
  ),
};

/** 라벨은 필드 왼쪽, 안내 문구는 필드 아래(왼쪽 정렬)에 놓인다. labelWidth로 라벨 폭을 맞춘다. */
export const WithControls: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={col}>
      <Field
        label="가맹점명"
        required
        labelWidth={96}
        helperText="사업자등록증의 상호를 입력합니다."
      >
        <TextField placeholder="입력해주세요" />
      </Field>
      <Field label="업종" labelWidth={96}>
        <SelectBox options={industries} />
      </Field>
      <Field label="계약일" labelWidth={96}>
        <DateField />
      </Field>
      <Field label="조회기간" labelWidth={96}>
        <DateRangeField />
      </Field>
      <Field label="사유" labelWidth={96}>
        <TextArea placeholder="내용을 입력해주세요" showCounter maxLength={200} />
      </Field>
    </div>
  ),
};

/** feedback은 안쪽 컨트롤과 안내 문구 색에 함께 적용된다. */
export const Feedback: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={col}>
      <Field label="Label Text" feedback="positive" helperText="유효성 검증 통과">
        <TextField defaultValue="입력값" />
      </Field>
      <Field label="Label Text" feedback="negative" helperText="유효성 검증 실패">
        <TextField defaultValue="입력값" />
      </Field>
    </div>
  ),
};

export const Small: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field label="Label Text" size="sm" helperText="Helper Text">
      <TextField placeholder="입력해주세요" />
    </Field>
  ),
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field label="Label Text" disabled>
      <TextField defaultValue="비활성화" />
    </Field>
  ),
};
