/**
 * 화면ID: [KWPC10010404] 특수권한 부여 처리 팝업
 * 위치: 시스템관리 > 사용자·권한·보안 관리 > 권한 신청 승인 관리 · /system/user-security/permission-approval/special (팝업)
 */
import {
  Badge,
  Button,
  ControlGroup,
  DateField,
  DetailCard,
  Field,
  Infobox,
  Modal,
  Stack,
  StatusView,
  useAction,
} from '@kiwoompay/design-system';
import { useEffect, useState } from 'react';
import {
  fetchSpecialApprovalDetail,
  grantSpecialPermission,
} from '@/features/system/specialApproval.api';
import { GrantError, type SpecialApprovalDetail } from '@/features/system/specialApproval.types';
import { codeLabel } from '@/utils/code';
import { orDash } from '@/utils/format';
import { APPROVAL_TONE, GRANT_TONE } from './specialApprovalColumns';

export interface SpecialGrantModalProps {
  /** 연 신청번호 (null이면 닫힘) */
  requestNo: string | null;
  onClose: () => void;
  /** 부여 후 (목록 다시 조회) — 완료 안내보다 먼저 */
  onGranted: () => void | Promise<void>;
}

/**
 * KWPC10010404 특수권한 부여 처리 팝업(화면설계서 머리 화면ID는 KWPC10010504) — 특수권한 결재 현황 [권한 부여]. 시안 없음.
 * 신청 기본정보 · 신청 사유 및 승인 결재 정보(조회 전용) → 최종 권한 부여 설정(실제 사용 기간) → [닫기] · [권한 부여].
 * 결재 승인완료 + 부여 대기만 처리, 결재 승인 · 반려는 다우오피스에서(이 팝업에서 처리 안 함)
 */
export function SpecialGrantModal({ requestNo, onClose, onGranted }: SpecialGrantModalProps) {
  return (
    <Modal open={requestNo !== null} onClose={onClose} size="xl">
      <Modal.Header title="특수권한 부여 처리" closeButton />
      {requestNo !== null && <Body requestNo={requestNo} onClose={onClose} onGranted={onGranted} />}
    </Modal>
  );
}

function Body({
  requestNo,
  onClose,
  onGranted,
}: {
  requestNo: string;
  onClose: () => void;
  onGranted: () => void | Promise<void>;
}) {
  const [detail, setDetail] = useState<SpecialApprovalDetail | null>(null);
  const [error, setError] = useState(false);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    fetchSpecialApprovalDetail(requestNo)
      .then((d) => {
        setDetail(d);
        // 실제 사용 기간 기본값 = 신청 희망 기간 (TODO(정책) 기본값)
        setStart(d.wishPeriod.start);
        setEnd(d.wishPeriod.end);
      })
      .catch(() => setError(true));
  }, [requestNo]);

  const grant = useAction({
    validate: () => {
      if (!detail) return null;
      if (!start || !end) return '시작일과 종료일을 입력해주세요.';
      if (end < start) return '종료일은 시작일 이전일 수 없습니다.';
      if (start < detail.wishPeriod.start || end > detail.wishPeriod.end) {
        return '신청 · 결재 범위(신청 희망 기간) 안에서 부여할 수 있습니다.';
      }
      return null;
    },
    confirm: () => `${detail?.specialName} 권한을 ${start} ~ ${end} 기간으로 부여할까요?`,
    confirmOptions: { confirmText: '권한 부여' },
    run: () => grantSpecialPermission(requestNo, { start, end }),
    onSuccess: async () => {
      await onGranted();
      onClose();
    },
    success: '권한이 부여되었습니다.',
    failure: (e) => {
      if (e instanceof GrantError && e.code === 'OVERLAP') {
        return '같은 계정에 같은 특수권한이 겹치는 기간으로 부여되어 있습니다.';
      }
      if (e instanceof GrantError && e.code === 'OUT_OF_RANGE') {
        return '신청 · 결재 범위(신청 희망 기간) 안에서 부여할 수 있습니다.';
      }
      if (e instanceof GrantError && e.code === 'NOT_GRANTABLE') {
        return '결재 승인완료 · 부여 대기인 신청만 부여할 수 있습니다.';
      }
      return '권한을 부여하지 못했습니다. 잠시 후 다시 시도해주세요.';
    },
  });

  const grantable = detail?.approvalStatus === 'APPROVED' && detail.grantStatus === 'PENDING';

  return (
    <>
      <Modal.Body>
        <Stack gap={16}>
          <Modal.Description>
            다우오피스 결재 승인완료 건의 실제 사용 기간을 설정하고, 시스템관리자가 권한을 최종
            부여합니다.
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
                  { label: '신청일', value: detail.requestedAt },
                  { label: '신청자 계정 ID', value: detail.accountId },
                  { label: '신청자명', value: detail.applicant },
                  { label: '특수권한 코드', value: detail.specialCode },
                  { label: '특수권한명', value: detail.specialName },
                ]}
              />
              <DetailCard
                title="신청 사유 및 승인 결재 정보"
                columns={4}
                labelWidth={96}
                items={[
                  { label: '신청 사유', value: detail.reason, span: 4 },
                  { label: '승인 결재번호', value: orDash(detail.approvalNo) },
                  { label: '결재 승인자', value: orDash(detail.approver) },
                  { label: '승인일시', value: orDash(detail.approvedAt) },
                  {
                    label: '결재 상태',
                    value: (
                      <Badge size="sm" tone={APPROVAL_TONE[detail.approvalStatus]}>
                        {codeLabel('APPROVAL_STATUS', detail.approvalStatus)}
                      </Badge>
                    ),
                  },
                ]}
              />
              <DetailCard
                title="최종 권한 부여 설정"
                form
                columns={2}
                labelWidth={110}
                items={[
                  {
                    label: '신청 희망 기간',
                    value: `${detail.wishPeriod.start} ~ ${detail.wishPeriod.end}`,
                  },
                  {
                    label: '현재 부여 상태',
                    value: (
                      <Badge size="sm" tone={GRANT_TONE[detail.grantStatus]}>
                        {codeLabel('GRANT_STATUS', detail.grantStatus)}
                      </Badge>
                    ),
                  },
                  {
                    label: '실제 권한 사용 기간',
                    span: 2,
                    value: (
                      <ControlGroup spacing="lg">
                        <Field label="시작일" required>
                          <DateField
                            value={start}
                            disabled={!grantable}
                            onChange={(v) => setStart(v)}
                          />
                        </Field>
                        <Field label="종료일" required>
                          <DateField
                            value={end}
                            disabled={!grantable}
                            onChange={(v) => setEnd(v)}
                          />
                        </Field>
                      </ControlGroup>
                    ),
                  },
                ]}
              />
              {/* 팝업 안내 — 기획서 화면의 ※ 문구 그대로, 여러 줄은 아이콘 하나 + 점 목록 */}
              <Infobox tone="neutral">
                <Infobox.Item
                  bullets={[
                    '시작일·종료일 필수. 종료일은 시작일 이전일 수 없습니다. 신청·결재 범위 내에서 부여할 수 있습니다.',
                    '시스템관리자가 최종 부여 처리합니다. 결재 승인·반려는 다우오피스에서 수행하며 이 팝업에서는 처리하지 않습니다.',
                  ]}
                />
              </Infobox>
            </>
          )}
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size="lg"
          variant="neutral"
          appearance="line"
          disabled={grant.loading}
          onClick={onClose}
        >
          닫기
        </Button>
        {grantable && (
          <Button size="lg" disabled={grant.loading} onClick={() => void grant.execute()}>
            권한 부여
          </Button>
        )}
      </Modal.Footer>
    </>
  );
}
