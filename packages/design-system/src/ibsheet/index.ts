// IBSheet8 연결 — 별도 경로 @kiwoompay/design-system/ibsheet (dist/ibsheet.js). 메인 진입점(index.ts)에는 넣지 않는다.
// IBSheet 본체(vendor/ibsheet)는 앱이 로드한다(개발 서버 vite.ibsheet.ts · 운영 셸 JSP). 테마는 ibsheet.css.
export {
  IbsheetGrid,
  type IbsheetColumn,
  type IbsheetEdit,
  type IbsheetGridProps,
} from './IbsheetGrid';
export {
  IBSHEET_BASE_OPTIONS,
  ibsheetOptions,
  checkedRowClass,
  headerCheckEvents,
} from './ibsheetOptions';
export { IB_CELL, IB_DATE_BUTTON_WIDTH, ibBadge, ibButton, type IbBadgeTone } from './ibsheetCells';
