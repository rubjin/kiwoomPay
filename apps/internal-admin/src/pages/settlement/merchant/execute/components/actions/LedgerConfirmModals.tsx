import { Infobox } from '@kiwoompay/design-system';
import { requestLedgerAction } from '@/api/settlement/merchantSettlement';
import { LedgerActionModal } from './LedgerActionModal';
import { amountColumn, LEDGER_ID_COLUMN, MERCHANT_COLUMN } from './ledgerActionColumns';
import { sumOf } from './ledgerActionRows';
import type { LedgerActionProps } from './LedgerActionModals';

const ids = (rows: { ledgerId: string }[]) => rows.map((r) => r.ledgerId);

/** 원장 지급확정 (시안 처리_실행 팝업2.png 왼쪽, KWPC06010207) — 입력 없이 확인만 */
export function PayConfirmModal({ open, rows, onClose, onDone }: LedgerActionProps) {
  return (
    <LedgerActionModal
      open={open}
      title="원장 지급확정"
      rows={rows}
      onClose={onClose}
      onDone={onDone}
      submitLabel="지급확정"
      summaryVariant="question"
      summary={(list) => [
        { label: '선택한 일반 원장', value: list.length, unit: '건의 지급을 확정하시겠습니까?' },
      ]}
      columns={[
        LEDGER_ID_COLUMN(),
        MERCHANT_COLUMN,
        { key: 'payDate', header: '지급예정일', width: 96 },
        amountColumn('amount', '확정 대상금액(원)', (r) => r.amount),
        // TODO(API) 원장별 검증 결과 (지금은 모두 검증 완료)
        { key: 'verify', header: '검증 결과', width: 80, render: () => '검증 완료' },
      ]}
      total={(list) => ({ label: '지급확정 대상금액 합계', value: sumOf(list, (r) => r.amount) })}
      notices={[
        '조정·상계·보류가 반영된 금액을 다시 검증하고 확정합니다.',
        '확정 후 지급대기로 전환되며, 실제 이체는 별도 절차입니다.',
        '[제외]를 누르면 해당 원장을 이번 처리 대상에서 뺍니다.',
      ]}
      run={(list) => requestLedgerAction('지급확정', ids(list))}
    />
  );
}

/** 선택 원장 재산출 (시안 가운데, KWPC06010208) — 현재 설정값 기준 재계산 · 안내 상자 2개 */
export function RecalcModal({ open, rows, onClose, onDone }: LedgerActionProps) {
  return (
    <LedgerActionModal
      open={open}
      title="선택 원장 재산출"
      rows={rows}
      onClose={onClose}
      onDone={onDone}
      submitLabel="재산출"
      summaryVariant="question"
      summary={(list) => [
        { label: '선택한 일반 원장', value: list.length, unit: '건을 다시 계산하시겠습니까?' },
      ]}
      columns={[
        LEDGER_ID_COLUMN(),
        MERCHANT_COLUMN,
        { key: 'payDate', header: '지급예정일', width: 96 },
        amountColumn('amount', '지급예정금액(원)', (r) => r.amount),
        { key: 'target', header: '처리 대상', width: 80, render: () => '재산출 대상' },
      ]}
      notices={
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--kp-space-12)' }}>
          <Infobox>
            <Infobox.Item
              title="현재 설정값 기준 재계산"
              bullets={[
                '거래·수수료·한도·상계·보류·연결 조정 재검증',
                '원장별 결과와 실행이력을 갱신합니다.',
              ]}
            />
          </Infobox>
          <Infobox tone="neutral">
            <Infobox.Item
              bullets={[
                '지급일 변경 저장과 별개인 재계산입니다. 지급확정은 별도입니다.',
                '[제외]를 누르면 해당 원장을 이번 처리 대상에서 뺍니다.',
              ]}
            />
          </Infobox>
        </div>
      }
      run={(list) => requestLedgerAction('선택 원장 재산출', ids(list))}
    />
  );
}

export interface PayDateSaveModalProps extends LedgerActionProps {
  /** 지급예정일 일괄 변경에서 적용한 변경 지급일 */
  newPayDate: string;
}

/**
 * 지급예정일 변경 저장·재산출 (시안 오른쪽) — 지급예정일 일괄 변경 [변경 예정 적용] 다음 단계.
 * 시트(IA)에 화면ID 없음 → 화면 목록은 KWPC06010204 아래
 */
export function PayDateSaveModal({
  open,
  rows,
  newPayDate,
  onClose,
  onDone,
}: PayDateSaveModalProps) {
  return (
    <LedgerActionModal
      open={open}
      title="지급예정일 변경 저장·재산출"
      rows={rows}
      onClose={onClose}
      onDone={onDone}
      submitLabel="저장 후 재산출"
      summaryVariant="question"
      summary={(list) => [
        { label: '선택 원장', value: list.length, unit: '건의 지급일 변경을 저장하시겠습니까?' },
      ]}
      columns={[
        LEDGER_ID_COLUMN(),
        { key: 'cpid', header: 'CPID', width: 100 },
        { key: 'payDate', header: '기존 지급일', width: 96 },
        { key: 'newPayDate', header: '변경 지급일', width: 96, render: () => newPayDate },
        amountColumn('amount', '대상금액(원)', (r) => r.amount),
      ]}
      total={(list) => ({ label: '변경 대상금액 합계', value: sumOf(list, (r) => r.amount) })}
      notices={[
        '저장 후 출발·도착 원장을 재산출하고 변경이력을 남깁니다.',
        '연결 조정·보류 내역은 자동 이동하지 않으며 영향을 검증합니다.',
        '[제외]를 누르면 해당 원장을 이번 처리 대상에서 뺍니다.',
      ]}
      run={(list) => requestLedgerAction('지급예정일 변경 저장·재산출', ids(list))}
    />
  );
}
