# 토큰 변경 절차

디자인 토큰은 두 곳에서 온다. 둘 다 `pnpm tokens` 한 번으로 `_generated.scss`가 된다.

| 구분       | 위치                                          | 누가              | 비고                                                  |
| ---------- | --------------------------------------------- | ----------------- | ----------------------------------------------------- |
| Figma 토큰 | `packages/design-system/tokens/figma/*.json`  | 디자이너가 내보냄 | **수정 금지** (color · space · text-styles)           |
| 코드 토큰  | `packages/design-system/tokens/custom/*.json` | 퍼블리셔          | Figma에 없는 값(포커스, 브레이크포인트, 역할 이름 등) |

> Figma 토큰은 현재 3개 파일로 고정한다. 더 필요한 토큰은 Figma에 추가하지 않고 코드 토큰으로 만든다.

## A. Figma 토큰이 바뀐 경우

1. Figma에서 변수 / 텍스트 스타일을 수정한다.
2. JSON으로 다시 내보내 `tokens/figma/`의 같은 파일을 **통째로 덮어쓴다** (직접 편집 금지).
3. `pnpm tokens` 실행 → `src/styles/tokens/_generated.scss` 갱신.
   - 참조가 끊기거나 이름이 겹치면 에러로 멈춘다. 코드 토큰이 지워진 Figma 토큰을 가리키고 있을 수 있으니 `tokens/custom`을 확인한다.
4. `git diff`로 `_generated.scss` 변경분을 확인하고 Storybook에서 화면을 본다.
5. `tokens/figma/*.json`과 `_generated.scss`를 함께 커밋한다.

## B. 코드 토큰을 추가·수정하는 경우

1. `tokens/custom/*.json`을 수정한다. 형식은 Figma 내보내기와 같은 DTCG 형식이다.
2. `pnpm tokens` 실행 → `_generated.scss` 갱신 → 함께 커밋한다.
3. 시안 확인 전 임시값에는 `$description`에 `TODO`를 적는다. 생성 파일에도 주석으로 남아 눈에 띈다.

```json
{
  "Focus": {
    "Ring": { "$type": "color", "$value": "{Primary.300}", "$description": "TODO 시안 확인" }
  }
}
```

## 이름 규칙 (Figma ↔ SCSS ↔ CSS 변수 1:1)

경로를 소문자 kebab-case로 이어 붙인다. 색(`$type: color`)만 앞에 `color-`가 붙는다.

| 원본 경로                     | SCSS 변수                                      | CSS 변수                                           |
| ----------------------------- | ---------------------------------------------- | -------------------------------------------------- |
| `Primary/500` (color)         | `$color-primary-500`                           | `--kp-color-primary-500`                           |
| `Status/Success/Text` (color) | `$color-status-success-text`                   | `--kp-color-status-success-text`                   |
| `space/16`                    | `$space-16`                                    | `--kp-space-16` (`16px`)                           |
| `Typo / 14 / Regular`         | `$typography-typo-14-regular-font-size` 외 3개 | `--kp-typography-typo-14-regular-font-size` 외 3개 |
| 역할 이름 `Body/MD`           | `$typography-body-md-font-size` 외 3개         | `--kp-typography-body-md-font-size` 외 3개         |
| `Font/Family/Base`            | `$font-family-base`                            | `--kp-font-family-base`                            |
| `Breakpoint/Tablet`           | `$breakpoint-tablet` (값 그대로)               | `--kp-breakpoint-tablet`                           |

- Typography는 속성 4개(`font-size` · `font-weight` · `line-height` · `letter-spacing`)로 풀어서 내보낸다. 컴포넌트에서는 `@include m.typography(body-md)`를 쓴다.
- Figma의 `{Primary.500}` 같은 참조는 CSS에서 `var(--kp-color-primary-500)`로 이어져 계층이 유지된다.
- 브레이크포인트만 SCSS 변수에 값을 그대로 둔다 (`@media` 안에서는 CSS 변수를 쓸 수 없기 때문). `@include m.respond-to(tablet)`로 사용한다.
- 컴포넌트에서 Primitive(`Primary`·`Neutral`·`Base`)를 직접 쓰지 않고 Semantic(`Text`·`Line`·`Status`·`Bg`…)을 쓴다.
- 아직 만들지 않은 코드 토큰(radius, border, shadow, z-index, motion, control 크기)은 시안 확인 후 `tokens/custom/`에 추가한다.

## 명령

```bash
pnpm tokens          # 생성
pnpm --filter @kiwoompay/design-system tokens:check   # 최신 여부 검사 (CI용)
```
