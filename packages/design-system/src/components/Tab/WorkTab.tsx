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

/** 메뉴명 최대 글자 수 — 공백 제외 (Figma Work Tab "최대 글자 12자까지"). 넘으면 12자 + 말줄임 아이콘 */
export const WORK_TAB_LABEL_MAX = 12;

/** 공백을 빼고 12자까지 자른다. 넘으면 truncated (글자 말줄임 "…" 대신 아이콘을 붙인다) */
const splitLabel = (text: string) => {
  let count = 0;
  const kept: string[] = [];
  for (const char of Array.from(text)) {
    if (char.trim() !== '') {
      if (count === WORK_TAB_LABEL_MAX) return { text: kept.join('').trimEnd(), truncated: true };
      count += 1;
    }
    kept.push(char);
  }
  return { text, truncated: false };
};

/** 메뉴명: 12자까지는 그대로, 넘으면 12자 + 말줄임 아이콘 (전체 이름은 버튼 title) */
function WorkTabLabel({ label }: { label: string }) {
  const { text, truncated } = splitLabel(label);
  return (
    <span className={styles.label}>
      {text}
      {truncated && (
        <span className={styles.labelMore} aria-hidden="true">
          <Icon name="dots-horizontal" size={16} />
        </span>
      )}
    </span>
  );
}

export interface WorkTabAction {
  /** 항목 식별자 (React key) */
  key: string;
  label: ReactNode;
  onSelect: () => void;
  disabled?: boolean;
}

// ── Action Menu 레이어 (열린 화면 Trigger) ──────────
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
  closeLabel: string;
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
  /** 닫기 버튼 접근성 이름 앞부분 (기본 '닫기' → "메뉴명 닫기") */
  closeLabel?: string;
  children: ReactNode;
}

const WorkTabRoot = forwardRef<HTMLDivElement, WorkTabProps>(
  (
    { value, defaultValue, onChange, onClose, closeLabel = '닫기', className, children, ...rest },
    ref,
  ) => {
    const [current, setCurrent] = useControllableState<string | undefined>(
      value,
      defaultValue,
      (next) => next !== undefined && onChange?.(next),
    );

    const context = useMemo(
      () => ({ value: current, onSelect: setCurrent, onClose, closeLabel }),
      [current, setCurrent, onClose, closeLabel],
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

    const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      group.onClose?.(value);
    };

    return (
      <div {...rest} ref={ref} className={clsx(styles.item, active && styles.active, className)}>
        <button
          type="button"
          role="tab"
          aria-selected={active}
          className={styles.select}
          title={title ?? label}
          onClick={() => group.onSelect(value)}
        >
          {label ? (
            <WorkTabLabel label={label} />
          ) : (
            <span className={styles.label}>{children}</span>
          )}
        </button>
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
