import { Tab } from '@kiwoompay/design-system';
import { useNavigate } from 'react-router-dom';

export const GENERAL_APPROVAL_PATH = '/system/user-security/permission-approval';
export const SPECIAL_APPROVAL_PATH = '/system/user-security/permission-approval/special';

const TABS = [
  { value: GENERAL_APPROVAL_PATH, label: '일반 메뉴·기능 권한' },
  { value: SPECIAL_APPROVAL_PATH, label: '특수권한 결재 현황' },
];

/**
 * 권한 신청 승인 관리 제목 탭 (화면 전체가 바뀜 — 일반 메뉴·기능 권한 KWPC10010401 · 특수권한 결재 현황 KWPC10010403).
 * 화면설계서에는 탭이 없지만 같은 메뉴의 4depth 화면이라 메뉴·기능 관리처럼 제목 탭으로 잇는다 (TODO(정책) 확인).
 * 바로 아래 박스(검색 조건)와 붙여 쓴다 — `<Stack gap={0}>` 안에 탭 + 박스
 */
export function PermissionApprovalTabs({ current }: { current: string }) {
  const navigate = useNavigate();
  return (
    <Tab
      variant="title"
      value={current}
      onChange={(path) => navigate(path)}
      aria-label="권한 신청 승인 관리"
    >
      {TABS.map((t) => (
        <Tab.Item key={t.value} value={t.value}>
          {t.label}
        </Tab.Item>
      ))}
    </Tab>
  );
}
