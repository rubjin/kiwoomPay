/**
 * 화면ID: [KWPC10010403] 특수권한 결재 현황
 * 위치: 시스템관리 > 사용자·권한·보안 관리 > 권한 신청 승인 관리 · /system/user-security/permission-approval/special
 */
import {
  Badge,
  DateRangeField,
  DetailCard,
  Field,
  Infobox,
  PageLayout,
  Pagination,
  ResultFooter,
  ResultPanel,
  ResultSummary,
  SearchPanel,
  SelectBox,
  Stack,
  TextField,
  useSearchResult,
  type SearchRequest,
} from '@kiwoompay/design-system';
import { IbsheetGrid } from '@kiwoompay/design-system/ibsheet';
import { useEffect, useState } from 'react';
import {
  PermissionApprovalTabs,
  SPECIAL_APPROVAL_PATH,
} from '@/features/system/components/PermissionApprovalTabs';
import { fetchSpecialApprovals } from '@/features/system/specialApproval.api';
import { fetchSpecialCodes } from '@/features/system/specialCode.api';
import type {
  SpecialApproval,
  SpecialApprovalSearchParams,
  SpecialApprovalSummary,
} from '@/features/system/specialApproval.types';
import { useCodeOptions } from '@/hooks/useCodeOptions';
import { codeLabel } from '@/utils/code';
import { orDash } from '@/utils/format';
import { toYmd } from '@/utils/period';
import {
  APPROVAL_TONE,
  GRANT_TONE,
  createSpecialApprovalColumns,
} from './components/specialApprovalColumns';
import { SpecialGrantModal } from './components/SpecialGrantModal';

/** 검색 초기값 — 신청일 최근 30일 (TODO(정책) 기본 기간) */
function createInitialParams(): SpecialApprovalSearchParams {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 30);
  return {
    applicant: '',
    specialCode: 'all',
    approvalStatus: 'all',
    grantStatus: 'all',
    period: { start: toYmd(start), end: toYmd(end) },
    requestNo: '',
    approvalNo: '',
  };
}

const summaryItems = (s?: SpecialApprovalSummary) => [
  { label: '결재 승인 대기', value: s?.waiting, tone: 'warning' as const },
  { label: '부여 대기', value: s?.grantPending, tone: 'info' as const },
  { label: '현재 사용 중', value: s?.active, tone: 'success' as const },
];

/**
 * KWPC10010403 특수권한 결재 현황 (권한 신청 승인 관리) — 화면설계서 v0.1 기준(머리 화면ID는 KWPC10010503), 시안 없음.
 * 페이지 패턴 P01: 검색 조건 → 조회 요약(결재 승인 대기 · 부여 대기 · 현재 사용 중) → 특수권한 신청·결재 목록(IBSheet)
 * → 선택 신청 상세 · 안내(카드 아래) → Total · Pagination(10건씩). 최초 진입 시 조회하지 않음.
 * 결재는 다우오피스 회신 기준(KWP에서 승인 · 반려 없음), [권한 부여] → 특수권한 부여 처리 팝업(KWPC10010404)
 */
export function SpecialApprovalPage() {
  const approvalStatuses = useCodeOptions('APPROVAL_STATUS', { withAll: true });
  const grantStatuses = useCodeOptions('GRANT_STATUS', { withAll: true });
  const [specialOptions, setSpecialOptions] = useState([{ value: 'all', label: '전체' }]);
  const [selected, setSelected] = useState<SpecialApproval | null>(null);
  const [grantNo, setGrantNo] = useState<string | null>(null);

  useEffect(() => {
    void fetchSpecialCodes({ code: '', name: '', uses: ['Y', 'N'] }).then((list) =>
      setSpecialOptions([
        { value: 'all', label: '전체' },
        ...list.map((c) => ({ value: c.code, label: c.name })),
      ]),
    );
  }, []);

  const result = useSearchResult({
    initialParams: createInitialParams(),
    // 조회할 때마다 선택 신청 상세를 비운다
    fetch: (request: SearchRequest<SpecialApprovalSearchParams>) => {
      setSelected(null);
      return fetchSpecialApprovals(request);
    },
  });
  const { params, setParam } = result;
  const ready = result.status === 'success';

  const columns = createSpecialApprovalColumns({
    onSelect: setSelected,
    // [권한 부여] → 특수권한 부여 처리 팝업(KWPC10010404)
    onGrant: (row) => setGrantNo(row.no),
  });

  return (
    <>
      <PageLayout.Title title="특수권한 결재 현황" />

      <Stack gap={0}>
        <PermissionApprovalTabs current={SPECIAL_APPROVAL_PATH} />
        <SearchPanel onSearch={result.search} onReset={result.reset} loading={result.loading}>
          <Field label="신청자">
            <TextField
              value={params.applicant}
              placeholder="계정 ID 또는 이름"
              onChange={(e) => setParam('applicant', e.target.value)}
            />
          </Field>
          <Field label="특수권한">
            <SelectBox
              options={specialOptions}
              value={params.specialCode}
              onChange={(v) => setParam('specialCode', v)}
            />
          </Field>
          <Field label="결재 상태">
            <SelectBox
              options={approvalStatuses}
              value={params.approvalStatus}
              onChange={(v) => setParam('approvalStatus', v)}
            />
          </Field>
          <Field label="부여 상태">
            <SelectBox
              options={grantStatuses}
              value={params.grantStatus}
              onChange={(v) => setParam('grantStatus', v)}
            />
          </Field>
          <Field label="신청일">
            <DateRangeField value={params.period} onChange={(v) => setParam('period', v)} />
          </Field>
          <Field label="신청번호">
            <TextField
              value={params.requestNo}
              placeholder="신청번호 입력"
              onChange={(e) => setParam('requestNo', e.target.value.replace(/\D/g, ''))}
            />
          </Field>
          <Field label="결재번호">
            <TextField
              value={params.approvalNo}
              placeholder="결재번호 입력"
              onChange={(e) => setParam('approvalNo', e.target.value)}
            />
          </Field>
        </SearchPanel>
      </Stack>

      <ResultSummary items={summaryItems(result.summary)} />

      <ResultPanel
        title="특수권한 신청·결재 목록"
        status={result.status}
        footer={
          // 카드 아래: 선택 신청 상세(신청번호 · 상세를 누르면) + 안내 — 목록이 없으면 둘 다 없음
          ready ? (
            <Stack gap={12}>
              {selected && (
                <DetailCard
                  title="선택 신청 상세"
                  columns={3}
                  labelWidth={110}
                  items={[
                    { label: '신청번호', value: selected.no },
                    { label: '권한', value: selected.specialName },
                    { label: '다우오피스 결재번호', value: orDash(selected.approvalNo) },
                    { label: '결재 승인자', value: orDash(selected.approver) },
                    {
                      label: '결재 상태',
                      value: (
                        <Badge size="sm" tone={APPROVAL_TONE[selected.approvalStatus]}>
                          {codeLabel('APPROVAL_STATUS', selected.approvalStatus)}
                        </Badge>
                      ),
                    },
                    {
                      label: '권한 부여',
                      value: (
                        <Badge size="sm" tone={GRANT_TONE[selected.grantStatus]}>
                          {codeLabel('GRANT_STATUS', selected.grantStatus)}
                        </Badge>
                      ),
                    },
                    { label: '신청 사유', value: selected.reason, span: 3 },
                  ]}
                />
              )}
              <Infobox tone="neutral">
                <Infobox.Item>
                  결재 승인완료 후에도 &apos;부여 대기&apos; 상태인 건은 권한을 사용할 수 없습니다.
                  [권한 부여] 버튼을 통해 사용 기간을 설정하고 최종 부여 처리해 주세요.
                </Infobox.Item>
              </Infobox>
            </Stack>
          ) : undefined
        }
      >
        <IbsheetGrid columns={columns} rows={ready ? result.items : []} rowKey={(r) => r.no} />
      </ResultPanel>

      <ResultFooter total={result.total}>
        <Pagination
          totalPages={result.totalPages}
          page={result.page}
          onChange={result.setPage}
          disabled={!ready}
        />
      </ResultFooter>

      <SpecialGrantModal
        requestNo={grantNo}
        onClose={() => setGrantNo(null)}
        onGranted={result.refresh}
      />
    </>
  );
}
