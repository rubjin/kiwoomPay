// 개발 서버: IBSheet8(상용, git에 올리지 않음)을 저장소 루트 vendor/ibsheet/에서 준다 — 세 시스템 앱이 같은 파일을 쓴다.
// 폴더가 있으면 index.html에 스크립트를 넣고 /ibsheet/* 를 이 폴더에서 응답한다.
// 폴더가 없으면 아무것도 하지 않는다 → window.IBSheet 없음 → 디자인 시스템 기본 Date Picker로 동작.
// 운영은 셸 JSP가 같은 순서로 로드한다 (docs/jsp-integration.md 7절)
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const URL_PREFIX = '/ibsheet/';
const dir = fileURLToPath(new URL('../../vendor/ibsheet/', import.meta.url));

// 로드 순서: 라이선스 → 본체 → 언어 → 플러그인 (jszip.min.js는 엑셀 기능이 plugins 폴더에서 직접 찾는다)
const SCRIPTS = [
  'ibleaders.js',
  'ibsheet.js',
  'locale/ko.js',
  'plugins/ibsheet-common.js',
  'plugins/ibsheet-dialog.js',
  'plugins/ibsheet-excel.js',
];

// 테마 CSS — 없으면 그리드 · 달력이 크기 0으로 그려진다. 기본 테마(Prefix IB) 하나만 쓴다(다른 테마 폴더는 삭제).
// 토큰 색 · 글자는 디자인 시스템 KWP 테마(@kiwoompay/design-system/ibsheet.css)가 이 위에 덮어쓴다 — 앱 main.tsx
const STYLES = ['css/default/main.css'];

const TYPES: Record<string, string> = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.html': 'text/html',
};

/** vendor/ibsheet가 있는지 (git 제외 — 없으면 IBSheet 없이 동작) */
export const ibsheetInstalled = existsSync(path.join(dir, 'ibsheet.js'));
/** IBSheet 파일 폴더 (Storybook staticDirs에서도 씀) */
export const ibsheetDir = dir;

// 기본 테마를 cascade layer(ibsheet)로 — 레이어 밖 스타일(KWP 테마 · 디자인 시스템 컴포넌트)이 선택자 우선순위와 상관없이 이긴다.
// kp-ib-fix는 ibsheet보다 앞 레이어: 기본 테마의 !important(box-sizing)를 셀 안 컴포넌트에서만 되돌린다 (테마 파일)
const layerCss = [
  '@layer kp-ib-fix, ibsheet;',
  ...STYLES.map((href) => `@import url('${URL_PREFIX}${href}') layer(ibsheet);`),
].join('\n');

/** <head>에 넣을 IBSheet 스타일 · 스크립트 (Storybook previewHead용 문자열) */
export const ibsheetHeadHtml = () =>
  ibsheetInstalled
    ? [
        `<style>${layerCss}</style>`,
        ...SCRIPTS.map((src) => `<script src="${URL_PREFIX}${src}"></script>`),
      ].join('\n')
    : '';

export function ibsheet(): Plugin {
  const installed = ibsheetInstalled;
  return {
    name: 'kp-ibsheet',
    apply: 'serve',
    configureServer(server) {
      if (!installed) {
        server.config.logger.info(
          '[ibsheet] vendor/ibsheet 없음 — 기본 Date Picker로 동작 (vendor/README.md)',
        );
        return;
      }
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? '';
        if (!url.startsWith(URL_PREFIX)) return next();
        const file = path.join(dir, decodeURIComponent(url.slice(URL_PREFIX.length)));
        if (!file.startsWith(dir) || !existsSync(file) || !statSync(file).isFile()) return next();
        res.setHeader(
          'Content-Type',
          TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
        );
        createReadStream(file).pipe(res);
      });
    },
    transformIndexHtml() {
      if (!installed) return [];
      return [
        { tag: 'style', children: layerCss, injectTo: 'head' as const },
        ...SCRIPTS.map((src) => ({
          tag: 'script',
          attrs: { src: URL_PREFIX + src },
          injectTo: 'head' as const,
        })),
      ];
    },
  };
}
