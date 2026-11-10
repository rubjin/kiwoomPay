import clsx from 'clsx';
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { useControllableState, useFloatingPosition, useOutsideClick } from '../../hooks';
import { mergeRefs } from '../../utils';
import { Icon } from '../Icon';
import styles from './WorkTab.module.scss';

/** 한 Workspace에서 열 수 있는 Work Tab 최대 개수. 초과 시 새 Tab 대신 얼럿을 띄운다 (화면에서 처리) */
export const WORK_TAB_LIMIT = 10;

export interface WorkTabAction {
  /** 항목 식별자 (React key) */
  key: string;
  label: ReactNode;
  onSelect: () => void;
  disabled?: boolean;
}

// ── Action Menu 레이어 (더보기 · 열린 화면 Trigger 공용) ──────────
interface ActionMenuLayerProps {
  id: string;
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  actions: WorkTabAction[];
  offsetVar: string;
  align: 'start' | 'end';
  onClose: (restoreFocus: boolean) => void;
}

function ActionMenuLayer({
  id,
  open,
  anchorRef,
  actions,
  offsetVar,
  align,
  onClose,
}: ActionMenuLayerProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const position = useFloatingPosition(anchorRef, menuRef, open, { offsetVar, align });

  const closeOutside = useCallback(() => onClose(false), [onClose]);
  useOutsideClick([anchorRef, menuRef], closeOutside, open);

  // Esc는 캡처 단계에서 먼저 처리해 모달의 Esc보다 앞선다 (메뉴만 닫힘)
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onClose(true);
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div ref={menuRef} id={id} role="menu" className={styles.menu} style={position}>
      {actions.map((action) => (
        <button
          key={action.key}
          type="button"
          role="menuitem"
          className={styles.menuItem}
          disabled={action.disabled}
          onClick={() => {
            onClose(true);
            action.onSelect();
          }}
        >
          {action.label}
        </button>
      ))}
    </div>,
    document.body,
  );
}

function useMenu() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);
  return { open, setOpen, triggerRef, menuId, close };
}

// ── WorkTab (Workspace Bar) ─────────────────────────────────
interface WorkTabContextValue {
  value?: string;
  onSelect: (value: string) => void;
  onClose?: (value: string) => void;
  actions?: WorkTabAction[];
  closeLabel: string;
  moreLabel: string;
}

const WorkTabContext = createContext<WorkTabContextValue | null>(null);

export interface WorkTabProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /** Active Tab 값 (controlled) */
  value?: string;
  /** 처음 Active Tab 값 (uncontrolled) */
  defaultValue?: string;
  /** Tab 선택 → 해당 업무 화면으로 전환 */
  onChange?: (value: string) => void;
  /** 닫기(X) → 해당 Work Tab 종료. 목록에서 빼는 것은 화면이 한다 */
  onClose?: (value: string) => void;
  /** Active Tab의 더보기(•••) 메뉴. 넘기지 않으면 더보기가 없다 */
  actions?: WorkTabAction[];
  /** 닫기 버튼 접근성 이름 앞부분 (기본 '닫기' → "메뉴명 닫기") */
  closeLabel?: string;
  /** 더보기 버튼 접근성 이름 (기본 '탭 메뉴') */
  moreLabel?: string;
  children: ReactNode;
}

const WorkTabRoot = forwardRef<HTMLDivElement, WorkTabProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      onClose,
      actions,
      closeLabel = '닫기',
      moreLabel = '탭 메뉴',
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const [current, setCurrent] = useControllableState<string | undefined>(
      value,
      defaultValue,
      (next) => next !== undefined && onChange?.(next),
    );

    const context = useMemo(
      () => ({ value: current, onSelect: setCurrent, onClose, actions, closeLabel, moreLabel }),
      [current, setCurrent, onClose, actions, closeLabel, moreLabel],
    );

    return (
      <WorkTabContext.Provider value={context}>
        <div {...rest} ref={ref} role="tablist" className={clsx(styles.bar, className)}>
          {children}
        </div>
      </WorkTabContext.Provider>
    );
  },
);
WorkTabRoot.displayName = 'WorkTab';

// ── WorkTab.Item ─────────────────────────────────────────────
export interface WorkTabItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 이 Tab이 나타내는 업무 화면 값 */
  value: string;
  /** 메뉴명 */
  children: ReactNode;
  /** 닫기(X) 표시 (기본 true). 고정 Tab 등 닫을 수 없으면 false */
  closable?: boolean;
}

const WorkTabItem = forwardRef<HTMLDivElement, WorkTabItemProps>(
  ({ value, children, closable = true, className, title, ...rest }, ref) => {
    const group = useContext(WorkTabContext);
    if (!group) throw new Error('WorkTab.Item은 WorkTab 안에서만 사용할 수 있습니다.');
    const active = group.value === value;
    const label = typeof children === 'string' ? children : undefined;
    const menu = useMenu();
    const itemRef = useRef<HTMLDivElement>(null);
    const hasMore = active && !!group.actions?.length;
    const menuOpen = menu.open && hasMore;
    const { setOpen } = menu;

    // Active가 다른 Tab으로 넘어가면 더보기 메뉴를 닫아 둔다
    useEffect(() => {
      if (!hasMore) setOpen(false);
    }, [hasMore, setOpen]);

    const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      group.onClose?.(value);
    };

    return (
      <div
        {...rest}
        ref={mergeRefs(ref, itemRef)}
        className={clsx(styles.item, active && styles.active, className)}
      >
        <button
          type="button"
          role="tab"
          aria-selected={active}
          className={styles.select}
          title={title ?? label}
          onClick={() => group.onSelect(value)}
        >
          <span className={styles.label}>{children}</span>
        </button>
        {hasMore && (
          <button
            ref={menu.triggerRef}
            type="button"
            className={styles.iconButton}
            aria-label={group.moreLabel}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? menu.menuId : undefined}
            onClick={() => menu.setOpen(!menu.open)}
          >
            <Icon name="dots-horizontal" size={24} />
          </button>
        )}
        {closable && (
          <button
            type="button"
            className={clsx(styles.iconButton, styles.close)}
            aria-label={label ? `${label} ${group.closeLabel}` : group.closeLabel}
            onClick={handleClose}
          >
            <Icon name="x-close" size={24} />
          </button>
        )}
        {hasMore && (
          <ActionMenuLayer
            id={menu.menuId}
            open={menuOpen}
            anchorRef={itemRef}
            actions={group.actions ?? []}
            offsetVar="--kp-work-tab-menu-tab-offset"
            align="start"
            onClose={menu.close}
          />
        )}
      </div>
    );
  },
);
WorkTabItem.displayName = 'WorkTab.Item';

// ── WorkTab.ActionMenu (열린 화면 N ⌄) ──────────────────────
export interface WorkTabActionMenuProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  /** Trigger 문구 (기본 '열린 화면') */
  label?: ReactNode;
  /** 열린 Work Tab 수. 넘기면 문구 뒤에 표시 */
  count?: number;
  /** Tab 관리 메뉴 (새 업무 탭으로 열기 · 탭 고정 · 현재 탭 닫기 …) */
  actions: WorkTabAction[];
}

const WorkTabActionMenu = forwardRef<HTMLButtonElement, WorkTabActionMenuProps>(
  ({ label = '열린 화면', count, actions, className, onClick, disabled, ...rest }, ref) => {
    const menu = useMenu();
    const open = menu.open && !disabled;

    return (
      <>
        <button
          {...rest}
          ref={mergeRefs(ref, menu.triggerRef)}
          type="button"
          disabled={disabled}
          className={clsx(styles.trigger, className)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menu.menuId : undefined}
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented) menu.setOpen(!menu.open);
          }}
        >
          <span className={styles.triggerLabel}>
            {label}
            {count !== undefined && ` ${count}`}
          </span>
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={24} />
        </button>
        <ActionMenuLayer
          id={menu.menuId}
          open={open}
          anchorRef={menu.triggerRef}
          actions={actions}
          offsetVar="--kp-work-tab-menu-offset"
          align="end"
          onClose={menu.close}
        />
      </>
    );
  },
);
WorkTabActionMenu.displayName = 'WorkTab.ActionMenu';

/**
 * 열려 있는 업무 화면을 전환 · 관리하는 Workspace Navigation.
 * 같은 화면 안 View 전환은 Tab을 쓴다 (혼용하지 않음).
 *
 * ```tsx
 * <WorkTab value={activeId} onChange={go} onClose={closeTab} actions={tabActions}>
 *   {tabs.map((tab) => (
 *     <WorkTab.Item key={tab.id} value={tab.id}>{tab.title}</WorkTab.Item>
 *   ))}
 * </WorkTab>
 * ```
 */
export const WorkTab = Object.assign(WorkTabRoot, {
  Item: WorkTabItem,
  ActionMenu: WorkTabActionMenu,
});
