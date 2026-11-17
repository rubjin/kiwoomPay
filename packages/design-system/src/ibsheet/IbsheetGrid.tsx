import {
  GridPlaceholder,
  type GridPlaceholderColumn,
} from '../patterns/search-result/GridPlaceholder';
import {
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { checkedRowClass, headerCheckEvents, ibsheetOptions } from './ibsheetOptions';

/**
 * 조회 결과 표를 IBSheet8로 — GridPlaceholder와 같은 props(columns · rows · rowKey · 선택)를 받는다.
 * 화면은 열 정의를 바꾸지 않고 GridPlaceholder 자리에 넣으면 된다.
 *
 * - render가 글자를 돌려주면 그 글자, React 요소(Badge · TextLink · Button …)를 돌려주면 실제 디자인 시스템 컴포넌트의
 *   HTML(renderToStaticMarkup)을 Html 칸에 넣는다 → 모양이 컴포넌트와 같다
 * - 칸을 누르면 render가 돌려준 요소의 onClick을 대신 부른다 (TextLink → 상세 팝업, Button → 처리)
 * - 선택(selectable)은 체크 열 + 머리 전체선택 · 일부 선택(–) · 체크한 줄 배경, selectedKeys와 양쪽 동기화
 * - 읽기 전용 표. 높이는 줄 수에 맞추고(머리 40 + 줄 40 × n), 폭은 표 영역 전체(열 폭은 디자인 값 — colWidth)
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
// 줄 · 머리 높이 (ibsheetOptions와 같은 값)
const ROW_HEIGHT = 40;
const HEADER_HEIGHT = 40;
// 행이 없을 때: 머리 영역(머리 40 + 선, 측정) · 본문 = 상태 안내 높이(StatusView $status-view-height 220) · 가로 스크롤바(측정)
const EMPTY_HEADER_HEIGHT = 43;
const EMPTY_BODY_HEIGHT = 220;
const HSCROLL_HEIGHT = 23;

export interface IbsheetGridProps<T> {
  columns: GridPlaceholderColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  selectable?: boolean;
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
}

/** render 결과 → IBSheet 칸 값 (글자는 그대로, 요소는 HTML) */
const toCellValue = (node: ReactNode) => {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  // .kpIbHtml: 테마가 이 안의 컴포넌트만 IBSheet 기본 테마의 box-sizing 강제를 되돌린다
  return renderToStaticMarkup(<div className="kpIbHtml">{node}</div>);
};

const headerText = (header: ReactNode) =>
  typeof header === 'string' || typeof header === 'number'
    ? String(header) || ' ' // 빈 문자열이면 IBSheet가 열 이름을 보여 준다
    : renderToStaticMarkup(<>{header}</>) || ' ';

const ALIGN = { left: 'Left', center: 'Center', right: 'Right' } as const;

export function IbsheetGrid<T>({
  columns,
  rows,
  rowKey,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
}: IbsheetGridProps<T>) {
  const ibsheet = getIBSheet();
  const elRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<SheetLike | null>(null);
  // 열이 표 폭을 넘어 가로 스크롤바가 있는지 — 있으면 그 높이만큼 표를 늘린다(없으면 마지막 줄이 스크롤바에 가려짐)
  const [hasHScroll, setHasHScroll] = useState(false);
  const sheetId = `ibGrid${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  // 이벤트 안에서 최신 값을 쓰도록 ref로
  const latest = useRef({ columns, rows, rowKey, onSelectionChange });
  latest.current = { columns, rows, rowKey, onSelectionChange };
  // 표에서 체크해 부모로 보낸 값 — 부모가 같은 값을 다시 내려주면 데이터를 다시 넣지 않는다
  const emittedKeys = useRef<string[] | null>(null);

  const buildData = () =>
    rows.map((row) => {
      const key = rowKey(row);
      const data: SheetRow = { [KEY]: key };
      if (selectable) data[CHECK] = selectedKeys.includes(key) ? 1 : 0;
      for (const col of columns) {
        data[colName(col.key)] = col.render
          ? toCellValue(col.render(row))
          : toCellValue((row as Record<string, ReactNode>)[col.key]);
      }
      return data;
    });

  // 표 만들기 (열 구성이 바뀌는 경우는 없다고 보고 한 번)
  useEffect(() => {
    const el = elRef.current;
    if (!ibsheet || !el) return;

    const emitSelection = (sheet: SheetLike) => {
      const checked = sheet.getRowsByChecked(CHECK) || [];
      const keys = checked.map((r) => String(r[KEY]));
      emittedKeys.current = keys;
      latest.current.onSelectionChange?.(keys);
    };

    const onCellClick = ({ row, col }: { row: SheetRow; col: string }) => {
      const { columns: cols, rows: dataRows, rowKey: keyOf } = latest.current;
      const column = cols.find((c) => colName(c.key) === col);
      const source = dataRows.find((r) => keyOf(r) === row[KEY]);
      if (!column?.render || !source) return;
      const node = column.render(source);
      const onClick = isValidElement(node)
        ? (node as ReactElement<{ onClick?: (e: unknown) => void }>).props.onClick
        : undefined;
      onClick?.({ preventDefault() {}, stopPropagation() {} });
    };

    // 폭을 정하지 않은 열이 있으면 그 열들이 남는 폭을 나눈다 (GridPlaceholder와 같음)
    const hasFlexCol = latest.current.columns.some((c) => !c.width);
    const cols = [
      ...(selectable ? [{ Header: ' ', Name: CHECK, Type: 'Bool', Width: 44, CanSort: 0 }] : []),
      ...latest.current.columns.map((col) => ({
        Header: headerText(col.header),
        Name: colName(col.key),
        Type: col.render ? 'Html' : 'Text',
        CanEdit: 0,
        Align: ALIGN[col.align ?? 'center'],
        ...colWidth(col.width, hasFlexCol),
        ...(col.render ? { OnClick: onCellClick } : {}),
      })),
    ];

    const check = headerCheckEvents(CHECK);
    // 다 그린 뒤(처음 · 조회 · 페이지 · 창 크기 변화) 가로 스크롤바 확인
    const syncHScroll = () => {
      const bar = el.querySelector('.IBHScrollMid');
      setHasHScroll(!!bar && bar.getBoundingClientRect().height > 0);
    };
    const sheet = ibsheet.create({
      id: sheetId,
      el,
      options: ibsheetOptions({
        Def: selectable ? { Row: checkedRowClass(CHECK) } : undefined,
        Events: selectable
          ? {
              ...check,
              onRenderFinish: (e: { sheet: SheetLike }) => {
                check.onRenderFinish(e as never);
                syncHScroll();
              },
              onAfterChange: (e: { sheet: SheetLike; col: string }) => {
                check.onAfterChange(e as never);
                if (e.col === CHECK) emitSelection(e.sheet);
              },
              onCheckAllFinish: (e: { sheet: SheetLike }) => {
                check.onCheckAllFinish(e as never);
                emitSelection(e.sheet);
              },
            }
          : { onRenderFinish: syncHScroll },
        Cols: cols,
      }),
      data: buildData(),
    });
    sheetRef.current = sheet;
    return () => {
      sheetRef.current = null;
      sheet.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 표는 한 번 만들고 데이터만 바꿔 넣는다
  }, [ibsheet, sheetId, selectable]);

  // 행 · 바깥에서 바뀐 선택 → 데이터 다시 넣기 (표에서 체크해 올려 보낸 선택은 건너뜀)
  const selectionKey = selectedKeys.join('|');
  const firstLoad = useRef(true);
  useEffect(() => {
    // 처음에는 표를 만들 때 데이터를 넣었다
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    const emitted = emittedKeys.current;
    if (emitted && emitted.join('|') === selectionKey) return;
    sheetRef.current?.loadSearchData(buildData());
    emittedKeys.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rows · 선택이 바뀔 때만
  }, [rows, selectionKey]);

  // IBSheet가 로드되지 않았으면(vendor/ibsheet 없음 · Storybook 등) 같은 props로 일반 표를 그린다
  if (!ibsheet) {
    return (
      <GridPlaceholder
        columns={columns}
        rows={rows}
        rowKey={rowKey}
        selectable={selectable}
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
      />
    );
  }

  // IBSheet는 el의 인라인 크기로 그린다 (매뉴얼 static/create)
  // 행이 없으면: 머리 → (ResultPanel 상태 안내 자리) → 가로 스크롤바 순서. 본문 높이를 상태 안내(StatusView 220)만큼 잡고,
  // ResultPanel이 data-kp-ib-empty 표 위 본문 자리에 상태 안내를 겹친다(SearchResult.module.scss) — 행이 있을 때처럼 스크롤바가 표 맨 아래.
  // 머리 아래 빈 줄은 테마가 숨김. 스크롤바 높이는 열이 넘칠 때만 더한다 → 안내가 머리와 표 아래 끝 사이 가운데
  const empty = rows.length === 0;
  const height = empty
    ? EMPTY_HEADER_HEIGHT + EMPTY_BODY_HEIGHT + (hasHScroll ? HSCROLL_HEIGHT : 0)
    : HEADER_HEIGHT + ROW_HEIGHT * rows.length + 2 + (hasHScroll ? HSCROLL_HEIGHT : 0);
  return (
    <div ref={elRef} data-kp-ib-empty={empty || undefined} style={{ width: '100%', height }} />
  );
}
