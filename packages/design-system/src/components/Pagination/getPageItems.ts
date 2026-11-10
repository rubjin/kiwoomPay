export type PageItem = number | 'start-ellipsis' | 'end-ellipsis';

const range = (start: number, end: number) =>
  end < start ? [] : Array.from({ length: end - start + 1 }, (_, i) => start + i);

/**
 * 보여줄 페이지 번호와 생략(…) 위치를 계산한다. 항상 같은 개수의 칸을 써서 이동해도 폭이 크게 흔들리지 않는다.
 *
 * 예) total 10, page 1  → 1 2 3 4 5 … 10
 *     total 10, page 5  → 1 … 4 5 6 … 10
 *     total 10, page 10 → 1 … 6 7 8 9 10
 *
 * @param total 전체 페이지 수
 * @param page 현재 페이지 (1부터)
 * @param siblingCount 현재 페이지 양옆에 보여줄 번호 수
 * @param boundaryCount 처음·끝에 항상 보여줄 번호 수
 */
export function getPageItems(
  total: number,
  page: number,
  siblingCount = 1,
  boundaryCount = 1,
): PageItem[] {
  if (total <= 0) return [];

  const startPages = range(1, Math.min(boundaryCount, total));
  const endPages = range(Math.max(total - boundaryCount + 1, boundaryCount + 1), total);

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, total - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0]! - 2 : total - 1,
  );

  return [
    ...startPages,
    ...(siblingsStart > boundaryCount + 2
      ? (['start-ellipsis'] as const)
      : boundaryCount + 1 < total - boundaryCount
        ? [boundaryCount + 1]
        : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < total - boundaryCount - 1
      ? (['end-ellipsis'] as const)
      : total - boundaryCount > boundaryCount
        ? [total - boundaryCount]
        : []),
    ...endPages,
  ];
}
