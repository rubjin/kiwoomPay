import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { Tab } from './Tab';

const meta = {
  title: 'Components/Tab/Tab',
  component: Tab,
  args: { defaultValue: 'a', children: null },
  argTypes: {
    variant: { control: 'inline-radio', options: ['line', 'button'] },
    size: { control: 'inline-radio', options: ['md', 'sm'] },
  },
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

const col: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 24 };

export const Playground: Story = {
  render: (args) => (
    <Tab {...args}>
      <Tab.Item value="a">전체</Tab.Item>
      <Tab.Item value="b" count={10}>
        승인대기
      </Tab.Item>
      <Tab.Item value="c">완료</Tab.Item>
      <Tab.Item value="d" disabled>
        보류
      </Tab.Item>
    </Tab>
  ),
};

/** Default · Active · Disabled. Active는 한 그룹에 1개만 */
export const States: Story = {
  render: () => (
    <Tab defaultValue="active">
      <Tab.Item value="default">Tab</Tab.Item>
      <Tab.Item value="active">Tab</Tab.Item>
      <Tab.Item value="disabled" disabled>
        Tab
      </Tab.Item>
    </Tab>
  ),
};

/** Medium 40(일반 콘텐츠) · Small 32(밀도 높은 영역) · Badge(기존 Number Badge 재사용) */
export const SizeAndBadge: Story = {
  render: () => (
    <div style={col}>
      <Tab defaultValue="a" size="md">
        <Tab.Item value="a">Tab</Tab.Item>
        <Tab.Item value="b">Tab</Tab.Item>
      </Tab>
      <Tab defaultValue="a" size="sm">
        <Tab.Item value="a" count={10}>
          Tab
        </Tab.Item>
        <Tab.Item value="b" count={3}>
          Tab
        </Tab.Item>
      </Tab>
      <Tab defaultValue="a" size="md">
        <Tab.Item value="a" count={10}>
          Tab
        </Tab.Item>
        <Tab.Item value="b" count={120}>
          Tab
        </Tab.Item>
        <Tab.Item value="c" count={0}>
          Tab
        </Tab.Item>
        <Tab.Item value="d" count={5} disabled>
          Tab
        </Tab.Item>
      </Tab>
    </div>
  ),
};

/** Content Width(기본): Label 길이만큼 · Equal Width(fullWidth): 부모 폭을 같은 비율로 */
export const Layout: Story = {
  render: () => (
    <div style={col}>
      <Tab defaultValue="a">
        <Tab.Item value="a">abcdefgh</Tab.Item>
        <Tab.Item value="b">거래내역</Tab.Item>
        <Tab.Item value="c">정산</Tab.Item>
      </Tab>
      <div style={{ width: 240 }}>
        <Tab defaultValue="fav" size="sm" fullWidth>
          <Tab.Item value="all" count={10}>
            abcdefgh
          </Tab.Item>
          <Tab.Item value="fav" count={10}>
            즐겨찾기
          </Tab.Item>
        </Tab>
      </div>
    </div>
  ),
};

/** Button Tab: 동일 영역의 동급 View를 버튼형으로 전환 */
export const ButtonTab: Story = {
  render: () => (
    <div style={col}>
      <Tab variant="button" defaultValue="a">
        <Tab.Item value="a">Tab</Tab.Item>
        <Tab.Item value="b">Tab</Tab.Item>
        <Tab.Item value="c" disabled>
          Tab
        </Tab.Item>
      </Tab>
      <div style={{ width: 400 }}>
        <Tab variant="button" defaultValue="day" fullWidth>
          <Tab.Item value="day">일별</Tab.Item>
          <Tab.Item value="month">월별</Tab.Item>
          <Tab.Item value="year">연도별</Tab.Item>
        </Tab>
      </div>
    </div>
  ),
};

function InteractiveExample() {
  const [view, setView] = useState('all');
  return (
    <div style={{ width: 480 }}>
      <Tab value={view} onChange={setView}>
        <Tab.Item value="all" count={24}>
          전체
        </Tab.Item>
        <Tab.Item value="wait" count={10}>
          승인대기
        </Tab.Item>
        <Tab.Item value="done">완료</Tab.Item>
      </Tab>
      <p style={{ marginTop: 16 }}>현재 View: {view}</p>
    </div>
  );
}

/** controlled: 선택한 Tab에 따라 화면이 View를 바꾼다 */
export const Interactive: Story = {
  render: () => <InteractiveExample />,
};
