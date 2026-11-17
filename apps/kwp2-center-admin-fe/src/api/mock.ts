// 예시 데이터 응답 도구 (API 스펙 전 임시). TODO(API) 실제 API로 바꾸면 이 파일을 쓰는 곳과 함께 지운다

/** 응답 지연 흉내 (ms) */
export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** 걸러 낸 예시 행을 한 페이지만큼 자른다 → SearchResultPage의 items · total */
export function paginate<T>(
  rows: readonly T[],
  { page, pageSize }: { page: number; pageSize: number },
) {
  const from = (page - 1) * pageSize;
  return { items: rows.slice(from, from + pageSize), total: rows.length };
}
