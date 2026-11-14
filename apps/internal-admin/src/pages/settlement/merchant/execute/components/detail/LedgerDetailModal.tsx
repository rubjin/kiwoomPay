import {
  ActionStats,
  Badge,
  Button,
  ControlGroup,
  FormTable,
  GridPlaceholder,
  Icon,
  Modal,
  Pagination,
  ResultFooter,
  SectionHeading,
  StatusView,
  Tab,
  TextButton,
  TextField,
  TextLink,
  useAction,
  useDialog,
  type GridPlaceholderColumn,
  Stack,
} from '@kiwoompay/design-system';
import { Fragment, useEffect, useState } from 'react';
import { fetchLedgerDetail, fetchLedgerTxs, saveLedgerNotes } from '@/api/settlement/ledgerDetail';
import type { LedgerBasisItem, LedgerDetail, LedgerTx } from '@/types/settlement/ledgerDetail';
import type { LedgerStatus, SettlementLedger } from '@/types/settlement/merchantSettlement';
import { formatWon } from '@/utils/format';
import { LEDGER_STATUS_TONE } from '../ledgerStatus';

const { Row, Label, Cell } = FormTable;
const TX_PAGE_SIZE = 10;

/** 원장 처리 (상세 팝업 오른쪽 위 · 지급예정일 연필) — 화면의 일괄 처리 팝업을 이 원장 하나로 연다 */
export type LedgerDetailAction = 'payDate' | 'hold' | 'release' | 'confirm';

/**
 * 상태별 처리 가능 여부. TODO(정책) 화면설계서 확인 —
 * 지급보류: 보류 · 완료가 아니면 / 보류해제: 지급보류일 때 / 지급확정: 지급대기일 때
 */
const canDo = (status: LedgerStatus) => ({
  hold: status !== '지급보류' && status !== '지급완료',
  release: status === '지급보류',
  confirm: status === '지급대기',
});

// 탭 안 칸 (드롭다운 · 입력이 있는 줄은 위아래 8 — 시안 줄 56)
const padded = { paddingBlock: 'var(--kp-space-8)' } as const;

function BasisTab({
  detail,
  notes,
  onNote,
}: {
  detail: LedgerDetail;
  notes: Record<string, string>;
  onNote: (key: string, value: string) => void;
}) {
  const dialog = useDialog();
  const openLinked = (id: string) => dialog.alert(`${id} 조정 원장 상세는 준비 중입니다.`);
  const columns: GridPlaceholderColumn<LedgerBasisItem>[] = [
    { key: 'label', header: '산출 항목', width: 182, align: 'left' },
    {
      key: 'amount',
      header: '금액',
      width: 150,
      align: 'right',
      render: (r) => formatWon(r.amount, { signed: r.signed }),
    },
    {
      key: 'linkedIds',
      header: '연계 ID',
      width: 190,
      align: 'left',
      render: (r) =>
        r.linkedIds.length === 0
          ? '-'
          : r.linkedIds.map((id, i) => (
              <Fragment key={id}>
                {i > 0 && ' · '}
                <TextLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    void openLinked(id);
                  }}
                >
                  {id}
                </TextLink>
              </Fragment>
            )),
    },
    { key: 'reference', header: '사유 / 참조 (조회)', width: 330, align: 'left' },
    {
      key: 'note',
      header: '비고',
      render: (r) => (
        <div style={padded}>
          <TextField
            fullWidth
            aria-label={`${r.label} 비고`}
            value={notes[r.key] ?? ''}
            onChange={(e) => onNote(r.key, e.target.value)}
          />
        </div>
      ),
    },
  ];
  return <GridPlaceholder columns={columns} rows={detail.basis} rowKey={(r) => r.key} />;
}

function TxTab({ ledger }: { ledger: SettlementLedger }) {
  const dialog = useDialog();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ items: LedgerTx[]; total: number } | null>(null);
  useEffect(() => {
    void fetchLedgerTxs(ledger, page, TX_PAGE_SIZE).then(setData);
  }, [ledger, page]);
  const columns: GridPlaceholderColumn<LedgerTx>[] = [
    {
      key: 'txNo',
      header: '거래번호',
      width: 200,
      render: (r) => (
        // TODO(정책) 거래번호 → 거래 상세정보 팝업 (통합 거래내역 KWPC04010101)
        <TextLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            void dialog.alert(`${r.txNo} 거래 상세정보는 준비 중입니다.`);
          }}
        >
          {r.txNo}
        </TextLink>
      ),
    },
    { key: 'paidAt', header: '결제일', width: 150 },
    { key: 'serviceName', header: '서비스명', width: 120 },
    { key: 'issuer', header: '결제기관', width: 90 },
    { key: 'orderNo', header: '주문번호', width: 200 },
    { key: 'buyerId', header: '구매자 ID', width: 80 },
    { key: 'customerName', header: '고객명', width: 70 },
    { key: 'productName', header: '상품명', align: 'left' },
  ];
  const total = data?.total ?? 0;
  return (
    <>
      <GridPlaceholder
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(r) => r.txNo}
        empty="정산대상 거래가 없습니다."
      />
      <ResultFooter total={total}>
        <Pagination
          totalPages={Math.max(1, Math.ceil(total / TX_PAGE_SIZE))}
          page={page}
          onChange={setPage}
        />
      </ResultFooter>
    </>
  );
}

function Body({
  ledger,
  onClose,
  onAction,
}: {
  ledger: SettlementLedger;
  onClose: () => void;
  onAction: (action: LedgerDetailAction) => void;
}) {
  const [detail, setDetail] = useState<LedgerDetail | null>(null);
  const [tab, setTab] = useState('basis');
  const [notes, setNotes] = useState<Record<string, string>>({});
  useEffect(() => {
    void fetchLedgerDetail(ledger).then((d) => {
      setDetail(d);
      setNotes(Object.fromEntries(d.basis.map((b) => [b.key, b.note])));
    });
  }, [ledger]);

  const save = useAction({
    run: () => saveLedgerNotes(ledger.ledgerId, notes),
    success: '비고가 저장되었습니다.',
    failure: '비고 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  });

  if (!detail) {
    return (
      <Modal.Body>
        <StatusView status="loading" />
      </Modal.Body>
    );
  }
  const { summary } = detail;
  const can = canDo(ledger.status);
  const error = { color: 'var(--kp-color-status-error-text)' } as const;

  return (
    <>
      <Modal.Body>
        <Stack gap={24}>
          {/* 원장 기본정보 */}
          <Stack as="section">
            <SectionHeading
              size="md"
              as="h3"
              title="원장 기본정보"
              actions={
                <ControlGroup>
                  <Button
                    variant="neutral"
                    appearance="line"
                    disabled={!can.hold}
                    onClick={() => onAction('hold')}
                  >
                    지급보류
                  </Button>
                  <Button
                    variant="neutral"
                    appearance="line"
                    disabled={!can.release}
                    onClick={() => onAction('release')}
                  >
                    보류해제
                  </Button>
                  <Button disabled={!can.confirm} onClick={() => onAction('confirm')}>
                    지급확정
                  </Button>
                </ControlGroup>
              }
            />
            <FormTable>
              <Row>
                <Label>정산원장 ID</Label>
                <Cell>{ledger.ledgerId}</Cell>
                <Label>가맹점명</Label>
                <Cell>{ledger.merchantName}</Cell>
                <Label>사업자번호</Label>
                <Cell>{ledger.bizNo}</Cell>
                <Label>지급예정일</Label>
                <Cell>
                  {ledger.payDate}
                  <TextButton
                    size="sm"
                    aria-label="지급예정일 변경"
                    onClick={() => onAction('payDate')}
                  >
                    <Icon name="edit" size={16} />
                  </TextButton>
                </Cell>
              </Row>
              <Row>
                <Label>CPID</Label>
                <Cell>{ledger.cpid}</Cell>
                <Label>결제수단</Label>
                <Cell>{ledger.payMethod}</Cell>
                <Label>정산주기</Label>
                <Cell>{ledger.cycle}</Cell>
                <Label>지급상태</Label>
                <Cell>
                  <Badge size="sm" tone={LEDGER_STATUS_TONE[ledger.status]}>
                    {ledger.status}
                  </Badge>
                </Cell>
              </Row>
              <Row>
                <Label>정산구분</Label>
                <Cell>{detail.typeCode}</Cell>
                <Label>상계그룹 ID</Label>
                <Cell>
                  {detail.offsetGroupId ? (
                    // TODO(정책) 상계그룹 상세 (상계 원장 상세 KWPC06010219)
                    <TextLink href="#" onClick={(e) => e.preventDefault()}>
                      {detail.offsetGroupId}
                    </TextLink>
                  ) : (
                    '-'
                  )}
                </Cell>
                <Label>지급계좌</Label>
                <Cell>
                  {/* 계좌번호는 한 줄로 (시안) */}
                  <span style={{ whiteSpace: 'nowrap' }}>{detail.payAccount}</span>
                </Cell>
                <Label>예금주</Label>
                <Cell>
                  <span style={detail.holderVerified ? undefined : error}>{detail.holder}</span>
                  {!detail.holderVerified && (
                    <Badge size="sm" tone="error">
                      검증 불일치
                    </Badge>
                  )}
                </Cell>
              </Row>
            </FormTable>
          </Stack>

          {/* 원장 요약 */}
          <Stack as="section">
            <SectionHeading size="md" as="h3" title="원장 요약" />
            <ActionStats
              items={[
                { label: '정산대상 거래', values: [{ value: summary.txCount }] },
                {
                  label: '수수료 차감 후 정산금액',
                  values: [{ value: summary.afterFee, unit: '원' }],
                },
                { label: '한도 조정 금액', values: [{ value: summary.limitAdjust, unit: '원' }] },
                { label: '상계 조정 금액', values: [{ value: summary.offsetAdjust, unit: '원' }] },
                { label: '지급예정금액', values: [{ value: summary.payAmount, unit: '원' }] },
              ]}
            />
          </Stack>

          {/* 원장 상세 내역 */}
          <Stack as="section">
            <SectionHeading size="md" as="h3" title="원장 상세 내역" />
            <Tab
              variant="button"
              fullWidth
              value={tab}
              onChange={setTab}
              aria-label="원장 상세 내역"
            >
              <Tab.Item value="basis">원장 산출 근거</Tab.Item>
              <Tab.Item value="tx">정산대상 거래 건</Tab.Item>
              <Tab.Item value="memo">메모</Tab.Item>
              <Tab.Item value="history">이력</Tab.Item>
            </Tab>
            {tab === 'basis' && (
              <BasisTab
                detail={detail}
                notes={notes}
                onNote={(key, value) => setNotes((n) => ({ ...n, [key]: value }))}
              />
            )}
            {tab === 'tx' && <TxTab ledger={ledger} />}
            {(tab === 'memo' || tab === 'history') && (
              // TODO(시안) 메모(KWPC06010212) · 처리이력(KWPC06010211) 탭 — 임의 작업
              <StatusView
                status="idle"
                title={tab === 'memo' ? '메모' : '이력'}
                description="시안 확인 후 작업합니다."
              />
            )}
          </Stack>
        </Stack>
      </Modal.Body>
      {/* 비고 저장은 원장 산출 근거 탭에서만 (시안) */}
      {tab === 'basis' && (
        <Modal.Footer>
          <Button size="lg" variant="neutral" appearance="line" onClick={onClose}>
            취소
          </Button>
          <Button size="lg" loading={save.loading} onClick={() => void save.execute()}>
            비고 저장
          </Button>
        </Modal.Footer>
      )}
    </>
  );
}

export interface LedgerDetailModalProps {
  /** 열 원장. null이면 닫힘 */
  ledger: SettlementLedger | null;
  onClose: () => void;
  /** 오른쪽 위 처리 버튼 · 지급예정일 연필 → 화면의 일괄 처리 팝업을 이 원장으로 */
  onAction: (action: LedgerDetailAction, ledger: SettlementLedger) => void;
}

/**
 * 일반 원장 상세 (시안 temp/페이지/처리_일반 원장 상세 팝업_*.png, KWPC06010209~12) — 정산원장 ID를 누르면 연다.
 * 원장 기본정보(처리 버튼) → 원장 요약 → 원장 상세 내역(산출 근거 · 정산대상 거래 건 · 메모 · 이력).
 * 폭: 시안 1360 → Modal xl 1280
 */
export function LedgerDetailModal({ ledger, onClose, onAction }: LedgerDetailModalProps) {
  return (
    <Modal open={ledger !== null} onClose={onClose} size="xl">
      <Modal.Header title="일반 원장 상세" />
      {ledger && <Body ledger={ledger} onClose={onClose} onAction={(a) => onAction(a, ledger)} />}
    </Modal>
  );
}
