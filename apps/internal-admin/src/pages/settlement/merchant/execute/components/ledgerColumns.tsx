import { Badge, type BadgeTone, type GridPlaceholderColumn } from '@kiwoompay/design-system';
import type { LedgerStatus, SettlementLedger } from '@/types/settlement/merchantSettlement';

const STATUS_TONE: Record<LedgerStatus, BadgeTone> = {
  '조치 필요': 'error',
  검증대기: 'info',
  지급대기: 'primary',
  지급보류: 'warning',
  지급완료: 'success',
  지급실패: 'error',
};

const dash = (value: string | number | null) =>
  value === null ? '-' : typeof value === 'number' ? value.toLocaleString('ko-KR') : value;

/**
 * 정산원장 Grid 열 (Figma KWPC06010201 조회결과). IBSheet8 연결 시 같은 순서 · 폭으로 Cols를 만든다.
 * TODO(IBSheet) 원장 ID · CPID · 거래건수 링크 이동, 열 필터, 지급예정일 편집은 IBSheet 설정으로 처리
 */
export const ledgerColumns: GridPlaceholderColumn<SettlementLedger>[] = [
  {
    key: 'status',
    header: '정산상태',
    width: 93,
    render: (row) => (
      <Badge size="sm" tone={STATUS_TONE[row.status]}>
        {row.status}
      </Badge>
    ),
  },
  { key: 'type', header: '정산구분', width: 89 },
  { key: 'ledgerId', header: '정산원장 ID', width: 140 },
  {
    key: 'sourceLedgerId',
    header: '원천원장 ID',
    width: 140,
    render: (row) => dash(row.sourceLedgerId),
  },
  { key: 'closedAt', header: '마감일시', width: 155 },
  { key: 'payDate', header: '지급예정일', width: 120 },
  { key: 'cpid', header: 'CPID', width: 120 },
  { key: 'merchantName', header: '가맹점명', width: 120 },
  { key: 'bizNo', header: '사업자번호', width: 120 },
  { key: 'payMethod', header: '결제수단', width: 90 },
  { key: 'cycle', header: '정산주기', width: 90 },
  { key: 'period', header: '정산기간', width: 180, render: (row) => dash(row.period) },
  { key: 'txCount', header: '정산대상 거래건수', width: 118, render: (row) => dash(row.txCount) },
];
