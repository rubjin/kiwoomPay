import clsx from 'clsx';
import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../components/Icon';
import { useControllableState } from '../../hooks';
import styles from './RecordForm.module.scss';

export interface FormSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** 제목 (FormSection.Heading — 18 Bold · h2) */
  title?: ReactNode;
  /** 제목 앞 작은 이름 (예: 선택 CPID) */
  label?: ReactNode;
  /** 제목 아래 줄 문맥 (ContextChip · 상태 Badge) */
  context?: ReactNode;
  /** 제목 옆 설명 (12 Regular) */
  description?: ReactNode;
  /** 제목 줄 오른쪽 (접기 버튼 앞) */
  actions?: ReactNode;
  /** 접기 · 열기 버튼 */
  collapsible?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  labels?: { collapse?: string; expand?: string };
  /** 카드 위에 붙는 제목 탭 (Tab variant="title"). 있으면 카드 왼쪽 위 모서리가 각진다 */
  tabs?: ReactNode;
  /** 탭 줄 오른쪽 (카드 위 8에 맞춘 버튼: 새로고침 · 등록 · 저장) */
  tabActions?: ReactNode;
  children?: ReactNode;
}

/**
 * P02 Record → Form 정보 섹션 카드 (Figma KWPC07010101).
 * 제목 줄 + 접기/열기, 카드 위 제목 탭 · 화면 Action 묶음을 함께 둘 수 있다.
 */
const FormSectionRoot = forwardRef<HTMLElement, FormSectionProps>(
  (
    {
      title,
      label,
      context,
      description,
      actions,
      collapsible = false,
      collapsed,
      defaultCollapsed = false,
      onCollapsedChange,
      labels,
      tabs,
      tabActions,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const bodyId = useId();
    const [isCollapsed, setCollapsed] = useControllableState(
      collapsed,
      defaultCollapsed,
      onCollapsedChange,
    );
    const text = { collapse: '접기', expand: '열기', ...labels };
    const hasHeader =
      title !== undefined ||
      label !== undefined ||
      description !== undefined ||
      context !== undefined ||
      actions !== undefined ||
      collapsible;
    const toggle = collapsible && (
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={!isCollapsed}
        aria-controls={bodyId}
        onClick={() => setCollapsed(!isCollapsed)}
      >
        {isCollapsed ? text.expand : text.collapse}
        <Icon name={isCollapsed ? 'chevron-down' : 'chevron-up'} size={20} />
      </button>
    );

    const card = (
      <section
        {...rest}
        ref={ref}
        className={clsx(
          styles.section,
          tabs !== undefined && styles.tabbed,
          tabs === undefined && className,
        )}
        style={tabs === undefined ? style : undefined}
      >
        {hasHeader && (
          // 카드 제목 줄도 본문 중간 제목 줄과 같은 FormSection.Heading — 접기는 오른쪽 Action 끝
          <FormSectionHeading
            className={styles.cardHeading}
            title={title}
            label={label}
            description={description}
            actions={
              actions || toggle ? (
                <>
                  {actions}
                  {toggle}
                </>
              ) : undefined
            }
          >
            {context}
          </FormSectionHeading>
        )}
        {!isCollapsed && children !== undefined && (
          <div id={bodyId} className={styles.sectionBody}>
            {children}
          </div>
        )}
      </section>
    );

    if (tabs === undefined) return card;
    return (
      // 탭이 있으면 className · style은 탭 + 카드 묶음에 준다
      <div className={clsx(styles.tabbedGroup, className)} style={style}>
        <div className={styles.tabRow}>
          <div className={styles.tabs}>{tabs}</div>
          {tabActions && <div className={styles.tabActions}>{tabActions}</div>}
        </div>
        {card}
      </div>
    );
  },
);
FormSectionRoot.displayName = 'FormSection';

export interface FormSectionHeadingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 제목 (18 Bold · 줄 높이 26 · h2) */
  title?: ReactNode;
  /** 제목 앞 작은 이름 (10 Regular, 예: 선택 CPID) */
  label?: ReactNode;
  /** 제목 옆 설명 (12 Regular, 예: 자금세탁방지 공지용 담당자 정보) */
  description?: ReactNode;
  /** 오른쪽 (이력조회 · 추가 · 삭제, 탭) */
  actions?: ReactNode;
  /** 제목 아래 줄 (ContextChip · 상태 Badge) */
  children?: ReactNode;
}

/**
 * 제목 줄 (h2). 카드 제목(기본 정보) · 본문 중간 제목(담당자 정보) · 대상 표시(선택 CPID)를 모두 이것으로 그린다 —
 * 한 카드 안의 제목은 같은 레벨 · 같은 모양.
 */
const FormSectionHeading = forwardRef<HTMLDivElement, FormSectionHeadingProps>(
  ({ title, label, description, actions, className, children, ...rest }, ref) => (
    <div
      {...rest}
      ref={ref}
      className={clsx(
        styles.heading,
        children !== undefined && children !== null && styles.headingTop,
        className,
      )}
    >
      <div className={styles.headingMain}>
        <div className={styles.headingLine}>
          {label !== undefined && <span className={styles.headingLabel}>{label}</span>}
          {title !== undefined && <h2 className={styles.headingTitle}>{title}</h2>}
          {description && <p className={styles.headingDescription}>{description}</p>}
        </div>
        {children !== undefined && children !== null && (
          <div className={styles.headingLine}>{children}</div>
        )}
      </div>
      {actions && <div className={styles.headingActions}>{actions}</div>}
    </div>
  ),
);
FormSectionHeading.displayName = 'FormSection.Heading';

export const FormSection = Object.assign(FormSectionRoot, { Heading: FormSectionHeading });
