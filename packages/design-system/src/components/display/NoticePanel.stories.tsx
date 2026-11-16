import type { Meta, StoryObj } from '@storybook/react-vite';
import { NoticePanel } from './NoticePanel';

const meta = {
  title: 'Components/Notice Panel',
  component: NoticePanel,
  args: {
    title: '비밀번호 설정 안내',
    items: [
      '8자 이상 30자 이하',
      '영문 대문자·소문자·숫자·특수문자 중 3종 이상 조합',
      '동일 문자 3자 이상, 연속 문자 4자 이상 사용 불가',
      '최근 사용한 비밀번호와 동일하게 설정 불가',
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: 580 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NoticePanel>;
export default meta;
type Story = StoryObj<typeof meta>;

/** 제목 + 글머리표 목록 (Figma KWPC02010101 비밀번호 설정 안내). 한 줄 안내는 Infobox */
export const Playground: Story = {};
