import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../../components/Badge';
import { Button, TextButton } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { SectionHeading } from '../../components/SectionHeading';
import { Tab } from '../../components/Tab';
import { ContextChip } from './ContextChip';
import { FormGroup, FormSection } from './FormSection';

const meta = {
  title: 'Composites/Form/Record Form/FormSection',
  component: FormSection,
  parameters: { layout: 'padded' },
  args: { collapsible: true, defaultCollapsed: false },
  argTypes: {
    collapsible: { control: 'boolean' },
    defaultCollapsed: { control: 'boolean' },
  },
} satisfies Meta<typeof FormSection>;
export default meta;
type Story = StoryObj<typeof meta>;

const wrap = { padding: 12, background: 'var(--kp-color-bg-page)' };
const table = { height: 40, background: 'var(--kp-color-bg-page)' };

/** 박스(FormSection) + "제목 + 폼" 묶음(FormGroup). 접기 버튼은 첫 제목 줄 actions에 FormSection.Toggle */
export const Playground: Story = {
  render: (args) => (
    <div style={wrap}>
      <FormSection {...args}>
        <FormGroup>
          <SectionHeading title="기본 정보" actions={<FormSection.Toggle />} />
          <div style={table}>FormTable</div>
        </FormGroup>
      </FormSection>
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
        collapsible
      >
        <FormGroup>
          <SectionHeading title="기본 정보" actions={<FormSection.Toggle />} />
          내용
        </FormGroup>
      </FormSection>
    </div>
  ),
};

/**
 * 한 카드에 묶음 여러 개: 제목은 같은 레벨 · 모양(18 Bold). 첫 묶음 제목 ↔ 폼 16, 아래 묶음 8, 묶음 사이 16.
 * 접으면 첫 제목 줄만 남는다 (담당자 정보도 숨음)
 */
export const Groups: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={wrap}>
      <FormSection collapsible>
        <FormGroup>
          <SectionHeading title="기본 정보" actions={<FormSection.Toggle />} />
          <div style={table}>FormTable</div>
        </FormGroup>
        <FormGroup>
          <SectionHeading
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
          <div style={table}>FormTable</div>
        </FormGroup>
      </FormSection>
    </div>
  ),
};

/** 대상 표시 (SectionHeading label + title, 아래 줄 children) + 오른쪽 탭 · 접기 (Figma 가맹점 정보관리) */
export const Target: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ ...wrap, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <FormSection collapsible defaultCollapsed>
        <FormGroup>
          <SectionHeading
            label="선택 CPID"
            title="등록된 CPID가 없습니다"
            actions={
              <>
                <Tab size="sm" defaultValue="a">
                  <Tab.Item value="a">CPID 기본 정보</Tab.Item>
                  <Tab.Item value="b">RM 관리</Tab.Item>
                </Tab>
                <FormSection.Toggle />
              </>
            }
          />
          내용
        </FormGroup>
      </FormSection>
      <FormSection collapsible>
        <FormGroup>
          <SectionHeading
            label="선택 CPID"
            title="CTS123456 · ABC몰"
            actions={<FormSection.Toggle />}
          >
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
          </SectionHeading>
          내용
        </FormGroup>
      </FormSection>
    </div>
  ),
};
