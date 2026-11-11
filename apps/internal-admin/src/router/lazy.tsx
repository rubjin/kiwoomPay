import { Suspense, lazy as reactLazy, type ComponentType } from 'react';

/**
 * 페이지 코드 스플리팅 헬퍼. 페이지 파일은 default export 대신 named export를 쓴다.
 *   const IntegratedTransactionPage = lazyPage(
 *     () => import('@/pages/transaction/integrated/IntegratedTransactionPage'),
 *     'IntegratedTransactionPage',
 *   );
 *   <Route path="list" element={<IntegratedTransactionPage />} />
 */
export function lazyPage<M extends Record<string, unknown>, K extends keyof M & string>(
  load: () => Promise<M>,
  name: K,
) {
  const Page = reactLazy(async () => ({ default: (await load())[name] as ComponentType }));
  return function LazyPage() {
    return (
      <Suspense fallback={null}>
        <Page />
      </Suspense>
    );
  };
}
