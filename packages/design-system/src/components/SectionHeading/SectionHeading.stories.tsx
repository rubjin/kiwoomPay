import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContextChip } from '../../patterns/record-form/ContextChip';
import { Badge } from '../Badge';
import { Button, TextButton } from '../Button';
import { Icon } from '../Icon';
import { TextField } from '../field';
import { SectionHeading } from './SectionHeading';

const meta = {
  title: 'Components/Section Heading',
  component: SectionHeading,
  parameters: { layout: 'padded' },
  args: { title: '기본 정보', size: 'lg', subtle: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['xl', 'lg', 'md'] },
    subtle: { control: 'boolean' },
    as: { control: 'inline-radio', options: ['h1', 'h2', 'h3', 'h4'] },
  },
} satisfies Meta<typeof SectionHeading>;
export default meta;
type Story = StoryObj<typeof meta>;

const card = {
  padding: 16,
  background: 'var(--kp-color-bg-surface)',
  border: '1px solid var(--kp-color-line-subtle)',
  borderRadius: 8,
};

export const Playground: Story = {
  args: { description: '자금세탁방지 공지용 담당자 정보' },
  render: (args) => (
    <div style={card}>
      <SectionHeading {...args} actions={<Button size="sm">등록</Button>} />
    </div>
  ),
};

/** xl 24 Bold (화면명 — PageLayout.Title) · lg 18 Bold (Section · 검색 조건 · 폼 카드) · md 16 Bold (조회 결과) · md subtle (한 줄 카드) */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionHeading as="h1" size="xl" title="화면명 (xl · PageLayout.Title)" />
      <div style={card}>
        <SectionHeading title="검색 조건 (lg)" />
      </div>
      <div style={card}>
        <SectionHeading size="md" title="조회 결과 (md)" />
      </div>
      <div style={card}>
        <SectionHeading size="md" subtle title="적용된 검색 조건 (md subtle)" />
      </div>
    </div>
  ),
};

/** 제목 옆 addon(접기 · 버튼) + 오른쪽 actions */
export const AddonAndActions: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={card}>
        <SectionHeading
          title="검색 조건"
          addon={<Icon name="chevron-up" size={24} />}
          actions={
            <>
              <Button
                variant="neutral"
                appearance="line"
                iconOnly
                icon={<Icon name="refresh" size={20} />}
                aria-label="초기화"
              />
              <Button variant="neutral">조회</Button>
            </>
          }
        />
      </div>
      <div style={card}>
        <SectionHeading
          size="md"
          title="조회 결과"
          addon={
            <Button size="sm" variant="neutral" appearance="line">
              엑셀 다운로드
            </Button>
          }
          actionsGrow
          actions={
            <>
              <TextField size="sm" placeholder="취소사유 입력" style={{ flex: '1 1 0' }} />
              <Button size="sm" variant="dark">
                선택 취소
              </Button>
            </>
          }
        />
      </div>
    </div>
  ),
};

/** 대상 표시: label + 제목, 아래 줄 문맥(children) — 오른쪽은 위에 맞춘다 */
export const LabelAndContext: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={card}>
      <SectionHeading
        label="선택 CPID"
        title="CTS123456 · ABC몰"
        actions={<TextButton>이력조회</TextButton>}
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
    </div>
  ),
};

/** 긴 제목은 말줄임 (오른쪽 Action은 줄지 않음) */
export const LongTitle: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ ...card, width: 360 }}>
      <SectionHeading
        title="아주 긴 섹션 제목이 들어가서 영역보다 길어지는 경우"
        actions={<Button size="sm">등록</Button>}
      />
    </div>
  ),
};
