import {
  DateRangeField,
  Field,
  GridPlaceholder,
  Icon,
  Infobox,
  PageLayout,
  Pagination,
  ResultFooter,
  ResultPanel,
  SearchPanel,
  SelectBox,
  TextField,
  useDialog,
  useSearchResult,
} from '@kiwoompay/design-system';
import { useState } from 'react';
import { downloadFile, fetchDownloadRequests, requestRegenerate } from '@/api/main/downloadCenter';
import { useCodeOptions } from '@/hooks/useCodeOptions';
import type { DownloadRequest } from '@/types/main/downloadCenter';
import { DownloadDetailModal } from './components/DownloadDetailModal';
import { ACTION_LABEL, type DownloadAction } from './components/downloadActions';
import { createDownloadColumns } from './components/downloadColumns';
import { createInitialParams } from './components/initialParams';

// 라벨 + 8 + 셀렉트 130 (시안 다운로드센터.png)
const SELECT_FIELD = { width: 183 };

/**
 * KWPC0104 다운로드 센터 — 페이지 패턴 P01 Search → Result (시안 다운로드센터.png · 다운로드요청상세.png).
 * 검색 조건이 한 줄이라 [초기화] · [조회]를 필드 줄 끝에 둔다 (SearchPanel actionsPlacement="inline").
 * 내 다운로드 요청 목록이라 들어오면 바로 조회한다 (조회 화면 기본 규칙의 예외, TODO(정책) 확인)
 */
export function DownloadCenterPage() {
  const dialog = useDialog();
  const areas = useCodeOptions('DOWNLOAD_AREA', { withAll: true });
  const statuses = useCodeOptions('DOWNLOAD_STATUS', { withAll: true });
  const fileStatuses = useCodeOptions('DOWNLOAD_FILE_STATUS', { withAll: true });
  const [detailId, setDetailId] = useState<string | null>(null);
  const result = useSearchResult({
    initialParams: createInitialParams(),
    fetch: fetchDownloadRequests,
    autoSearch: true,
  });
  const { params, setParam } = result;
  const ready = result.status === 'success';

  /** 다운로드는 바로 내려받고, 재시도 · 재요청은 Confirm → 요청 → 재조회 → 완료 Alert (P04) */
  const runAction = async (
    row: Pick<DownloadRequest, 'id' | 'fileName'>,
    action: DownloadAction,
  ) => {
    if (action === 'download') {
      try {
        await downloadFile(row.id);
      } catch {
        await dialog.alert('파일을 내려받지 못했습니다. 잠시 후 다시 시도해주세요.');
      }
      return;
    }
    const label = ACTION_LABEL[action];
    const ok = await dialog.confirm(`${row.fileName}\n파일 생성을 ${label}할까요?`, {
      confirmText: label,
    });
    if (!ok) return;
    try {
      await requestRegenerate(row.id);
    } catch {
      await dialog.alert(`${label} 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.`);
      return;
    }
    setDetailId(null);
    await result.refresh();
    await dialog.alert(`파일 생성을 다시 요청했습니다. 파일이 생성되면 알림센터에서 안내합니다.`);
  };

  const columns = createDownloadColumns({
    onOpenDetail: (row) => setDetailId(row.id),
    onAction: runAction,
  });

  return (
    <>
      <PageLayout.Title title="다운로드 센터" />

      <Infobox>
        <Infobox.Item>
          대용량 파일은 비동기로 생성되며, 완료 후 목록에서 다운로드할 수 있습니다. 처리 결과는
          알림센터에서 안내합니다.
        </Infobox.Item>
      </Infobox>

      <SearchPanel
        title="검색조건"
        actionsPlacement="inline"
        onSearch={result.search}
        onReset={result.reset}
        loading={result.loading}
      >
        <Field label="업무영역" style={SELECT_FIELD}>
          <SelectBox
            fullWidth
            options={areas}
            value={params.area}
            onChange={(area) => setParam('area', area)}
          />
        </Field>
        <Field label="처리상태" style={SELECT_FIELD}>
          <SelectBox
            fullWidth
            options={statuses}
            value={params.status}
            onChange={(status) => setParam('status', status)}
          />
        </Field>
        <Field label="파일상태" style={SELECT_FIELD}>
          <SelectBox
            fullWidth
            options={fileStatuses}
            value={params.fileStatus}
            onChange={(fileStatus) => setParam('fileStatus', fileStatus)}
          />
        </Field>
        <Field label="요청일">
          <DateRangeField
            value={params.requestDate}
            onChange={(requestDate) => setParam('requestDate', requestDate)}
          />
        </Field>
        <Field label="파일명" style={{ flex: '1 1 240px' }}>
          <TextField
            fullWidth
            leadingIcon={<Icon name="search" size={20} />}
            placeholder="파일명 또는 요청명을 입력해주세요"
            value={params.keyword}
            onChange={(e) => setParam('keyword', e.target.value)}
          />
        </Field>
      </SearchPanel>

      <ResultPanel status={result.status}>
        {/* TODO(IBSheet) IBSheet8 본체 · 라이선스를 받으면 GridPlaceholder를 IBSheet로 교체 */}
        <GridPlaceholder
          columns={columns}
          rows={ready ? result.items : []}
          rowKey={(row) => row.id}
        />
      </ResultPanel>

      <ResultFooter total={result.total}>
        <Pagination
          totalPages={result.totalPages}
          page={result.page}
          onChange={result.setPage}
          disabled={!ready}
        />
      </ResultFooter>

      <DownloadDetailModal
        requestId={detailId}
        onClose={() => setDetailId(null)}
        onAction={runAction}
      />
    </>
  );
}
