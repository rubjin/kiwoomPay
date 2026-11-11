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

### 토큰으로 둘 것 / 컴포넌트 SCSS 변수로 둘 것

| 토큰 (`tokens/custom/*.json` → `--kp-*`)                                        | 컴포넌트 SCSS 변수 (`*.module.scss` 맨 위)          |
| ------------------------------------------------------------------------------- | --------------------------------------------------- |
| 색 전부 (시스템별 테마가 CSS 변수로 덮어쓰므로)                                 | 그 컴포넌트에서만 쓰는 크기 · 간격 · 반경 · 선 두께 |
| typography 역할, shadow, z-index, breakpoint                                    |                                                     |
| 여러 컴포넌트가 함께 쓰는 크기 (`control/*`, `field/radius`, `selection/size`…) |                                                     |
| JS가 CSS 변수로 읽는 값 (팝업 위치 계산 등)                                     |                                                     |

```scss
// Lnb.module.scss
@use 'tokens' as t;

// 컴포넌트 전용 크기 (시안 값 · 공통 토큰은 t.* 사용)
$lnb-indent: 44px; // 2·3Depth 시작 위치 = 여백 12 + 아이콘 20 + 간격 12
$lnb-padding-x: t.$space-12; // Scale과 같은 값은 숫자 대신 Scale을 가리킨다

.depth3 {
  padding-left: $lnb-indent; // 선언에는 값을 직접 쓰지 않는다 (Stylelint 경고)
}
```

- 크기 값을 바꿀 때는 그 컴포넌트 파일만 고치면 된다 (`pnpm tokens` 불필요).
- 다른 컴포넌트도 같은 값을 쓰게 되면 그때 `tokens/custom`으로 올린다.

## C. 시스템별 키컬러(테마)

세 시스템은 컴포넌트와 토큰을 공유하고 **키컬러(Primary 10단계)만** 다르다. Figma 토큰은 그대로 두고 코드의 테마 파일로 덮어쓴다.

| 시스템       | `data-system` | 테마 파일                            | 키컬러(Primary 500) |
| ------------ | ------------- | ------------------------------------ | ------------------- |
| 내부관리자   | 없음(기본)    | — (Figma 값 그대로)                  | #2484C6             |
| 가맹점관리자 | `merchant`    | `tokens/custom/themes/merchant.json` | #514FEC             |
| 영업대행사   | `agency`      | 미정 → 파일이 없으면 기본색          | —                   |

1. `tokens/custom/themes/<시스템>.json`에 바꿀 토큰만 적는다. 파일명이 `data-system` 값이 된다(소문자 kebab-case).
2. 테마는 **기존 토큰의 값만** 바꿀 수 있다. 없는 토큰 · typography · 끊긴 참조는 빌드 에러.
3. 키컬러를 바꿀 때는 `Primary/50~900` 전부와, 값으로 들어 있는 `Shadow/Focus`(포커스 번짐 rgba)를 함께 적는다. Primary를 가리키는 다른 토큰(버튼 · 탭 · LNB 등)은 자동으로 따라간다.
4. `pnpm tokens` → `_generated.scss`의 `$themes` → CSS `:root[data-system='merchant'] { --kp-color-primary-500: … }`
5. 페이지는 **`<html>`에** `data-system`을 붙인다. 하위 요소에 붙이면 alias 변수(예: 버튼 배경)가 이미 html에서 계산된 뒤라 바뀌지 않는다.
6. Storybook 툴바의 **시스템** 메뉴로 시스템별 색을 확인한다.

## 이름 규칙 (Figma ↔ SCSS ↔ CSS 변수 1:1)

경로를 소문자 kebab-case로 이어 붙인다. 색(`$type: color`)만 앞에 `color-`가 붙는다.

| 원본 경로                      | SCSS 변수                                      | CSS 변수                                           |
| ------------------------------ | ---------------------------------------------- | -------------------------------------------------- |
| `Primary/500` (color)          | `$color-primary-500`                           | `--kp-color-primary-500`                           |
| `Status/Success/Text` (color)  | `$color-status-success-text`                   | `--kp-color-status-success-text`                   |
| `space/16`                     | `$space-16`                                    | `--kp-space-16` (`16px`)                           |
| `Typo / 14 / Regular`          | `$typography-typo-14-regular-font-size` 외 3개 | `--kp-typography-typo-14-regular-font-size` 외 3개 |
| 역할 이름 `Body/MD`(앱 화면용) | `$typography-body-md-font-size` 외 3개         | `--kp-typography-body-md-font-size` 외 3개         |
| `Font/Family/Base`             | `$font-family-base`                            | `--kp-font-family-base`                            |
| `Breakpoint/Tablet`            | `$breakpoint-tablet` (값 그대로)               | `--kp-breakpoint-tablet`                           |

- Typography는 속성 4개(`font-size` · `font-weight` · `line-height` · `letter-spacing`)로 풀어서 내보낸다. 컴포넌트에서는 Figma 스타일 이름 그대로 `@include m.typography(typo-14-regular)`를 쓴다(이름만 보고 크기 · 굵기를 알 수 있게). 없는 이름은 빌드 에러. 컴포넌트 전용 글자 역할은 만들지 않는다. 목록은 Storybook `Foundation/Typography`.
- Figma의 `{Primary.500}` 같은 참조는 CSS에서 `var(--kp-color-primary-500)`로 이어져 계층이 유지된다.
- 브레이크포인트만 SCSS 변수에 값을 그대로 둔다 (`@media` 안에서는 CSS 변수를 쓸 수 없기 때문). `@include m.respond-to(tablet)`로 사용한다.
- 컴포넌트에서 Primitive(`Primary`·`Neutral`·`Base`)를 직접 쓰지 않고 Semantic(`Text`·`Line`·`Status`·`Bg`…)을 쓴다.
- 아직 만들지 않은 코드 토큰(radius, border, shadow, z-index, motion, control 크기)은 시안 확인 후 `tokens/custom/`에 추가한다.

## 명령

```bash
pnpm tokens          # 생성
pnpm --filter @kiwoompay/design-system tokens:check   # 최신 여부 검사 (CI용)
```
