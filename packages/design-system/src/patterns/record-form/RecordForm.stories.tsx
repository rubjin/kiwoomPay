import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Badge } from '../../components/Badge';
import { Button, TextButton } from '../../components/Button';
import { DateField, SelectBox, TextField } from '../../components/field';
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
import { useAction } from '../action';
import { DialogProvider, useDialog } from '../common';
import { GridPlaceholder } from '../search-result';

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
                <TextField style={{ width: 72 }} defaultValue="46757" />
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
// Modal md 620 · 높이 고정 (탭 · 상태가 바뀌어도 같은 크기 — 가장 긴 결제 오류 · 결제정보 탭 기준)
const DETAIL_HEIGHT = 655;

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

// 결제 오류 (사용자 이미지): 결제상태 오류 · 에러코드 · 에러내용 빨간 글자
const PAY_INFO_ERROR = PAY_INFO.map((item) =>
  item.label === '결제상태'
    ? { ...item, value: '오류', tone: 'error' as const }
    : item.label === '매입상태'
      ? { ...item, value: '승인' }
      : item,
);

function TransactionDetailModal({
  open,
  onClose,
  error = false,
}: {
  open: boolean;
  onClose: () => void;
  /** 결제 오류 거래 */
  error?: boolean;
}) {
  const [tab, setTab] = useState(error ? 'pay' : 'basic');
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
            description={
              error
                ? '선택한 PG 거래의 결제정보 및 오류정보를 조회합니다'
                : '선택한 PG 거래의 결제 관련 정보를 조회합니다.'
            }
          >
            <DetailCard title="결제정보" items={error ? PAY_INFO_ERROR : PAY_INFO} />
            <DetailCard
              title="결제 고객 정보"
              items={[
                { label: '결제 고객 ID', value: 'user***23' },
                { label: '고객명', value: '홍*동' },
                ...(error
                  ? [
                      { label: '에러코드', value: '에러코드명', tone: 'error' as const },
                      { label: '에러내용', value: '오류 메시지 내용', tone: 'error' as const },
                    ]
                  : []),
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
    tempWork: '팝업 높이 655 고정(결제 오류 · 결제정보 탭 기준)',
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

/** 결제정보 · 결제 오류: 결제상태 오류, 결제 고객 정보에 에러코드 · 에러내용 (빨간 글자, DetailCard item tone="error") */
export const TransactionDetailError: Story = {
  name: 'Detail Popup · 결제 오류',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    tempWork: '팝업 높이 655 고정(결제 오류 · 결제정보 탭 기준) · 오류 예시 값',
  },
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="neutral" appearance="line" onClick={() => setOpen(true)}>
          거래 상세정보 (결제 오류)
        </Button>
        <TransactionDetailModal open={open} onClose={() => setOpen(false)} error />
      </>
    );
  },
};
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ── 조회 + 입력 팝업 (Figma KWPC04010101 고객문의·민원 처리 29443:116562) ──
// (임의 작업) 선택지 · 필수 항목 · 완료 문구
const COMPLAINT_TYPES = [
  { value: 'customer', label: '고객 민원' },
  { value: 'fss', label: '금감원 민원' },
  { value: 'kca', label: '소비자원 민원' },
  { value: 'etc', label: '기타' },
];
const COMPLAINT_KINDS = [
  { value: 'cancel', label: '결제취소 요청' },
  { value: 'refund', label: '환불 문의' },
  { value: 'error', label: '결제 오류' },
  { value: 'etc', label: '기타' },
];
const REPLY_METHODS = [
  { value: 'phone', label: '전화' },
  { value: 'email', label: 'E-mail' },
  { value: 'sms', label: 'SMS' },
  { value: 'none', label: '회신 불필요' },
];

interface ComplaintForm {
  type: string;
  person: string;
  dueDate: string;
  officer: string;
  kind: string;
  reply: string;
  content: string;
}
const EMPTY_COMPLAINT: ComplaintForm = {
  type: '',
  person: '',
  dueDate: '',
  officer: '',
  kind: '',
  reply: '',
  content: '',
};

/** 접수 내역 4칸 같은 폭 (카드 안 표 폭 554 ÷ 4, Figma) */
const HISTORY_COLUMN_WIDTH = 138;

interface ComplaintRow {
  id: string;
  receivedAt: string;
  route: string;
  type: string;
  status: string;
}

// 접수정보가 있는 거래 (사용자 이미지)
const COMPLAINT_HISTORY: ComplaintRow[] = [
  {
    id: 'h1',
    receivedAt: '2026-08-31 09:12:30',
    route: '가맹점관리자 1:1 문의',
    type: '고객 민원',
    status: '처리완료',
  },
  { id: 'h2', receivedAt: '2026-08-31 09:12:30', route: '전화', type: '고객 민원', status: '접수' },
  {
    id: 'h3',
    receivedAt: '2026-08-31 09:12:30',
    route: '카드사 전달',
    type: '제휴사 민원',
    status: '처리중',
  },
];

function ComplaintModal({
  open,
  onClose,
  history = [],
}: {
  open: boolean;
  onClose: () => void;
  /** 이 거래의 문의 · 민원 접수 내역 */
  history?: ComplaintRow[];
}) {
  const dialog = useDialog();
  const [form, setForm] = useState(EMPTY_COMPLAINT);
  const set = (patch: Partial<ComplaintForm>) => setForm((prev) => ({ ...prev, ...patch }));
  const dirty = JSON.stringify(form) !== JSON.stringify(EMPTY_COMPLAINT);

  const validate = () =>
    !form.type
      ? '민원구분을 선택해주세요.'
      : !form.content.trim()
        ? '민원내용을 입력해주세요.'
        : null;
  const done = () => {
    setForm(EMPTY_COMPLAINT);
    onClose();
  };
  const save = useAction({
    validate,
    run: () => wait(400), // TODO(API) 민원 등록
    onSuccess: done,
    success: '민원을 등록했습니다.',
  });
  const saveMail = useAction({
    validate,
    run: () => wait(400), // TODO(API) 민원 등록 + 메일 발송
    onSuccess: done,
    success: '민원을 등록하고 메일을 발송했습니다.',
  });
  const busy = save.loading || saveMail.loading;

  const close = async () => {
    if (
      dirty &&
      !(await dialog.confirm('입력한 내용이 저장되지 않습니다. 닫을까요?', { confirmText: '닫기' }))
    )
      return;
    setForm(EMPTY_COMPLAINT);
    onClose();
  };

  return (
    <Modal open={open} onClose={busy ? undefined : close} size="md">
      <Modal.Header title="고객문의·민원 처리" closeButton />
      <DetailTarget value="T202608310001" divider={false} />
      <Modal.Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <DetailCard
            title="업체 정보"
            labelGap={20}
            items={[
              { label: 'CP명', value: 'ABC쇼핑몰' },
              { label: 'CPID', value: 'CTS1511467' },
              { label: 'CP상담전화', value: '02-3410-5078' },
              { label: '서비스명', value: '키움페이 결제서비스' },
              { label: '서비스 URL', value: 'https://www.example.com' },
              { label: '담당자 E-mail', value: 'cs@example.com' },
              { label: '메일 발송여부', value: '발송 완료' },
              { label: 'E-mail 1/2/3', value: 'cs1 / cs2 / cs3' },
            ]}
          />
          <DetailCard
            title="거래내역 - 휴대폰"
            labelGap={20}
            items={[
              { label: '결제일', value: '2026-08-31 09:12:30' },
              { label: '거래번호', value: 'T202608310001' },
              { label: '통신사', value: 'KT' },
              { label: '휴대폰번호', value: '010-12**-56**' },
              { label: '금액', value: '120,000원' },
              { label: '상품명', value: '테스트 상품' },
            ]}
          />
          <DetailCard title="문의 · 민원 접수정보">
            {/* TODO(IBSheet) 접수 내역 그리드 */}
            <GridPlaceholder<ComplaintRow>
              columns={[
                {
                  key: 'receivedAt',
                  header: '접수일시',
                  align: 'center',
                  width: HISTORY_COLUMN_WIDTH,
                },
                { key: 'route', header: '접수경로', align: 'center', width: HISTORY_COLUMN_WIDTH },
                { key: 'type', header: '민원구분', align: 'center', width: HISTORY_COLUMN_WIDTH },
                { key: 'status', header: '처리상태', align: 'center', width: HISTORY_COLUMN_WIDTH },
              ]}
              rows={history}
              rowKey={(row) => row.id}
              empty="등록된 문의/민원이 없습니다."
            />
          </DetailCard>
          <DetailCard
            title="민원사항"
            form
            items={[
              {
                label: '민원구분',
                value: (
                  <SelectBox
                    fullWidth
                    placeholder="선택"
                    options={COMPLAINT_TYPES}
                    value={form.type}
                    onChange={(type) => set({ type })}
                    aria-label="민원구분"
                  />
                ),
              },
              {
                label: '민원인',
                value: (
                  <TextField
                    fullWidth
                    placeholder="민원인 입력"
                    value={form.person}
                    onChange={(e) => set({ person: e.target.value })}
                    aria-label="민원인"
                  />
                ),
              },
              {
                label: '처리기한',
                value: (
                  <DateField
                    fullWidth
                    value={form.dueDate}
                    onChange={(dueDate) => set({ dueDate })}
                    aria-label="처리기한"
                  />
                ),
              },
              {
                label: '기관담당자',
                value: (
                  <TextField
                    fullWidth
                    placeholder="기관담당자 입력"
                    value={form.officer}
                    onChange={(e) => set({ officer: e.target.value })}
                    aria-label="기관담당자"
                  />
                ),
              },
              {
                label: '민원유형',
                value: (
                  <SelectBox
                    fullWidth
                    placeholder="선택"
                    options={COMPLAINT_KINDS}
                    value={form.kind}
                    onChange={(kind) => set({ kind })}
                    aria-label="민원유형"
                  />
                ),
              },
              {
                label: '회신방법',
                value: (
                  <SelectBox
                    fullWidth
                    placeholder="선택"
                    options={REPLY_METHODS}
                    value={form.reply}
                    onChange={(reply) => set({ reply })}
                    aria-label="회신방법"
                  />
                ),
              },
              {
                label: '민원내용',
                span: 2,
                value: (
                  <TextField
                    fullWidth
                    placeholder="민원내용 입력"
                    value={form.content}
                    onChange={(e) => set({ content: e.target.value })}
                    aria-label="민원내용"
                  />
                ),
              },
            ]}
          />
        </div>
      </Modal.Body>
      <Modal.Footer
        start={
          <Button
            size="lg"
            variant="neutral"
            appearance="line"
            iconOnly
            icon={<Icon name="refresh" size={24} />}
            aria-label="입력 초기화"
            disabled={busy}
            onClick={() => setForm(EMPTY_COMPLAINT)}
          />
        }
      >
        <Button size="lg" variant="neutral" appearance="line" disabled={busy} onClick={close}>
          취소
        </Button>
        <Button
          size="lg"
          variant="primary"
          appearance="line"
          loading={saveMail.loading}
          disabled={save.loading}
          onClick={() => saveMail.execute()}
        >
          등록 후 메일 발송
        </Button>
        <Button
          size="lg"
          loading={save.loading}
          disabled={saveMail.loading}
          onClick={() => save.execute()}
        >
          등록
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

/** 조회 + 입력 팝업: 정보 카드(DetailCard) · 접수 내역 표 · 입력 폼 카드(DetailCard form) + Footer 왼쪽 새로고침 */
export const ComplaintDetail: Story = {
  name: 'Detail Popup · 고객문의·민원 처리',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    tempWork: '선택지 · 필수 항목(민원구분 · 민원내용) · 완료 문구, 팝업 폭 md 620(Figma 720)',
  },
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <DialogProvider>
        <Button variant="neutral" appearance="line" onClick={() => setOpen(true)}>
          고객문의·민원 처리
        </Button>
        <ComplaintModal open={open} onClose={() => setOpen(false)} />
      </DialogProvider>
    );
  },
};

/** 접수정보가 있는 거래: 문의 · 민원 접수 내역 표에 행 표시 */
export const ComplaintDetailWithHistory: Story = {
  name: 'Detail Popup · 고객문의·민원 처리 (접수정보 있음)',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    tempWork: '접수 내역 예시 값 · 표는 IBSheet 연결 전 미리보기',
  },
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <DialogProvider>
        <Button variant="neutral" appearance="line" onClick={() => setOpen(true)}>
          고객문의·민원 처리 (접수정보 있음)
        </Button>
        <ComplaintModal open={open} onClose={() => setOpen(false)} history={COMPLAINT_HISTORY} />
      </DialogProvider>
    );
  },
};
