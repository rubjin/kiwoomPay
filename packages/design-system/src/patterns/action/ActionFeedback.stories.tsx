import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { Field, SelectBox, TextField } from '../../components/field';
import { PageLayout } from '../../components/layout';
import { Modal } from '../../components/Modal';
import { Tab } from '../../components/Tab';
import { SectionHeading } from '../../components/SectionHeading';
import { DialogProvider } from '../common';
import { FormGroup, FormSection, FormTable } from '../record-form';
import { useAction } from './useAction';

const meta = {
  title: 'Patterns/P04 Action Feedback',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <DialogProvider>
        <Story />
      </DialogProvider>
    ),
  ],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// 입력 팝업(sm 400)의 라벨 폭 — 가장 긴 라벨에 맞춘다 (TODO(시안) 측정값 확인)
const LABEL_WIDTH = 120;
const FIELD_ROW_GAP = 12;

// ── 엑셀 다운로드 사유 입력 ──────────────────────────────
const DOWNLOAD_REASONS = [
  { value: 'report', label: '업무 보고 자료 작성' },
  { value: 'settlement', label: '정산 내역 확인' },
  { value: 'cs', label: '민원 · CS 처리' },
  { value: 'etc', label: '기타 (직접 입력)' },
];

/** 엑셀 다운로드 사유 입력 (sm). 확인 → 다운로드 요청 → 닫고 완료 안내 */
function DownloadReasonModal({
  open,
  onClose,
  inline,
}: {
  open: boolean;
  onClose: () => void;
  inline?: boolean;
}) {
  const [reason, setReason] = useState('');
  const [etc, setEtc] = useState('');

  const request = useAction({
    validate: () =>
      !reason
        ? '다운로드 사유를 선택해주세요.'
        : reason === 'etc' && !etc.trim()
          ? '다운로드 사유를 입력해주세요.'
          : null,
    run: () => wait(600), // TODO(API) 다운로드 요청
    onSuccess: () => {
      setReason('');
      setEtc('');
      onClose();
    },
    success: '다운로드를 요청했습니다. 파일이 생성되면 다운로드 센터에서 받을 수 있습니다.',
  });

  return (
    <Modal open={open} onClose={request.loading ? undefined : onClose} inline={inline}>
      <Modal.Header title="엑셀 다운로드 사유 입력" closeButton />
      <Modal.Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: FIELD_ROW_GAP }}>
          <Field label="다운로드 사유 선택" labelWidth={LABEL_WIDTH} required>
            <SelectBox
              fullWidth
              options={DOWNLOAD_REASONS}
              value={reason || undefined}
              onChange={setReason}
              placeholder="사유를 선택해주세요"
            />
          </Field>
          {reason === 'etc' && (
            <Field label="직접 입력" labelWidth={LABEL_WIDTH} required>
              <TextField
                fullWidth
                placeholder="다운로드 사유를 입력해주세요"
                value={etc}
                onChange={(e) => setEtc(e.target.value)}
              />
            </Field>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size="lg"
          variant="neutral"
          appearance="line"
          disabled={request.loading}
          onClick={onClose}
        >
          취소
        </Button>
        <Button size="lg" loading={request.loading} onClick={() => request.execute()}>
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// ── 사업자번호 변경 ──────────────────────────────────────
const BIZ_NO = /^\d{3}-\d{2}-\d{5}$/;

/** 사업자번호 변경 (sm). Check(형식 · 같은 번호 · 사유) → Confirm → 변경 → 닫고 완료 안내. 실패하면 입력 유지 */
function BizNoChangeModal({
  open,
  current,
  onChanged,
  onClose,
  inline,
}: {
  open: boolean;
  current: string;
  onChanged: (bizNo: string) => void;
  onClose: () => void;
  inline?: boolean;
}) {
  const [next, setNext] = useState('');
  const [reason, setReason] = useState('');

  const change = useAction({
    validate: () =>
      !BIZ_NO.test(next)
        ? '변경할 사업자번호를 000-00-00000 형식으로 입력해주세요.'
        : next === current
          ? '현재 사업자번호와 같습니다.'
          : !reason.trim()
            ? '변경 사유를 입력해주세요.'
            : null,
    confirm: () => `사업자번호를 ${current} → ${next}(으)로 변경할까요?`,
    confirmOptions: { confirmText: '변경' },
    run: async () => {
      await wait(600); // TODO(API) 사업자번호 변경
      if (next.startsWith('000')) throw new Error('duplicated'); // 예시: 실패 케이스
    },
    onSuccess: () => {
      onChanged(next);
      setNext('');
      setReason('');
      onClose();
    },
    success: '사업자번호가 변경되었습니다.',
    failure: '이미 등록된 사업자번호입니다. 번호를 확인해주세요.',
  });

  return (
    <Modal open={open} onClose={change.loading ? undefined : onClose} inline={inline}>
      <Modal.Header title="사업자번호 변경" closeButton />
      <Modal.Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: FIELD_ROW_GAP }}>
          <Field label="현재 사업자번호" labelWidth={LABEL_WIDTH}>
            <TextField fullWidth readOnly value={current} />
          </Field>
          <Field label="변경 사업자번호" labelWidth={LABEL_WIDTH} required>
            <TextField
              fullWidth
              placeholder="변경할 사업자번호를 입력해주세요"
              value={next}
              onChange={(e) => setNext(e.target.value)}
            />
          </Field>
          <Field label="변경 사유" labelWidth={LABEL_WIDTH} required>
            <TextField
              fullWidth
              placeholder="변경 사유를 입력해주세요"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Field>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size="lg"
          variant="neutral"
          appearance="line"
          disabled={change.loading}
          onClick={onClose}
        >
          취소
        </Button>
        <Button size="lg" loading={change.loading} onClick={() => change.execute()}>
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// ── 카드번호별 매입사 결제한도 설정 (xl 1280): 넓은 입력 표 ──────────────
const BIZ_GROUPS = [
  { value: 'general', label: '일반충전업종' },
  { value: 'game', label: '게임업종' },
  { value: 'voucher', label: '상품권업종' },
];
const CARD_COMPANIES = [
  'NH농협카드',
  '삼성카드',
  '신한카드',
  '현대카드',
  '하나카드',
  '롯데카드',
  '비씨카드',
  '국민카드',
  '우리카드',
];
const LIMIT_COLUMNS = [
  { key: 'dailyCount', label: '일 결제횟수', unit: '회' },
  { key: 'perAmount', label: '1회 결제금액', unit: '원' },
  { key: 'dailyAmount', label: '일 결제금액', unit: '원' },
  { key: 'monthlyAmount', label: '월 결제금액', unit: '원' },
] as const;
type LimitKey = (typeof LIMIT_COLUMNS)[number]['key'];
/** 업종 → 카드사 → 한도 (숫자만, 쉼표 없이 보관) */
type Limits = Record<string, Record<string, Partial<Record<LimitKey, string>>>>;

const withComma = (digits: string) => (digits ? Number(digits).toLocaleString('ko-KR') : '');

/** 카드번호별 매입사 결제한도 설정 (xl 1280). 업종 Tab마다 카드사 × 한도 입력 → [등록] */
function CardLimitModal({
  open,
  onClose,
  inline,
}: {
  open: boolean;
  onClose: () => void;
  inline?: boolean;
}) {
  const [group, setGroup] = useState(BIZ_GROUPS[0]!.value);
  const [limits, setLimits] = useState<Limits>({});
  const setLimit = (card: string, key: LimitKey, value: string) =>
    setLimits((all) => ({
      ...all,
      [group]: {
        ...all[group],
        [card]: { ...all[group]?.[card], [key]: value.replace(/\D/g, '') },
      },
    }));

  const register = useAction({
    validate: () =>
      Object.values(limits).every((cards) =>
        Object.values(cards).every((row) => Object.values(row).every((v) => !v)),
      )
        ? '결제한도를 입력해주세요.'
        : null,
    confirm: '입력한 결제한도를 등록할까요?',
    confirmOptions: { confirmText: '등록' },
    run: () => wait(600), // TODO(API) 결제한도 등록
    onSuccess: onClose,
    success: '결제한도가 등록되었습니다.',
  });

  return (
    <Modal open={open} onClose={register.loading ? undefined : onClose} inline={inline} size="xl">
      <Modal.Header title="카드번호별 매입사 결제한도 설정" closeButton />
      <Modal.Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: FIELD_ROW_GAP }}>
          <Tab variant="button" value={group} onChange={setGroup}>
            {BIZ_GROUPS.map((g) => (
              <Tab.Item key={g.value} value={g.value}>
                {g.label}
              </Tab.Item>
            ))}
          </Tab>
          <FormTable template="minmax(0, 1fr) repeat(4, minmax(0, 1.2fr))">
            <FormTable.Row>
              <FormTable.Head>카드사</FormTable.Head>
              {LIMIT_COLUMNS.map((c) => (
                <FormTable.Head key={c.key}>{c.label}</FormTable.Head>
              ))}
            </FormTable.Row>
            {CARD_COMPANIES.map((card) => (
              <FormTable.Row key={card}>
                <FormTable.Cell center>{card}</FormTable.Cell>
                {LIMIT_COLUMNS.map((c) => (
                  <FormTable.Cell key={c.key}>
                    <TextField
                      fullWidth
                      style={{ flex: 1 }}
                      inputMode="numeric"
                      aria-label={`${card} ${c.label}`}
                      value={withComma(limits[group]?.[card]?.[c.key] ?? '')}
                      onChange={(e) => setLimit(card, c.key, e.target.value)}
                    />
                    <span>{c.unit}</span>
                  </FormTable.Cell>
                ))}
              </FormTable.Row>
            ))}
          </FormTable>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size="lg"
          variant="neutral"
          appearance="line"
          disabled={register.loading}
          onClick={onClose}
        >
          취소
        </Button>
        <Button size="lg" loading={register.loading} onClick={() => register.execute()}>
          등록
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

/** 호출 화면: [엑셀 다운로드] → 사유 입력 · 사업자번호 [수정] → 변경 팝업. 결과는 Alert (Toast 없음) */
export const ActionFeedback: Story = {
  parameters: {
    controls: { disable: true },
    tempWork:
      '호출 화면 구성 · 다운로드 사유 선택지 · 검증 문구 · 실패 예시(000으로 시작하는 번호)',
  },
  render: function Render() {
    const [downloadOpen, setDownloadOpen] = useState(false);
    const [bizOpen, setBizOpen] = useState(false);
    const [bizNo, setBizNo] = useState('123-45-67890');
    const [limitOpen, setLimitOpen] = useState(false);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          padding: '20px 24px',
          minHeight: '100vh',
          background: 'var(--kp-color-bg-page)',
        }}
      >
        <PageLayout.Title
          title="가맹점 기본/계약 정보 관리"
          actions={
            <>
              <Button variant="neutral" appearance="line" onClick={() => setDownloadOpen(true)}>
                엑셀 다운로드
              </Button>
              <Button variant="neutral" appearance="line" onClick={() => setLimitOpen(true)}>
                결제한도 설정
              </Button>
            </>
          }
        />
        <FormSection>
          <FormGroup>
            <SectionHeading title="기본 정보" />
            <FormTable>
              <FormTable.Row>
                <FormTable.Label required>사업자번호</FormTable.Label>
                <FormTable.Cell colSpan={3}>
                  <TextField fullWidth readOnly value={bizNo} style={{ flex: 1 }} />
                  <Button variant="neutral" appearance="line" onClick={() => setBizOpen(true)}>
                    수정
                  </Button>
                </FormTable.Cell>
                <FormTable.Label>상호</FormTable.Label>
                <FormTable.Cell colSpan={3}>(주)ABC커머스</FormTable.Cell>
              </FormTable.Row>
            </FormTable>
          </FormGroup>
        </FormSection>
        <DownloadReasonModal open={downloadOpen} onClose={() => setDownloadOpen(false)} />
        <BizNoChangeModal
          open={bizOpen}
          current={bizNo}
          onChanged={setBizNo}
          onClose={() => setBizOpen(false)}
        />
        <CardLimitModal open={limitOpen} onClose={() => setLimitOpen(false)} />
      </div>
    );
  },
};

/** 엑셀 다운로드 사유 입력 (sm 400) */
export const DownloadReason: Story = {
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => <DownloadReasonModal open inline onClose={() => {}} />,
};

/** 사업자번호 변경 (sm 400) */
export const BizNoChange: Story = {
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => (
    <BizNoChangeModal open inline current="123-45-67890" onChanged={() => {}} onClose={() => {}} />
  ),
};

/** 카드번호별 매입사 결제한도 설정 (xl 1280): 업종 Tab + 카드사 × 한도 입력 표 */
export const CardLimit: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'padded',
    tempWork: '한도 입력 검증 · 등록 확인 문구 · 업종 · 카드사 목록(시안 값)',
  },
  render: () => <CardLimitModal open inline onClose={() => {}} />,
};
