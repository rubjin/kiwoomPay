import clsx from 'clsx';
import {
  cloneElement,
  forwardRef,
  useId,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Icon } from '../../components/Icon';
import { SectionHeading, type SectionHeadingProps } from '../../components/SectionHeading';
import { useControllableState } from '../../hooks';
import styles from './RecordForm.module.scss';

export interface FormSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /**
   * 카드 제목 줄 — `<SectionHeading title="기본 정보" />` (lg 18 Bold).
   * 대상 표시는 label · 아래 줄 문맥은 children (예: 선택 CPID). 접기 버튼은 FormSection이 오른쪽 끝에 붙인다
   */
  heading?: ReactElement<SectionHeadingProps>;
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
  /**
   * 화면명(PageLayout.Title) 바로 아래 첫 탭 묶음: 탭 줄 버튼이 화면명 줄과 겹치게 올라가고 화면명 ↔ 제목 탭 10.
   * 기본(카드 아래)은 위 카드 ↔ 탭 줄 버튼 7 (Figma KWPC07010101)
   */
  underTitle?: boolean;
  children?: ReactNode;
}

/**
 * P02 Record → Form 정보 섹션 카드 (Figma KWPC07010101).
 * 제목 줄 + 접기/열기, 카드 위 제목 탭 · 화면 Action 묶음을 함께 둘 수 있다.
 */
export const FormSection = forwardRef<HTMLElement, FormSectionProps>(
  (
    {
      heading,
      collapsible = false,
      collapsed,
      defaultCollapsed = false,
      onCollapsedChange,
      labels,
      tabs,
      tabActions,
      underTitle = false,
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

    // 카드 제목 줄 = 넘겨받은 SectionHeading + 오른쪽 끝 접기 버튼
    const base = heading ?? (collapsible ? <SectionHeading /> : undefined);
    const cardHeading =
      base &&
      cloneElement(base, {
        className: clsx(base.props.className, styles.heading),
        actions:
          base.props.actions || toggle ? (
            <>
              {base.props.actions}
              {toggle}
            </>
          ) : undefined,
      });

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
        {cardHeading}
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
      <div
        className={clsx(styles.tabbedGroup, underTitle && styles.underTitle, className)}
        style={style}
      >
        <div className={styles.tabRow}>
          <div className={styles.tabs}>{tabs}</div>
          {tabActions && <div className={styles.tabActions}>{tabActions}</div>}
        </div>
        {card}
      </div>
    );
  },
);
FormSection.displayName = 'FormSection';
