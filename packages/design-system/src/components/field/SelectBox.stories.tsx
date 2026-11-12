import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { Case, caseRow } from '../../stories/Case';
import { SelectBox, type SelectOption } from './SelectBox';

const options: SelectOption[] = [
  { value: 'default', label: 'Default' },
  { value: 'hover', label: 'Hover' },
  { value: 'selected', label: 'Selected' },
  { value: 'disabled', label: 'Disabled', disabled: true },
];

const many: SelectOption[] = Array.from({ length: 12 }, (_, i) => ({
  value: `item-${i + 1}`,
  label: `항목 ${i + 1}`,
}));

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--kp-space-16)',
  alignItems: 'flex-start',
};
// 드롭다운 패널이 아래로 펼쳐지므로 높이를 확보한다
const tall: CSSProperties = { minHeight: 300 };
const cell: CSSProperties = { width: 200 };

const meta = {
  title: 'Components/Field/SelectBox',
  component: SelectBox,
  args: { options, placeholder: '선택해주세요' },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    feedback: { control: 'inline-radio', options: [undefined, 'positive', 'negative'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
} satisfies Meta<typeof SelectBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={tall}>
      <SelectBox {...args} />
    </div>
  ),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <SelectBox options={options} size="md" />
      <SelectBox options={options} size="sm" />
    </div>
  ),
};

/** Default · Filled · Disabled · Negative. Open은 클릭하거나 아래 스토리에서 확인한다. */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <SelectBox options={options} />
      <SelectBox options={options} defaultValue="default" />
      <SelectBox options={options} disabled placeholder="비활성화" />
      <SelectBox options={options} feedback="negative" defaultValue="default" />
    </div>
  ),
};

/** 열린 상태: 기본(항목 Default · Hover(마우스 오버) · Selected · Disabled) · 불러오는 중 · 선택 가능한 항목 없음 */
export const Open: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={caseRow}>
      <Case label="기본" description="항목 Default · Hover · Selected · Disabled" height={320}>
        <SelectBox options={options} defaultOpen defaultValue="selected" fullWidth />
      </Case>
      <Case label="불러오는 중" description="loading" height={320}>
        <SelectBox options={[]} defaultOpen loading fullWidth />
      </Case>
      <Case label="선택 가능한 항목 없음" description="options 빈 배열" height={320}>
        <SelectBox options={[]} defaultOpen fullWidth />
      </Case>
    </div>
  ),
};

/** 항목이 많으면 최대 높이에서 스크롤된다. */
export const Scroll: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={tall}>
      <div style={cell}>
        <SelectBox options={many} defaultOpen fullWidth />
      </div>
    </div>
  ),
};

function ControlledExample() {
  const [value, setValue] = useState('hover');
  return (
    <div style={row}>
      <SelectBox options={options} value={value} onChange={setValue} />
      <span>선택값: {value}</span>
    </div>
  );
}

/** controlled 사용 예시 */
export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={tall}>
      <ControlledExample />
    </div>
  ),
};
