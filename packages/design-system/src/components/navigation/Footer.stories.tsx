import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from './Footer';
import { systemAssets } from '../../stories/systemAssets';

// 로고는 앱마다 둔다 (apps/<앱>/src/assets/logo/logo-footer.svg). 스토리는 앱 이미지를 주소로 읽는다 (systemAssets)
const logo = <img src={systemAssets.logoFooter} alt="DAOU DATA" width={110} height={16} />;

const items = [
  '대표이사 : 김상준',
  '사업자등록번호 : 220-81-01733',
  '04156 서울특별시 마포구 독막로 311 (염리동, 재화스퀘어) 3층, 5층',
  '대표전화 : 1588-5984',
  'FAX : 02-6280-3268',
];

const meta = {
  title: 'Layout/Footer',
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
