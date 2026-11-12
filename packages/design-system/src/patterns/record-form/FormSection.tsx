import clsx from 'clsx';
import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../components/Icon';
import { useControllableState } from '../../hooks';
import styles from './RecordForm.module.scss';

export interface FormSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** 제목. 글자면 18 SemiBold, 노드면 그대로 (예: 선택 CPID 문맥) */
  title?: ReactNode;
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
    const hasHeader = title !== undefined || actions !== undefined || collapsible;

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
          <div className={styles.sectionHeader}>
            {typeof title === 'string' ? <h2 className={styles.sectionTitle}>{title}</h2> : title}
            <div className={styles.sectionActions}>
              {actions}
              {collapsible && (
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
              )}
            </div>
          </div>
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

export interface FormSectionHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 소제목 (18 Bold) */
  title: ReactNode;
  /** 소제목 옆 설명 (12 Regular) */
  description?: ReactNode;
  /** 오른쪽 (이력조회 · 추가 · 삭제) */
  actions?: ReactNode;
}

/** 섹션 안의 소제목 줄 (예: 담당자 정보) */
const FormSectionHeader = forwardRef<HTMLDivElement, FormSectionHeaderProps>(
  ({ title, description, actions, className, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.subHeader, className)}>
      <div className={styles.subHeading}>
        <h3 className={styles.subTitle}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {actions && <div className={styles.subActions}>{actions}</div>}
    </div>
  ),
);
FormSectionHeader.displayName = 'FormSection.Header';

export interface RecordHeadingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 작은 이름 (예: 선택 CPID) */
  label: ReactNode;
  /** 대상 이름 (18 Bold) */
  value: ReactNode;
  /** 아래 줄 (ContextChip · 상태 Badge) */
  children?: ReactNode;
}

/** 섹션 제목 자리의 대상 표시 (Figma Context / 선택 CPID) */
const RecordHeading = forwardRef<HTMLDivElement, RecordHeadingProps>(
  ({ label, value, className, children, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.heading, className)}>
      <div className={styles.headingLine}>
        <span className={styles.headingLabel}>{label}</span>
        <h2 className={styles.headingValue}>{value}</h2>
      </div>
      {children && <div className={styles.headingLine}>{children}</div>}
    </div>
  ),
);
RecordHeading.displayName = 'FormSection.Heading';

export const FormSection = Object.assign(FormSectionRoot, {
  Header: FormSectionHeader,
  Heading: RecordHeading,
});
