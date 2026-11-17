import { PageLayout } from '@kiwoompay/design-system';
import { Outlet } from 'react-router-dom';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { Lnb } from '../Lnb/Lnb';
import { useWorkTabBar } from '../WorkTabBar/WorkTabBar';

/**
 * 로그인 후 공통 App Shell (LNB · Header · Work Tab · 본문 · Footer). 내부관리자는 데스크톱 고정 — 화면 최소 폭 1920 (Figma 화면 폭).
 * 최소 폭은 LNB 오른쪽 영역에 준다(1920 − LNB 240) — 창이 좁아도 그 안에서만 가로 스크롤되고 LNB는 움직이지 않는다
 */
const CONTENT_MIN_WIDTH = 1920 - 240;

export function MainLayout() {
  const { workTab, workTabActions } = useWorkTabBar();
  return (
    <PageLayout
      lnb={<Lnb />}
      header={<Header />}
      workTab={workTab}
      workTabActions={workTabActions}
      footer={<Footer />}
      contentMinWidth={CONTENT_MIN_WIDTH}
    >
      <Outlet />
    </PageLayout>
  );
}
