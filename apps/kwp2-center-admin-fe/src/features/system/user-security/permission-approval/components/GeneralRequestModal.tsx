/**
 * 화면ID: [KWPC10010402] 일반권한 신청 처리 팝업
 * 위치: 시스템관리 > 사용자·권한·보안 관리 > 권한 신청 승인 관리 · /system/user-security/permission-approval (팝업)
 */
import {
  Badge,
  Button,
  DetailCard,
  Field,
  GridPlaceholder,
  Modal,
  Stack,
  StatusView,
  Text,
  TextArea,
  useAction,
  type BadgeTone,
  type GridPlaceholderColumn,
} from '@kiwoompay/design-system';
import { useEffect, useState } from 'react';
import {
  approveGeneralRequest,
  fetchGeneralRequestDetail,
  rejectGeneralRequest,
} from '@/features/system/permissionApproval.api';
import type {
  GeneralRequestDetail,
  RequestStatus,
  RequestedPermission,
} from '@/features/system/permissionApproval.types';
import { codeLabel } from '@/utils/code';
import { orDash } from '@/utils/format';

const STATUS_TONE: Record<RequestStatus, BadgeTone> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
};

const PERMISSION_COLUMNS: GridPlaceholderColumn<RequestedPermission & { no: number }>[] = [
  { key: 'no', header: 'No', width: 56 },
  { key: 'menuPath', header: '메뉴 경로', align: 'left' },
  { key: 'kind', header: '구분', width: 100 },
  { key: 'permission', header: '신청 권한', width: 200, align: 'left' },
];

export interface GeneralRequestModalProps {
  /** 연 신청번호 (null이면 닫힘) */
  requestNo: string | null;
  onClose: () => void;
  /** 승인 · 반려 후 (목록 다시 조회) — 완료 안내보다 먼저 */
  onProcessed: () => void | Promise<void>;
}

/**
 * KWPC10010402 일반권한 신청 처리 팝업(화면설계서 머리 화면ID는 KWPC10010502) (일반 메뉴·기능 권한 목록 신청번호 · [상세보기]) — 화면설계서 v0.1, 시안 없음.
 * 신청 기본정보 · 신청 사유 · 신청 권한 내역(조회 전용) → 처리 의견 → [닫기] · [반려] · [승인].
 * 신청번호 단위 전체 승인 · 반려(개별 선택 없음), 반려는 사유 필수. 처리 완료면 조회 전용 · [닫기]만
 */
export function GeneralRequestModal({ requestNo, onClose, onProcessed }: GeneralRequestModalProps) {
  return (
    <Modal open={requestNo !== null} onClose={onClose} size="xl">
      <Modal.Header title="일반권한 신청 처리" closeButton />
      {requestNo !== null && (
        <Body requestNo={requestNo} onClose={onClose} onProcessed={onProcessed} />
      )}
    </Modal>
  );
}

function Body({
  requestNo,
  onClose,
  onProcessed,
}: {
  requestNo: string;
  onClose: () => void;
  onProcessed: () => void | Promise<void>;
}) {
  const [detail, setDetail] = useState<GeneralRequestDetail | null>(null);
  const [error, setError] = useState(false);
  const [opinion, setOpinion] = useState('');

  useEffect(() => {
    fetchGeneralRequestDetail(requestNo)
      .then(setDetail)
      .catch(() => setError(true));
  }, [requestNo]);

  const done = async () => {
    await onProcessed();
    onClose();
  };

  const approve = useAction({
    confirm: () => `신청번호 ${requestNo}의 신청 권한 전체를 승인할까요?`,
    confirmOptions: { confirmText: '승인' },
    run: () => approveGeneralRequest(requestNo, opinion),
    onSuccess: done,
    success: '승인되었습니다.',
    failure: '승인하지 못했습니다. 잠시 후 다시 시도해주세요.',
  });
  const reject = useAction({
    validate: () => (!opinion.trim() ? '반려 사유를 입력해주세요.' : null),
    confirm: () => `신청번호 ${requestNo}의 신청을 반려할까요?`,
    confirmOptions: { confirmText: '반려' },
    run: () => rejectGeneralRequest(requestNo, opinion),
    onSuccess: done,
    success: '반려되었습니다.',
    failure: '반려하지 못했습니다. 잠시 후 다시 시도해주세요.',
  });

  const pending = detail?.status === 'PENDING';
  const busy = approve.loading || reject.loading;

  return (
    <>
      <Modal.Body>
        <Stack gap={16}>
          <Modal.Description>
            시스템관리자가 일반 메뉴·기능 권한 신청 내용을 검토하고 신청번호 단위로 승인·반려합니다.
          </Modal.Description>
          {error ? (
            <StatusView status="error" />
          ) : !detail ? null : (
            <>
              <DetailCard
                title="신청 기본정보"
                columns={3}
                labelWidth={96}
                items={[
                  { label: '신청번호', value: detail.no },
                  { label: '신청자 계정 ID', value: detail.accountId },
                  { label: '신청자명', value: detail.applicant },
                  {
                    label: '권한유형',
                    value: codeLabel('GENERAL_PERMISSION_TYPE', detail.type),
                  },
                  { label: '신청일시', value: detail.requestedAt },
                  {
                    label: '처리상태',
                    value: (
                      <Badge size="sm" tone={STATUS_TONE[detail.status]}>
                        {codeLabel('PERMISSION_REQUEST_STATUS', detail.status)}
                      </Badge>
                    ),
                  },
                ]}
              />
              <DetailCard title="신청 사유">
                <Text as="p" variant="body-sm" tone="body">
                  {detail.reason}
                </Text>
              </DetailCard>
              <DetailCard title="신청 권한 내역">
                <GridPlaceholder
                  columns={PERMISSION_COLUMNS}
                  rows={detail.permissions.map((p, i) => ({ ...p, no: i + 1 }))}
                  rowKey={(p) => String(p.no)}
                />
              </DetailCard>
              {pending ? (
                <Field label="처리 의견 / 반려 사유" labelPosition="top">
                  <TextArea
                    fullWidth
                    value={opinion}
                    placeholder="처리 의견을 입력하세요. (승인 시 선택 / 반려 시 필수)"
                    onChange={(e) => setOpinion(e.target.value)}
                  />
                </Field>
              ) : (
                // 처리 완료 — 조회 전용
                <DetailCard
                  title="처리 의견 / 반려 사유"
                  columns={3}
                  items={[
                    { label: '처리자', value: orDash(detail.processor) },
                    { label: '처리일시', value: orDash(detail.processedAt) },
                    { label: '처리 의견', value: orDash(detail.opinion) },
                  ]}
                />
              )}
            </>
          )}
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button size="lg" variant="neutral" appearance="line" disabled={busy} onClick={onClose}>
          닫기
        </Button>
        {pending && (
          <>
            <Button
              size="lg"
              variant="neutral"
              disabled={busy}
              onClick={() => void reject.execute()}
            >
              반려
            </Button>
            <Button size="lg" disabled={busy} onClick={() => void approve.execute()}>
              승인
            </Button>
          </>
        )}
      </Modal.Footer>
    </>
  );
}
