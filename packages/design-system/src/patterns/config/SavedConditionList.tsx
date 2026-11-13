import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Badge, type BadgeTone } from '../../components/Badge';
import { SearchField } from '../../components/field';
import { Pagination } from '../../components/Pagination';
import styles from './Config.module.scss';

export interface SavedCondition {
  id: string;
  name: string;
  /** 한 줄 요약 (예: 1주일 · PG · 승인) */
  summary: ReactNode;
  /** 상태 Badge (예: 적용 중 · 삭제 예정) */
  status?: { label: ReactNode; tone: BadgeTone };
}

export interface SavedConditionListProps {
  items: SavedCondition[];
  /** 전체 건수 (없으면 items 수) */
  total?: number;
  value?: string;
  onChange?: (id: string) => void;
  query?: string;
  onQueryChange?: (query: string) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  title?: ReactNode;
  /** 저장된 조건이 없을 때 제목 (14 SemiBold) */
  emptyText?: ReactNode;
  /** 저장된 조건이 없을 때 설명 (12 Regular) */
  emptyDescription?: ReactNode;
  /** 검색 결과가 없을 때 */
  noResultText?: ReactNode;
  className?: string;
}

/**
 * 저장된 조건 목록 (P07 V03): 제목 · 총 N 건 → 검색 + 카드 목록(이름 · 요약 · 상태) → Pagination.
 * Figma KWPC04010105 내 검색조건 관리.
 */
export function SavedConditionList({
  items,
  total,
  value,
  onChange,
  query = '',
  onQueryChange,
  page = 1,
  totalPages = 1,
  onPageChange,
  title = '저장된 검색조건',
  emptyText = '저장된 검색조건이 없습니다.',
  emptyDescription = (
    <>
      현재 화면에서 설정한 검색조건을
      <br />
      오른쪽에서 새로 저장할 수 있습니다.
    </>
  ),
  noResultText = '검색 결과가 없습니다.',
  className,
}: SavedConditionListProps) {
  const empty = items.length === 0;
  return (
    <div className={clsx(styles.saved, className)}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>{title}</h3>
        <span className={styles.count}>
          총 {(total ?? items.length).toLocaleString('ko-KR')} 건
        </span>
      </div>
      <div className={clsx(styles.panel, styles.savedPanel, empty && styles.savedPanelEmpty)}>
        {onQueryChange && (
          <SearchField
            fullWidth
            placeholder="검색조건명 검색"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onClear={() => onQueryChange('')}
            aria-label="검색조건명 검색"
          />
        )}
        {empty ? (
          <div className={styles.savedEmpty}>
            {query.trim() ? (
              <p className={styles.savedEmptyTitle}>{noResultText}</p>
            ) : (
              <>
                <p className={styles.savedEmptyTitle}>{emptyText}</p>
                {emptyDescription && (
                  <p className={styles.savedEmptyDescription}>{emptyDescription}</p>
                )}
              </>
            )}
          </div>
        ) : (
          <ul className={styles.savedList}>
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={clsx(styles.card, item.id === value && styles.cardSelected)}
                  aria-pressed={item.id === value}
                  onClick={() => onChange?.(item.id)}
                >
                  <span className={styles.cardTop}>
                    <span className={styles.cardTitle}>{item.name}</span>
                    {item.status && (
                      <Badge size="sm" tone={item.status.tone} dot>
                        {item.status.label}
                      </Badge>
                    )}
                  </span>
                  <span className={styles.cardSummary}>{item.summary}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {totalPages > 1 && onPageChange && (
        <div className={styles.pagination}>
          <hr className={styles.paginationDivider} />
          <Pagination totalPages={totalPages} page={page} onChange={onPageChange} />
        </div>
      )}
    </div>
  );
}

export interface ConditionSummaryProps {
  rows: { label: ReactNode; value: ReactNode }[];
  className?: string;
}

/** 조건 요약 카드 (Neutral 50 · 반경 6): 이름 12 SemiBold · 값 12 Regular, 줄 사이 16 */
export function ConditionSummary({ rows, className }: ConditionSummaryProps) {
  return (
    <dl className={clsx(styles.summary, className)}>
      {rows.map((row, index) => (
        <div key={index} className={styles.summaryRow}>
          <dt className={styles.summaryLabel}>{row.label}</dt>
          <dd className={styles.summaryValue}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export interface ConfigSplitProps {
  /** 맨 위 안내 (12 Regular) */
  description?: ReactNode;
  left: ReactNode;
  right: ReactNode;
  className?: string;
}

/** 설정 Modal 본문 2단: 안내 → 왼쪽(목록, 318) | 구분선 | 오른쪽(선택한 항목 관리) */
export function ConfigSplit({ description, left, right, className }: ConfigSplitProps) {
  return (
    <div className={clsx(styles.split, className)}>
      {description && <p className={styles.splitDescription}>{description}</p>}
      <div className={styles.splitBody}>
        <div className={styles.splitLeft}>{left}</div>
        <div className={styles.splitDivider} />
        <div className={styles.splitRight}>{right}</div>
      </div>
    </div>
  );
}

export interface ConfigFieldProps {
  label: ReactNode;
  /** 라벨 칸 폭 (같은 묶음의 줄을 맞출 때) */
  labelWidth?: number;
  /** between: 라벨 왼쪽 · 내용 오른쪽 끝 (예: 선택 조건 작업 [삭제] [적용]) */
  align?: 'start' | 'between';
  children: ReactNode;
  className?: string;
}

/** 설정 Modal의 라벨(13 Bold) + 내용 줄. 기본 라벨 ↔ 내용 30 (Figma 엑셀 다운로드 설정) */
export function ConfigField({
  label,
  labelWidth,
  align = 'start',
  children,
  className,
}: ConfigFieldProps) {
  return (
    <div className={clsx(styles.field, align === 'between' && styles.fieldBetween, className)}>
      <span className={styles.fieldLabel} style={labelWidth ? { width: labelWidth } : undefined}>
        {label}
      </span>
      <div className={styles.fieldContent}>{children}</div>
    </div>
  );
}

export interface ConfigPanelHeaderProps {
  title: ReactNode;
  /** 오른쪽 (총 N 건 · [신규 등록] 등) */
  actions?: ReactNode;
  className?: string;
}

/** 설정 Modal 패널 제목 줄: 제목 16 Bold · 높이 32 · 오른쪽 actions */
export function ConfigPanelHeader({ title, actions, className }: ConfigPanelHeaderProps) {
  return (
    <div className={clsx(styles.panelHeader, className)}>
      <h3 className={styles.panelTitle}>{title}</h3>
      {actions}
    </div>
  );
}

/** 버튼 옆 보조 설명 (12 Regular) */
export function ConfigHint({ children }: { children: ReactNode }) {
  return <span className={styles.hint}>{children}</span>;
}

/** 설정 패널 안 가로 구분선 */
export function ConfigDivider() {
  return <hr className={styles.hDivider} />;
}
