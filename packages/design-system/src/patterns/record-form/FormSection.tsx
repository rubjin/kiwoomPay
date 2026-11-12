import clsx from 'clsx';
import {
  Children,
  createContext,
  forwardRef,
  useContext,
  useId,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Icon } from '../../components/Icon';
import { useControllableState } from '../../hooks';
import styles from './RecordForm.module.scss';

interface CollapseContextValue {
  collapsed: boolean;
  toggle: () => void;
  sectionId: string;
  labels: { collapse: string; expand: string };
}

const CollapseContext = createContext<CollapseContextValue | null>(null);
// 접힌 카드의 첫 묶음: 제목 줄만 그린다
const HeadingOnlyContext = createContext(false);

export interface FormSectionProps extends HTMLAttributes<HTMLElement> {
  /**
   * 카드 접기 · 열기. 접으면 첫 묶음(FormGroup)의 제목 줄만 남는다 (Figma: 기본 정보를 접으면 담당자 정보도 숨음).
   * 버튼은 첫 제목 줄 actions에 `<FormSection.Toggle />`로 넣는다
   */
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
  /** 묶음(FormGroup)들. 묶음 사이 16 */
  children?: ReactNode;
}

/**
 * P02 Record → Form 정보 카드 (박스). 배경 · 테두리 · 여백 · 위 제목 탭 · 접기 상태만 맡고,
 * 내용은 "제목 + 폼" 묶음(FormGroup)으로 넣는다.
 *
 * @example
 * <FormSection collapsible>
 *   <FormGroup>
 *     <SectionHeading title="기본 정보" actions={<FormSection.Toggle />} />
 *     <FormTable>…</FormTable>
 *   </FormGroup>
 *   <FormGroup>
 *     <SectionHeading title="담당자 정보" actions={…} />
 *     <FormTable template="…">…</FormTable>
 *   </FormGroup>
 * </FormSection>
 */
const FormSectionRoot = forwardRef<HTMLElement, FormSectionProps>(
  (
    {
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
      id,
      children,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const sectionId = id ?? autoId;
    const [isCollapsed, setCollapsed] = useControllableState(
      collapsed,
      defaultCollapsed,
      onCollapsedChange,
    );
    const folded = collapsible && isCollapsed;

    const card = (
      <section
        {...rest}
        ref={ref}
        id={sectionId}
        className={clsx(
          styles.section,
          tabs !== undefined && styles.tabbed,
          tabs === undefined && className,
        )}
        style={tabs === undefined ? style : undefined}
      >
        <CollapseContext.Provider
          value={
            collapsible
              ? {
                  collapsed: isCollapsed,
                  toggle: () => setCollapsed(!isCollapsed),
                  sectionId,
                  labels: { collapse: '접기', expand: '열기', ...labels },
                }
              : null
          }
        >
          {folded ? (
            <HeadingOnlyContext.Provider value>
              {Children.toArray(children)[0]}
            </HeadingOnlyContext.Provider>
          ) : (
            children
          )}
        </CollapseContext.Provider>
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
FormSectionRoot.displayName = 'FormSection';

/** 접기 · 열기 버튼 (13 Bold + ⌃⌄). collapsible 카드의 첫 제목 줄 actions 끝에 둔다. 아니면 그리지 않는다 */
const FormSectionToggle = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, onClick, ...rest }, ref) => {
    const ctx = useContext(CollapseContext);
    if (!ctx) return null;
    return (
      <button
        {...rest}
        ref={ref}
        type="button"
        className={clsx(styles.toggle, className)}
        aria-expanded={!ctx.collapsed}
        aria-controls={ctx.sectionId}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) ctx.toggle();
        }}
      >
        {ctx.collapsed ? ctx.labels.expand : ctx.labels.collapse}
        <Icon name={ctx.collapsed ? 'chevron-down' : 'chevron-up'} size={20} />
      </button>
    );
  },
);
FormSectionToggle.displayName = 'FormSection.Toggle';

export const FormSection = Object.assign(FormSectionRoot, { Toggle: FormSectionToggle });

export type FormGroupProps = HTMLAttributes<HTMLDivElement>;

/**
 * "제목 + 폼" 묶음: SectionHeading 다음에 FormTable 등. 제목 줄 오른쪽 항목 사이 16.
 * 카드 첫 묶음은 제목 ↔ 폼 16, 그 아래 묶음(담당자 정보)은 8 (Figma KWPC07010101)
 */
export const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(
  ({ className, children, ...rest }, ref) => {
    const headingOnly = useContext(HeadingOnlyContext);
    return (
      <div {...rest} ref={ref} className={clsx(styles.group, className)}>
        {headingOnly ? Children.toArray(children)[0] : children}
      </div>
    );
  },
);
FormGroup.displayName = 'FormGroup';
