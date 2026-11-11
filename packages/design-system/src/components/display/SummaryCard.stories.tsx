import type { Meta, StoryObj } from '@storybook/react-vite';
import { SummaryCard } from './SummaryCard';

const row = { display: 'flex', gap: 'var(--kp-space-12)', alignItems: 'flex-start' };
const md = { width: 320 };
const sm = { width: 280 };
const info = '조회 기간 동안 승인된 거래 건수입니다.';

const meta = {
  title: 'Components/Summary Card',
  component: SummaryCard,
  args: {
    title: '총 거래',
    info,
    value: 12480,
    unit: '₩',
    meta: '내용 입력',
    size: 'md',
    loading: false,
    empty: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    value: { control: 'number' },
    unit: { control: 'text' },
    meta: { control: 'text' },
    title: { control: 'text' },
    info: { control: 'text' },
  },
  render: (args) => (
    <div style={args.size === 'sm' ? sm : md}>
      <SummaryCard {...args} />
    </div>
  ),
} satisfies Meta<typeof SummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** md · sm × 값 · 로딩 · 결과 없음 (시안) */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--kp-space-12)' }}>
      <div style={row}>
        <SummaryCard
          style={md}
          title="총 거래"
          info={info}
          value={12480}
          unit="₩"
          meta="내용 입력"
        />
        <SummaryCard style={md} title="총 거래" info={info} loading />
        <SummaryCard style={md} title="총 거래" info={info} empty />
      </div>
      <div style={row}>
        <SummaryCard
          style={sm}
          size="sm"
          title="총 거래"
          info={info}
          value={12480}
          unit="₩"
          meta="내용 입력"
        />
        <SummaryCard style={sm} size="sm" title="총 거래" info={info} loading />
        <SummaryCard style={sm} size="sm" title="총 거래" info={info} empty />
      </div>
    </div>
  ),
};

/** 화면 상단 요약 줄: 부모 grid가 폭을 나눈다 */
export const InGrid: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'var(--kp-space-12)',
        width: 1200,
      }}
    >
      <SummaryCard title="총 거래" value={12480} unit="건" meta="전일 대비 +3.2%" />
      <SummaryCard title="승인 금액" info={info} value={1284500000} unit="₩" meta="부가세 포함" />
      <SummaryCard title="취소 금액" value={8420000} unit="₩" meta="부분 취소 포함" />
      <SummaryCard title="정산 예정" empty />
    </div>
  ),
};
