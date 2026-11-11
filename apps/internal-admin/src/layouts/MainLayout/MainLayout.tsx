import { PageLayout } from '@kiwoompay/design-system';
import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header';
import { Lnb } from '../Lnb/Lnb';

/** 로그인 후 공통 App Shell (LNB · Header · 본문) */
export function MainLayout() {
  return (
    <PageLayout lnb={<Lnb />} header={<Header />}>
      <Outlet />
    </PageLayout>
  );
}
