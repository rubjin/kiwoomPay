import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../../components/Badge';
import { Button, TextButton } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Tab } from '../../components/Tab';
import { ContextChip } from './ContextChip';
import { FormSection } from './FormSection';

const meta = {
  title: 'Components/Record Form/FormSection',
  component: FormSection,
  parameters: { layout: 'padded' },
  args: { title: '기본 정보', collapsible: true, defaultCollapsed: false },
  argTypes: {
    collapsible: { control: 'boolean' },
    defaultCollapsed: { control: 'boolean' },
  },
} satisfies Meta<typeof FormSection>;
export default meta;
type Story = StoryObj<typeof meta>;

const wrap = { padding: 12, background: 'var(--kp-color-bg-page)' };

export const Playground: Story = {
  render: (args) => (
    <div style={wrap}>
      <FormSection {...args}>섹션 내용 (FormTable 등)</FormSection>
    </div>
  ),
};

/** 카드 위 제목 탭 + 오른쪽 Action (버튼은 카드 위 8, 탭 밑줄은 카드 테두리에 겹침) */
export const Tabbed: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={wrap}>
      <FormSection
        tabs={
          <Tab variant="title" defaultValue="a">
            <Tab.Item value="a">사업자 정보 관리</Tab.Item>
            <Tab.Item value="b">고객 확인 정보</Tab.Item>
            <Tab.Item value="c">결제 오픈 현황</Tab.Item>
          </Tab>
        }
        tabActions={
          <>
            <Button
              variant="neutral"
              appearance="line"
              iconOnly
              icon={<Icon name="refresh" size={20} />}
              aria-label="새로고침"
            />
            <Button>등록</Button>
          </>
        }
        title="기본 정보"
        collapsible
      >
        내용
      </FormSection>
    </div>
  ),
};

/** 소제목 줄 (FormSection.Header): 18 Bold + 설명 12 + 오른쪽 Action, 아래 표와 8 */
export const SubHeader: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={wrap}>
      <FormSection title="기본 정보">
        <FormSection.Header
          title="담당자 정보"
          description="자금세탁방지 공지용 담당자 정보"
          actions={
            <>
              <TextButton>이력조회</TextButton>
              <Button size="sm" variant="neutral" appearance="line">
                추가
              </Button>
            </>
          }
        />
        <div style={{ height: 40, background: 'var(--kp-color-bg-page)' }} />
      </FormSection>
    </div>
  ),
};

/** 제목 자리에 대상 표시 (FormSection.Heading) + 오른쪽 탭 · 접힘 (Figma 가맹점 정보관리) */
export const Heading: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ ...wrap, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <FormSection
        title={<FormSection.Heading label="선택 CPID" value="등록된 CPID가 없습니다" />}
        actions={
          <Tab size="sm" defaultValue="a">
            <Tab.Item value="a">CPID 기본 정보</Tab.Item>
            <Tab.Item value="b">RM 관리</Tab.Item>
          </Tab>
        }
        collapsible
        defaultCollapsed
      >
        내용
      </FormSection>
      <FormSection
        title={
          <FormSection.Heading label="선택 CPID" value="CTS123456 · ABC몰">
            <ContextChip
              muted
              items={[
                { label: '현재 사업자', value: '㈜ABC커머스' },
                { label: '대표자명', value: '홍길동' },
              ]}
            />
            <Badge size="sm" tone="success" dot>
              서비스 · 사용중
            </Badge>
          </FormSection.Heading>
        }
        collapsible
      >
        내용
      </FormSection>
    </div>
  ),
};
