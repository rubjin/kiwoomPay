import type { SettlementLedger } from '@/types/settlement/merchantSettlement';

/**
 * 일괄 처리 팝업 대상 줄 = 정산원장 + 금액 · 보류 정보.
 * TODO(API) 원장 목록 응답에 금액 · 보류 정보가 없어 지금은 거래건수로 예시 금액을 만든다 (시안 값 6,800,000 등과 비슷한 크기)
 */
export interface LedgerActionRow extends SettlementLedger {
  /** 지급예정금액 */
  amount: number;
  /** 기존 보류액 */
  heldAmount: number;
  /** 보류 사유 (보류 해제 대상) */
  holdReason: string;
  /** 보류 해제 가능 여부 · 확인 내용 */
  releasable: boolean;
  releaseNote: string;
}

const HOLD_CASES = [
  { holdReason: '한도초과', releasable: true, releaseNote: '한도 증액 확인 완료' },
  { holdReason: '수동 보류', releasable: true, releaseNote: '수동 보류 종료 확인' },
  { holdReason: 'AML 미이행', releasable: false, releaseNote: 'AML 이행 확인 필요' },
];

export function toActionRows(ledgers: SettlementLedger[]): LedgerActionRow[] {
  return ledgers.map((l, i) => {
    const hold = HOLD_CASES[i % HOLD_CASES.length]!;
    return {
      ...l,
      amount: (l.txCount ?? 100) * 5_000,
      heldAmount: [900_000, 0, 200_000][i % 3]!,
      ...hold,
    };
  });
}

export const sumOf = (rows: LedgerActionRow[], pick: (r: LedgerActionRow) => number) =>
  rows.reduce((total, r) => total + pick(r), 0);
