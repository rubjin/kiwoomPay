import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SearchStatus } from './ResultPanel';

export interface SearchResultPage<T, S = undefined> {
  items: T[];
  /** 전체 건수 (페이지와 무관) */
  total: number;
  /** 조회 요약 (화면별 집계) */
  summary?: S;
}

export interface SearchRequest<P> {
  params: P;
  page: number;
  pageSize: number;
}

export interface UseSearchResultOptions<P, T, S> {
  /** 검색 조건 기본값 (초기화하면 이 값으로) */
  initialParams: P;
  /** 조회 API. 화면(앱)이 넘긴다 */
  fetch: (request: SearchRequest<P>) => Promise<SearchResultPage<T, S>>;
  /** 페이지당 건수 (기본 10) */
  pageSize?: number;
  /** 최초 진입 시 자동 조회 (기본 false — 페이지 패턴 P-3: 최초 진입은 조회 전 상태) */
  autoSearch?: boolean;
  /** 권한 없음 오류인지 판별 (예: HTTP 403) */
  isForbidden?: (error: unknown) => boolean;
}

/**
 * P01 Search → Result 흐름.
 * - 입력 중인 조건(params)과 조회에 쓴 조건(appliedParams)을 분리한다 → 조건을 바꿔도 결과는 [조회] 전까지 유지
 * - status: idle(조회 전) · loading · success · empty(0건) · error · forbidden
 * - 늦게 도착한 이전 응답은 버린다 (조회 중 다시 조회 · 페이지 이동)
 */
export function useSearchResult<P extends object, T, S = undefined>({
  initialParams,
  fetch,
  pageSize = 10,
  autoSearch = false,
  isForbidden,
}: UseSearchResultOptions<P, T, S>) {
  const [params, setParamsState] = useState<P>(initialParams);
  const [appliedParams, setAppliedParams] = useState<P | null>(null);
  const [page, setPageState] = useState(1);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [data, setData] = useState<SearchResultPage<T, S> | null>(null);
  const [error, setError] = useState<unknown>(null);
  const requestId = useRef(0);
  const fetchRef = useRef(fetch);
  fetchRef.current = fetch;
  const initialRef = useRef(initialParams);

  const run = useCallback(
    async (nextParams: P, nextPage: number): Promise<SearchResultPage<T, S> | undefined> => {
      requestId.current += 1;
      const id = requestId.current;
      setStatus('loading');
      setAppliedParams(nextParams);
      setPageState(nextPage);
      try {
        const result = await fetchRef.current({ params: nextParams, page: nextPage, pageSize });
        if (id !== requestId.current) return undefined;
        setData(result);
        setError(null);
        setStatus(result.total === 0 ? 'empty' : 'success');
        return result;
      } catch (e) {
        if (id !== requestId.current) return undefined;
        setData(null);
        setError(e);
        setStatus(isForbidden?.(e) ? 'forbidden' : 'error');
        return undefined;
      }
    },
    [pageSize, isForbidden],
  );

  /** [조회]: 현재 입력 조건으로 1페이지부터 */
  const search = useCallback(() => run(params, 1), [run, params]);

  /** 페이지 이동: 마지막으로 조회한 조건 기준 */
  const setPage = useCallback(
    (next: number) => {
      if (appliedParams) void run(appliedParams, next);
    },
    [run, appliedParams],
  );

  /**
   * 재조회: 마지막으로 조회한 조건 · 현재 페이지 그대로 (처리 · 저장 후 목록 갱신).
   * 행이 빠져 현재 페이지가 비면 마지막 페이지로 옮긴다. 조회 전이면 아무것도 하지 않는다
   */
  const refresh = useCallback(async () => {
    if (!appliedParams) return;
    const res = await run(appliedParams, page);
    if (res && res.items.length === 0 && res.total > 0 && page > 1) {
      await run(appliedParams, Math.ceil(res.total / pageSize));
    }
  }, [run, appliedParams, page, pageSize]);

  /** 초기화: 입력 조건만 기본값으로 (결과는 유지) */
  const reset = useCallback(() => setParamsState(initialRef.current), []);

  const setParam = useCallback(<K extends keyof P>(key: K, value: P[K]) => {
    setParamsState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setParams = useCallback((patch: Partial<P>) => {
    setParamsState((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    if (autoSearch) void run(initialRef.current, 1);
    // 최초 1회만
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return useMemo(
    () => ({
      params,
      setParam,
      setParams,
      appliedParams,
      search,
      reset,
      status,
      loading: status === 'loading',
      /** 조회를 한 번이라도 했는지 (결과 Action 활성화 기준) */
      searched: appliedParams !== null,
      items: data?.items ?? [],
      total,
      summary: data?.summary,
      error,
      page,
      setPage,
      refresh,
      pageSize,
      totalPages,
    }),
    [
      params,
      setParam,
      setParams,
      appliedParams,
      search,
      reset,
      status,
      data,
      total,
      error,
      page,
      setPage,
      refresh,
      pageSize,
      totalPages,
    ],
  );
}
