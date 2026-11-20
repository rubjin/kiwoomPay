// IBSheet 셀 안 디자인 시스템 모양 — 클래스 · HTML은 디자인 시스템 KWP 테마(ibsheet-theme.scss)의 kpIb* 클래스와 짝이다.
// 화면 Cols에서 쓴다:
//   링크      { Type: 'Text', Class: IB_CELL.link, CanEdit: 0, OnClick }
//   Badge     { Type: 'Html', CanEdit: 0 } + 데이터에 ibBadge(이름, tone)
//   입력      { Type: 'Text', Class: IB_CELL.input }
//   셀렉트    { Type: 'Enum', Class: IB_CELL.input, Enum, EnumKeys }  (화살표는 테마가 오른쪽에)
//   체크      { Type: 'Bool', CanSort: 0 }  (머리 전체선택을 눌러도 정렬되지 않게)
//   달력      { Type: 'Date', Class: IB_CELL.input, WidthPad: IB_DATE_BUTTON_WIDTH, Format }
//   버튼      { Type: 'Button', Button: 'Html', ButtonText: ibButton('상세'), OnClick }

export const IB_CELL = {
  /** 글자 링크 (TextLink 모양: Primary + 밑줄) */
  link: 'kpIbLink',
  /** 편집 칸 (입력 · 셀렉트 · 달력): 칸 안에 필드 테두리 */
  input: 'kpIbInput',
  /** 고칠 수 있는 칸 — 평소 글자만, 달력 칸은 마우스를 올린 줄에서 아이콘 (IbsheetGrid 열 edit) */
  editable: 'kpIbEditable',
  /** 체크한 줄 (ibsheetOptions checkedRowClass가 붙인다) */
  rowChecked: 'kpIbRowChecked',
} as const;

/**
 * 달력 아이콘 칸 폭(Date 열 WidthPad, 기본 25) — 아이콘 앞 여유 3 + 아이콘 20 + 간격 8 + 필드 안쪽 4 + 칸 선 1.
 * 32로 두면 칸 선만큼 아이콘 왼쪽이 1 잘린다
 */
export const IB_DATE_BUTTON_WIDTH = 36;

export type IbBadgeTone = 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'error';

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const TONE_CLASS: Record<IbBadgeTone, string> = {
  neutral: 'kpIbBadgeNeutral',
  primary: 'kpIbBadgePrimary',
  info: 'kpIbBadgeInfo',
  success: 'kpIbBadgeSuccess',
  warning: 'kpIbBadgeWarning',
  error: 'kpIbBadgeError',
};

/** Badge sm soft (Html 열 값) */
export const ibBadge = (label: string, tone: IbBadgeTone = 'neutral') =>
  `<span class="kpIbBadge ${TONE_CLASS[tone]}">${escapeHtml(label)}</span>`;

/** Button sm Neutral Line (Button 열 ButtonText, Button: 'Html') */
export const ibButton = (label: string) => `<span class="kpIbButton">${escapeHtml(label)}</span>`;
