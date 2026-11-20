import { Badge } from '@kiwoompay/design-system';
import { IB_CELL, type IbsheetColumn } from '@kiwoompay/design-system/ibsheet';
import type { ReactNode } from 'react';
import type { SettlementLedger } from '@/features/settlement/merchantSettlement.types';
import { formatNumber } from '@/utils/format';
import type { LedgerDetailTab } from './detail/LedgerDetailModal';
import { LEDGER_STATUS_TONE } from './ledgerStatus';

export interface LedgerColumnHandlers {
  /** 일반 원장 상세 팝업 (거래건수 · 취소건수 → 정산대상 거래 건 탭) */
  onOpenDetail: (row: SettlementLedger, tab?: LedgerDetailTab) => void;
  /** 원천원장 ID → 그 원장 상세 */
  onOpenSource: (ledgerId: string) => void;
  /** 아직 없는 화면 · 팝업 (조정 원장 상세 · CPID 정산 상세 · 상계그룹 ID 관리) */
  onNotReady: (name: string) => void;
}

/** 조정 원장 — 체크박스 · 일괄 처리 대상에서 제외, 원천 거래 금액 없음 (화면설계서 KWPC06010202 ②) */
export const isAdjustLedger = (row: SettlementLedger) => row.type === '조정';

/**
 * 지급예정일 칸 편집 — 수정 가능 상태에서만 (화면설계서 ③ "확정 · 마감 제한").
 * (임의 작업) TODO(정책) 수정 가능 상태 · 권한 기준 — 지금은 조정 원장 · 지급완료 · 지급실패 제외
 */
const canEditPayDate = (row: SettlementLedger) =>
  !isAdjustLedger(row) && row.status !== '지급완료' && row.status !== '지급실패';
/** 정산담당자 · 처리메모 칸 편집 (Figma 머리 연필) — (임의 작업) TODO(정책) 지급완료만 제외 */
const canEditNote = (row: SettlementLedger) => row.status !== '지급완료';

/** 링크 칸 (IBSheet 링크 모양: Primary + 밑줄, Figma 글자 13 Regular) — 누르면 IbsheetGrid가 onClick을 부른다 */
const link = (text: ReactNode, onClick: () => void) => (
  <span
    className={IB_CELL.link}
    role="link"
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
  >
    {text}
  </span>
);

const dash = '-';
const num = (n: number | null) => (n === null ? dash : formatNumber(n));
/** 연결상계 · 조정 금액 — 양수에 + (Figma +200,000) */
const signed = (n: number | null) => (n === null ? dash : `${n > 0 ? '+' : ''}${formatNumber(n)}`);
const text = (s: string | null) => s ?? dash;

const AMOUNT = 118;

/**
 * 정산원장 표 37열 (Figma 조회결과 29711:135279 폭 · 정렬, 화면설계서 KWPC06010202 링크 규칙).
 * 머리 필터는 IbsheetGrid filterable, 편집 열(지급예정일 · 정산담당자 · 처리메모)은 edit.
 */
export const createLedgerColumns = ({
  onOpenDetail,
  onOpenSource,
  onNotReady,
}: LedgerColumnHandlers): IbsheetColumn<SettlementLedger>[] => [
  {
    key: 'status',
    header: '정산상태',
    width: 93,
    // 상태 칸은 링크 아님 (화면설계서 ①)
    render: (row) => (
      <Badge size="sm" tone={LEDGER_STATUS_TONE[row.status]}>
        {row.status}
      </Badge>
    ),
  },
  { key: 'type', header: '정산구분', width: 89 },
  {
    key: 'ledgerId',
    header: '정산원장 ID',
    width: 140,
    // 일반 ID → 원장 상세, 조정 ID → 조정 원장 상세 (화면설계서 ②)
    render: (row) =>
      link(row.ledgerId, () =>
        isAdjustLedger(row) ? onNotReady('조정 원장 상세') : onOpenDetail(row),
      ),
  },
  {
    key: 'sourceLedgerId',
    header: '원천원장 ID',
    width: 140,
    render: (row) =>
      row.sourceLedgerId ? link(row.sourceLedgerId, () => onOpenSource(row.sourceLedgerId!)) : dash,
  },
  { key: 'closedAt', header: '마감일시', width: 155 },
  {
    key: 'payDate',
    header: '지급예정일',
    width: 120,
    edit: { type: 'date', value: (row) => row.payDate, canEdit: canEditPayDate },
  },
  {
    key: 'cpid',
    header: 'CPID',
    width: 120,
    // CPID → CPID 정산 상세 팝업 (화면설계서 ④, CPID_DETAIL_MODAL) — TODO(시안) 팝업 없음
    render: (row) => link(row.cpid, () => onNotReady('CPID 정산 상세')),
  },
  { key: 'merchantName', header: '가맹점명', width: 120 },
  { key: 'bizNo', header: '사업자번호', width: 120 },
  { key: 'payMethod', header: '결제수단', width: 90 },
  { key: 'cycle', header: '정산주기', width: 90 },
  { key: 'period', header: '정산기간', width: 180, render: (row) => text(row.period) },
  {
    key: 'txCount',
    header: '정산대상\n거래건수',
    width: 90,
    align: 'right',
    // 원천 거래건수만 (조정 · 상계행 제외) → 원장 상세 정산대상 거래 건 탭 (화면설계서 ⑤)
    render: (row) =>
      row.txCount === null ? dash : link(num(row.txCount), () => onOpenDetail(row, 'tx')),
  },
  {
    key: 'cancelCount',
    header: '취소건수',
    width: 90,
    align: 'right',
    // 취소 거래 → 원장 상세 정산대상 거래 건 탭. 0건은 글자만 (화면설계서 ⑥) — TODO(정책) 취소 필터 적용
    render: (row) =>
      row.cancelCount === null
        ? dash
        : row.cancelCount === 0
          ? '0'
          : link(num(row.cancelCount), () => onOpenDetail(row, 'tx')),
  },
  {
    key: 'approveAmount',
    header: '승인금액',
    width: AMOUNT,
    align: 'right',
    render: (r) => num(r.approveAmount),
  },
  {
    key: 'cancelAmount',
    header: '취소금액',
    width: AMOUNT,
    align: 'right',
    render: (r) => num(r.cancelAmount),
  },
  {
    key: 'receiveAmount',
    header: '수납금액',
    width: AMOUNT,
    align: 'right',
    render: (r) => num(r.receiveAmount),
  },
  {
    key: 'reserveAmount',
    header: '유보금액',
    width: AMOUNT,
    align: 'right',
    render: (r) => num(r.reserveAmount),
  },
  {
    key: 'targetAmount',
    header: '정산대상 금액',
    width: AMOUNT,
    align: 'right',
    render: (r) => num(r.targetAmount),
  },
  {
    key: 'diffAmount',
    header: '차액정산\n대상금액',
    width: AMOUNT,
    align: 'right',
    render: (r) => num(r.diffAmount),
  },
  {
    key: 'feeRate',
    header: '수수료율',
    width: AMOUNT,
    align: 'right',
    render: (r) => (r.feeRate === null ? dash : r.feeRate.toFixed(2)),
  },
  { key: 'fee', header: '수수료', width: AMOUNT, align: 'right', render: (r) => num(r.fee) },
  { key: 'vat', header: '부가세', width: AMOUNT, align: 'right', render: (r) => num(r.vat) },
  // 조정 원장 금액은 조정행에만 (화면설계서 하단 금액 집계 기준)
  {
    key: 'adjustAmount',
    header: '조정원장 금액',
    width: AMOUNT,
    align: 'right',
    render: (r) => signed(r.adjustAmount),
  },
  {
    key: 'offsetGroupId',
    header: '상계그룹 ID',
    width: 150,
    // 상계그룹 ID → 정산 정책 관리 > 상계그룹 ID 관리 · 기본정보 (화면설계서 기타 링크) — 화면 없음
    render: (row) =>
      row.offsetGroupId ? link(row.offsetGroupId, () => onNotReady('상계그룹 ID 관리')) : dash,
  },
  {
    key: 'linkedOffsetAmount',
    header: '연결상계 금액',
    width: AMOUNT,
    align: 'right',
    render: (r) => signed(r.linkedOffsetAmount),
  },
  {
    key: 'holdAmount',
    header: '보류금액',
    width: AMOUNT,
    align: 'right',
    render: (r) => num(r.holdAmount),
  },
  {
    key: 'finalPayAmount',
    header: '최종지급\n예정금액',
    width: AMOUNT,
    align: 'right',
    render: (r) => num(r.finalPayAmount),
  },
  {
    key: 'costFee',
    header: '원가 수수료',
    width: AMOUNT,
    align: 'right',
    render: (r) => num(r.costFee),
  },
  {
    key: 'costVat',
    header: '원가 부가세',
    width: AMOUNT,
    align: 'right',
    render: (r) => num(r.costVat),
  },
  {
    key: 'profit',
    header: '이익금액',
    width: AMOUNT,
    align: 'right',
    render: (r) => num(r.profit),
  },
  { key: 'payBank', header: '지급은행', width: 89, render: (r) => text(r.payBank) },
  { key: 'accountHolder', header: '예금주', width: 78, render: (r) => text(r.accountHolder) },
  { key: 'reason', header: '처리사유', width: 200, align: 'left' },
  {
    key: 'manager',
    header: '정산담당자',
    width: 120,
    edit: { type: 'text', value: (row) => row.manager, canEdit: canEditNote },
  },
  {
    key: 'memo',
    header: '처리메모',
    width: 220,
    align: 'left',
    edit: { type: 'text', value: (row) => row.memo, canEdit: canEditNote },
  },
  { key: 'lastProcessedAt', header: '최종처리일시', width: 132 },
];
