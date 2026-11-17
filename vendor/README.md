# vendor — 상용 라이브러리 (git에 올리지 않음)

## IBSheet8
업체(IB Leaders)에서 받은 파일. **라이선스 파일이 있어 git에 올리지 않는다**(`.gitignore`). 받은 사람에게 따로 전달받는다.

```
vendor/
├─ ibsheet/              ← 받은 패키지의 product/IBSheet8_package 안 내용 그대로
│  ├─ ibleaders.js       ← 라이선스 (도메인별 발급 — 개발 localhost · 운영 도메인 확인)
│  ├─ ibsheet.js
│  ├─ css/default/ · fonts/ · locale/ · plugins/(jszip.min.js 포함)   ← 테마는 default 하나만 (다른 테마 폴더는 삭제)
│  └─ license.txt
├─ ibsheet-docs/manual/  ← 오프라인 매뉴얼 (참고용, 없어도 됨) — manual/index.html
└─ README.md
```

- 개발 서버: `packages/design-system/vite.ibsheet.ts`(git에 올림). 각 앱의 `vite.config.ts`가 `ibsheet()` 플러그인을 쓴다. `vendor/ibsheet/`가 있으면 `index.html`에 스크립트를 넣고 `/ibsheet/*`를 이 폴더에서 응답. 없으면 IBSheet 없이(기본 Date Picker) 동작한다.
- 세 시스템 앱(내부관리자 · 가맹점관리자 · 영업대행사)과 Storybook(`.storybook/main.ts`)이 이 한 폴더를 같이 쓴다. 새 앱을 만들면 `vite.config.ts`에 `ibsheet()`만 추가한다.
- 운영: JSP 프로젝트 `static/ibsheet/`에 같은 파일을 두고 셸 JSP에서 로드한다(`docs/jsp-integration.md` 7절). 앱 빌드 결과(`app.js`)에는 포함되지 않는다.
- 새 버전을 받으면 `ibsheet/` 안을 통째로 바꾼다.
- 디자인: 기본 테마(css/default) 위에 디자인 시스템 KWP 테마(`@kiwoompay/design-system/ibsheet.css`, 소스 `packages/design-system/src/styles/ibsheet/ibsheet-theme.scss`)가 토큰 색 · 글자를 덮어쓴다. 행 · 머리 높이 · 표 연결(IbsheetGrid)은 `@kiwoompay/design-system/ibsheet`(소스 `packages/design-system/src/ibsheet/`)
