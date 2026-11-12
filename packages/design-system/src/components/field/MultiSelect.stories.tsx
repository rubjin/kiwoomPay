import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { Field } from './Field';
import { MultiSelect, type MultiSelectOption } from './MultiSelect';

const options: MultiSelectOption[] = [
  { value: 'm2-end', label: 'M+2월말' },
  { value: 'm2-start', label: 'M+2월초' },
  { value: 'm1-end', label: 'M+1월말' },
];

const reasons: MultiSelectOption[] = [
  '처리사유 없음',
  '계좌 예금주 불일치',
  '지급한도 초과 조정',
  '상계그룹 내 상계',
  '수수료 정정',
  '부분상계·잔액 이월',
  '정산주기 불일치',
  '한도 내 부분지급·이월',
].map((label, i) => ({ value: `r${i}`, label }));

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--kp-space-12)',
  alignItems: 'flex-start',
};
const tall: CSSProperties = { minHeight: 260 };
const cell: CSSProperties = { width: 200 };

const meta = {
  title: 'Components/Field/MultiSelect',
  component: MultiSelect,
  args: { options, placeholder: '선택해주세요' },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    feedback: { control: 'inline-radio', options: [undefined, 'positive', 'negative'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    searchable: { control: 'boolean' },
    selectAll: { control: 'boolean' },
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ ...tall, ...cell }}>
      <MultiSelect {...args} fullWidth />
    </div>
  ),
};

/** Default · Filled · Disabled · Negative (md 40 · sm 32) */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--kp-space-16)' }}>
      {(['md', 'sm'] as const).map((size) => (
        <div key={size} style={row}>
          <div style={cell}>
            <MultiSelect fullWidth size={size} options={options} />
          </div>
          <div style={cell}>
            <MultiSelect fullWidth size={size} options={options} defaultValue={['m2-end']} />
          </div>
          <div style={cell}>
            <MultiSelect fullWidth size={size} options={options} disabled placeholder="비활성화" />
          </div>
          <Field feedback="negative" helperText="필수 항목을 선택해주세요" size={size}>
            <div style={cell}>
              <MultiSelect fullWidth options={options} />
            </div>
          </Field>
        </div>
      ))}
    </div>
  ),
};

/** 열린 상태: 1개 선택 · 여러 개 선택(쉼표 나열) · Scroll · Loading · Empty */
export const Open: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ ...row, minHeight: 300 }}>
      <div style={cell}>
        <MultiSelect fullWidth options={options} defaultValue={['m2-end']} defaultOpen />
      </div>
      <div style={cell}>
        <MultiSelect
          fullWidth
          options={options}
          defaultValue={['m2-end', 'm2-start', 'm1-end']}
          defaultOpen
        />
      </div>
      <div style={cell}>
        <MultiSelect
          options={[...options, ...reasons]}
          defaultValue={['m2-end']}
          defaultOpen
          fullWidth
        />
      </div>
      <div style={cell}>
        <MultiSelect options={options} loading defaultOpen fullWidth />
      </div>
      <div style={cell}>
        <MultiSelect options={[]} defaultOpen fullWidth />
      </div>
      <div style={cell}>
        <MultiSelect
          size="sm"
          options={[...options, ...reasons]}
          defaultValue={['m2-end']}
          defaultOpen
          fullWidth
        />
      </div>
    </div>
  ),
};

/** 패널 폭은 트리거 폭을 따른다. 항목이 많으면 목록만 스크롤된다 */
export const Wide: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ ...tall, width: 320 }}>
      <MultiSelect options={reasons} defaultValue={['r0']} defaultOpen fullWidth />
    </div>
  ),
};

/** 선택값(controlled) · 여러 개 선택 시 쉼표로 나열(넘치면 말줄임) */
export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [value, setValue] = useState<string[]>(['r0', 'r2']);
    return (
      <div style={{ ...tall, width: 320 }}>
        <MultiSelect options={reasons} value={value} onChange={setValue} fullWidth />
        <p style={{ marginTop: 'var(--kp-space-8)' }}>value: {JSON.stringify(value)}</p>
      </div>
    );
  },
};
