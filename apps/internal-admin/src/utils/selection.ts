/** 선택 목록에서 key를 넣거나 뺀다 (줄 체크박스) */
export const toggleKey = (list: readonly string[], key: string) =>
  list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
