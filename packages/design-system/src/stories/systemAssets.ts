// 스토리 예시 이미지 = 시스템(앱)의 실제 이미지. 복사본을 두지 않는다 (로고는 앱마다 — Q48).
// 내부관리자 앱 폴더(apps/kwp2-center-admin-fe/src/assets)를 직접 import 한다 — Storybook 개발 서버 · 빌드 모두 Vite가 주소를 만든다.
// 지금은 내부관리자만 (시스템 선택 연동은 나중에)
import loginSecurity from '../../../../apps/kwp2-center-admin-fe/src/assets/common/login-security.svg';
import logoFooter from '../../../../apps/kwp2-center-admin-fe/src/assets/logo/logo-footer.svg';
import logoHeader from '../../../../apps/kwp2-center-admin-fe/src/assets/logo/logo-header.svg';
import logoLnb from '../../../../apps/kwp2-center-admin-fe/src/assets/logo/logo-lnb.svg';

export const systemAssets = {
  logoHeader,
  logoLnb,
  logoFooter,
  loginSecurity,
} as const;
