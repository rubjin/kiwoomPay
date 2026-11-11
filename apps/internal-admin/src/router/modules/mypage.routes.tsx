import { Route } from 'react-router-dom';
import { menuPlaceholderRoutes } from '../placeholder';

// 02 마이페이지
// 화면을 만들면 placeholder 대신 lazy 페이지로 바꾼다 (transaction.routes.tsx 참고)
//   0201 계정관리 → pages/mypage/account/
//   0202 권한관리 → pages/mypage/permission/
//   0203 알림센터 → pages/mypage/notification/
export const mypageRoutes = <Route path="mypage">{menuPlaceholderRoutes('mypage')}</Route>;
