# JSP 연동

백엔드는 JSP, 프론트는 React다. React 앱은 **빌드 결과물(JS·CSS)을 JSP 프로젝트의 정적 폴더에 넣고**, JSP는 그 파일을 `<script>` / `<link>`로 불러와 `<div id="root">`에 마운트한다.

> `apps/*`는 아직 없다. 아래는 앱을 추가할 때 따르는 방식이다. JSP 프로젝트의 실제 정적 폴더 경로가 정해지면 `JSP_STATIC_DIR`만 바꾼다.

## 빌드 산출물

| 대상                     | 산출물                                                                                 | 용도                                                                     |
| ------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `packages/design-system` | `dist/index.js` · `dist/kiwoompay-ui.css` · `dist/fonts/pretendard/*` · `dist/types/*` | 앱이 가져다 쓰는 라이브러리. React는 번들에 포함하지 않는다(peer)        |
| `apps/<앱>` (예정)       | `app.js` · `app.css` · `fonts/pretendard/*`                                            | JSP가 직접 로드하는 파일. React와 디자인 시스템이 **앱 번들에 포함**된다 |

앱 산출물 위치 (JSP 프로젝트 기준):

```
<JSP 프로젝트>/src/main/webapp/static/<앱 이름>/
├─ app.js
├─ app.css
└─ fonts/pretendard/
   ├─ pretendardvariable-dynamic-subset.css
   └─ woff2-dynamic-subset/*.woff2
```

파일 이름에 해시를 붙이지 않는다(JSP가 이름을 알 수 있도록). 캐시는 `?v=` 쿼리로 갱신한다.

## 앱 Vite 설정 예시 (`apps/merchant-admin/vite.config.ts`)

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// JSP 프로젝트의 정적 폴더. 예: C:/work/kiwoompay-web/src/main/webapp/static/merchant-admin
const outDir = process.env.JSP_STATIC_DIR ?? 'dist';

export default defineConfig({
  plugins: [react()],
  base: '/static/merchant-admin/', // 컨텍스트 패스가 있으면 JSP의 ${ctx}와 맞춘다
  build: {
    outDir,
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: 'src/main.tsx',
      output: {
        entryFileNames: 'app.js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: (info) =>
          info.names?.[0]?.endsWith('.css') ? 'app.css' : 'assets/[name][extname]',
      },
    },
  },
});
```

빌드 후 폰트를 같은 폴더에 복사한다 (`package.json`):

```json
"scripts": {
  "build": "vite build && node -e \"require('fs').cpSync('../../packages/design-system/dist/fonts', process.env.JSP_STATIC_DIR + '/fonts', {recursive:true})\""
}
```

## JSP 예시

```jsp
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="assets" value="${ctx}/static/merchant-admin" />
<!DOCTYPE html>
<!-- 시스템별 키컬러: 가맹점관리자 merchant · 영업대행사 agency · 내부관리자는 생략 (docs/token-workflow.md C) -->
<html lang="ko" data-system="merchant">
  <head>
    <meta charset="UTF-8" />
    <!-- 가맹점관리자만 반응형. 내부관리자·영업대행사는 viewport 태그를 넣지 않는다 -->
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>가맹점 목록</title>
    <link rel="stylesheet" href="${assets}/fonts/pretendard/pretendardvariable-dynamic-subset.css" />
    <link rel="stylesheet" href="${assets}/app.css?v=${buildVersion}" />
  </head>
  <body>
    <%-- 서버 값은 data-* 로 넘긴다. <c:out>이 HTML 이스케이프를 해준다 --%>
    <div
      id="root"
      data-page="merchant-list"
      data-user-id="<c:out value='${loginUser.id}' />"
      data-api-base="${ctx}/api"
    ></div>
    <script type="module" src="${assets}/app.js?v=${buildVersion}"></script>
  </body>
</html>
```

- `${buildVersion}`은 배포 때마다 바뀌는 값(빌드 번호 등)을 서버에서 내려준다.
- `type="module"`은 IE를 지원하지 않는 전제다(지원 브라우저: 최신 Chrome·Edge, 가맹점관리자는 모바일 Safari·Chrome 포함).
- 큰 초기 데이터는 `data-*` 대신 API로 받는다. JSP에서 JSON을 `<script>`에 직접 출력하려면 `</script>` 이스케이프를 반드시 처리한다.

## React 마운트 (`apps/merchant-admin/src/main.tsx`)

```tsx
import '@kiwoompay/design-system/style.css'; // 토큰(:root 변수) + reset + global. 앱에서 한 번만
import { createRoot } from 'react-dom/client';
import { App } from './App';

const el = document.getElementById('root');
if (!el) throw new Error('#root 를 찾을 수 없습니다');

const { page = '', userId = '', apiBase = '' } = el.dataset;
createRoot(el).render(<App page={page} userId={userId} apiBase={apiBase} />);
```

- 페이지 URL은 JSP(서버)가 정하고, 각 JSP가 `data-page`로 어떤 화면을 그릴지 알려준다. React Router는 쓰지 않는다(라우팅 의존 없음 원칙).
- 같은 앱 안의 여러 JSP가 한 `app.js`를 공유하거나, 페이지별 entry를 분리할 수 있다. 앱 추가 시 정한다.

## 개발 중 (HMR)

앱 개발은 `vite dev` 서버로 하고, JSP는 개발용 `<script type="module" src="http://localhost:5173/src/main.tsx">`로 붙인다. 운영 JSP는 위 빌드 산출물만 참조한다.
