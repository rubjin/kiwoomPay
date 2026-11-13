import clsx from 'clsx';
import { useState, type ReactNode } from 'react';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Checkbox } from '../../components/selection';
import styles from './Config.module.scss';

export interface TransferItem {
  key: string;
  label: ReactNode;
}

export interface TransferListProps {
  /** 고를 수 있는 전체 항목 (왼쪽은 이 중 선택되지 않은 것) */
  items: TransferItem[];
  /** 선택 항목 key — 순서 = 출력 순서 */
  value: string[];
  onChange: (value: string[]) => void;
  availableTitle?: ReactNode;
  selectedTitle?: ReactNode;
  className?: string;
}

/**
 * 두 목록 이동 (P07 V02 선택 · 순서): 전체 항목에서 체크 → [추가], 선택 항목에서 체크 → [제거], 선택 항목은 끌어서 순서 변경.
 * Figma KWPC04010107 엑셀 다운로드 설정.
 */
export function TransferList({
  items,
  value,
  onChange,
  availableTitle = '전체 항목',
  selectedTitle = '선택 항목 / 출력 순서',
  className,
}: TransferListProps) {
  const [leftChecked, setLeftChecked] = useState<string[]>([]);
  const [rightChecked, setRightChecked] = useState<string[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const byKey = new Map(items.map((item) => [item.key, item]));
  const available = items.filter((item) => !value.includes(item.key));
  const selected = value
    .map((key) => byKey.get(key))
    .filter((item): item is TransferItem => !!item);

  const toggle = (list: string[], set: (next: string[]) => void, key: string, on: boolean) =>
    set(on ? [...list, key] : list.filter((k) => k !== key));

  const add = () => {
    onChange([...value, ...available.filter((i) => leftChecked.includes(i.key)).map((i) => i.key)]);
    setLeftChecked([]);
  };
  const remove = () => {
    onChange(value.filter((key) => !rightChecked.includes(key)));
    setRightChecked([]);
  };
  const drop = (to: number) => {
    if (dragIndex === null || dragIndex === to) return;
    const next = [...value];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(to, 0, moved!);
    onChange(next);
  };

  return (
    <div className={clsx(styles.transfer, className)}>
      <div className={styles.transferSide}>
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>{availableTitle}</h3>
        </div>
        <div className={clsx(styles.panel, styles.transferPanel)}>
          {available.length === 0 ? (
            <p className={styles.empty}>모든 항목을 선택했습니다.</p>
          ) : (
            <ul className={styles.transferItems}>
              {available.map((item) => (
                <li key={item.key} className={styles.transferItem}>
                  <Checkbox
                    size="sm"
                    label={<span className={styles.transferLabel}>{item.label}</span>}
                    checked={leftChecked.includes(item.key)}
                    onChange={(e) =>
                      toggle(leftChecked, setLeftChecked, item.key, e.target.checked)
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={styles.transferButtons}>
        <Button
          size="sm"
          className={styles.addButton}
          variant="primary"
          appearance="line"
          disabled={leftChecked.length === 0}
          trailingIcon={<Icon name="plus" size={20} />}
          onClick={add}
        >
          추가
        </Button>
        <Button
          size="sm"
          variant="danger"
          appearance="line"
          disabled={rightChecked.length === 0}
          trailingIcon={<Icon name="minus" size={20} />}
          onClick={remove}
        >
          제거
        </Button>
      </div>

      <div className={styles.transferSide}>
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>{selectedTitle}</h3>
        </div>
        <div className={clsx(styles.panel, styles.transferPanel)}>
          {selected.length === 0 ? (
            <p className={styles.empty}>왼쪽에서 항목을 추가해주세요.</p>
          ) : (
            <ul className={styles.rows}>
              {selected.map((item, index) => (
                <li
                  key={item.key}
                  draggable
                  className={clsx(
                    styles.row,
                    dragIndex === index && styles.rowDragging,
                    overIndex === index && dragIndex !== index && styles.rowOver,
                  )}
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = 'move';
                    setDragIndex(index);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setOverIndex(index);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    drop(index);
                  }}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                >
                  <Checkbox
                    size="sm"
                    label={<span className={styles.transferLabel}>{item.label}</span>}
                    checked={rightChecked.includes(item.key)}
                    onChange={(e) =>
                      toggle(rightChecked, setRightChecked, item.key, e.target.checked)
                    }
                  />
                  <span className={styles.handle} aria-hidden>
                    <Icon name="drag-handle" size={20} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
