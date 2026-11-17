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

export function ibsheet(): Plugin {
  const installed = existsSync(path.join(dir, 'ibsheet.js'));
  return {
    name: 'kp-ibsheet',
    apply: 'serve',
    configureServer(server) {
      if (!installed) {
        server.config.logger.info('[ibsheet] vendor/ibsheet 없음 — 기본 Date Picker로 동작 (vendor/README.md)');
        return;
      }
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? '';
        if (!url.startsWith(URL_PREFIX)) return next();
        const file = path.join(dir, decodeURIComponent(url.slice(URL_PREFIX.length)));
        if (!file.startsWith(dir) || !existsSync(file) || !statSync(file).isFile()) return next();
        res.setHeader('Content-Type', TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream');
        createReadStream(file).pipe(res);
      });
    },
    transformIndexHtml() {
      if (!installed) return [];
      return SCRIPTS.map((src) => ({
        tag: 'script',
        attrs: { src: URL_PREFIX + src },
        injectTo: 'head' as const,
      }));
    },
  };
}
