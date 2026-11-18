import { IB_CELL } from './ibsheetCells';

// IBSheet8 그리드 공통 옵션 — 화면은 Cols · 화면별 Cfg만 더한다.
// 색 · 글자 · 선은 KWP 테마(@kiwoompay/design-system/ibsheet.css — 앱 main.tsx에서 로드),
// 높이는 CSS로 바꿀 수 없어 여기서 정한다 (매뉴얼 props/cfg/size: Def.Row · Def.Header Height)

// TODO(시안) 행 · 머리 높이 40 — GridPlaceholder 미리보기와 같은 임시값 (Lookup 결과 48 등 시안별 확인)
const ROW_HEIGHT = 40;
const HEADER_HEIGHT = 40;

export const IBSHEET_BASE_OPTIONS = {
  // 디자인 시스템 표 미리보기(GridPlaceholder)와 같게
  Cfg: {
    // 기본 테마(Prefix IB) 하나만 쓴다 — vendor/ibsheet/css/default
    SearchMode: 0,
    InfoRowConfig: { Visible: 0 }, // 위 건수 줄 없음 — 건수는 화면 ResultFooter(Total)
    HeaderCheck: 1, // Bool 열 머리에 전체선택 체크박스
    Alternate: 0, // 줄무늬 없음
    HoverScope: 1, // 머리(th)에는 hover 표시 없음 — 줄 hover 판이 머리 줄에도 덮여 어두워졌음
    // IBSheet 자체 '조회된 데이터가 없습니다.' 안내 끔 — 조회 중 행을 비울 때 떴다 사라졌음. 빈 상태 안내는 ResultPanel(StatusView)
    NoDataMessage: 0,
  },
  Def: {
    Row: { Height: ROW_HEIGHT },
    Header: { Height: HEADER_HEIGHT, Align: 'Center' },
    Col: { Align: 'Center' }, // 칸 기본 가운데 (금액은 열에서 Right)
  },
} as const;

interface SheetDef {
  Row?: object;
  Header?: object;
  Col?: object;
  [key: string]: unknown;
}

interface FocusEvent {
  sheet: {
    MainTag: HTMLElement;
    getFirstCol: () => string;
    getLastCol: () => string;
  };
  col: string;
}

/**
 * 커서 칸이 첫 열 · 마지막 열인지 표 영역(MainTag)에 data-kp-ib-focus-edge="first | last"로 붙인다.
 * 커서 칸 테두리는 IBSheet 기본 위치 그대로 두고, 표 바깥으로 나가 잘리는 첫 열 왼쪽 · 마지막 열 오른쪽 조각만 테마가 투명으로
 */
const markFocusEdge = ({ sheet, col }: FocusEvent) => {
  const edges = [
    col === sheet.getFirstCol() && 'first',
    col === sheet.getLastCol() && 'last',
  ].filter(Boolean);
  sheet.MainTag.dataset.kpIbFocusEdge = edges.join(' ');
};

/** 공통 옵션 + 화면 옵션 (Cfg는 한 단계, Def는 Row · Header · Col까지 합친다 — 화면이 Row를 줘도 행 높이 유지) */
export function ibsheetOptions(options: {
  Cfg?: object;
  Def?: SheetDef;
  Cols: object[];
  /** IBSheet 이벤트 (예: headerCheckEvents). onFocus는 공통 처리(첫 · 마지막 열 표시) 뒤에 부른다 */
  Events?: { onFocus?: (e: FocusEvent) => void; [name: string]: unknown };
}) {
  const base = IBSHEET_BASE_OPTIONS.Def;
  const def = options.Def ?? {};
  const events = options.Events ?? {};
  return {
    ...options,
    Events: {
      ...events,
      onFocus: (e: FocusEvent) => {
        markFocusEdge(e);
        events.onFocus?.(e);
      },
    },
    Cfg: { ...IBSHEET_BASE_OPTIONS.Cfg, ...options.Cfg },
    Def: {
      ...base,
      ...def,
      Row: { ...base.Row, ...def.Row },
      Header: { ...base.Header, ...def.Header },
      Col: { ...base.Col, ...def.Col },
    },
  };
}

/**
 * 체크한 줄 배경 — Bool 열(colName) 값이 1이면 줄 칸마다 kpIbRowChecked(테마 $ib-color-row-checked)를 붙인다.
 * Def.Row에 합친다: ibsheetOptions({ Def: { Row: checkedRowClass('check') }, … })
 * (IBSheet 행 ClassFormula — CanFormula · CalcOrder 필요. 화면에 다른 행 Formula가 있으면 CalcOrder에 함께 적는다)
 */
export const checkedRowClass = (colName: string) => ({
  CanFormula: 1,
  CalcOrder: 'Class',
  ClassFormula: (fr: { Row: Record<string, unknown> }) =>
    Number(fr.Row[colName]) === 1 ? IB_CELL.rowChecked : '',
});

interface CheckSheet {
  MainTag: HTMLElement;
  getDataRows: () => unknown[];
  getRowsByChecked: (col: string) => unknown[] | false;
}

/**
 * 머리 전체선택의 일부 선택(–) 표시 — IBSheet 머리 체크는 전체 · 그 외 두 가지뿐이라,
 * 체크가 바뀔 때마다 체크한 줄 수를 세어 표 영역(MainTag)에 data-kp-ib-check="none | partial | all"을 붙인다 (테마가 – 를 그림).
 * ibsheetOptions({ Events: headerCheckEvents('check'), … }) — 화면에 다른 이벤트가 있으면 함께 부른다
 */
export const headerCheckEvents = (colName: string) => {
  const sync = ({ sheet }: { sheet: CheckSheet }) => {
    const total = sheet.getDataRows().length;
    const checked = (sheet.getRowsByChecked(colName) || []).length;
    sheet.MainTag.dataset.kpIbCheck =
      checked === 0 ? 'none' : checked === total ? 'all' : 'partial';
  };
  // 줄 체크(onAfterChange) · 머리 전체선택(onCheckAllFinish) · 조회 · 페이지 바꿈(onRenderFinish)
  return { onAfterChange: sync, onCheckAllFinish: sync, onRenderFinish: sync };
};
