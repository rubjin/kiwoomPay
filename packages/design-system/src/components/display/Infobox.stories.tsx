import type { Meta, StoryObj } from '@storybook/react-vite';
import { Infobox } from './Infobox';

const mail = 'pg-admin@daoudata.co.kr';
const account = (
  <Infobox.Item
    title="계정정보 변경 안내"
    actionLabel="변경 요청"
    action={<Infobox.Link href={`mailto:${mail}`}>{mail}</Infobox.Link>}
  >
    휴대전화번호·이메일 등 기본 계정정보는 직접 수정할 수 없습니다. 변경이 필요한 경우 시스템
    관리자에게 요청해 주세요.
  </Infobox.Item>
);
const history = (
  <Infobox.Item
    title="이력 확인 안내"
    actionLabel="변경 요청"
    action={<Infobox.Link href={`mailto:${mail}`}>{mail}</Infobox.Link>}
  >
    계정 상태 및 로그인 이력은 해당 영역의 이력 버튼을 통해 확인할 수 있습니다.
  </Infobox.Item>
);

const stack = { display: 'grid', gap: 'var(--kp-space-24)', width: 1242 };

const meta = {
  title: 'Components/Display/Infobox',
  component: Infobox,
  args: { tone: 'info', children: account },
  argTypes: {
    tone: { control: 'inline-radio', options: ['info', 'neutral'] },
    children: { control: false },
  },
  render: (args) => (
    <div style={{ width: 1242 }}>
      <Infobox {...args} />
    </div>
  ),
} satisfies Meta<typeof Infobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Info · Neutral × 한 줄 · 여러 줄 (시안) */
export const Types: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={stack}>
      <Infobox>{account}</Infobox>
      <Infobox>
        {account}
        {history}
      </Infobox>
      <Infobox tone="neutral">{account}</Infobox>
      <Infobox tone="neutral">
        {account}
        {history}
      </Infobox>
    </div>
  ),
};

/** 오른쪽 영역 없음 · 좁은 폭(설명 줄바꿈) */
export const Variations: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ ...stack, width: 640 }}>
      <Infobox>
        <Infobox.Item title="조회 안내">최근 3개월 거래만 조회할 수 있습니다.</Infobox.Item>
      </Infobox>
      <Infobox>{account}</Infobox>
    </div>
  ),
};
