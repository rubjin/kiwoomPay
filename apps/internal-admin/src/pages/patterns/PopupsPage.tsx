import {
  // 화면 틀 · 버튼
  PageLayout,
  Button,
  ControlGroup,
  // 결과 안내
  useDialog,
} from '@kiwoompay/design-system';
import { useEffect, useState, type ReactNode } from 'react';
// 실제 화면 팝업 — 화면이 쓰는 컴포넌트를 그대로 불러온다 (복사하지 않음)
import { FavoriteEditModal } from '@/layouts/Lnb/FavoriteEditModal';
import { lnbItems } from '@/layouts/Lnb/Lnb';
import { SmsUnavailableModal } from '@/pages/auth/login/components/SmsUnavailableModal';
import { SmsVerifyModal } from '@/pages/auth/login/components/SmsVerifyModal';
import { PermissionRequestModal } from '@/pages/mypage/hub/components/PermissionRequestModal';
import { DownloadDetailModal } from '@/pages/main/download-center/components/DownloadDetailModal';
import { fetchDownloadRequests } from '@/api/main/downloadCenter';
import type { DownloadStatus } from '@/types/main/downloadCenter';
import { ExcelDownloadModal } from '@/pages/transaction/integrated/components/ExcelDownloadModal';
import { SavedSearchModal } from '@/pages/transaction/integrated/components/SavedSearchModal';
import { EXAMPLE_SAVED_SEARCHES } from '@/pages/transaction/integrated/components/savedSearches';
import { createInitialParams } from '@/pages/transaction/integrated/components/initialParams';
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
    description: '권한관리 카드 → [권한 신청 현황]',
    buttons: [{ key: 'permissionRequest', label: '권한 신청 현황' }],
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
 */
export function PopupsPage() {
  const dialog = useDialog();
  const [open, setOpen] = useState<PopupKey | null>(null);
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
