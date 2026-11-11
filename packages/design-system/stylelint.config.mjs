/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss'],
  ignoreFiles: ['dist/**', 'storybook-static/**', 'src/styles/tokens/_generated.scss'],
  rules: {
    // CSS Modules의 :global / :local / :export 허용
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global', 'local', 'export'] },
    ],
    'property-no-unknown': [true, { ignoreProperties: ['composes'] }],
    // SCSS 중첩 최대 2단계, ID 선택자 금지
    'max-nesting-depth': [2, { ignore: ['blockless-at-rules', 'pseudo-classes'] }],
    'selector-max-id': 0,
    // CSS Modules는 styles.iconOnly 처럼 접근하므로 camelCase 단어를 허용한다 (BEM 금지)
    'selector-class-pattern': [
      /^[a-z][a-zA-Z0-9]*$/,
      { message: '클래스명은 camelCase 단어로 단순하게 짓습니다 (BEM 금지)' },
    ],
    'scss/dollar-variable-pattern': null,
  },
  overrides: [
    {
      // 컴포넌트: 요소 선택자 금지 + 토큰 외 하드코딩 값은 경고
      files: ['src/components/**/*.scss'],
      rules: {
        'selector-max-type': 0,
        'declaration-property-value-disallowed-list': [
          {
            '/^(color|background|border|outline|fill|stroke|box-shadow|text-shadow)/': [
              /#[0-9a-f]{3,8}\b/i,
              /\b(rgb|rgba|hsl|hsla)\(/,
            ],
            '/^(margin|padding|gap|row-gap|column-gap|border-radius|font-size|line-height|letter-spacing|z-index|transition|animation)/':
              [/(^|[^\w-])\d*\.?\d+(px|rem|em|ms|s)\b/, /^[1-9]\d*$/],
          },
          {
            message: '토큰(t.$...) 또는 파일 위 SCSS 변수($...)를 사용하세요. 값을 선언에 직접 쓰지 않습니다.',
            severity: 'warning',
          },
        ],
      },
    },
  ],
};
