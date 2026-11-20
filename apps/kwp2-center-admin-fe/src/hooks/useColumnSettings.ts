import type { ColumnPickerItem, GridPlaceholderColumn } from '@kiwoompay/design-system';
import { isValidElement, useState } from 'react';

const labelOf = <T>(col: GridPlaceholderColumn<T>) =>
  typeof col.header === 'string'
    ? col.header.replace(/\n/g, ' ') // 두 줄 열 이름(정산대상 거래건수)은 한 줄로
    : isValidElement(col.header)
      ? col.key
      : String(col.header);

/**
 * 조회 결과 표의 표시항목설정 상태 — 보일 열 · 순서. components/popups/ColumnSettingsModal과 쓴다.
 *
 * ```tsx
 * const view = useColumnSettings(columns);
 * <Button onClick={view.open}>표시항목설정</Button>
 * <IbsheetGrid columns={view.columns} … />
 * <ColumnSettingsModal {...view.modalProps} />
 * ```
 */
export function useColumnSettings<T>(columns: GridPlaceholderColumn<T>[]) {
  const [order, setOrder] = useState(() => columns.map((c) => c.key));
  const [visible, setVisible] = useState(() => columns.map((c) => c.key));
  const [isOpen, setOpen] = useState(false);

  const byKey = new Map(columns.map((c) => [c.key, c]));
  const toItem = (key: string): ColumnPickerItem => ({
    value: key,
    label: labelOf(byKey.get(key)!),
  });

  return {
    /** 표에 넘길 열 (보이는 열만, 설정한 순서) */
    columns: order
      .filter((key) => visible.includes(key) && byKey.has(key))
      .map((key) => byKey.get(key)!),
    open: () => setOpen(true),
    modalProps: {
      open: isOpen,
      items: order.filter((key) => byKey.has(key)).map(toItem),
      value: visible,
      defaultItems: columns.map((c) => toItem(c.key)),
      onApply: (items: ColumnPickerItem[], value: string[]) => {
        setOrder(items.map((i) => i.value));
        setVisible(value);
      },
      onClose: () => setOpen(false),
    },
  };
}
