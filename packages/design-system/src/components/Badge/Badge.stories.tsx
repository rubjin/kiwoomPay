import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { Badge, DotBadge, NumberBadge, type BadgeTone } from './Badge';

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--kp-space-16)',
  alignItems: 'center',
};
const col: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 'var(--kp-space-16)' };

const tones: Array<[BadgeTone, string]> = [
  ['neutral', '일반'],
  ['primary', '주요'],
  ['info', '처리중'],
  ['success', '정상'],
  ['warning', '확인필요'],
  ['error', '고위험'],
];

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: '정상', tone: 'success', dot: true },
  argTypes: {
    tone: { control: 'inline-radio', options: tones.map(([t]) => t) },
    appearance: { control: 'inline-radio', options: ['soft', 'line'] },
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    dot: { control: 'boolean' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Text · Number · Dot */
export const Types: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Badge tone="success" dot>
        정상
      </Badge>
      <NumberBadge count={1} />
      <DotBadge aria-label="새 기능" />
    </div>
  ),
};

/** Tone: Status 색 체계를 그대로 쓴다. 상태(info~error)는 점과 함께, 분류(neutral·primary)는 점 없이. */
export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={col}>
      <div style={row}>
        {tones.map(([tone, label]) => (
          <Badge key={tone} tone={tone} dot={tone !== 'neutral' && tone !== 'primary'}>
            {label}
          </Badge>
        ))}
      </div>
      <div style={row}>
        {tones.map(([tone, label]) => (
          <Badge key={tone} tone={tone} appearance="line">
            {label}
          </Badge>
        ))}
      </div>
    </div>
  ),
};

/** Soft · Line · Default(H24 · 13 Medium) · Small(H20 · 12 Medium) · Status Dot */
export const TextBadge: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Badge tone="info" dot>
        처리중
      </Badge>
      <Badge tone="primary" appearance="line">
        주요
      </Badge>
      <Badge tone="success" dot>
        정상
      </Badge>
      <Badge tone="warning" dot size="sm">
        확인필요
      </Badge>
      <Badge tone="error" dot>
        고위험
      </Badge>
    </div>
  ),
};

/** Number: 99를 넘으면 99+. 0이면 숨긴다(showZero로 표시). Dot: 신규 기능·메뉴 업데이트 */
export const NumberAndDot: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <NumberBadge count={1} />
      <NumberBadge count={120} />
      <NumberBadge count={1} tone="error" />
      <NumberBadge count={100} tone="error" />
      <NumberBadge count={0} showZero />
      <DotBadge aria-label="새 기능" />
      <DotBadge tone="error" aria-label="새 알림" />
    </div>
  ),
};

/** StatusDot 기준: 단독 상태는 Hide, 여러 상태를 비교하는 목록은 Show, 분류·속성은 Hide */
export const StatusDotUsage: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Badge tone="success">정상</Badge>
      <Badge tone="success" dot>
        정상
      </Badge>
      <Badge tone="neutral">일반</Badge>
    </div>
  ),
};
