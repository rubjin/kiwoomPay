import { DateField, Field, SelectBox, TextArea } from '@kiwoompay/design-system';
import { useRef, useState } from 'react';
import { requestLedgerAction } from '@/api/settlement/merchantSettlement';
import { useCodeOptions } from '@/hooks/useCodeOptions';
import { LedgerActionModal } from './LedgerActionModal';
import { amountColumn, LEDGER_ID_COLUMN, MERCHANT_COLUMN, TwoLines } from './ledgerActionColumns';
import { sumOf, won, type LedgerActionRow } from './ledgerActionRows';

export interface LedgerActionProps {
  open: boolean;
  rows: LedgerActionRow[];
  onClose: () => void;
  /** 처리 후 재조회 */
  onDone: () => Promise<void>;
}

export interface PayDateChangeModalProps extends LedgerActionProps {
  /** [변경 예정 적용] 후 — 적용한 원장 · 변경 지급일 (저장·재산출 팝업으로 이어짐) */
  onApplied?: (rows: LedgerActionRow[], payDate: string) => void;
}

/** 지급예정일 일괄 변경 (시안 처리_실행 팝업.png 왼쪽) — 변경 예정만 반영, 저장·재산출은 다음 팝업 */
export function PayDateChangeModal({
  open,
  rows,
  onClose,
  onDone,
  onApplied,
}: PayDateChangeModalProps) {
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const applied = useRef<LedgerActionRow[]>([]);
  return (
    <LedgerActionModal
      open={open}
      title="지급예정일 일괄 변경"
      rows={rows}
      onClose={onClose}
      onDone={async () => {
        await onDone();
        onApplied?.(applied.current, date);
      }}
      submitLabel="변경 예정 적용"
      successMessage="변경 예정이 적용되었습니다. 저장·재산출을 진행해주세요."
      columns={[
        LEDGER_ID_COLUMN('정산원장 ID'),
        MERCHANT_COLUMN,
        {
          key: 'pay',
          header: '결제수단 / 주기',
          align: 'left',
          render: (r) => <TwoLines top={r.payMethod} bottom={r.cycle} />,
        },
        { key: 'payDate', header: '현재 지급예정일', width: 96 },
        amountColumn('amount', '지급예정금액(원)', (r) => r.amount),
      ]}
      summary={(list) => [
        { label: '선택한 일반 정산원장', value: list.length },
        { label: '합계', value: sumOf(list, (r) => r.amount), unit: '원' },
      ]}
      notices={[
        '변경일 · 사유는 공통 적용합니다.',
        '저장 시 원장별 권한 · 상태 · 도착 원장 및 연결 내역을 검증합니다.',
        '[제외]를 누르면 해당 원장을 이번 처리 대상에서 뺍니다.',
      ]}
      footerNotices={[
        '[변경 예정 적용]은 임시 변경값만 반영합니다.',
        '임시 변경 완료 후 또는 원장 재산출 팝업에서 [저장 후 재산출] 버튼 클릭 시 원장별 처리 결과와 실패 사유를 확인합니다.',
        '연결 조정·보류 내역은 자동 이동하지 않으며 영향 내역을 확인합니다.',
      ]}
      validate={() =>
        !date
          ? '변경 지급예정일을 입력해주세요.'
          : !reason.trim()
            ? '변경사유를 입력해주세요.'
            : null
      }
      run={async (list) => {
        applied.current = list;
        return requestLedgerAction(
          '지급예정일 일괄 변경',
          list.map((r) => r.ledgerId),
        );
      }}
    >
      <Field label="변경 지급예정일" required>
        <DateField value={date} onChange={setDate} />
      </Field>
      <Field label="변경사유" required labelPosition="top">
        <TextArea
          fullWidth
          rows={3}
          placeholder="지급예정일 변경에 대한 처리메모를 입력해주세요"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Field>
    </LedgerActionModal>
  );
}

/** 지급보류 (시안 가운데) — 각 원장의 현재 지급가능액 전체를 보류 */
export function PayHoldModal({ open, rows, onClose, onDone }: LedgerActionProps) {
  const reasons = useCodeOptions('PAY_HOLD_REASON');
  const [reasonCode, setReasonCode] = useState('');
  const [detail, setDetail] = useState('');
  return (
    <LedgerActionModal
      open={open}
      title="지급보류"
      rows={rows}
      onClose={onClose}
      onDone={onDone}
      submitLabel="검증 후 보류"
      columns={[
        LEDGER_ID_COLUMN(),
        MERCHANT_COLUMN,
        amountColumn('heldAmount', '기존 보류액', (r) => r.heldAmount),
        amountColumn('newHold', '신규 보류액', (r) => r.amount),
        amountColumn('afterPay', '처리 후 지급가능액', () => 0),
      ]}
      summary={(list) => [
        { label: '선택한 일반 정산원장', value: list.length },
        { label: '신규 보류 합계', value: sumOf(list, (r) => r.amount), unit: '원' },
      ]}
      notices={[
        '금액 단위: 원 · 각 원장의 현재 지급가능액 전체를 보류합니다.',
        '보류사유·상세 사유는 선택 원장에 공통 적용합니다.',
        '기존 보류액·한도 차감액은 다시 차감하지 않습니다.',
        '[제외]를 누르면 해당 원장을 이번 처리 대상에서 뺍니다.',
      ]}
      validate={() =>
        !reasonCode
          ? '보류사유를 선택해주세요.'
          : !detail.trim()
            ? '상세 보류사유를 입력해주세요.'
            : null
      }
      run={(list) =>
        requestLedgerAction(
          '지급보류',
          list.map((r) => r.ledgerId),
        )
      }
    >
      <Field label="보류사유" required>
        <SelectBox
          fullWidth
          options={reasons}
          placeholder="보류사유를 선택해주세요"
          value={reasonCode}
          onChange={setReasonCode}
        />
      </Field>
      <Field label="상세 보류사유" required labelPosition="top">
        <TextArea
          fullWidth
          rows={3}
          placeholder="지급보류 사유를 입력해주세요"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />
      </Field>
    </LedgerActionModal>
  );
}

/** 보류 해제 (시안 오른쪽) — 해제 가능 / 불가를 나눠 보여 주고, 불가 원장이 남아 있으면 막는다 */
export function HoldReleaseModal({ open, rows, onClose, onDone }: LedgerActionProps) {
  const [reason, setReason] = useState('');
  return (
    <LedgerActionModal
      open={open}
      title="보류 해제"
      rows={rows}
      onClose={onClose}
      onDone={onDone}
      submitLabel="검증 후 해제"
      columns={[
        LEDGER_ID_COLUMN(),
        MERCHANT_COLUMN,
        {
          key: 'hold',
          header: '보류사유 / 보류금액(원)',
          align: 'left',
          render: (r) => <TwoLines top={r.holdReason} bottom={won(r.heldAmount || r.amount)} />,
        },
        {
          key: 'judge',
          header: '해제 판정',
          width: 76,
          render: (r) => (r.releasable ? '해제 가능' : '해제 불가'),
        },
        { key: 'releaseNote', header: '확인 내용', align: 'left' },
      ]}
      summary={(list) => [
        { label: '선택한 보류 원장', value: list.length },
        { label: '보류금액', value: sumOf(list, (r) => r.heldAmount || r.amount), unit: '원' },
      ]}
      stats={(list) => {
        const ok = list.filter((r) => r.releasable);
        const ng = list.filter((r) => !r.releasable);
        const held = (part: LedgerActionRow[]) => sumOf(part, (r) => r.heldAmount || r.amount);
        return [
          { label: '해제 가능', values: [{ value: ok.length }, { value: held(ok), unit: '원' }] },
          { label: '해제 불가', values: [{ value: ng.length }, { value: held(ng), unit: '원' }] },
        ];
      }}
      notices={[
        '해제 불가 원장은 보류사유를 먼저 해소해주세요.',
        '표시 금액은 보류잔액이며 실제 지급금액은 재정산 후 결정됩니다.',
        '[제외]를 누르면 해당 원장을 이번 처리 대상에서 뺍니다.',
      ]}
      footerNotices={[
        '해제 후 재정산과 담당자 검증을 거쳐 별도로 지급확정합니다.',
        '보류 해제만으로 이체가 진행되지는 않습니다.',
      ]}
      validate={(list) =>
        list.some((r) => !r.releasable)
          ? '해제 불가 원장이 있습니다. [제외]로 빼거나 보류사유를 먼저 해소해주세요.'
          : !reason.trim()
            ? '해제사유를 입력해주세요.'
            : null
      }
      run={(list) =>
        requestLedgerAction(
          '보류 해제',
          list.map((r) => r.ledgerId),
        )
      }
    >
      <Field label="해제사유" required labelPosition="top">
        <TextArea
          fullWidth
          rows={3}
          placeholder="해제 대상 원장에 공통으로 적용할 사유와 확인 근거를 입력해주세요"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Field>
    </LedgerActionModal>
  );
}
