// 셸 JSP가 <div id="root" data-*>로 넘기는 값 (docs/jsp-integration.md). 개발 서버에서는 기본값을 쓴다
const dataset = document.getElementById('root')?.dataset ?? {};

export const config = {
  /** 컨텍스트 패스. React Router basename. 예) '' 또는 '/admin' */
  basename: dataset.basename ?? '',
  /** API 주소. 예) '/admin/api' */
  apiBase: dataset.apiBase ?? '/api',
};
