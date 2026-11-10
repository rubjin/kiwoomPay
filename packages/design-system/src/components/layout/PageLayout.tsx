import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styles from './PageLayout.module.scss';

// ── PageLayout (App Shell) ──────────────────────────────────
export interface PageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  /** 왼쪽 LNB (Lnb 컴포넌트). 폭은 LNB가 정한다 (240 · 접힘 48) */
  lnb?: ReactNode;
  /** App Header (공통 검색 · 사용자 정보 · 세션). 높이 66 */
  header?: ReactNode;
  /** Work Tab Bar (WorkTab). 영역 높이 60, Tab은 아래 선에 붙는다 */
  workTab?: ReactNode;
  /** Work Tab 줄 오른쪽 끝 (예: WorkTab.ActionMenu "열린 화면 N") */
  workTabActions?: ReactNode;
  /** Footer (회사 정보). 높이 74 */
  footer?: ReactNode;
  /** Page Content: PageLayout.Title · PageLayout.Section을 위에서 아래로 쌓는다 */
  children: ReactNode;
}

/**
 * 공통 App Shell. 영역 배치와 여백만 정하고, 각 영역의 내용(LNB · Header · Work Tab · Footer)은 슬롯으로 받는다.
 * 페이지 본문은 문서 스크롤, LNB는 화면 높이에 고정된다. Grid(IBSheet8)는 자체 스크롤을 쓴다.
 */
const PageLayoutRoot = forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ lnb, header, workTab, workTabActions, footer, className, children, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.shell, className)}>
      {lnb && <aside className={styles.lnb}>{lnb}</aside>}
      <div className={styles.main}>
        {header && <header className={styles.header}>{header}</header>}
        {(workTab || workTabActions) && (
          <div className={styles.workTab}>
            <div className={styles.workTabBar}>
              <div className={styles.workTabTabs}>{workTab}</div>
              {workTabActions && <div className={styles.workTabActions}>{workTabActions}</div>}
            </div>
          </div>
        )}
        <main className={styles.content}>{children}</main>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>
  ),
);
PageLayoutRoot.displayName = 'PageLayout';

// ── PageLayout.Title (Page Header) ──────────────────────────
export interface PageTitleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 화면명 */
  title: ReactNode;
  /** 화면별 Action (예: 내 검색조건 선택 · 관리) */
  actions?: ReactNode;
}

const PageTitle = forwardRef<HTMLDivElement, PageTitleProps>(
  ({ title, actions, className, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.pageTitle, className)}>
      <h1 className={styles.titleText}>{title}</h1>
      {actions && <div className={styles.titleActions}>{actions}</div>}
    </div>
  ),
);
PageTitle.displayName = 'PageLayout.Title';

// ── PageLayout.Section ──────────────────────────────────────
export type PageSectionLayout = 'stack' | 'inline';

export interface PageSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Section 제목 (예: 검색 조건 · 조회 결과 · 적용된 검색 조건) */
  title?: ReactNode;
  /** 제목 바로 옆 요소 (예: 접기 버튼 · 표시항목설정 · 엑셀 다운로드) */
  titleAddon?: ReactNode;
  /** 오른쪽 끝 Action (예: 초기화 · 조회 · 업무 처리 버튼) */
  actions?: ReactNode;
  /** stack(기본): 제목 줄 아래에 내용 / inline: 제목 오른쪽에 내용 한 줄 (적용된 검색 조건 · 조회 요약) */
  layout?: PageSectionLayout;
  /** 제목 줄 아래 구분선 (검색 조건) */
  divider?: boolean;
  /** 안쪽 여백 12 (기본 16). 한 줄짜리 Section에 사용 */
  compact?: boolean;
  /** 카드(배경 · 테두리) 없이 영역만 (예: Grid 아래 Total · Pagination 줄) */
  plain?: boolean;
  children?: ReactNode;
}

const PageSection = forwardRef<HTMLElement, PageSectionProps>(
  (
    {
      title,
      titleAddon,
      actions,
      layout = 'stack',
      divider = false,
      compact = false,
      plain = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const hasHeader = title !== undefined || titleAddon !== undefined || actions !== undefined;
    const heading = (title !== undefined || titleAddon !== undefined) && (
      <div className={styles.sectionHeading}>
        {title !== undefined && <h2 className={styles.sectionTitle}>{title}</h2>}
        {titleAddon}
      </div>
    );

    return (
      <section
        {...rest}
        ref={ref}
        className={clsx(
          styles.section,
          compact && styles.compact,
          plain && styles.plain,
          layout === 'inline' && styles.inline,
          className,
        )}
      >
        {layout === 'inline' ? (
          <>
            {heading}
            {children !== undefined && <div className={styles.sectionInlineBody}>{children}</div>}
            {actions && <div className={styles.sectionActions}>{actions}</div>}
          </>
        ) : (
          <>
            {hasHeader && (
              <div className={clsx(styles.sectionHeader, divider && styles.divider)}>
                {heading}
                {actions && <div className={styles.sectionActions}>{actions}</div>}
              </div>
            )}
            {children}
          </>
        )}
      </section>
    );
  },
);
PageSection.displayName = 'PageLayout.Section';

/**
 * 공통 Shell(Header · LNB · Work Tab · Footer)과 Page Title · Section 순서 · 여백을 정한다.
 * Grid 기능 · 업무별 컬럼 · 데이터 처리는 IBSheet8과 화면설계서가 담당한다.
 *
 * ```tsx
 * <PageLayout lnb={<Lnb … />} header={<AppHeader />} workTab={<WorkTab …/>} footer={<AppFooter />}>
 *   <PageLayout.Title title="통합 거래내역" actions={…} />
 *   <PageLayout.Section title="검색 조건" divider actions={…}>…</PageLayout.Section>
 *   <PageLayout.Section title="조회 결과">{grid}</PageLayout.Section>
 * </PageLayout>
 * ```
 */
export const PageLayout = Object.assign(PageLayoutRoot, {
  Title: PageTitle,
  Section: PageSection,
});
