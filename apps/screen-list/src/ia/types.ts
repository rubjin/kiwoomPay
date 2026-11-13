/** IA(구글 시트) 한 줄 — scripts/import-ia.mjs가 만든다 */
export interface IaRow {
  /** 시트 NO (화면ID가 겹치는 줄이 있어 줄 구분에 쓴다) */
  no: number;
  depth1: string;
  depth2: string;
  depth3: string;
  depth4: string;
  /** 화면ID (12자리, 예: KWPC01040100) */
  id: string;
  /** 화면유형: M 페이지 · T 탭 · P 팝업 · PT 팝업 안 탭 (빈 값 = 미정) */
  kind: string;
  /** 신규구분: 신규 · 개선 · 유지 · 확인필요 */
  change: string;
  /** 시트 비고 */
  note: string;
}

export const IA_KIND_LABEL: Record<string, string> = {
  M: '페이지',
  T: '탭',
  P: '팝업',
  PT: '팝업 안 탭',
};
