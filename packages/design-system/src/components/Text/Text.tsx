import clsx from 'clsx';
import { forwardRef, type HTMLAttributes } from 'react';
import styles from './Text.module.scss';

/** 글자 역할 (Foundation/Typography 역할 이름 — 앱 화면용) */
export type TextVariant = 'body-md' | 'body-sm' | 'caption-md' | 'caption-strong' | 'label-strong';
export type TextTone = 'body' | 'secondary' | 'heading' | 'error';

const VARIANT_CLASS: Record<TextVariant, string> = {
  'body-md': 'bodyMd',
  'body-sm': 'bodySm',
  'caption-md': 'captionMd',
  'caption-strong': 'captionStrong',
  'label-strong': 'labelStrong',
};

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /**
   * body-md 14 Regular · body-sm 13 Regular · caption-md 12 Regular(기본 — 도움말 · 보조 설명)
   * · caption-strong 12 SemiBold · label-strong 13 SemiBold
   */
  variant?: TextVariant;
  /** 글자색: body(본문) · secondary(보조, 기본) · heading(진한 강조) · error(오류 · 확인 필요 — 상태 Error 글자) */
  tone?: TextTone;
  /** 한 줄로 (줄바꿈 안 함 — 계좌번호 등) */
  nowrap?: boolean;
  /** 태그 (기본 span). 문단은 p — 바깥 여백은 없다 */
  as?: 'span' | 'p' | 'div' | 'dt' | 'dd';
}

/**
 * 화면의 보조 설명 · 안내 글자. 앱은 SCSS를 쓰지 않으므로 글자 크기 · 색을 인라인 스타일로 쓰지 않고 이것을 쓴다.
 * 제목은 SectionHeading, 표 · 입력 안 글자는 각 컴포넌트가 정한다.
 * TODO(시안) 보조 설명 글자 규칙 — 지금 화면 값(권한관리 12 · 요청 조건 13 회색) 기준
 */
export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      variant = 'caption-md',
      tone = 'secondary',
      as: Tag = 'span',
      nowrap = false,
      className,
      ...rest
    },
    ref,
  ) => (
    <Tag
      {...rest}
      ref={ref as never}
      className={clsx(
        styles.text,
        styles[VARIANT_CLASS[variant]],
        styles[tone],
        nowrap && styles.nowrap,
        className,
      )}
    />
  ),
);
Text.displayName = 'Text';
