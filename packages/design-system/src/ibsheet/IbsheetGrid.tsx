import {
  GridPlaceholder,
  type GridPlaceholderColumn,
} from '../patterns/search-result/GridPlaceholder';
import {
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Icon } from '../components/Icon';
import { IB_CELL, IB_DATE_BUTTON_WIDTH } from './ibsheetCells';
import { IbsheetFilterPanel } from './IbsheetFilterPanel';
import { checkedRowClass, headerCheckEvents, ibsheetOptions } from './ibsheetOptions';

/**
 * 조회 결과 표를 IBSheet8로 — GridPlaceholder와 같은 props(columns · rows · rowKey · 선택)를 받는다.
 * 화면은 열 정의를 바꾸지 않고 GridPlaceholder 자리에 넣으면 된다.
 *
 * - render가 글자를 돌려주면 그 글자, React 요소(Badge · TextLink · Button …)를 돌려주면 실제 디자인 시스템 컴포넌트의
 *   HTML(renderToStaticMarkup)을 Html 칸에 넣는다 → 모양이 컴포넌트와 같다
 * - 칸을 누르면 render가 돌려준 요소의 onClick을 대신 부른다 (TextLink → 상세 팝업, Button → 처리)
 * - 선택(selectable)은 체크 열 + 머리 전체선택 · 일부 선택(–) · 체크한 줄 배경, selectedKeys와 양쪽 동기화.
 *   isRowSelectable이 false인 줄은 체크박스가 비활성(회색)이고 고를 수 없다
 * - filterable: 머리 칸 오른쪽 깔때기 → 열 값 고르기(IbsheetFilterPanel). 받은 rows 안에서 거른다
 * - sortable: 머리 칸 정렬 아이콘(맨 오른쪽, 깔때기 오른쪽 4) → 오름차순 · 내림차순 · 정렬 안 함. 받은 rows 안에서 정렬(IBSheet 머리 클릭 정렬은 끔)
 * - 열 edit: 칸 편집(입력 · 달력), 머리 이름 옆 연필. 고치면 onCellEdit
 * - 높이는 줄 수에 맞추고(머리 headerHeight + 줄 48 × n), 폭은 표 영역 전체(열 폭은 디자인 값 — colWidth)
 * IBSheet가 로드되지 않았으면(vendor/ibsheet 없음) 같은 props로 GridPlaceholder(일반 표)를 그린다.
 */

interface SheetRow {
  [key: string]: unknown;
}

interface SheetLike {
  dispose: () => void;
  loadSearchData: (data: object[]) => void;
  getRowsByChecked: (col: string) => SheetRow[] | false;
}

interface IbsheetGlobal {
  create: (args: { id: string; el: HTMLElement; options: object; data?: object[] }) => SheetLike;
}

const getIBSheet = () => (window as unknown as { IBSheet?: IbsheetGlobal }).IBSheet;

const KEY = '__key';
const CHECK = '__check';
// IBSheet 열 이름 — 예약어(id 등 행 속성)와 겹치지 않게 접두어를 붙인다 (id 열이면 머리가 'Header'로 보였음)
const colName = (key: string) => `c_${key}`;
// 폭을 정하지 않은 열의 최소 폭
const DEFAULT_COL_WIDTH = 100;

/**
 * 열 폭 — 디자인(열 정의 width = 시안 측정값)대로, 표 영역 전체를 채운다 (GridPlaceholder · 일반 표와 같은 규칙)
 * - 폭 없는 열이 있으면: 폭 있는 열은 디자인 값 고정, 폭 없는 열이 남는 폭을 나눈다(최소 100)
 * - 모든 열에 폭이 있으면: 남는 폭을 디자인 폭 비율로 나눠 늘어난다(디자인 폭보다 작아지지 않음 — 넘치면 가로 스크롤)
 */
const colWidth = (width: number | undefined, hasFlexCol: boolean) => {
  if (!width) return { RelWidth: 1, MinWidth: DEFAULT_COL_WIDTH };
  return hasFlexCol ? { Width: width } : { RelWidth: width, MinWidth: width };
};
// 줄 · 머리 높이 (ibsheetOptions와 같은 값 — 페이지 표 머리 40 · 줄 48)
const ROW_HEIGHT = 48;
const HEADER_HEIGHT = 40;
// 행이 없을 때: 머리 영역(머리 + 선 3, 측정) · 본문 = 상태 안내 높이(StatusView $status-view-height 220) · 가로 스크롤바(측정)
const EMPTY_HEADER_EXTRA = 3;
const EMPTY_BODY_HEIGHT = 220;
const HSCROLL_HEIGHT = 23;

/** 칸 편집 (IbsheetColumn.edit) */
export interface IbsheetEdit<T> {
  /** text: 입력 · date: 달력(yyyy-MM-dd) */
  type: 'text' | 'date';
  /** 칸 값 (편집할 원래 값) */
  value: (row: T) => string;
  /** 이 줄을 고칠 수 있는지 (없으면 모든 줄) */
  canEdit?: (row: T) => boolean;
}

/** GridPlaceholder 열 + IBSheet 전용(편집) */
export interface IbsheetColumn<T> extends GridPlaceholderColumn<T> {
  edit?: IbsheetEdit<T>;
}

export interface IbsheetGridProps<T> {
  columns: IbsheetColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  selectable?: boolean;
  /** false인 줄은 체크박스가 비활성(회색)이고 고를 수 없다 (예: 조정 원장) */
  isRowSelectable?: (row: T) => boolean;
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  /** 머리 칸 깔때기 → 열 값으로 거르기 (받은 rows 안에서) */
  filterable?: boolean;
  /** 머리 칸 정렬 아이콘 → 오름차순 · 내림차순 · 정렬 안 함 (받은 rows 안에서) */
  sortable?: boolean;
  /** 머리 높이 (기본 40. 두 줄 열 이름이면 56 — 열 이름의 \n이 줄바꿈) */
  headerHeight?: number;
  /** edit 열을 고쳤을 때 */
  onCellEdit?: (row: T, key: string, value: string) => void;
  /** 칸 · 머리 글자: md 14(기본, 데이터 표) · sm 13(열이 많고 내용이 긴 표 — 정산 원장) */
  textSize?: 'md' | 'sm';
}

/** render 결과 → IBSheet 칸 값 (글자는 그대로, 요소는 HTML) */
const toCellValue = (node: ReactNode) => {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  // .kpIbHtml: 테마가 이 안의 컴포넌트만 IBSheet 기본 테마의 box-sizing 강제를 되돌린다
  return renderToStaticMarkup(<div className="kpIbHtml">{node}</div>);
};

/** 필터에 쓰는 칸 글자 (요소면 HTML에서 글자만) */
const toCellText = (node: ReactNode) => {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  return renderToStaticMarkup(<>{node}</>)
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
};

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const headerLabel = (header: ReactNode) =>
  typeof header === 'string' || typeof header === 'number'
    ? escapeHtml(String(header)).replace(/\n/g, '<br>')
    : renderToStaticMarkup(<>{header}</>);

const EDIT_ICON = renderToStaticMarkup(<Icon name="edit" size={16} />);
const FILTER_ICON = renderToStaticMarkup(<Icon name="filter" size={16} />);
// 정렬: 오름차순 · 내림차순 아이콘을 함께 두고 테마가 상태(kpIbHeadSortAsc · Desc)에 맞는 것만 보인다.
// 정렬 안 함은 sort-asc를 회색 하나로 (TODO(시안) 정렬 안 함 아이콘 없음)
const SORT_ASC_ICON = renderToStaticMarkup(<Icon name="sort-asc" size={16} />);
const SORT_DESC_ICON = renderToStaticMarkup(<Icon name="sort-desc" size={16} />);
const SORT_ICONS = `<span class="kpIbSortAsc">${SORT_ASC_ICON}</span><span class="kpIbSortDesc">${SORT_DESC_ICON}</span>`;

export type IbsheetSortDir = 'asc' | 'desc';

/** 정렬 비교 — 숫자(쉼표 · 부호 포함)면 숫자로, 아니면 글자(숫자 자연 순서) */
const compareText = (a: string, b: string) => {
  const num = (s: string) =>
    /^[+-]?[\d,]+(\.\d+)?$/.test(s) ? Number(s.replace(/[,+]/g, '')) : Number.NaN;
  const na = num(a);
  const nb = num(b);
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
  return a.localeCompare(b, 'ko', { numeric: true });
};

/** 머리 칸 — 이름(+ 편집 연필) · 오른쪽 정렬 · 필터 아이콘. 모두 없으면 글자 그대로 */
const headerCell = (
  key: string,
  header: ReactNode,
  editable: boolean,
  filterable: boolean,
  sortable: boolean,
) => {
  if (!editable && !filterable && !sortable) {
    const text = typeof header === 'string' || typeof header === 'number' ? String(header) : '';
    return text ? text : renderToStaticMarkup(<>{header}</>) || ' '; // 빈 문자열이면 IBSheet가 열 이름을 보여 준다
  }
  const label = `<span class="kpIbHeadLabel">${headerLabel(header)}${
    editable ? `<span class="kpIbHeadEdit" aria-label="편집 가능">${EDIT_ICON}</span>` : ''
  }</span>`;
  const sort = sortable
    ? `<span class="kpIbHeadSort" role="button" aria-label="정렬" data-kp-ib-sort="${escapeHtml(key)}">${SORT_ICONS}</span>`
    : '';
  const filter = filterable
    ? `<span class="kpIbHeadFilter" role="button" aria-label="필터" data-kp-ib-filter="${escapeHtml(key)}">${FILTER_ICON}</span>`
    : '';
  // 순서: 필터 → 정렬 (정렬이 맨 오른쪽, 사용자 지정)
  const icons = sort || filter ? `<span class="kpIbHeadIcons">${filter}${sort}</span>` : '';
  return { Value: `<span class="kpIbHead">${label}${icons}</span>`, Type: 'Html' };
};

const ALIGN = { left: 'Left', center: 'Center', right: 'Right' } as const;

// 머리가 잘리지 않는 최소 열 폭 — 칸 여백 12 × 2 + 칸 선 1 · 아이콘 16 · 아이콘 사이 4 · 아이콘 묶음 오른쪽 8 (테마 값과 같음)
const HEAD_PADDING = 12 * 2 + 1;
const HEAD_ICON = 16;
const HEAD_GAP = 4;
const HEAD_ICONS_RIGHT = 8;
const HEAD_SAFETY = 4; // 글꼴 반올림 여유
let measureCtx: CanvasRenderingContext2D | null = null;
const textWidth = (text: string, font: string) => {
  measureCtx ??= document.createElement('canvas').getContext('2d');
  if (!measureCtx) return 0;
  measureCtx.font = font;
  return measureCtx.measureText(text).width;
};

/** 머리 이름(여러 줄이면 가장 긴 줄) + 연필 + 필터 · 정렬 아이콘이 다 보이는 폭 */
const headerMinWidth = (
  header: ReactNode,
  {
    size,
    editable,
    filterable,
    sortable,
  }: { size: number; editable: boolean; filterable: boolean; sortable: boolean },
) => {
  if (typeof header !== 'string' && typeof header !== 'number') return 0;
  const font = `600 ${size}px Pretendard, sans-serif`;
  const label = Math.max(
    ...String(header)
      .split('\n')
      .map((line) => textWidth(line, font)),
  );
  const icons = (filterable ? 1 : 0) + (sortable ? 1 : 0);
  const iconsWidth = icons
    ? HEAD_GAP + icons * HEAD_ICON + (icons - 1) * HEAD_GAP + HEAD_ICONS_RIGHT
    : 0;
  return Math.ceil(label + (editable ? HEAD_ICON : 0) + iconsWidth + HEAD_PADDING + HEAD_SAFETY);
};

/** IBSheet 날짜 값 → yyyy-MM-dd (편집 후 값은 밀리초 숫자로 온다 — 측정) */
const toDateText = (value: unknown) => {
  const s = String(value ?? '');
  if (/^\d{8}$/.test(s)) return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  if (/^\d{10,}$/.test(s)) {
    const d = new Date(Number(s));
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  return s;
};

export function IbsheetGrid<T>({
  columns,
  rows,
  rowKey,
  selectable = false,
  isRowSelectable,
  selectedKeys = [],
  onSelectionChange,
  filterable = false,
  sortable = false,
  headerHeight = HEADER_HEIGHT,
  onCellEdit,
  textSize = 'md',
}: IbsheetGridProps<T>) {
  const ibsheet = getIBSheet();
  const elRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<SheetLike | null>(null);
  // 열이 표 폭을 넘어 가로 스크롤바가 있는지 — 있으면 그 높이만큼 표를 늘린다(없으면 마지막 줄이 스크롤바에 가려짐)
  const [hasHScroll, setHasHScroll] = useState(false);
  const sheetId = `ibGrid${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  // 머리 필터: 열 key → 고른 값 (없으면 전체)
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [openFilter, setOpenFilter] = useState<{ key: string; anchor: HTMLElement } | null>(null);
  const cellText = (col: IbsheetColumn<T>, row: T) =>
    col.edit
      ? col.edit.value(row)
      : col.render
        ? toCellText(col.render(row))
        : toCellText((row as Record<string, ReactNode>)[col.key]);
  const activeFilters = Object.entries(filters).filter(([key]) =>
    columns.some((c) => c.key === key),
  );
  const filteredRows = activeFilters.length
    ? rows.filter((row) =>
        activeFilters.every(([key, values]) => {
          const col = columns.find((c) => c.key === key)!;
          return values.includes(cellText(col, row));
        }),
      )
    : rows;
  // 머리 정렬: 한 열만 (다른 열을 누르면 그 열로 바뀐다)
  const [sort, setSort] = useState<{ key: string; dir: IbsheetSortDir } | null>(null);
  const sortColumn = sort ? columns.find((c) => c.key === sort.key) : undefined;
  const shownRows =
    sort && sortColumn
      ? [...filteredRows].sort((a, b) => {
          const order = compareText(cellText(sortColumn, a), cellText(sortColumn, b));
          return sort.dir === 'asc' ? order : -order;
        })
      : filteredRows;

  // 이벤트 안에서 최신 값을 쓰도록 ref로
  const latest = useRef({ columns, rows, rowKey, onSelectionChange, onCellEdit, filters, sort });
  latest.current = { columns, rows, rowKey, onSelectionChange, onCellEdit, filters, sort };
  // 표에서 체크해 부모로 보낸 값 — 부모가 같은 값을 다시 내려주면 데이터를 다시 넣지 않는다
  const emittedKeys = useRef<string[] | null>(null);

  const buildData = () =>
    shownRows.map((row) => {
      const key = rowKey(row);
      const data: SheetRow = { [KEY]: key };
      if (selectable) {
        const canSelect = isRowSelectable ? isRowSelectable(row) : true;
        data[CHECK] = canSelect && selectedKeys.includes(key) ? 1 : 0;
        if (!canSelect) {
          data[`${CHECK}CanEdit`] = 0;
          data[`${CHECK}Class`] = 'kpIbNoCheck';
        }
      }
      for (const col of columns) {
        const name = colName(col.key);
        if (col.edit) {
          data[name] = col.edit.value(row);
          const canEdit = col.edit.canEdit ? col.edit.canEdit(row) : true;
          if (canEdit) data[`${name}Class`] = IB_CELL.editable;
          else data[`${name}CanEdit`] = 0;
          continue;
        }
        data[name] = col.render
          ? toCellValue(col.render(row))
          : toCellValue((row as Record<string, ReactNode>)[col.key]);
      }
      return data;
    });

  // 머리 깔때기 켜짐 · 정렬 방향 표시 (머리는 다시 그려질 수 있어 그릴 때마다 맞춘다)
  const syncFilterIcons = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    const { filters: on, sort: sorted } = latest.current;
    el.querySelectorAll<HTMLElement>('[data-kp-ib-filter]').forEach((icon) => {
      icon.classList.toggle('kpIbHeadFilterOn', !!on[icon.dataset.kpIbFilter ?? '']);
    });
    el.querySelectorAll<HTMLElement>('[data-kp-ib-sort]').forEach((icon) => {
      const dir = sorted && sorted.key === icon.dataset.kpIbSort ? sorted.dir : null;
      icon.classList.toggle('kpIbHeadSortAsc', dir === 'asc');
      icon.classList.toggle('kpIbHeadSortDesc', dir === 'desc');
    });
  }, []);

  // 표 만들기 — 열 구성(표시항목설정으로 바뀌는 열 · 순서)이 바뀌면 다시 만든다
  const columnsKey = columns.map((c) => c.key + (c.edit ? '*' : '')).join('|');
  useEffect(() => {
    const el = elRef.current;
    if (!ibsheet || !el) return;

    const emitSelection = (sheet: SheetLike) => {
      const checked = sheet.getRowsByChecked(CHECK) || [];
      const keys = checked.map((r) => String(r[KEY]));
      emittedKeys.current = keys;
      latest.current.onSelectionChange?.(keys);
    };

    const sourceOf = (row: SheetRow) => {
      const { rows: dataRows, rowKey: keyOf } = latest.current;
      // IBSheet는 숫자로만 된 키(예: 신청번호 '1031')를 숫자로 바꿔 두므로 문자열로 맞춰 비교
      return dataRows.find((r) => keyOf(r) === String(row[KEY]));
    };

    const onCellClick = ({ row, col }: { row: SheetRow; col: string }) => {
      const column = latest.current.columns.find((c) => colName(c.key) === col);
      const source = sourceOf(row);
      if (!column?.render || column.edit || !source) return;
      const node = column.render(source);
      const onClick = isValidElement(node)
        ? (node as ReactElement<{ onClick?: (e: unknown) => void }>).props.onClick
        : undefined;
      onClick?.({ preventDefault() {}, stopPropagation() {} });
    };

    const onEdit = (row: SheetRow, col: string, value: unknown) => {
      const column = latest.current.columns.find((c) => colName(c.key) === col);
      const source = sourceOf(row);
      if (!column?.edit || !source) return;
      const text = column.edit.type === 'date' ? toDateText(value) : String(value ?? '');
      if (text === column.edit.value(source)) return;
      latest.current.onCellEdit?.(source, column.key, text);
    };

    // 폭을 정하지 않은 열이 있으면 그 열들이 남는 폭을 나눈다 (GridPlaceholder와 같음)
    const hasFlexCol = latest.current.columns.some((c) => !c.width);
    const cols = [
      ...(selectable ? [{ Header: ' ', Name: CHECK, Type: 'Bool', Width: 44, CanSort: 0 }] : []),
      ...latest.current.columns.map((col) => {
        const base = {
          Header: headerCell(col.key, col.header, !!col.edit, filterable, sortable),
          Name: colName(col.key),
          // 정렬 아이콘을 쓰면 IBSheet 머리 클릭 정렬은 끈다 (화면에서 정렬 — 아이콘 상태와 어긋나지 않게)
          ...(sortable ? { CanSort: 0 } : {}),
          Align: ALIGN[col.align ?? 'center'],
          // 시안 폭이 머리(이름 + 아이콘)보다 좁으면 머리가 다 보이는 폭으로 (사용자 요청: th 안 잘리게)
          ...colWidth(
            col.width &&
              Math.max(
                col.width,
                headerMinWidth(col.header, {
                  size: textSize === 'sm' ? 13 : 14,
                  editable: !!col.edit,
                  filterable,
                  sortable,
                }),
              ),
            hasFlexCol,
          ),
        };
        if (col.edit?.type === 'date') {
          return {
            ...base,
            Type: 'Date',
            Format: 'yyyy-MM-dd',
            DataFormat: 'yyyy-MM-dd',
            WidthPad: IB_DATE_BUTTON_WIDTH,
            CanEdit: 1,
          };
        }
        if (col.edit) return { ...base, Type: 'Text', CanEdit: 1 };
        return {
          ...base,
          Type: col.render ? 'Html' : 'Text',
          CanEdit: 0,
          ...(col.render ? { OnClick: onCellClick } : {}),
        };
      }),
    ];

    const check = headerCheckEvents(CHECK);
    // 다 그린 뒤(처음 · 조회 · 페이지 · 창 크기 변화) 가로 스크롤바 · 머리 깔때기 확인
    const afterRender = () => {
      const bar = el.querySelector('.IBHScrollMid');
      setHasHScroll(!!bar && bar.getBoundingClientRect().height > 0);
      syncFilterIcons();
    };
    const sheet = ibsheet.create({
      id: sheetId,
      el,
      options: ibsheetOptions({
        Def: {
          ...(selectable ? { Row: checkedRowClass(CHECK) } : {}),
          Header: { Height: headerHeight },
        },
        Events: {
          ...(selectable ? check : {}),
          onRenderFinish: (e: { sheet: SheetLike }) => {
            if (selectable) check.onRenderFinish(e as never);
            afterRender();
          },
          onAfterChange: (e: { sheet: SheetLike; row: SheetRow; col: string; val: unknown }) => {
            if (selectable) check.onAfterChange(e as never);
            if (e.col === CHECK) emitSelection(e.sheet);
            else onEdit(e.row, e.col, e.val);
          },
          ...(selectable
            ? {
                onCheckAllFinish: (e: { sheet: SheetLike }) => {
                  check.onCheckAllFinish(e as never);
                  emitSelection(e.sheet);
                },
              }
            : {}),
        },
        Cols: cols,
      }),
      data: buildData(),
    });
    sheetRef.current = sheet;

    // 머리 깔때기 · 정렬 아이콘: IBSheet 머리 클릭보다 먼저 받는다
    const iconOf = (event: Event) =>
      (event.target as HTMLElement | null)?.closest<HTMLElement>(
        '[data-kp-ib-filter], [data-kp-ib-sort]',
      ) ?? null;
    const onPointer = (event: Event) => {
      const icon = iconOf(event);
      if (!icon) return;
      event.stopPropagation();
      event.preventDefault();
      if (event.type !== 'click') return;
      if (icon.dataset.kpIbFilter !== undefined) {
        const key = icon.dataset.kpIbFilter;
        setOpenFilter((open) => (open?.key === key ? null : { key, anchor: icon }));
        return;
      }
      // 정렬: 오름차순 → 내림차순 → 정렬 안 함
      const key = icon.dataset.kpIbSort ?? '';
      setSort((prev) =>
        prev?.key !== key ? { key, dir: 'asc' } : prev.dir === 'asc' ? { key, dir: 'desc' } : null,
      );
    };
    const types = ['mousedown', 'mouseup', 'click', 'dblclick'] as const;
    types.forEach((type) => el.addEventListener(type, onPointer, true));
    return () => {
      types.forEach((type) => el.removeEventListener(type, onPointer, true));
      sheetRef.current = null;
      sheet.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 표는 열 구성이 바뀔 때만 만들고 데이터는 바꿔 넣는다
  }, [ibsheet, sheetId, selectable, filterable, sortable, headerHeight, textSize, columnsKey]);

  // 행 · 바깥에서 바뀐 선택 · 필터 · 정렬 → 데이터 다시 넣기 (표에서 체크해 올려 보낸 선택은 건너뜀)
  const selectionKey = selectedKeys.join('|');
  const filtersKey = JSON.stringify({ filters, sort });
  const firstLoad = useRef(true);
  const lastFiltersKey = useRef(filtersKey);
  useEffect(() => {
    // 처음에는 표를 만들 때 데이터를 넣었다
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    const emitted = emittedKeys.current;
    const filterChanged = lastFiltersKey.current !== filtersKey;
    lastFiltersKey.current = filtersKey;
    if (!filterChanged && emitted && emitted.join('|') === selectionKey) return;
    sheetRef.current?.loadSearchData(buildData());
    emittedKeys.current = null;
    syncFilterIcons();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rows · 선택 · 필터 · 정렬이 바뀔 때만
  }, [rows, selectionKey, filtersKey]);

  // IBSheet가 로드되지 않았으면(vendor/ibsheet 없음 · Storybook 등) 같은 props로 일반 표를 그린다
  if (!ibsheet) {
    return (
      <GridPlaceholder
        columns={columns}
        rows={rows}
        rowKey={rowKey}
        selectable={selectable}
        isRowSelectable={isRowSelectable}
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
      />
    );
  }

  const filterColumn = openFilter && columns.find((c) => c.key === openFilter.key);

  // IBSheet는 el의 인라인 크기로 그린다 (매뉴얼 static/create)
  // 행이 없으면: 머리 → (ResultPanel 상태 안내 자리) → 가로 스크롤바 순서. 본문 높이를 상태 안내(StatusView 220)만큼 잡고,
  // ResultPanel이 data-kp-ib-empty 표 위 본문 자리에 상태 안내를 겹친다(SearchResult.module.scss) — 행이 있을 때처럼 스크롤바가 표 맨 아래.
  // 머리 아래 빈 줄은 테마가 숨김. 스크롤바 높이는 열이 넘칠 때만 더한다 → 안내가 머리와 표 아래 끝 사이 가운데
  const empty = shownRows.length === 0;
  const height = empty
    ? headerHeight + EMPTY_HEADER_EXTRA + EMPTY_BODY_HEIGHT + (hasHScroll ? HSCROLL_HEIGHT : 0)
    : headerHeight + ROW_HEIGHT * shownRows.length + 2 + (hasHScroll ? HSCROLL_HEIGHT : 0);
  return (
    <>
      <div
        ref={elRef}
        data-kp-ib-empty={empty || undefined}
        // 머리 높이 — ResultPanel이 빈 표 위 상태 안내 위치를 맞춘다 (SearchResult.module.scss)
        data-kp-ib-head={headerHeight}
        // 글자 크기 — 테마가 sm이면 13 (ibsheet-theme.scss)
        data-kp-ib-size={textSize}
        style={{ width: '100%', height }}
      />
      {openFilter && filterColumn && (
        <IbsheetFilterPanel
          anchor={openFilter.anchor}
          options={[...new Set(rows.map((row) => cellText(filterColumn, row)))]}
          value={filters[openFilter.key]}
          onChange={(value) =>
            setFilters((prev) => {
              const next = { ...prev };
              if (value) next[openFilter.key] = value;
              else delete next[openFilter.key];
              return next;
            })
          }
          onClose={() => setOpenFilter(null)}
        />
      )}
    </>
  );
}
