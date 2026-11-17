// 스토리 예시 이미지 = 시스템(앱)의 실제 이미지. 복사본을 두지 않는다 (로고는 앱마다 — Q48).
// .storybook/main.ts staticDirs가 apps/internal-admin/src/assets를 /assets/internal로 연결한다.
// 상대 주소: Storybook을 하위 경로에 배포해도 iframe.html 기준으로 찾는다. 지금은 내부관리자만 (시스템 선택 연동은 나중에)

const INTERNAL = './assets/internal';

export const systemAssets = {
  logoHeader: `${INTERNAL}/logo/logo-header.svg`,
  logoLnb: `${INTERNAL}/logo/logo-lnb.svg`,
  logoFooter: `${INTERNAL}/logo/logo-footer.svg`,
  loginSecurity: `${INTERNAL}/common/login-security.svg`,
} as const;
