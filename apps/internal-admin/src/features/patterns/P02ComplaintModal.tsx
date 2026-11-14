import {
  // 팝업 틀 · 버튼
  Modal,
  Button,
  Icon,
  // 상세 정보 (P02)
  DetailTarget,
  DetailCard,
  GridPlaceholder,
  // 입력 컨트롤
  SelectBox,
  TextField,
  DateField,
  // 처리 흐름 (P04)
  useAction,
  useDialog,
} from '@kiwoompay/design-system';
import { useState } from 'react';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

/**
 * P02 조회 + 입력 팝업 템플릿 (Figma KWPC04010101 고객문의·민원 처리, 임의 작업: 선택지 · 필수 항목 · 완료 문구).
 * 구성: Modal.Header → DetailTarget(구분선 없음) → Body(정보 DetailCard · 접수 내역 표 · 입력 폼 DetailCard form) → Footer(왼쪽 새로고침 · 취소 · 등록 후 메일 발송 · 등록)
 */
// 접수정보가 있는 거래 예시
export const COMPLAINT_HISTORY: ComplaintRow[] = [
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

export function P02ComplaintModal({
  open,
  onClose,
  history = [],
}: {
  open: boolean;
  onClose: () => void;
  /** 이 거래의 문의 · 민원 접수 내역 (TODO(API)) */
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
