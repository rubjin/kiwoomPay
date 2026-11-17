import { PageLayout } from '@kiwoompay/design-system';
import { useLocation } from 'react-router-dom';
import type { MenuInfo } from '@/constants/menu';
import { menu3OfPath } from '@/constants/menu3';

/** 아직 만들지 않은 화면 자리. 3depth 경로면 3depth 이름 */
export function PlaceholderPage({ menu }: { menu: MenuInfo }) {
  const { pathname } = useLocation();
  const menu3 = menu3OfPath(pathname);
  return (
    <>
      <PageLayout.Title title={menu3?.name ?? menu.depth2} />
      <PageLayout.Section title="준비 중">
        {menu3?.id ?? menu.id} · {menu.depth1} &gt; {menu.depth2}
        {menu3 && <> &gt; {menu3.name}</>} · <code>{pathname}</code>
      </PageLayout.Section>
    </>
  );
}
