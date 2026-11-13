import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Badge } from '../../components/Badge';
import { Button, TextButton } from '../../components/Button';
import { SelectBox, TextField } from '../../components/field';
import { Icon } from '../../components/Icon';
import { PageLayout } from '../../components/layout';
import { Checkbox, Radio, RadioGroup } from '../../components/selection';
import { Modal } from '../../components/Modal';
import { Tab } from '../../components/Tab';
import { SectionHeading } from '../../components/SectionHeading';
import { ContextChip } from './ContextChip';
import { DetailCard, DetailSection, DetailTabs, DetailTarget } from './RecordDetail';
import { FormGroup, FormSection } from './FormSection';
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
        underTitle
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
        collapsible
      >
        <FormGroup>
          <SectionHeading title="기본 정보" actions={<FormSection.Toggle />} />
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
        </FormGroup>
      </FormSection>
      <FormSection collapsible defaultCollapsed>
        <FormGroup>
          <SectionHeading
            label="선택 CPID"
            title="등록된 CPID가 없습니다"
            actions={<FormSection.Toggle />}
          />
          내용
        </FormGroup>
      </FormSection>
    </div>
  ),
};

// ── V01 조회 전용 상세 팝업 (Figma KWPC04010101 거래 상세정보 · PG) ──
// Modal md 620 · 높이 고정 (탭을 바꿔도 같은 크기 — 결제정보 탭 내용 높이 기준)
const DETAIL_HEIGHT = 621;

const PAY_INFO = [
  { label: '결제서비스', value: '신용카드' },
  { label: '카드사', value: 'ABC카드' },
  { label: '승인일시', value: '2026-08-31 09:12:30' },
  { label: '결제상태', value: '승인' },
  { label: '결제금액', value: '120,000원' },
  { label: '카드번호', value: '1234-5678-****-9012' },
  { label: '매입상태' },
  { label: '할부개월' },
  { label: '정산예정일' },
  { label: '예상수수료' },
];

// 기본정보 탭 (Figma 29443:106622)
const MERCHANT_INFO = [
  { label: '가맹점명', value: 'ABC쇼핑몰' },
  { label: 'CPID', value: 'CTS1511467' },
  { label: '상담전화', value: '02-3410-5078' },
  { label: '서비스명', value: '키움페이 결제서비스' },
  { label: 'URL', value: 'https://www.example.com', span: 2 },
];

const TX_INFO = [
  { label: '거래번호', value: 'T202608310001' },
  { label: '주문번호', value: 'O202608310001' },
  { label: '거래원천', value: 'PG' },
  { label: '승인일시', value: '2026-08-31 09:12:30' },
  { label: '결제상태', value: '승인' },
  { label: '결제금액', value: '120,000원' },
];

function TransactionDetailModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState('basic');
  return (
    <Modal open={open} onClose={onClose} size="md" height={DETAIL_HEIGHT}>
      <Modal.Header title="거래 상세정보 · PG" closeButton />
      <DetailTarget value="T202608310001" />
      <DetailTabs>
        <Tab variant="title" fullWidth value={tab} onChange={setTab}>
          <Tab.Item value="basic">기본정보</Tab.Item>
          <Tab.Item value="pay">결제정보</Tab.Item>
        </Tab>
      </DetailTabs>
      <Modal.Body>
        {tab === 'pay' ? (
          <DetailSection
            title="결제정보"
            description="선택한 PG 거래의 결제 관련 정보를 조회합니다."
          >
            <DetailCard title="결제정보" items={PAY_INFO} />
            <DetailCard
              title="결제 고객 정보"
              items={[
                { label: '결제 고객 ID', value: 'user***23' },
                { label: '고객명', value: '홍*동' },
              ]}
            />
            <DetailCard title="부분취소 이력" emptyText="표시할 이력이 없습니다." />
          </DetailSection>
        ) : (
          <DetailSection
            title="기본정보"
            description="선택한 PG 거래의 가맹점 및 거래 기본정보를 조회합니다"
          >
            <DetailCard title="가맹점 정보" items={MERCHANT_INFO} />
            <DetailCard title="거래 기본정보" items={TX_INFO} />
          </DetailSection>
        )}
      </Modal.Body>
    </Modal>
  );
}

/** V01 조회 전용 상세 팝업: 대상 줄 · 제목 탭(스크롤 밖) + 정보 카드(DetailSection · DetailCard). Footer 없음 */
export const TransactionDetail: Story = {
  name: 'Detail Popup · 거래 상세정보',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    tempWork: '팝업 높이 621 고정(결제정보 탭 기준)',
  },
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="neutral" appearance="line" onClick={() => setOpen(true)}>
          거래 상세정보
        </Button>
        <TransactionDetailModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  },
};
