/**
 * 화면ID: [KWPC10010401] 일반 메뉴·기능 권한
 * 위치: 시스템관리 > 사용자·권한·보안 관리 > 권한 신청 승인 관리 · /system/user-security/permission-approval
 */
import {
  DateRangeField,
  Field,
  PageLayout,
  Pagination,
  ResultFooter,
  ResultPanel,
  SearchPanel,
  Stack,
  SelectBox,
  TextField,
  useSearchResult,
} from '@kiwoompay/design-system';
import { IbsheetGrid } from '@kiwoompay/design-system/ibsheet';
import { useState } from 'react';
import {
  GENERAL_APPROVAL_PATH,
  PermissionApprovalTabs,
} from '@/features/system/components/PermissionApprovalTabs';
import { fetchGeneralRequests } from '@/features/system/permissionApproval.api';
import { useCodeOptions } from '@/hooks/useCodeOptions';
import { createInitialParams } from './components/initialParams';
import { createRequestColumns } from './components/requestColumns';
import { GeneralRequestModal } from './components/GeneralRequestModal';

/**
 * KWPC10010401 일반 메뉴·기능 권한 (권한 신청 승인 관리) — 화면설계서 v0.1 기준(머리 화면ID는 KWPC10010501), 시안 없음.
 * 페이지 패턴 P01 Search → Result: 검색 조건 → 일반 권한 신청 목록(IBSheet) → Total · Pagination(10건씩).
 * 최초 진입 시 조회하지 않음(확정 결정). 신청번호 · [상세보기] → 신청 처리 팝업(KWPC10010502) — 처리하면 목록 다시 조회
 */
export function GeneralPermissionPage() {
  const statuses = useCodeOptions('PERMISSION_REQUEST_STATUS', { withAll: true });
  const typeCodes = useCodeOptions('GENERAL_PERMISSION_TYPE');
  const departments = useCodeOptions('DEPARTMENT', { withAll: true });
  // 기획서 화면 문구: 권한유형 전체는 "전체 (메뉴·기능)"
  const types = [{ value: 'all', label: '전체 (메뉴·기능)' }, ...typeCodes];

  const result = useSearchResult({
    initialParams: createInitialParams(),
    fetch: fetchGeneralRequests,
  });
  const { params, setParam } = result;
  const ready = result.status === 'success';

  // 신청번호 · [상세보기] → 신청 처리 팝업(KWPC10010502)
  const [detailNo, setDetailNo] = useState<string | null>(null);
  const columns = createRequestColumns((row) => setDetailNo(row.no));

  return (
    <>
      <PageLayout.Title title="일반 메뉴·기능 권한" />

      {/* 제목 탭(화면 전체 전환) 바로 아래 검색 조건을 붙인다 */}
      <Stack gap={0}>
        <PermissionApprovalTabs current={GENERAL_APPROVAL_PATH} />
        <SearchPanel onSearch={result.search} onReset={result.reset} loading={result.loading}>
          <Field label="신청자">
            <TextField
              value={params.applicant}
              placeholder="계정 ID 또는 이름"
              onChange={(e) => setParam('applicant', e.target.value)}
            />
          </Field>
          <Field label="처리상태">
            <SelectBox
              options={statuses}
              value={params.status}
              onChange={(status) => setParam('status', status)}
            />
          </Field>
          <Field label="권한유형">
            <SelectBox
              options={types}
              value={params.type}
              onChange={(type) => setParam('type', type)}
            />
          </Field>
          <Field label="신청번호">
            <TextField
              value={params.requestNo}
              placeholder="신청번호 입력"
              onChange={(e) => setParam('requestNo', e.target.value.replace(/\D/g, ''))}
            />
          </Field>
          <Field label="신청일">
            <DateRangeField
              value={params.period}
              onChange={(period) => setParam('period', period)}
            />
          </Field>
          <Field label="신청자 부서">
            <SelectBox
              options={departments}
              value={params.department}
              onChange={(department) => setParam('department', department)}
            />
          </Field>
        </SearchPanel>
      </Stack>

      <ResultPanel title="일반 권한 신청 목록" status={result.status}>
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

      <GeneralRequestModal
        requestNo={detailNo}
        onClose={() => setDetailNo(null)}
        onProcessed={result.refresh}
      />
    </>
  );
}
