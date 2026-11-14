import {
  ActionStats,
  ActionTargetBar,
  ActionTotal,
  Button,
  GridPlaceholder,
  Infobox,
  Modal,
  useAction,
  type ActionStatItem,
  type ActionSummaryPart,
  type GridPlaceholderColumn,
  Stack,
} from '@kiwoompay/design-system';
import { useState, type ReactNode } from 'react';

export interface LedgerActionModalProps<R extends { ledgerId: string }> {
  open: boolean;
  title: string;
  /** 처리 대상 (팝업을 열 때의 선택 원장). [제외]로 이번 처리에서 뺀다 */
  rows: R[];
  /** 대상 표 열 — 맨 끝 [제외] 열은 이 틀이 붙인다 */
  columns: GridPlaceholderColumn<R>[];
  /** 위 요약 줄 (예: 선택한 일반 정산원장 3건 · 합계 10,500,000원) */
  summary: (rows: R[]) => ActionSummaryPart[];
  /** bar(기본): 회색 요약 줄 / question: 확인 질문 문장 (지급확정 · 재산출 · 저장·재산출) */
  summaryVariant?: 'bar' | 'question';
  /** 표 아래 합계 줄 (예: 지급확정 대상금액 합계) */
  total?: (rows: R[]) => { label: ReactNode; value: number };
  /** 요약 아래 건수 상자 (예: 해제 가능 · 해제 불가) */
  stats?: (rows: R[]) => ActionStatItem[];
  /** 표 아래 안내: 점 목록 배열이면 회색 Infobox, 아니면 그대로 (예: 안내 상자 2개 나란히) */
  notices: ReactNode[] | ReactNode;
  /** 입력 (변경일 · 사유 등) */
  children?: ReactNode;
  /** 입력 아래 안내 (파란 점 목록) */
  footerNotices?: ReactNode[];
  submitLabel: string;
  /** 완료 안내 (기본 '<제목> 처리가 완료되었습니다.') */
  successMessage?: ReactNode;
  /** 처리 전 검사: 문제가 있으면 안내 문구 (대상 0건은 이 틀이 막는다) */
  validate?: (rows: R[]) => ReactNode | null;
  /** 처리 (API) */
  run: (rows: R[]) => Promise<unknown>;
  /** 처리 후 (재조회 등) — 완료 안내보다 먼저 */
  onDone?: () => void | Promise<void>;
  onClose: () => void;
}

function Body<R extends { ledgerId: string }>({
  title,
  rows: initialRows,
  columns,
  summary,
  summaryVariant = 'bar',
  total,
  stats,
  notices,
  children,
  footerNotices,
  submitLabel,
  successMessage,
  validate,
  run,
  onDone,
  onClose,
}: Omit<LedgerActionModalProps<R>, 'open'>) {
  const [rows, setRows] = useState(initialRows);
  const action = useAction({
    validate: () =>
      rows.length === 0 ? '처리할 정산원장이 없습니다.' : (validate?.(rows) ?? null),
    run: () => run(rows),
    onSuccess: async () => {
      await onDone?.();
      onClose();
    },
    success: successMessage ?? `${title} 처리가 완료되었습니다.`,
    failure: `${title} 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.`,
  });

  const withExclude: GridPlaceholderColumn<R>[] = [
    ...columns,
    {
      key: 'exclude',
      header: '제외',
      width: 56,
      render: (r) => (
        <Button
          size="sm"
          variant="neutral"
          appearance="line"
          disabled={action.loading}
          onClick={() => setRows((list) => list.filter((x) => x.ledgerId !== r.ledgerId))}
        >
          제외
        </Button>
      ),
    },
  ];

  return (
    <>
      <Modal.Body>
        <Stack gap={12}>
          <ActionTargetBar variant={summaryVariant} parts={summary(rows)} />
          {stats && <ActionStats items={stats(rows)} />}
          <GridPlaceholder
            columns={withExclude}
            rows={rows}
            rowKey={(r) => r.ledgerId}
            empty="처리할 정산원장이 없습니다."
          />
          {total && <ActionTotal {...total(rows)} />}
          {Array.isArray(notices) ? (
            <Infobox tone="neutral">
              <Infobox.Item bullets={notices} />
            </Infobox>
          ) : (
            notices
          )}
          {children}
          {footerNotices && (
            <Infobox>
              <Infobox.Item bullets={footerNotices} />
            </Infobox>
          )}
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button size="lg" variant="neutral" appearance="line" onClick={onClose}>
          취소
        </Button>
        <Button size="lg" loading={action.loading} onClick={() => void action.execute()}>
          {submitLabel}
        </Button>
      </Modal.Footer>
    </>
  );
}

/**
 * 정산원장 일괄 처리 팝업 공통 틀 (시안 temp/페이지/처리_실행 팝업.png · 처리_실행 팝업2.png):
 * 선택 대상 요약(회색 줄 또는 질문 문장) → (건수 상자) → 대상 표 + [제외] → (합계 줄) → 안내 → 입력 → 안내 → [취소] · [처리].
 * 흐름은 P04 useAction: 검사(대상 0건 · 입력) → 처리 → 재조회 → 완료 안내.
 * 폭: 시안 723 → Modal lg 880 (md 620은 표 6열이 넘친다)
 */
export function LedgerActionModal<R extends { ledgerId: string }>({
  open,
  ...rest
}: LedgerActionModalProps<R>) {
  return (
    <Modal open={open} onClose={rest.onClose} size="lg">
      <Modal.Header title={rest.title} />
      {open && <Body {...rest} />}
    </Modal>
  );
}
