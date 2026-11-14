import { PageLayout } from '@kiwoompay/design-system';

/**
 * 레이아웃 템플릿 (화면 확인용, 임의 작업): App Shell(Header · LNB · Work Tab · Footer) + 화면 타이틀까지.
 * 새 화면은 MainLayout 안에서 PageLayout.Title부터 시작한다. 가이드: Storybook Layout/Page Layout
 */
export function P00LayoutPage() {
  return <PageLayout.Title title="화면 타이틀" />;
}
