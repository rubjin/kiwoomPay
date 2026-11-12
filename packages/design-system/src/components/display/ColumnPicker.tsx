import clsx from 'clsx';
import {
  forwardRef,
  useRef,
  useState,
  type DragEvent,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { useControllableState } from '../../hooks';
import { Icon } from '../Icon';
import { Checkbox } from '../selection';
import styles from './ColumnPicker.module.scss';

export interface ColumnPickerItem {
  value: string;
  label: string;
}

export interface ColumnPickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /** 항목 (이 순서대로 보여준다). 순서를 바꾸면 onItemsChange로 새 순서를 넘긴다 */
  items: ColumnPickerItem[];
  onItemsChange?: (items: ColumnPickerItem[]) => void;
  /** 선택한 항목 value (controlled) */
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** 위쪽 안내 문구 */
  description?: ReactNode;
  selectAllLabel?: ReactNode;
  /** 한 줄 칸 수 (기본 4) */
  columns?: number;
}

/**
 * 항목 선택 + 드래그로 순서 변경 (엑셀 다운로드 항목 설정 등). Modal.Body에 넣는다.
 * 순서 변경은 브라우저 기본 Drag and Drop(마우스)이다.
 */
export const ColumnPicker = forwardRef<HTMLDivElement, ColumnPickerProps>(
  (
    {
      items,
      onItemsChange,
      value,
      defaultValue = [],
      onChange,
      description = '다운로드 하고 싶은 항목을 선택하고, 항목의 순서를 변경할 수 있어요.',
      selectAllLabel = '전체선택',
      columns = 4,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const [selected, setSelected] = useControllableState(value, defaultValue, onChange);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    // 이벤트가 연달아 올 때도 끌고 있는 항목을 알 수 있도록 ref에도 둔다
    const dragRef = useRef<number | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);

    const allChecked = items.length > 0 && items.every((item) => selected.includes(item.value));
    const someChecked = !allChecked && items.some((item) => selected.includes(item.value));

    // 선택값은 항목 순서대로 넘긴다
    const ordered = (next: Set<string>) => items.map((i) => i.value).filter((v) => next.has(v));

    const toggle = (target: string, checked: boolean) => {
      const next = new Set(selected);
      if (checked) next.add(target);
      else next.delete(target);
      setSelected(ordered(next));
    };

    const toggleAll = (checked: boolean) => setSelected(checked ? items.map((i) => i.value) : []);

    const endDrag = () => {
      dragRef.current = null;
      setDragIndex(null);
      setOverIndex(null);
    };

    const drop = (event: DragEvent, index: number) => {
      event.preventDefault();
      const from = dragRef.current;
      if (from === null || from === index) return endDrag();
      const next = [...items];
      const [moved] = next.splice(from, 1);
      if (moved) next.splice(index, 0, moved);
      onItemsChange?.(next);
      if (value === undefined)
        setSelected(next.map((i) => i.value).filter((v) => selected.includes(v)));
      endDrag();
    };

    return (
      <div {...rest} ref={ref} className={clsx(styles.picker, className)} style={style}>
        {description && <p className={styles.description}>{description}</p>}
        <Checkbox
          label={selectAllLabel}
          checked={allChecked}
          indeterminate={someChecked}
          onChange={(event) => toggleAll(event.target.checked)}
        />
        <ul className={styles.grid} style={{ gridTemplateColumns: `repeat(${columns}, auto)` }}>
          {items.map((item, index) => (
            <li
              key={item.value}
              className={clsx(
                styles.item,
                dragIndex === index && styles.dragging,
                overIndex === index && dragIndex !== index && styles.over,
              )}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', item.value);
                dragRef.current = index;
                setDragIndex(index);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                if (overIndex !== index) setOverIndex(index);
              }}
              onDrop={(event) => drop(event, index)}
              onDragEnd={endDrag}
            >
              <span className={styles.handle} aria-hidden>
                <Icon name="move" size={20} />
              </span>
              <span className={styles.label} title={item.label}>
                {item.label}
              </span>
              <Checkbox
                aria-label={item.label}
                checked={selected.includes(item.value)}
                onChange={(event) => toggle(item.value, event.target.checked)}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
ColumnPicker.displayName = 'ColumnPicker';
