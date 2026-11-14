import {
  // 팝업 틀 · 버튼
  Modal,
  Button,
  // 상세 정보 (P02 부품)
  DetailCard,
  DetailSummary,
  GridPlaceholder,
  // 입력 컨트롤
  TextField,
  Radio,
  RadioGroup,
  // 처리 흐름 (P04)
  useAction,
} from '@kiwoompay/design-system';
import { useState } from 'react';
import { formatNumber, formatWon } from '@/utils/format';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// (임의 작업) 취소유형 값 · 거래 예시 — TODO(API) 거래 · 취소 내역 조회, 부분취소 요청
const CANCEL_TYPES = [
  { value: 'normal', label: '일반취소' },
  { value: 'offset', label: '상계취소' },
  { value: 'force', label: '강제취소' },
  { value: 'issuer', label: '카드사직권취소' },
];

interface CancelRow {
  id: string;
  canceledAt: string;
  amount: number;
  type: string;
  status: string;
}

/** 내역 표 4칸 같은 폭 (본문 폭 580 ÷ 4) */
const CANCEL_COLUMN_WIDTH = 145;

const nowText = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};

/**
 * P04 부분취소 요청 팝업 템플릿 (Figma KWPC04010111, md 620 — Figma 720).
 * Check(금액 · 사유) → Confirm → 요청 → 완료 안내 + 취소내역 반영(팝업 유지). 임의 작업: 검증 · 확인 · 완료 문구, 처리상태 "요청"
 */
export function P04PartialCancelModal({
  open,
  onClose,
  total = 100,
}: {
  open: boolean;
  onClose: () => void;
  /** 거래의 취소가능금액 */
  total?: number;
}) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('normal');
  const [reason, setReason] = useState('');
  const [history, setHistory] = useState<CancelRow[]>([]);

  const canceled = history.reduce((sum, row) => sum + row.amount, 0);
  const remaining = total - canceled;
  const value = Number(amount.replace(/,/g, '')) || 0;

  const request = useAction({
    validate: () =>
      value <= 0
        ? '취소요청금액을 입력해주세요.'
        : value > remaining
          ? `취소요청금액은 잔여 취소가능금액(${formatWon(remaining)}) 이하로 입력해주세요.`
          : !reason.trim()
            ? '취소사유를 입력해주세요.'
            : null,
    confirm: () => `${formatWon(value)}을 부분취소 요청할까요?`,
    confirmOptions: { confirmText: '부분취소 요청' },
    run: () => wait(500), // TODO(API) 부분취소 요청
    onSuccess: () => {
      // 결과는 팝업 안 취소내역에 반영 (다시 요청할 수 있게 닫지 않음)
      setHistory((rows) => [
        ...rows,
        {
          id: String(rows.length + 1),
          canceledAt: nowText(),
          amount: value,
          type: CANCEL_TYPES.find((t) => t.value === type)?.label ?? type,
          status: '요청',
        },
      ]);
      setAmount('');
      setReason('');
    },
    success: '부분취소를 요청했습니다.',
  });

  return (
    <Modal open={open} onClose={request.loading ? undefined : onClose} size="md">
      <Modal.Header title="부분취소 요청" closeButton />
      <Modal.Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <DetailCard
            title="거래정보"
            labelGap={20}
            items={[
              { label: '거래번호', value: 'ATS26060114533091437' },
              { label: '취소가능금액', value: formatWon(total) },
            ]}
          />
          <DetailCard
            plain
            form
            columns={1}
            title="취소 요청정보"
            items={[
              {
                label: '취소요청금액',
                value: (
                  <TextField
                    fullWidth
                    inputMode="numeric"
                    placeholder="취소요청금액 입력"
                    value={amount}
                    disabled={remaining <= 0}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '');
                      setAmount(digits ? formatNumber(Number(digits)) : '');
                    }}
                    aria-label="취소요청금액"
                  />
                ),
              },
              {
                label: '취소유형',
                value: (
                  <RadioGroup direction="horizontal" value={type} onChange={setType}>
                    {CANCEL_TYPES.map((t) => (
                      <Radio key={t.value} value={t.value} label={t.label} />
                    ))}
                  </RadioGroup>
                ),
              },
              {
                label: '취소사유',
                value: (
                  <TextField
                    fullWidth
                    placeholder="취소사유 입력"
                    value={reason}
                    disabled={remaining <= 0}
                    onChange={(e) => setReason(e.target.value)}
                    aria-label="취소사유"
                  />
                ),
              },
            ]}
          />
          <DetailCard plain title="취소내역">
            <DetailSummary
              items={[
                { label: '누적 취소금액', value: formatWon(canceled) },
                { label: '잔여 취소가능금액', value: formatWon(remaining) },
              ]}
            />
            {/* TODO(IBSheet) 취소 내역 그리드 */}
            <GridPlaceholder<CancelRow>
              columns={[
                {
                  key: 'canceledAt',
                  header: '취소일시',
                  align: 'center',
                  width: CANCEL_COLUMN_WIDTH,
                },
                {
                  key: 'amount',
                  header: '취소금액',
                  align: 'center',
                  width: CANCEL_COLUMN_WIDTH,
                  render: (row) => formatWon(row.amount),
                },
                { key: 'type', header: '취소유형', align: 'center', width: CANCEL_COLUMN_WIDTH },
                { key: 'status', header: '처리상태', align: 'center', width: CANCEL_COLUMN_WIDTH },
              ]}
              rows={history}
              rowKey={(row) => row.id}
              empty="취소 건이 없습니다."
            />
          </DetailCard>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size="lg"
          loading={request.loading}
          disabled={remaining <= 0}
          onClick={() => request.execute()}
        >
          부분취소 요청
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
