# JSP 연동 (SPA)

백엔드는 JSP(Spring), 프론트는 React SPA다. 시스템(앱)마다 **셸 JSP 1개**가 React 앱을 띄우고, 화면 이동은 React Router가 맡는다.

```
브라우저 /transaction/integrated/list
  └─ 서버: /api · /static 이 아닌 GET → 셸 JSP로 forward
       └─ app.jsp: <div id="root" data-*> + app.css + app.js
            └─ React Router가 URL을 보고 화면을 그린다 (이후 이동은 서버 요청 없음, lazy chunk만 받음)
```

- 화면이 바뀌어도 페이지를 다시 로드하지 않으므로 LNB · Header · Work Tab(열린 화면의 검색 조건 · 결과)이 유지된다.
- 화면 URL은 셸만 내려준다. 권한은 메뉴 트리 API와 각 API 호출에서 확인한다.
- 시스템 3개는 앱도 3개다(`apps/internal-admin` · `merchant-admin` · `agency-admin`). 각 앱이 자기 셸 JSP와 정적 폴더를 가진다.

## 1. 빌드 산출물

| 대상                     | 산출물                                                                                 | 용도                                                              |
| ------------------------ | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `packages/design-system` | `dist/index.js` · `dist/kiwoompay-ui.css` · `dist/fonts/pretendard/*` · `dist/types/*` | 앱이 가져다 쓰는 라이브러리. React는 번들에 포함하지 않는다(peer) |
| `apps/<앱>`              | `app.js` · `app.css` · `chunks/*.js` · `fonts/pretendard/*`                            | 셸 JSP가 로드하는 파일. React와 디자인 시스템이 앱 번들에 포함됨  |

JSP 프로젝트 기준 위치:

```
<JSP 프로젝트>/src/main/webapp/static/<앱 이름>/
├─ app.js                    # 진입 파일. 이름 고정(해시 없음) → JSP가 ?v=빌드번호 로 캐시 갱신
├─ app.css
├─ chunks/<화면>-<해시>.js     # 화면별 lazy chunk. 이름에 해시가 있어 오래 캐시해도 됨
└─ fonts/pretendard/
```

빌드: `JSP_STATIC_DIR=<위 폴더> pnpm --filter @kiwoompay/internal-admin build` (기본값은 `apps/<앱>/dist`).
`base: './'`(상대 경로)로 빌드하므로 컨텍스트 패스가 바뀌어도 다시 빌드하지 않는다.

## 2. 앱 Vite 설정 (`apps/internal-admin/vite.config.ts`)

```ts
const outDir = process.env.JSP_STATIC_DIR ?? 'dist';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: { alias: { '@': r('./src') } },
  publicDir: command === 'serve' ? r('../../packages/design-system/dist') : false, // 개발 서버 폰트
  server: { proxy: { '/api': 'http://localhost:8580' } },
  base: command === 'build' ? './' : '/',
  build: {
    outDir,
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: r('./src/app/main.tsx'), // index.html이 아니라 JS 진입 파일 (HTML은 셸 JSP)
      output: {
        entryFileNames: 'app.js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (info) =>
          info.names?.[0]?.endsWith('.css') ? 'app.css' : 'assets/[name]-[hash][extname]',
      },
    },
  },
}));
```

폰트는 빌드 후 `scripts/copy-fonts.mjs`가 `<outDir>/fonts`로 복사한다.

## 3. 셸 JSP (`/WEB-INF/views/internal-admin/app.jsp`)

```jsp
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="assets" value="${ctx}/static/internal-admin" />
<!DOCTYPE html>
<%-- 시스템별 키컬러: 가맹점관리자 data-system="merchant" · 영업대행사 "agency" · 내부관리자는 생략 (docs/token-workflow.md C) --%>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <%-- 가맹점관리자만 반응형: <meta name="viewport" content="width=device-width, initial-scale=1" /> --%>
    <title>키움페이 내부관리자</title>
    <link rel="stylesheet" href="${assets}/fonts/pretendard/pretendardvariable-dynamic-subset.css" />
    <link rel="stylesheet" href="${assets}/app.css?v=${buildVersion}" />
  </head>
  <body>
    <div id="root" data-basename="${ctx}" data-api-base="${ctx}/api"></div>
    <script type="module" src="${assets}/app.js?v=${buildVersion}"></script>
  </body>
</html>
```

- `data-basename`: 컨텍스트 패스. React Router `basename`이 된다(`src/app/config.ts`).
- `data-api-base`: axios `baseURL`(`src/api/http.ts`).
- `${buildVersion}`은 배포 때마다 바뀌는 값(빌드 번호 등). 셸 JSP 응답은 캐시하지 않는다(`Cache-Control: no-store`) — 그래야 새 `?v=`가 바로 반영된다.
- 사용자 정보 · 메뉴 같은 데이터는 셸에 넣지 않고 API로 받는다(JWT 흐름 그대로). 셸에 서버 값을 넣어야 하면 `data-*` + `<c:out>`으로 이스케이프한다.
- `type="module"`은 IE를 지원하지 않는 전제다(지원 브라우저: 최신 Chrome · Edge, 가맹점관리자는 모바일 Safari · Chrome 포함).

## 4. 서버 forward (Spring 예시)

새로고침 · 주소 직접 입력 · 북마크로 들어와도 화면이 열리도록, 화면 URL은 모두 셸 JSP로 보낸다.

```java
@Controller
public class SpaController {

    // /api/** · /static/** 와 확장자가 있는 파일(.js · .css · .ico …)은 제외
    @GetMapping({ "/", "/{path:^(?!api$|static$)[^.]*}", "/{path:^(?!api$|static$)[^.]*}/**" })
    public String app(HttpServletResponse response) {
        response.setHeader("Cache-Control", "no-store");
        return "internal-admin/app"; // → /WEB-INF/views/internal-admin/app.jsp
    }
}
```

- 정적 파일 핸들러(`/static/**`)와 API 컨트롤러(`/api/**`)가 먼저 매칭되도록 둔다.
- 없는 화면 URL도 셸이 열리고, React가 404 화면(`pages/error/NotFoundPage`)을 그린다.
- 로그인 여부는 React(`RequireAuth`)와 API(401)가 처리한다. 서버 세션 기반으로 바꾸면 이 컨트롤러에서 로그인 페이지로 redirect해도 된다.

## 5. React 진입 (`apps/internal-admin/src/app/main.tsx`)

```tsx
import '@kiwoompay/design-system/style.css'; // 토큰(:root 변수) + reset + global. 앱에서 한 번만
import { createRoot } from 'react-dom/client';
import { App } from './App'; // <BrowserRouter basename={config.basename}> + AppRoutes

createRoot(document.getElementById('root')!).render(<App />);
```

라우트 구조는 `directory-structure.md`(1depth별 `router/modules/*.routes.tsx`, `React.lazy` 코드 스플리팅)를 따른다.

## 6. 개발 중

`pnpm --filter @kiwoompay/internal-admin dev` → `http://localhost:5173`. Vite 개발 서버가 `index.html`로 셸 역할을 하고, `/api`는 `localhost:8580`으로 프록시한다. JSP 서버를 띄우지 않아도 화면을 개발할 수 있다.
디자인 시스템을 고친 뒤에는 `pnpm build`(디자인 시스템 `dist` 갱신)를 먼저 실행한다.
