import { Route } from 'react-router-dom';
import { PlaceholderPage } from '@/components/common/PlaceholderPage';
import { menusOf } from '@/constants/menu';

/** 아직 화면이 없는 2depth 메뉴를 임시 페이지로 연결한다. 화면을 만들면 lazy 페이지 라우트로 바꾼다 */
export function menuPlaceholderRoutes(depth1Path: string, except: string[] = []) {
  return menusOf(depth1Path)
    .filter((menu) => !except.includes(menu.path))
    .map((menu) => (
      <Route
        key={menu.id}
        path={`${menu.path.split('/')[2]}/*`}
        element={<PlaceholderPage menu={menu} />}
      />
    ));
}
