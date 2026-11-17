import {
  // 화면 틀 · 버튼
  PageLayout,
  Button,
  ControlGroup,
  // 결과 안내
  useDialog,
} from '@kiwoompay/design-system';
import { useEffect, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
// 실제 화면 팝업 — 화면이 쓰는 컴포넌트를 그대로 불러온다 (복사하지 않음)
import { FavoriteEditModal } from '@/layouts/Lnb/FavoriteEditModal';
import { lnbItems } from '@/layouts/Lnb/Lnb';
import { SmsUnavailableModal } from '@/features/auth/login/components/SmsUnavailableModal';
import { SmsVerifyModal } from '@/features/auth/login/components/SmsVerifyModal';
import { PermissionRequestModal } from '@/features/mypage/components/PermissionRequestModal';
import { SpecialPermissionRequestModal } from '@/features/mypage/permission/components/SpecialPermissionRequestModal';
import { ExceptionPermissionModal } from '@/features/mypage/permission/components/ExceptionPermissionModal';
import { MenuPermissionRequestModal } from '@/features/mypage/permission/components/MenuPermissionRequestModal';
import { PermissionChangeModal } from '@/features/mypage/components/PermissionChangeModal';
import { PasswordChangeModal } from '@/features/mypage/account/components/PasswordChangeModal';
import { LoginHistoryModal } from '@/features/mypage/account/components/LoginHistoryModal';
import { AccountStatusHistoryModal } from '@/features/mypage/account/components/AccountStatusHistoryModal';
import { BizFinderModal } from '@/components/popups/BizFinderModal';
import { fetchSettlementLedgers } from '@/features/settlement/merchantSettlement.api';
import {
  HoldReleaseModal,
  PayDateChangeModal,
  PayHoldModal,
} from '@/features/settlement/merchant/execute/components/actions/LedgerActionModals';
import { LedgerDetailModal } from '@/features/settlement/merchant/execute/components/detail/LedgerDetailModal';
import {
  PayConfirmModal,
  PayDateSaveModal,
  RecalcModal,
} from '@/features/settlement/merchant/execute/components/actions/LedgerConfirmModals';
import {
  toActionRows,
  type LedgerActionRow,
} from '@/features/settlement/merchant/execute/components/actions/ledgerActionRows';
import { createInitialParams as createSettlementParams } from '@/features/settlement/merchant/execute/components/initialParams';
import { DownloadDetailModal } from '@/features/main/download-center/components/DownloadDetailModal';
import { fetchDownloadRequests } from '@/features/main/downloadCenter.api';
import type { DownloadStatus } from '@/features/main/downloadCenter.types';
import { ExcelDownloadModal } from '@/features/transaction/integrated/components/ExcelDownloadModal';
import { SavedSearchModal } from '@/features/transaction/integrated/components/SavedSearchModal';
import { EXAMPLE_SAVED_SEARCHES } from '@/features/transaction/integrated/components/savedSearches';
import { createInitialParams } from '@/features/transaction/integrated/components/initialParams';
// 패턴 템플릿 팝업
import { P02DetailModal } from './P02DetailModal';
import { COMPLAINT_HISTORY, P02ComplaintModal } from './P02ComplaintModal';
import { AddressLookupModal, BizLookupModal, IndustryLookupModal } from './P03LookupApplyPage';
import { BizNoChangeModal, CardLimitModal, DownloadReasonModal } from './P04ActionFeedbackPage';
import { P04PartialCancelModal } from './P04PartialCancelModal';

/** 팝업 하나 = 모음 페이지의 버튼 하나 */
type PopupKey =
  | 'favorite'
  | 'sms'
  | 'smsUnavailable'
  | 'permissionRequest'
  | 'specialPermission'
  | 'exceptionPermission'
  | 'menuPermission'
  | 'permissionChange'
  | 'passwordChange'
  | 'loginHistory'
  | 'statusHistory'
  | 'bizLookup'
  | 'ledgerPayDate'
  | 'ledgerHold'
  | 'ledgerRelease'
  | 'ledgerConfirm'
  | 'ledgerRecalc'
  | 'ledgerPayDateSave'
  | 'ledgerDetail'
  | `download-${DownloadStatus}`
  | 'excel'
  | 'savedSearch'
  | 'savedSearchEmpty'
  | 'detail'
  | 'detailError'
  | 'complaint'
  | 'complaintHistory'
  | 'industry'
  | 'biz'
  | 'address'
  | 'downloadReason'
  | 'bizNoChange'
  | 'cardLimit'
  | 'partialCancel';

interface PopupGroup {
  /** 화면ID · 화면명 */
  title: string;
  description?: string;
  buttons: { key: PopupKey; label: string }[];
}

const GROUPS: PopupGroup[] = [
  {
    title: 'KWPC1301 LNB',
    description: 'LNB 즐겨찾기 탭 → [편집]',
    buttons: [{ key: 'favorite', label: '즐겨찾기 편집' }],
  },
  {
    title: 'KWPC3000 로그인',
    description: '아이디 · 비밀번호 확인 후 (인증번호 123456)',
    buttons: [
      { key: 'sms', label: 'SMS 인증' },
      { key: 'smsUnavailable', label: 'SMS 인증 불가 (휴대전화번호 없음)' },
    ],
  },
  {
    title: 'KWPC2000 마이페이지',
    description:
      '권한관리 카드 → [권한 신청 현황] · 권한관리 특수권한 카드 → [특수권한 신청] · 메뉴 및 기능 권한 카드 → [보유 기능 권한 보기] · 권한 변경 이력 탭 → [상세보기]',
    buttons: [
      { key: 'permissionRequest', label: '권한 신청 현황 상세 (KWPC02020101)' },
      { key: 'specialPermission', label: '특수권한 신청 (KWPC02020004)' },
      { key: 'exceptionPermission', label: '개별 예외 권한 (KWPC02020001)' },
      { key: 'menuPermission', label: '메뉴 권한 신청 (KWPC02020002)' },
      { key: 'permissionChange', label: '권한 변경 이력 (KWPC02020201)' },
    ],
  },
  {
    title: 'KWPC02010100 계정관리',
    description:
      '비밀번호 및 로그인 보안 → [비밀번호 변경] (현재 비밀번호 password) · [로그인 이력], 기본 계정정보 → [계정 상태 이력]',
    buttons: [
      { key: 'passwordChange', label: '비밀번호 변경 (KWPC02010101)' },
      { key: 'loginHistory', label: '로그인 이력 (KWPC02010102)' },
      { key: 'statusHistory', label: '계정 상태 이력 (KWPC02010103)' },
    ],
  },
  {
    title: 'KWPC06010201 가맹점 정산 실행/처리',
    description:
      '검색 조건 [사업자 찾기] (KWPC06010203, 공통 팝업) · 조회 결과 원장 선택 후 일괄 처리 (KWPC06010204~08) · 정산원장 ID → 일반 원장 상세 (KWPC06010209~)',
    buttons: [
      { key: 'bizLookup', label: '사업자 찾기' },
      { key: 'ledgerPayDate', label: '지급예정일 일괄 변경' },
      { key: 'ledgerHold', label: '지급보류' },
      { key: 'ledgerRelease', label: '보류 해제' },
      { key: 'ledgerConfirm', label: '원장 지급확정' },
      { key: 'ledgerRecalc', label: '선택 원장 재산출' },
      { key: 'ledgerPayDateSave', label: '지급예정일 변경 저장·재산출' },
      { key: 'ledgerDetail', label: '일반 원장 상세' },
    ],
  },
  {
    title: 'KWPC0104 다운로드 센터',
    description: '목록 파일명 선택',
    buttons: [
      { key: 'download-DONE', label: '다운로드 요청 상세 · 완료' },
      { key: 'download-GENERATING', label: '다운로드 요청 상세 · 생성중' },
      { key: 'download-FAILED', label: '다운로드 요청 상세 · 실패' },
    ],
  },
  {
    title: 'KWPC04010100 통합 거래내역',
    buttons: [
      { key: 'excel', label: '엑셀 다운로드 설정 (KWPC04010107)' },
      { key: 'savedSearch', label: '내 검색조건 관리 (KWPC04010105)' },
      { key: 'savedSearchEmpty', label: '내 검색조건 관리 · 저장조건 없음' },
    ],
  },
  {
    title: '패턴 P02 Record → Form',
    description: '조회 전용 상세 · 조회 + 입력 팝업',
    buttons: [
      { key: 'detail', label: '거래 상세정보' },
      { key: 'detailError', label: '거래 상세정보 · 결제 오류' },
      { key: 'complaint', label: '고객문의·민원 처리' },
      { key: 'complaintHistory', label: '고객문의·민원 처리 · 접수정보 있음' },
    ],
  },
  {
    title: '패턴 P03 Lookup → Apply',
    description: '찾기 팝업 — 고른 값은 안내로 표시',
    buttons: [
      { key: 'industry', label: '표준산업 분류코드 조회' },
      { key: 'biz', label: '사업자번호 검색' },
      { key: 'address', label: '주소 검색' },
    ],
  },
  {
    title: '패턴 P04 Action → Feedback',
    buttons: [
      { key: 'downloadReason', label: '엑셀 다운로드 사유 입력' },
      { key: 'bizNoChange', label: '사업자번호 변경' },
      { key: 'cardLimit', label: '카드번호별 매입사 결제한도 설정' },
      { key: 'partialCancel', label: '부분취소 요청' },
    ],
  },
];

/** 안내 · 확인 창 (useDialog alert · confirm) — 화면에서 쓰는 문구 그대로 */
interface DialogExample {
  label: string;
  kind: 'alert' | 'confirm';
  message: string;
}

const DIALOG_GROUPS: { title: string; description: string; items: DialogExample[] }[] = [
  {
    title: '완료 안내',
    description: '처리 성공 후 (useAction success)',
    items: [
      { label: '비밀번호 변경', kind: 'alert', message: '비밀번호가 변경되었습니다.' },
      { label: '저장', kind: 'alert', message: '저장되었습니다.' },
      { label: '즐겨찾기 저장', kind: 'alert', message: '즐겨찾기 메뉴가 저장되었습니다.' },
      { label: '부분취소 요청', kind: 'alert', message: '부분취소를 요청했습니다.' },
      {
        label: '엑셀 다운로드 요청',
        kind: 'alert',
        message: '엑셀 다운로드를 요청했습니다. 대용량 파일은 다운로드 센터에서 받을 수 있습니다.',
      },
    ],
  },
  {
    title: '확인 (Confirm)',
    description: '처리 전 [취소] · [확인]',
    items: [
      { label: '저장', kind: 'confirm', message: '저장할까요?' },
      { label: '선택 건 처리', kind: 'confirm', message: '선택한 3건을 처리할까요?' },
      { label: '결제한도 등록', kind: 'confirm', message: '입력한 결제한도를 등록할까요?' },
      {
        label: '닫기 (변경 내용 있음)',
        kind: 'confirm',
        message: '변경한 내용이 저장되지 않습니다. 닫을까요?',
      },
    ],
  },
  {
    title: '입력 · 선택 확인',
    description: '처리 전 검사에 걸렸을 때 (useAction validate)',
    items: [
      { label: '선택 없음', kind: 'alert', message: '처리할 정산원장을 선택해주세요.' },
      { label: '필수 입력', kind: 'alert', message: '취소사유를 입력해주세요.' },
      { label: '준비 중', kind: 'alert', message: '사업자 찾기 팝업은 준비 중입니다.' },
    ],
  },
  {
    title: '실패 안내',
    description: '처리 실패 (useAction failure)',
    items: [
      {
        label: '처리 오류',
        kind: 'alert',
        message: '취소 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
      {
        label: '중복 등록',
        kind: 'alert',
        message: '이미 등록된 사업자번호입니다. 번호를 확인해주세요.',
      },
    ],
  },
];

const SMS_CHALLENGE = {
  challengeId: 'popup-gallery',
  maskedPhone: '010-****-5678',
  expiresIn: 180,
};

/** 다운로드 센터 예시 데이터에서 상태별 첫 요청번호 */
function useDownloadIds() {
  const [ids, setIds] = useState<Partial<Record<DownloadStatus, string>>>({});
  useEffect(() => {
    fetchDownloadRequests({
      params: {
        area: 'all',
        status: 'all',
        fileStatus: 'all',
        requestDate: { start: '', end: '' },
        keyword: '',
      },
      page: 1,
      pageSize: 100,
    }).then(({ items }) => {
      const found: Partial<Record<DownloadStatus, string>> = {};
      for (const item of items) found[item.status] ??= item.id;
      setIds(found);
    });
  }, []);
  return ids;
}

/**
 * 팝업 모음 (개발 서버 전용, 임의 작업) — 앱의 팝업을 화면별로 모아 버튼 하나로 연다.
 * 실제 화면이 쓰는 팝업 컴포넌트를 그대로 불러오므로 화면과 어긋나지 않는다. 결과(선택 · 저장)는 안내로만 보여 준다.
 * 새 팝업을 만들면 GROUPS에 버튼 한 줄 + 아래 렌더 한 줄을 추가한다.
 * 아래 "안내 · 확인 창" 묶음은 팝업 없이 안내(Alert) · 확인(Confirm) 창만 띄운다 — 문구를 바꾸면 DIALOG_GROUPS도 맞춘다.
 * `?open=<버튼 키>`로 들어오면 그 팝업을 바로 연다 (화면 목록의 팝업 링크, 예: /patterns/popups?open=bizLookup)
 */
export function PopupsPage() {
  const dialog = useDialog();
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState<PopupKey | null>(() => {
    const key = searchParams.get('open');
    return GROUPS.some((g) => g.buttons.some((b) => b.key === key)) ? (key as PopupKey) : null;
  });
  // 일괄 처리 팝업 예시 대상: 정산원장 조회 첫 3건
  const [ledgerRows, setLedgerRows] = useState<LedgerActionRow[]>([]);
  useEffect(() => {
    void fetchSettlementLedgers({ params: createSettlementParams(), page: 1, pageSize: 3 }).then(
      (r) => setLedgerRows(toActionRows(r.items)),
    );
  }, []);
  const [favoriteIds, setFavoriteIds] = useState(['KWPC0401', 'KWPC0601', 'KWPC0104']);
  const [saved, setSaved] = useState(EXAMPLE_SAVED_SEARCHES);
  const [bizNo, setBizNo] = useState('123-45-67890');
  const downloadIds = useDownloadIds();
  const close = () => setOpen(null);
  const is = (key: PopupKey) => open === key;
  const report = (label: string, value: ReactNode) => {
    close();
    void dialog.alert(
      <>
        {label}: {value}
      </>,
    );
  };
  const downloadId = open?.startsWith('download-')
    ? (downloadIds[open.slice('download-'.length) as DownloadStatus] ?? null)
    : null;

  return (
    <>
      <PageLayout.Title title="팝업 모음 (개발용)" />

      {GROUPS.map((group) => (
        <PageLayout.Section key={group.title} title={group.title} titleAddon={group.description}>
          <ControlGroup>
            {group.buttons.map((b) => (
              <Button
                key={b.key}
                variant="neutral"
                appearance="line"
                onClick={() => setOpen(b.key)}
              >
                {b.label}
              </Button>
            ))}
          </ControlGroup>
        </PageLayout.Section>
      ))}

      {/* 안내 · 확인 창 (팝업 없이 창만) */}
      {DIALOG_GROUPS.map((group) => (
        <PageLayout.Section
          key={group.title}
          title={`안내 · 확인 창 — ${group.title}`}
          titleAddon={group.description}
        >
          <ControlGroup>
            {group.items.map((item) => (
              <Button
                key={item.label}
                variant="neutral"
                appearance="line"
                onClick={() =>
                  void (item.kind === 'confirm'
                    ? dialog.confirm(item.message)
                    : dialog.alert(item.message))
                }
              >
                {item.label}
              </Button>
            ))}
          </ControlGroup>
        </PageLayout.Section>
      ))}

      {/* 실제 화면 팝업 */}
      <FavoriteEditModal
        open={is('favorite')}
        items={lnbItems}
        favoriteIds={favoriteIds}
        onClose={close}
        onSaved={setFavoriteIds}
      />
      {is('sms') && (
        <SmsVerifyModal
          challenge={SMS_CHALLENGE}
          onClose={close}
          onVerified={() => report('SMS 인증', '완료 (로그인 처리는 로그인 화면에서)')}
        />
      )}
      {is('smsUnavailable') && <SmsUnavailableModal onClose={close} />}
      <PermissionRequestModal open={is('permissionRequest')} onClose={close} />
      <SpecialPermissionRequestModal open={is('specialPermission')} onClose={close} />
      <ExceptionPermissionModal open={is('exceptionPermission')} onClose={close} />
      <MenuPermissionRequestModal open={is('menuPermission')} onClose={close} />
      <PermissionChangeModal open={is('permissionChange')} onClose={close} />
      <PasswordChangeModal
        open={is('passwordChange')}
        onClose={close}
        // 완료 안내("비밀번호가 변경되었습니다.")는 팝업이 띄운다
        onChanged={() => undefined}
      />
      <LoginHistoryModal open={is('loginHistory')} onClose={close} />
      <AccountStatusHistoryModal open={is('statusHistory')} onClose={close} />
      <PayDateChangeModal
        open={is('ledgerPayDate') && ledgerRows.length > 0}
        rows={ledgerRows}
        onClose={close}
        onDone={async () => undefined}
      />
      <PayHoldModal
        open={is('ledgerHold') && ledgerRows.length > 0}
        rows={ledgerRows}
        onClose={close}
        onDone={async () => undefined}
      />
      <HoldReleaseModal
        open={is('ledgerRelease') && ledgerRows.length > 0}
        rows={ledgerRows}
        onClose={close}
        onDone={async () => undefined}
      />
      <LedgerDetailModal
        ledger={is('ledgerDetail') ? (ledgerRows[1] ?? ledgerRows[0] ?? null) : null}
        onClose={close}
        onAction={(action, ledger) => report('일반 원장 상세', `${ledger.ledgerId} · ${action}`)}
      />
      <PayConfirmModal
        open={is('ledgerConfirm') && ledgerRows.length > 0}
        rows={ledgerRows}
        onClose={close}
        onDone={async () => undefined}
      />
      <RecalcModal
        open={is('ledgerRecalc') && ledgerRows.length > 0}
        rows={ledgerRows}
        onClose={close}
        onDone={async () => undefined}
      />
      <PayDateSaveModal
        open={is('ledgerPayDateSave') && ledgerRows.length > 0}
        rows={ledgerRows}
        newPayDate="2026-09-02"
        onClose={close}
        onDone={async () => undefined}
      />
      <BizFinderModal
        open={is('bizLookup')}
        onCancel={close}
        onSelect={(r) =>
          report(
            '사업자 찾기',
            `${r.name} (${r.bizNo}) · CPID ${r.allCpids ? '전체' : r.cpids.join(', ')}`,
          )
        }
      />
      <DownloadDetailModal
        requestId={downloadId}
        onClose={close}
        onAction={(detail, action) => report('다운로드 요청 상세', `${detail.id} · ${action}`)}
      />
      <ExcelDownloadModal open={is('excel')} onClose={close} />
      <SavedSearchModal
        open={is('savedSearch') || is('savedSearchEmpty')}
        saved={is('savedSearchEmpty') ? [] : saved}
        appliedId={null}
        currentParams={createInitialParams()}
        onSave={(list) => !is('savedSearchEmpty') && setSaved(list)}
        onClose={close}
      />

      {/* 패턴 템플릿 팝업 */}
      <P02DetailModal
        key={is('detailError') ? 'error' : 'normal'}
        open={is('detail') || is('detailError')}
        error={is('detailError')}
        onClose={close}
      />
      <P02ComplaintModal
        open={is('complaint') || is('complaintHistory')}
        history={is('complaintHistory') ? COMPLAINT_HISTORY : []}
        onClose={close}
      />
      <IndustryLookupModal
        open={is('industry')}
        onSelect={(row) => report('표준산업 분류코드', `${row.code} ${row.detail}`)}
        onClose={close}
      />
      <BizLookupModal
        open={is('biz')}
        onSelect={(row) => report('사업자번호', `${row.bizNo} ${row.name}`)}
        onClose={close}
      />
      <AddressLookupModal
        open={is('address')}
        onSelect={(item) => report('주소', `${item.zipCode} ${item.roadAddress}`)}
        onClose={close}
      />
      <DownloadReasonModal open={is('downloadReason')} onClose={close} />
      <BizNoChangeModal
        open={is('bizNoChange')}
        current={bizNo}
        onChanged={setBizNo}
        onClose={close}
      />
      <CardLimitModal open={is('cardLimit')} onClose={close} />
      <P04PartialCancelModal open={is('partialCancel')} onClose={close} />
    </>
  );
}
