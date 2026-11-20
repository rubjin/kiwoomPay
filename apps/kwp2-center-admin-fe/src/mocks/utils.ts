// 예시 데이터 공용 도구 (API 스펙 전 임시). TODO(API) 실제 API로 바꾸면 이 파일을 쓰는 곳과 함께 지운다
// mock 파일 두 곳 이상에서 같은 도구가 필요하면 여기에 둔다 (docs/screen-from-spec.md 4절 "중복 처리")
import { toYmd } from '@/utils/period';

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

// ── 날짜 (예시 날짜를 오늘 기준으로 옮길 때) ──

export const HOUR = 60 * 60 * 1000;
export const DAY = 24 * HOUR;

/** 두 자리 숫자 (9 → '09') */
export const pad = (n: number) => String(n).padStart(2, '0');

/** 'YYYY-MM-DD HH:mm(:ss)' → Date */
export const parseDateTime = (text: string) => new Date(text.replace(' ', 'T'));

/** Date → 'YYYY-MM-DD HH:mm' */
export const toYmdHm = (d: Date) => `${toYmd(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

/** Date → 'YYYY-MM-DD HH:mm:ss' */
export const toYmdHms = (d: Date) => `${toYmdHm(d)}:${pad(d.getSeconds())}`;

// ── 마스킹 (TODO(API) 서버가 마스킹해서 내려준다) ──

/** 홍길동 → 홍*동, 홍길 → 홍* */
export const maskName = (name: string) =>
  name.length <= 2 ? `${name[0]}*` : `${name[0]}${'*'.repeat(name.length - 2)}${name.at(-1)}`;

/** admin01 → adm**01 */
export const maskId = (id: string) => `${id.slice(0, 3)}**${id.slice(-2)}`;

/** 계정 아이디 (kwpay1234 → kw*****34) */
export const maskAccount = (id: string) => `${id.slice(0, 2)}*****${id.slice(-2)}`;
