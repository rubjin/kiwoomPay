// 개발 컨벤션 · "화면 전용 부품" 탭: 컴포넌트(디자인 시스템 · 앱 공통)로 만들지 않고 한 화면 안에서만 쓰는 것.
// 2026-11-14 점검 기준. 화면을 만들다 같은 모양이 두 번째로 나오면 여기 판단을 보고 공통으로 올린다

/**
 * 유지: 그 화면 전용으로 둔다 · 후보: 두 번째 사용처가 생기면 올린다 · 필요: 이미 여러 곳에 같은 코드가 있다
 * · 완료: 공통으로 올렸다 (plan에 새 위치)
 */
export type LocalVerdict = '유지' | '후보' | '필요' | '완료';

export interface LocalPart {
  name: string;
  /** features/ 아래 경로 (features/ 생략). 공통 폴더는 (공통) src/ 기준 */
  where: string;
  role: string;
  verdict: LocalVerdict;
  /** 올린다면 어디로 · 어떻게 (완료면 새 위치) */
  plan?: string;
}

export interface LocalPartGroup {
  title: string;
  parts: LocalPart[];
}

export const LOCAL_PARTS: LocalPartGroup[] = [
  {
    title: '컴포넌트',
    parts: [
      {
        name: 'SelectAll · toggle',
        where: 'operation/merchant-contract/basic/components/CpidBasicPanel.tsx · ContactTable.tsx',
        role: '표 머리 전체 선택 체크박스(indeterminate 포함) + 한 줄 선택 토글',
        verdict: '완료',
        plan: '디자인 시스템 SelectAllCheckbox(전체 선택) + toggleKey(줄 선택) — 2026-11-17 앱 → 디자인 시스템. 선택 상태는 화면이 가진다',
      },
      {
        name: '팝업 본문 영역 (소제목 + 내용)',
        where: '다운로드 상세 · 원장 상세 · 사업자 찾기 · 마이페이지 팝업 등 11개 팝업 17곳',
        role: 'Stack + SectionHeading(md · h3) 조합, 소제목 ↔ 내용 16 · 8 혼재',
        verdict: '완료',
        plan: '디자인 시스템 Modal.Section(title · description · step · actions · gap 16 / 8) — 다운로드 상세의 Section 래퍼 삭제. 내 검색조건 관리(ConfigSplit 오른쪽 칸)는 틀이 첫 줄을 맞춰 그대로',
      },
      {
        name: 'TwoLines',
        where: 'settlement/merchant/execute/components/actions/ledgerActionColumns.tsx',
        role: '표 칸 안 두 줄 (가맹점 / CPID · 결제수단 / 주기)',
        verdict: '후보',
        plan: '다른 목록에도 두 줄 칸이 나오면 GridPlaceholder 칸 옵션으로',
      },
      {
        name: 'YesNo',
        where: 'operation/merchant-contract/basic/components/CpidBasicPanel.tsx',
        role: '예 · 아니오 가로 라디오 (선택지 YES_NO 포함)',
        verdict: '후보',
        plan: '선택지는 constants/options(YES_NO_OPTIONS)로, 라디오는 RadioGroup 그대로',
      },
      {
        name: 'ListActions',
        where: 'operation/merchant-contract/basic/components/CpidBasicPanel.tsx',
        role: '제목 줄 오른쪽 [이력조회](텍스트) + [추가] [삭제]',
        verdict: '후보',
        plan: '등록 · 수정 화면의 목록형 표마다 반복되면 앱 components/common으로',
      },
      {
        name: 'AddressCell',
        where: 'operation/merchant-contract/basic/components/BasicInfoTable.tsx',
        role: '주소 칸 (국가 · 우편번호 · 주소 + 주소 찾기)',
        verdict: '후보',
        plan: '다른 등록 화면에 주소 입력이 나오면 앱 components/common으로 (주소 찾기 팝업 포함)',
      },
      {
        name: 'RequestConditions',
        where: 'main/download-center/components/RequestConditions.tsx',
        role: '요청 당시 조회조건 줄 (라벨 값 | 라벨 값 …, 시안 측정 인라인 스타일)',
        verdict: '후보',
        plan: '코드 주석대로 같은 모양이 다른 화면에도 나오면 디자인 시스템으로',
      },
      {
        name: 'DownloadStatusBadge · FileStatusBadge',
        where: 'main/download-center/components/statusBadges.tsx',
        role: '처리상태 · 파일상태 → Badge 색',
        verdict: '유지',
      },
      {
        name: 'MypageTabs',
        where: 'mypage/components/MypageTabs.tsx',
        role: '마이페이지 2depth 탭 (계정관리 · 권한관리 · 알림센터)',
        verdict: '유지',
      },
      {
        name: 'BasisTab · TxTab · Body',
        where: 'settlement/merchant/execute/components/detail/LedgerDetailModal.tsx',
        role: '원장 상세 팝업 탭 내용',
        verdict: '유지',
      },
      {
        name: 'LedgerActionModal (Body)',
        where: 'settlement/merchant/execute/components/actions/LedgerActionModal.tsx',
        role: '정산원장 일괄 처리 팝업 틀 (지급일 변경 · 보류 · 해제가 같이 씀)',
        verdict: '유지',
      },
      {
        name: 'PermissionRequestBody · BizLookupBody',
        where:
          'mypage/components/PermissionRequestModal.tsx · (공통) components/popups/BizFinderModal.tsx',
        role: '팝업 본문 (열릴 때만 상태를 만들려고 나눔)',
        verdict: '유지',
      },
    ],
  },
  {
    title: '함수 · 상수 · 스타일',
    parts: [
      {
        name: 'wait(ms)',
        where: '<1depth>/*.api.ts · (공통) api/*.api.ts — 11개 파일',
        role: '예시 데이터 응답 지연',
        verdict: '완료',
        plan: '(공통) api/mock.ts wait (API 연결 시 함께 삭제)',
      },
      {
        name: '페이지 자르기',
        where:
          'main/downloadCenter.api.ts · mypage/permissionRequest.api.ts · settlement/merchantSettlement.api.ts',
        role: 'rows.slice(from, from + pageSize) → { items, total }',
        verdict: '완료',
        plan: '(공통) api/mock.ts paginate(rows, { page, pageSize }) → { items, total }',
      },
      {
        name: 'won · dash · count',
        where:
          'ledgerActionRows.ts · LedgerDetailModal.tsx · ledgerColumns.tsx · downloadColumns.tsx · DownloadDetailModal.tsx · PermissionRequestModal.tsx · BizFinderModal.tsx',
        role: "금액 천 단위(원 · 부호), 빈 값 '-', 건수 · 개수",
        verdict: '완료',
        plan: "(공통) utils/format.ts — formatNumber(표 금액 칸) · formatWon(원 · signed) · formatCount(수 + 단위) · orDash(없으면 '-', 숫자는 쉼표)",
      },
      {
        name: 'STATUS_TONE (원장 상태 색)',
        where:
          'settlement/merchant/execute/components/ledgerColumns.tsx · detail/LedgerDetailModal.tsx',
        role: '원장 상태 → Badge 색, 두 파일에 같은 표',
        verdict: '완료',
        plan: 'settlement/merchant/execute/components/ledgerStatus.ts LEDGER_STATUS_TONE',
      },
      {
        name: '세로 묶음 인라인 스타일',
        where: '팝업 · 마이페이지 등 16곳',
        role: "style={{ display: 'flex', flexDirection: 'column', gap: … }}",
        verdict: '완료',
        plan: '디자인 시스템 Stack (gap 0 · 4 · 8 · 12 · 16(기본) · 24, as div · section · span) — 16곳 교체',
      },
      {
        name: '보조 설명 글자 (12 · 13, 회색)',
        where:
          'mypage/permission/PermissionPage.tsx 3곳 · main/download-center/components/RequestConditions.tsx',
        role: "style={{ fontSize: 12, color: 'var(--kp-color-text-secondary)' }} 인라인",
        verdict: '완료',
        plan: '디자인 시스템 Text(variant 역할 이름 · tone · as). 요청 조건 값 14 SemiBold는 역할 이름에 없어 측정값 그대로',
      },
      {
        name: '검색 필드 남는 폭 채우기',
        where:
          'DownloadCenterPage 파일명 · MerchantSettlementExecutePage 가맹점명 · (공통) BizFinderModal',
        role: 'Field style={{ flex: … }}',
        verdict: '후보',
        plan: 'Field grow 보류 — 확정 결정 "검색 조건 기본 폭"(필드는 흐름, flex로 늘리지 않음)과 반대. 남은 flex를 지울지 결정 필요',
      },
      {
        name: '양 끝 정렬 줄',
        where: 'mypage/permission/PermissionPage.tsx 2곳',
        role: '왼쪽 탭 · 제목, 오른쪽 문구 · 버튼 (flex space-between 인라인)',
        verdict: '후보',
        plan: '다른 화면에도 나오면 SectionHeading actions 또는 디자인 시스템 줄 컴포넌트로',
      },
      {
        name: '2열 그리드',
        where:
          'mypage/account/AccountPage.tsx · mypage/permission/PermissionPage.tsx · settlement …/LedgerConfirmModals.tsx',
        role: 'display: grid + gridTemplateColumns 인라인 (쓰임이 제각각)',
        verdict: '후보',
        plan: '쓰임이 같아지면 HubGrid처럼 열 비율을 받는 레이아웃으로',
      },
      {
        name: '표 칸 위아래 여백',
        where: '(공통) BizFinderModal · settlement …/LedgerDetailModal.tsx · TwoLines',
        role: '표 미리보기 칸 안 paddingBlock 인라인',
        verdict: '후보',
        plan: '결과 표가 IBSheet로 바뀌면 사라질 코드 — 지금은 만들지 않음',
      },
      {
        name: '화면 고유 폭 · 시안 측정값',
        where: 'TransactionSearchPanel · CpidBasicPanel · AccountPage 등',
        role: '시안에서 잰 칸 폭 · 열 구성 상수 (인라인)',
        verdict: '유지',
        plan: '화면마다 다른 값이라 화면 파일 위 상수로 둔다 (확정 규칙)',
      },
    ],
  },
];
