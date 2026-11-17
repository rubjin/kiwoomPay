import { Lnb as LnbBase, type IconName, type LnbMenuItem } from '@kiwoompay/design-system';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { config } from '@/app/config';
import logoLnb from '@/assets/logo/logo-lnb.svg';
import { MENUS } from '@/constants/menu';
import { FavoriteEditModal } from './FavoriteEditModal';

// KWPC0103 LNB. TODO(이관): 메뉴는 서버(GET /menus/tree → buildTree → 권한 필터)에서 받는다.
// 지금은 constants/menu.ts로 1 · 2depth만 그린다. 메뉴즐겨찾기 팝업도 이 폴더에 둔다.
// 구성은 가이드(Figma LNB)와 같게: 맨 위 대시보드(1Depth 단독) → 업무 1Depth.
// 메인 · 마이페이지 · 로그인은 LNB에 두지 않는다 — 메인 = 대시보드, 마이페이지 · 다운로드센터는 헤더에서 진입

const DASHBOARD_ID = 'KWPC0101';
const NOT_IN_LNB = new Set(['main', 'mypage', 'auth']);

// 1Depth 아이콘 (경로 첫 단계 기준). 시스템관리는 Figma에 없어 임의로 정함 (임의 작업)
const DEPTH1_ICONS: Record<string, IconName> = {
  transaction: 'card-check',
  statistics: 'bar-chart',
  settlement: 'file-text',
  operation: 'building',
  addon: 'archive',
  rm: 'shield-check',
  system: 'setting',
};

const firstSegment = (path: string) => path.split('/')[1] ?? '';
// href는 새 탭 열기용 실제 주소(컨텍스트 패스 포함). 클릭 이동은 MENUS의 path로 한다
const hrefOf = (path: string) => config.basename + path;

const dashboard = MENUS.find((m) => m.id === DASHBOARD_ID);

export const lnbItems: LnbMenuItem[] = [
  ...(dashboard
    ? [
        {
          id: dashboard.id,
          label: dashboard.depth2,
          icon: 'home' as const,
          href: hrefOf(dashboard.path),
        },
      ]
    : []),
  ...Object.values(
    MENUS.filter((m) => !NOT_IN_LNB.has(firstSegment(m.path))).reduce<Record<string, LnbMenuItem>>(
      (groups, m) => {
        const key = firstSegment(m.path);
        groups[key] ??= { id: key, label: m.depth1, icon: DEPTH1_ICONS[key], children: [] };
        groups[key].children?.push({ id: m.id, label: m.depth2, href: hrefOf(m.path) });
        return groups;
      },
      {},
    ),
  ),
];

export function Lnb() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = MENUS.find((m) => pathname.startsWith(m.path));
  // TODO(API) 사용자 즐겨찾기 메뉴 (지금은 예시 · 화면 안에서만 유지)
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['KWPC0401', 'KWPC0601', 'KWPC0501']);
  // 열 때마다 새로 그려 초안을 저장값으로 맞춘다
  const [editKey, setEditKey] = useState(0);
  const [editing, setEditing] = useState(false);

  return (
    <>
      <LnbBase
        logo={<img src={logoLnb} alt="키움페이" width={125} height={23} />}
        items={lnbItems}
        activeId={active?.id}
        onNavigate={(item, event) => {
          const menu = MENUS.find((m) => m.id === item.id);
          if (!menu) return;
          event.preventDefault(); // 링크는 그대로 두고(새 탭 열기 등) 이동만 SPA로
          navigate(menu.path);
        }}
        favoriteIds={favoriteIds}
        onFavoriteEdit={() => {
          setEditKey((k) => k + 1);
          setEditing(true);
        }}
      />
      <FavoriteEditModal
        key={editKey}
        open={editing}
        items={lnbItems}
        favoriteIds={favoriteIds}
        onClose={() => setEditing(false)}
        onSaved={setFavoriteIds}
      />
    </>
  );
}
