import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styles from './SectionHeading.module.scss';

export type SectionHeadingSize = 'lg' | 'md';

export interface SectionHeadingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 제목 */
  title?: ReactNode;
  /** lg 18 Bold(기본: Section · 검색 조건 · 폼 카드) · md 16 Bold(조회 결과 · 한 줄 카드) */
  size?: SectionHeadingSize;
  /** 한 줄 카드 제목처럼 한 단계 옅은 글자색 (적용된 검색 조건 · 조회 요약) */
  subtle?: boolean;
  /** 제목 태그 (기본 h2) */
  as?: 'h2' | 'h3' | 'h4';
  /** 제목 앞 작은 이름 (10 Regular, 예: 선택 CPID) */
  label?: ReactNode;
  /** 제목 옆 설명 (12 Regular, 제목과 12) */
  description?: ReactNode;
  /** 제목 바로 옆 (접기 아이콘 · 표시항목설정 버튼 · Badge) */
  addon?: ReactNode;
  /** 오른쪽 끝 (버튼 · 탭 · ActionBar) */
  actions?: ReactNode;
  /** 오른쪽 영역이 남는 폭을 채운다 (ActionBar처럼 늘어나는 내용) */
  actionsGrow?: boolean;
  /** 제목 아래 줄 (ContextChip · 상태 Badge). 있으면 오른쪽 영역은 위에 맞춘다 */
  children?: ReactNode;
}

/**
 * 영역 제목 줄: [label] 제목 [description] [addon] ··· [actions].
 * Section 카드 · 검색 조건 · 조회 결과 · 폼 카드가 같은 제목 줄을 쓴다.
 * 간격은 쓰는 곳에서 CSS 변수로 바꾼다: `--section-heading-gap`(제목 묶음 ↔ 오른쪽, 기본 16) ·
 * `--section-heading-actions-gap`(오른쪽 항목 사이, 기본 8)
 */
export const SectionHeading = forwardRef<HTMLDivElement, SectionHeadingProps>(
  (
    {
      title,
      size = 'lg',
      subtle = false,
      as: Tag = 'h2',
      label,
      description,
      addon,
      actions,
      actionsGrow = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const hasContext = children !== undefined && children !== null && children !== false;
    return (
      <div
        {...rest}
        ref={ref}
        className={clsx(
          styles.heading,
          hasContext && styles.top,
          actions && actionsGrow && styles.growing,
          className,
        )}
      >
        <div className={styles.main}>
          <div className={styles.line}>
            {label !== undefined && <span className={styles.label}>{label}</span>}
            {title !== undefined && (
              <Tag className={clsx(styles.title, styles[size], subtle && styles.subtle)}>
                {title}
              </Tag>
            )}
            {description && <p className={styles.description}>{description}</p>}
            {addon}
          </div>
          {hasContext && <div className={styles.line}>{children}</div>}
        </div>
        {actions && (
          <div className={clsx(styles.actions, actionsGrow && styles.grow)}>{actions}</div>
        )}
      </div>
    );
  },
);
SectionHeading.displayName = 'SectionHeading';
