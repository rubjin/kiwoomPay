import { Tab } from '@kiwoompay/design-system';
import { useNavigate } from 'react-router-dom';

export const MENU_PATH = '/system/user-security/menu';
export const FUNCTION_CODE_PATH = '/system/user-security/function-code';

const TABS = [
  { value: MENU_PATH, label: '메뉴관리' },
  { value: FUNCTION_CODE_PATH, label: '기능 코드 관리' },
];

/**
 * 메뉴·기능 관리 제목 탭 (화면 전체가 바뀜 — 메뉴관리 KWPC10010201 · 기능 코드 관리 KWPC10010202).
 * 바로 아래 박스(검색 조건)와 붙여 쓴다 — `<Stack gap={0}>` 안에 탭 + 박스
 */
export function MenuFunctionTabs({ current }: { current: string }) {
  const navigate = useNavigate();
  return (
    <Tab
      variant="title"
      value={current}
      onChange={(path) => navigate(path)}
      aria-label="메뉴·기능 관리"
    >
      {TABS.map((t) => (
        <Tab.Item key={t.value} value={t.value}>
          {t.label}
        </Tab.Item>
      ))}
    </Tab>
  );
}
