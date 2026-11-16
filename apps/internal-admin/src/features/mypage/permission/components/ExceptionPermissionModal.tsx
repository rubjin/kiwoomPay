import {
  // 팝업 틀 · 배치
  Modal,
  Stack,
  ControlGroup,
  SectionHeading,
  // 요약 · 목록
  InfoStrip,
  Badge,
  GridPlaceholder,
  StatusView,
  ResultFooter,
  Pagination,
  useSearchResult,
  type GridPlaceholderColumn,
} from '@kiwoompay/design-system';
import { useEffect, useState } from 'react';
import {
  fetchExceptionOverview,
  fetchExceptionPermissions,
} from '@/features/mypage/exceptionPermission.api';
import type {
  ExceptionFilter,
  ExceptionPermission,
  ExceptionPermissionOverview,
} from '@/features/mypage/exceptionPermission.types';
const joined = (actions: string[]) => (actions.length > 0 ? actions.join(', ') : '-');

/**
 * 개별 예외 권한 열 (Figma 폭 133 · 400 · 155 · 150 · 126 · 220 · 148 = 1332).
 * 팝업 xl 1280 안(1240)에 맞추려고 메뉴 경로는 남는 폭, 최종 적용일 160 · 처리자 120 (임의 작업).
 * TODO(IBSheet) IBSheet8 연결 시 같은 순서 · 폭으로
 */
const COLUMNS: GridPlaceholderColumn<ExceptionPermission>[] = [
  {
    key: 'count',
    header: '추가/제외 건수',
    width: 133,
    align: 'left',
    render: (r) => (
      <ControlGroup>
        {r.addedActions.length > 0 && (
          <Badge size="sm" tone="primary">
            {r.addedActions.length}건
          </Badge>
        )}
        {r.excludedActions.length > 0 && (
          <Badge size="sm" tone="error">
            {r.excludedActions.length}건
          </Badge>
        )}
      </ControlGroup>
    ),
  },
  { key: 'menuPath', header: '메뉴 경로', align: 'left' },
  { key: 'template', header: '템플릿 권한', width: 155, render: (r) => joined(r.templateActions) },
  { key: 'added', header: '추가 권한', width: 150, render: (r) => joined(r.addedActions) },
  { key: 'excluded', header: '제외 권한', width: 126, render: (r) => joined(r.excludedActions) },
  { key: 'appliedAt', header: '최종 적용일', width: 160 },
  { key: 'processor', header: '처리자', width: 120 },
];

// 권한 적용 기준 칸 폭 (Figma 405 · 250 · 302 · 나머지)
const SUMMARY_COLUMNS = '405px 250px 302px 1fr';

function ExceptionPermissionBody() {
  const [overview, setOverview] = useState<ExceptionPermissionOverview | null>(null);
  useEffect(() => {
    void fetchExceptionOverview().then(setOverview);
  }, []);

  const result = useSearchResult({
    initialParams: { filter: 'all' as ExceptionFilter },
    fetch: fetchExceptionPermissions,
  });
  const { params, setParam, search } = result;
  // 처음 열 때 · 건수를 눌러 보기를 바꿀 때 조회
  useEffect(() => {
    void search();
    // 보기(filter)가 바뀔 때만 다시 조회 (search는 의존성에서 뺀다)
  }, [params.filter]);
  const show = (filter: ExceptionFilter) => setParam('filter', filter);
  const ready = result.status === 'success';

  return (
    <Stack>
      <Stack gap={16}>
        <SectionHeading
          size="md"
          as="h3"
          title="권한 적용 기준"
          description="※ 현재 유효한 예외 권한만 표시하며, 과거 변경 이력은 권한 변경 이력에서 확인합니다."
        />
        <InfoStrip
          layout="stacked"
          columns={SUMMARY_COLUMNS}
          items={[
            { label: '적용 권한 템플릿', value: overview?.templateName ?? '-' },
            {
              label: '전체',
              value: overview ? `${overview.addedCount + overview.excludedCount}건` : '-',
              onClick: () => show('all'),
            },
            {
              label: '개별 추가 권한',
              value: (
                <Badge size="sm" tone="primary">
                  {overview?.addedCount ?? 0}건
                </Badge>
              ),
              onClick: () => show('added'),
            },
            {
              label: '개별 제외 권한',
              value: (
                <Badge size="sm" tone="error">
                  {overview?.excludedCount ?? 0}건
                </Badge>
              ),
              onClick: () => show('excluded'),
            },
          ]}
        />
      </Stack>

      <SectionHeading size="md" as="h3" title="개별 예외 권한 목록" />
      {result.status === 'success' ? (
        <GridPlaceholder
          columns={COLUMNS}
          rows={result.items}
          rowKey={(r) => r.id}
          empty="개별 예외 권한이 없습니다."
        />
      ) : (
        <StatusView status={result.status === 'idle' ? 'loading' : result.status} />
      )}

      <ResultFooter total={result.total}>
        <Pagination
          totalPages={result.totalPages}
          page={result.page}
          onChange={result.setPage}
          disabled={!ready}
        />
      </ResultFooter>
    </Stack>
  );
}

/**
 * 마이페이지 권한관리 · 개별 예외 권한 팝업 (KWPC02020001, Figma 29175:76240) — 메뉴 및 기능 권한 카드 [보유 기능 권한 보기]에서 연다.
 * 권한 적용 기준(템플릿 · 전체 · 추가 · 제외 건수) → 개별 예외 권한 목록 → Total · Pagination. 조회 전용 — 제목 줄 닫기(X)로 닫는다.
 * 건수를 누르면 목록을 그 보기(전체 · 추가 있는 메뉴 · 제외 있는 메뉴)로 바꾼다 (임의 작업).
 * 폭: Figma 1380 → Modal xl 1280 (표준 크기)
 */
export function ExceptionPermissionModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} size="xl">
      <Modal.Header title="개별 예외 권한" closeButton />
      <Modal.Body>{open && <ExceptionPermissionBody />}</Modal.Body>
    </Modal>
  );
}
