import { PageLayout } from '@kiwoompay/design-system';
import { Outlet } from 'react-router-dom';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { Lnb } from '../Lnb/Lnb';

/** 로그인 후 공통 App Shell (LNB · Header · 본문 · Footer) */
export function MainLayout() {
  return (
    <PageLayout lnb={<Lnb />} header={<Header />} footer={<Footer />}>
      <Outlet />
    </PageLayout>
  );
}
