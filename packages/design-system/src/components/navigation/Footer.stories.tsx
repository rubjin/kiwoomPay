import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from './Footer';

// 로고 이미지가 아직 없어 글자로 대신한다 (TODO: 로고 SVG 파일)
const logo = (
  <span style={{ font: '700 16px/16px var(--kp-font-family-base)', letterSpacing: 2 }}>
    DAOU <span style={{ fontWeight: 400 }}>DATA</span>
  </span>
);

const items = [
  '대표이사 : 김상준',
  '사업자등록번호 : 220-81-01733',
  '04156 서울특별시 마포구 독막로 311 (염리동, 재화스퀘어) 3층, 5층',
  '대표전화 : 1588-5984',
  'FAX : 02-6280-3268',
];

const meta = {
  title: 'Components/Footer',
  component: Footer,
  args: { logo, items, copyright: 'Copyright ⓒ DAOU Tech Inc. All Rights Reserved.' },
  argTypes: { logo: { control: false }, items: { control: false }, copyright: { control: 'text' } },
  render: (args) => (
    <div style={{ width: 1680, height: 74 }}>
      <Footer {...args} />
    </div>
  ),
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 시안 (1680 = 1920 - LNB 240, 높이 74는 PageLayout 슬롯) */
export const Playground: Story = {};

/** 좁은 폭: 항목 단위로 줄바꿈 */
export const Narrow: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ width: 900, height: 74 }}>
      <Footer {...args} />
    </div>
  ),
};
