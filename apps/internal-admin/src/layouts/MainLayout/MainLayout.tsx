import { PageLayout } from '@kiwoompay/design-system';
import { Outlet } from 'react-router-dom';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { Lnb } from '../Lnb/Lnb';
import { useWorkTabBar } from '../WorkTabBar/WorkTabBar';

/** 로그인 후 공통 App Shell (LNB · Header · Work Tab · 본문 · Footer). 내부관리자는 데스크톱 고정 — 최소 폭 1920 (Figma 화면 폭) */
const MIN_WIDTH = 1920;

export function MainLayout() {
  const { workTab, workTabActions } = useWorkTabBar();
  return (
    <PageLayout
      lnb={<Lnb />}
      header={<Header />}
      workTab={workTab}
      workTabActions={workTabActions}
      footer={<Footer />}
      style={{ minWidth: MIN_WIDTH }}
    >
      <Outlet />
    </PageLayout>
  );
}
