# kiwoompay-ui

키움페이 백오피스 3종(가맹점관리자 / 내부관리자 / 영업대행사)이 공유하는 React 디자인 시스템.

## 시작하기

```bash
pnpm install          # pnpm 10 (corepack enable 또는 npm i -g pnpm@10)
pnpm dev              # 내부관리자 앱(5173) + 화면 목록(5180) 함께 실행, 화면 목록이 브라우저에 자동으로 열림
pnpm storybook        # 토큰 생성 + Storybook (http://localhost:6006)
pnpm build            # 토큰 생성 + 라이브러리 빌드 (packages/design-system/dist)
pnpm lint             # ESLint + Stylelint
```

- 토큰 변경 절차: [docs/token-workflow.md](docs/token-workflow.md)
- JSP 연동: [docs/jsp-integration.md](docs/jsp-integration.md)
- AI 작업 지시·진행 현황: [docs/ai/](docs/ai/)
