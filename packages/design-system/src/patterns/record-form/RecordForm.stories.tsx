import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../../components/Badge';
import { Button, TextButton } from '../../components/Button';
import { SelectBox, TextField } from '../../components/field';
import { Icon } from '../../components/Icon';
import { PageLayout } from '../../components/layout';
import { Checkbox, Radio, RadioGroup } from '../../components/selection';
import { Tab } from '../../components/Tab';
import { ContextChip } from './ContextChip';
import { FormSection } from './FormSection';
import { FormTable } from './FormTable';

const meta = {
  title: 'Patterns/P02 Record Form',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const { Row, Label, Cell, InlineLabel, Head } = FormTable;

/** KWPC07010101 가맹점 기본/계약 정보 관리 (기본 정보 · 담당자 정보 일부) */
export const RecordForm: Story = {
  parameters: { controls: { disable: true }, tempWork: '예시 값 · 일부 줄만 표시' },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '20px 24px',
        background: 'var(--kp-color-bg-page)',
        minWidth: 1680,
      }}
    >
      <PageLayout.Title
        title="가맹점 기본/계약 정보 관리"
        titleAddon={
          <>
            <ContextChip
              items={[
                { label: '현재 사업자', value: '㈜ABC커머스' },
                { label: '사업자번호', value: '123-45-67890' },
              ]}
            />
            <Badge size="sm" tone="success" dot>
              정상
            </Badge>
          </>
        }
      />
      <FormSection
        style={{ marginTop: -17 }}
        tabs={
          <Tab variant="title" defaultValue="a">
            <Tab.Item value="a">사업자 정보 관리</Tab.Item>
            <Tab.Item value="b">고객 확인 정보</Tab.Item>
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
            <Button>저장</Button>
          </>
        }
        title="기본 정보"
        collapsible
      >
        <FormTable>
          <Row>
            <Label required>사업자번호</Label>
            <Cell>
              <TextField fullWidth readOnly defaultValue="123-45-67890" />
              <Button variant="neutral" appearance="line">
                수정
              </Button>
            </Cell>
            <Label required>사업자구분</Label>
            <Cell>
              <SelectBox
                fullWidth
                options={[{ value: 'c', label: '법인사업자' }]}
                defaultValue="c"
              />
            </Cell>
            <Label>영중소 구분</Label>
            <Cell>중소2</Cell>
            <Label required>신탁 구분</Label>
            <Cell>
              <RadioGroup direction="horizontal" defaultValue="y">
                <Radio value="n" label="해당없음" />
                <Radio value="y" label="해당있음" />
              </RadioGroup>
            </Cell>
          </Row>
          <Row>
            <Label required>업종</Label>
            <Cell colSpan={3}>
              <TextField fullWidth defaultValue="전자상거래 및 온라인 플랫폼 운영" />
            </Cell>
            <Label required>업태</Label>
            <Cell colSpan={3}>
              <TextField fullWidth defaultValue="정보통신업" />
            </Cell>
          </Row>
          <Row>
            <Label required>사업장 주소</Label>
            <Cell colSpan={7}>
              <Checkbox label="사업장 주소와 동일" />
              <InlineLabel>우편번호</InlineLabel>
              <TextField style={{ width: 200 }} defaultValue="46757" />
              <InlineLabel>주소</InlineLabel>
              <TextField fullWidth style={{ flex: '1 1 0' }} defaultValue="부산광역시 강서구" />
            </Cell>
          </Row>
        </FormTable>
        <FormSection
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
        <FormTable template="36px repeat(3, minmax(0, 1fr))">
          <Row>
            <Head>
              <Checkbox aria-label="전체 선택" />
            </Head>
            <Head>업무구분</Head>
            <Head>담당자명</Head>
            <Head>이메일</Head>
          </Row>
          <Row>
            <Cell center>
              <Checkbox aria-label="선택" />
            </Cell>
            <Cell>
              <SelectBox
                fullWidth
                options={[{ value: '계약', label: '계약' }]}
                defaultValue="계약"
              />
            </Cell>
            <Cell>
              <TextField fullWidth defaultValue="최계약" />
            </Cell>
            <Cell>
              <TextField fullWidth defaultValue="choi@company.com" />
            </Cell>
          </Row>
        </FormTable>
      </FormSection>
      <FormSection
        title={<FormSection label="선택 CPID" description="등록된 CPID가 없습니다" />}
        collapsible
        defaultCollapsed
      >
        내용
      </FormSection>
    </div>
  ),
};
