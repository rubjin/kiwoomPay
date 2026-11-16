import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from './Field';
import { PasswordField } from './PasswordField';

const meta = {
  title: 'Components/Field/PasswordField',
  component: PasswordField,
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: { placeholder: '비밀번호를 입력해 주세요', disabled: false },
} satisfies Meta<typeof PasswordField>;
export default meta;
type Story = StoryObj<typeof meta>;

/** 뒤 [보기] 버튼으로 가림 ↔ 보임 (가린 상태 eye, 보인 상태 eye-off) */
export const Playground: Story = {};

/** 비밀번호 변경 팝업처럼 Field 안에서 — 라벨 왼쪽 96 · 오류 문구 간격 5 (KWPC02010101) */
export const InField: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 580 }}>
      <Field
        label="현재 비밀번호"
        required
        labelWidth={96}
        helperGap={5}
        feedback="negative"
        helperText="현재 비밀번호를 입력해 주세요."
      >
        <PasswordField fullWidth placeholder="현재 비밀번호를 입력해 주세요" />
      </Field>
    </div>
  ),
};
