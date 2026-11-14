import { Tab } from '@kiwoompay/design-system';
import { useNavigate } from 'react-router-dom';
import { MENU } from '@/constants/menu';

const TABS = [
  { value: MENU.KWPC0201, label: '계정관리' },
  { value: MENU.KWPC0202, label: '권한관리' },
];

/**
 * 마이페이지 하위 화면 탭 (계정관리 · 권한관리, 제목 탭). 누르면 해당 메뉴 화면으로 이동.
 * 탭 밑줄이 아래 카드 위 선에 닿도록 카드와 붙여 쓴다 (시안 계정관리 · 권한관리.png)
 */
export function MypageTabs({ current }: { current: string }) {
  const navigate = useNavigate();
  return (
    <Tab
      variant="title"
      value={current}
      onChange={(path) => navigate(path)}
      aria-label="마이페이지"
    >
      {TABS.map((t) => (
        <Tab.Item key={t.value} value={t.value}>
          {t.label}
        </Tab.Item>
      ))}
    </Tab>
  );
}
