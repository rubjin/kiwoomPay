import { PageLayout } from '@kiwoompay/design-system';
import type { MenuInfo } from '@/constants/menu';

/** 아직 만들지 않은 화면 자리 */
export function PlaceholderPage({ menu }: { menu: MenuInfo }) {
  return (
    <>
      <PageLayout.Title title={menu.depth2} />
      <PageLayout.Section title="준비 중">
        {menu.id} · {menu.depth1} &gt; {menu.depth2} · <code>{menu.path}</code>
      </PageLayout.Section>
    </>
  );
}
