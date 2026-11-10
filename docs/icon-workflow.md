# 아이콘 추가·수정 절차

아이콘은 Figma에서 SVG로 내보내 `packages/design-system/src/assets/icons/`에 넣고,
`pnpm icons`로 `src/components/Icon/icons.generated.tsx`를 생성한다. (직접 수정 금지)

## 절차

1. Figma 아이콘 컴포넌트 세트에서 SVG를 내보낸다. Size 12 / 16 / 20 / 24는 각각 별도 파일이다.
2. 파일을 `src/assets/icons/`에 넣는다. Figma 기본 이름을 그대로 쓴다.
   - `Name=<아이콘명>, Size=<크기>.svg` (예: `Name=Chevron-down, Size=24.svg`)
   - `Name=`으로 시작하지 않는 파일(`Icon-1.svg` 등)은 **빌드에서 무시**한다.
3. `pnpm icons`를 실행한다. 이름·크기·색 규칙에 어긋나면 에러로 멈춘다.
4. Storybook의 `Components/Icon/Guide` 갤러리에서 새 아이콘을 확인한다.
5. 새 SVG와 `icons.generated.tsx`를 함께 커밋한다.

```bash
pnpm icons            # 생성
pnpm --filter @kiwoompay/design-system icons:check   # 최신 여부 검사 (CI용)
```

`pnpm build`, `pnpm storybook`은 시작할 때 자동으로 `pnpm icons`를 실행한다.

## 이름 규칙

Figma 이름을 소문자 kebab-case로 바꾼다. 크기는 같은 이름의 variant로 묶인다.

| Figma                 | 코드 `name`           |
| --------------------- | --------------------- |
| `Chevron-up-double`   | `chevron-up-double`   |
| `Check-circle_filled` | `check-circle-filled` |
| `Drag Handle`         | `drag-handle`         |
| `InfoBox`             | `info-box`            |

Figma 이름만으로 만들 수 없는 경우는 `scripts/build-icons.mjs`의 두 표에서 지정한다.

- `NAME_BY_FIGMA_NAME`: 의미를 알 수 없는 이름 (`1dp(0)` → `home` 등)
- `BY_FILE`: 같은 이름·크기가 중복되거나, 같은 Figma 이름에 **다른 모양**이 섞여 있는 파일
  (`Link-external` 12 / `24-1`은 화살표(↗)라서 `arrow-up-right`로 분리)

## 색 규칙

선 아이콘은 색을 고정하지 않고 글자색(`currentColor`)을 따른다. Figma에서 흰색·짙은 회색으로 내보낸 선은 모두 `currentColor`로 바뀐다.

| SVG 값                                                               | 결과                                                                     |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 선(stroke)의 `white` · `#111827` · `#1E293B` · `#667281` · `#8C98A6` | `currentColor`                                                           |
| 채움 도형 앞의 `white`(점 등 채움 포함)                              | `currentColor`                                                           |
| 색 채움 도형 **뒤의** `white`(체크, X 등 글리프)                     | `var(--kp-color-icon-on-color)`                                          |
| 채움 `#3B82F6` `#22C55E` `#F59E0B` `#EF4444` `#8C98A6` `#2484C6`     | `--kp-color-icon-info` `-success` `-warning` `-error` `-muted` `-accent` |
| 짙은 채움 `#111827` `#1E293B`                                        | `currentColor`                                                           |

표에 없는 색이 나오면 에러로 멈춘다. 색 규칙(`build-icons.mjs`)과 토큰(`tokens/custom/icon.json`)을 함께 추가한다.

## 파일 검증

내보낸 SVG는 `width` · `height` · `viewBox`가 `Size`와 같아야 한다(`Size=24`면 `24×24`, `0 0 24 24`).
지원하는 요소는 `path` `rect` `circle` `ellipse` `line` `polyline` `polygon` `g` `defs` `clipPath`이다.
`clipPath`의 `id`는 아이콘끼리 겹치지 않도록 생성할 때 새로 만든다.
