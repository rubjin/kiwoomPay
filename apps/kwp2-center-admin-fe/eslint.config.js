import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const STYLE_MESSAGE =
  '인라인 style 대신 디자인 시스템 옵션(Stack · ControlGroup · Field grow · fieldWidth · Text)을 쓴다 — docs/screen-from-spec.md';

// 디자인 시스템(packages/design-system/eslint.config.js)과 같은 규칙 + 인라인 style 경고(앱 전용)
export default defineConfig([
  globalIgnores(['dist']),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { react, 'react-hooks': reactHooks },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
      // 인라인 style 금지 (경고) — 간격 · 배치 · 폭은 디자인 시스템 옵션(Stack · ControlGroup · Field grow ·
      // fieldWidth · Text)으로. 꼭 필요한 곳(외부 라이브러리 크기 · 시안 고정 칸 폭)만 사유를 달아 끈다
      'react/forbid-dom-props': ['warn', { forbid: [{ propName: 'style', message: STYLE_MESSAGE }] }],
      'react/forbid-component-props': [
        'warn',
        { forbid: [{ propName: 'style', message: STYLE_MESSAGE }] },
      ],
      // { raw: _raw, ...rest }처럼 필드를 빼낼 때 쓰는 이름은 허용
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },
  {
    files: ['scripts/**/*.mjs', '*.config.{js,ts}'],
    languageOptions: { globals: globals.node },
  },
  prettier,
]);
