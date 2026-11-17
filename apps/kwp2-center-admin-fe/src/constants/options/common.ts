/** 선택지 1개 (SelectBox · Radio · Segmented · MultiSelect 공통) */
export interface Option<V extends string = string> {
  value: V;
  label: string;
}

/** 목록 맨 앞 "전체" */
export const ALL_OPTION: Option = { value: 'all', label: '전체' };

const hours = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`);
/** 시작 시각 (00:00 ~ 23:00, 정시) */
export const START_TIMES: Option[] = hours.map((t) => ({ value: t, label: t }));
/** 종료 시각 (01:00 ~ 23:00 정시 + 23:59) */
export const END_TIMES: Option[] = [
  ...hours.slice(1).map((t) => ({ value: t, label: t })),
  { value: '23:59', label: '23:59' },
];
