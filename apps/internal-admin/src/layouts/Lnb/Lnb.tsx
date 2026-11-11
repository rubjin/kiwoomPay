import { Lnb as LnbBase, type LnbMenuItem } from '@kiwoompay/design-system';
import { useLocation, useNavigate } from 'react-router-dom';
import { config } from '@/app/config';
import logoLnb from '@/assets/logo/logo-lnb.svg';
import { MENUS } from '@/constants/menu';

// KWPC0103 LNB. TODO(이관): 메뉴는 서버(GET /menus/tree → buildTree → 권한 필터)에서 받는다.
// 지금은 constants/menu.ts로 1 · 2depth만 그린다. 메뉴즐겨찾기 팝업도 이 폴더에 둔다.
const items: LnbMenuItem[] = Object.values(
  MENUS.filter((m) => m.path.split('/')[1] !== 'auth').reduce<Record<string, LnbMenuItem>>(
    (groups, m) => {
      const key = m.path.split('/')[1] ?? '';
      groups[key] ??= { id: key, label: m.depth1, children: [] };
      // href는 새 탭 열기용 실제 주소(컨텍스트 패스 포함). 클릭 이동은 MENUS의 path로 한다
      groups[key].children?.push({ id: m.id, label: m.depth2, href: config.basename + m.path });
      return groups;
    },
    {},
  ),
);

export function Lnb() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = MENUS.find((m) => pathname.startsWith(m.path));

  return (
    <LnbBase
      logo={<img src={logoLnb} alt="키움페이" width={125} height={23} />}
      items={items}
      activeId={active?.id}
      onNavigate={(item, event) => {
        const menu = MENUS.find((m) => m.id === item.id);
        if (!menu) return;
        event.preventDefault(); // 링크는 그대로 두고(새 탭 열기 등) 이동만 SPA로
        navigate(menu.path);
      }}
    />
  );
}
