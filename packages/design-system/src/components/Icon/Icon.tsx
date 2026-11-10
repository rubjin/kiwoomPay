import clsx from 'clsx';
import { forwardRef, type ReactNode, type SVGAttributes } from 'react';
import styles from './Icon.module.scss';
import { iconSet } from './icons.generated';

export type IconName = keyof typeof iconSet;
/** 제공되는 크기: 12 · 16 · 20 · 24 (24가 기준) */
export type IconSize = 12 | 16 | 20 | 24;

type Variants = Partial<Record<IconSize, () => ReactNode>>;

const SIZES: readonly IconSize[] = [12, 16, 20, 24];

/** 모든 아이콘 이름 (가이드·갤러리용) */
export const iconNames = Object.keys(iconSet) as IconName[];

/** 아이콘이 직접 제공하는 크기 목록 */
export function getIconSizes(name: IconName): IconSize[] {
  const variants: Variants = iconSet[name];
  return SIZES.filter((size) => variants[size]);
}

/** 요청한 크기의 variant를 쓰고, 없으면 가장 가까운 큰 variant(없으면 가장 큰 작은 variant)를 가져와 크기를 맞춘다. */
function pickVariant(name: IconName, size: IconSize): IconSize {
  const available = getIconSizes(name);
  if (available.includes(size)) return size;
  return available.find((s) => s > size) ?? available[available.length - 1] ?? 24;
}

export interface IconProps extends Omit<
  SVGAttributes<SVGSVGElement>,
  'name' | 'children' | 'width' | 'height' | 'viewBox'
> {
  name: IconName;
  /** 12 · 16 · 20 · 24 (기본 24). 해당 크기의 모양이 없는 아이콘은 가장 가까운 크기를 줄여서 그린다 */
  size?: IconSize;
}

/**
 * 시스템 아이콘. 선 아이콘은 색을 고정하지 않고 글자색(`currentColor`)을 따르므로
 * 부모의 `color`로 색을 정한다. 상태 아이콘(info-circle-filled 등)만 고유한 색을 가진다.
 * 의미가 있는 아이콘(텍스트 없이 단독 사용)은 `aria-label`을 주고, 장식이면 생략한다.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 24, className, 'aria-label': ariaLabel, ...rest }, ref) => {
    const variant = pickVariant(name, size);
    const variants: Variants = iconSet[name];
    const render = variants[variant];

    return (
      <svg
        focusable="false"
        aria-hidden={ariaLabel ? undefined : true}
        role={ariaLabel ? 'img' : undefined}
        aria-label={ariaLabel}
        {...rest}
        ref={ref}
        className={clsx(styles.icon, className)}
        width={size}
        height={size}
        viewBox={`0 0 ${variant} ${variant}`}
        fill="none"
      >
        {render?.()}
      </svg>
    );
  },
);

Icon.displayName = 'Icon';
