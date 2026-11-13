import { IA_AGENCY } from './ia/agency.generated';
import { IA_INTERNAL } from './ia/internal.generated';
import { IA_MERCHANT } from './ia/merchant.generated';
import { IA_KIND_LABEL, type IaRow } from './ia/types';
import { SCREENS, type ScreenInfo, type ScreenStatus, type SystemId } from './screens';

/** 화면 목록 한 줄 (IA 줄 + 작업 기록) */
export interface ScreenRow {
  key: string;
  depth1: string;
  depth2: string;
  depth3: string;
  id: string;
  name: string;
  /** 앱 경로. 작업 전이면 없음 */
  path?: string;
  /** 화면유형 (IA M/T/P/PT → 페이지 · 탭 · 팝업 · 팝업 안 탭) + 적용 패턴 */
  kind: string;
  /** 신규구분 (IA: 신규 · 개선 · 유지 · 확인필요) */
  change: string;
  status: ScreenStatus;
  planVersion: string;
  updatedAt: string;
  /** 기타: 임의 작업 메모 · IA 비고 */
  etc: string;
}

const IA: Record<SystemId, IaRow[]> = {
  internal: IA_INTERNAL,
  merchant: IA_MERCHANT,
  agency: IA_AGENCY,
};

const withPattern = (kind: string, pattern?: string) =>
  pattern ? `${kind || '-'} (${pattern})` : kind || '-';

const etcOf = (work?: ScreenInfo, note?: string) =>
  [work?.tempWork && `임의 작업: ${work.tempWork}`, note && `비고: ${note}`]
    .filter(Boolean)
    .join(' / ') || '-';

/** IA 줄 마지막 depth = 화면명 */
const iaName = (r: IaRow) => r.depth4 || r.depth3 || r.depth2 || r.depth1;

/**
 * 시스템 화면 목록: IA에 없는 작업 줄(레이아웃 · 패턴 템플릿 · 팝업 모음)을 맨 위에, 그 아래 IA 순서.
 * IA 줄에 같은 화면ID의 작업이 있으면 작업마다 한 줄(예시 케이스 포함), 없으면 미작업 한 줄
 */
export function rowsOf(system: SystemId): ScreenRow[] {
  const ia = IA[system];
  const iaIds = new Set(ia.map((r) => r.id));
  const works = SCREENS.filter((s) => s.system === system);

  const custom: ScreenRow[] = works
    .filter((w) => !iaIds.has(w.id))
    .map((w) => ({
      key: `work|${w.id}|${w.name}`,
      depth1: w.depth1,
      depth2: w.depth2,
      depth3: w.depth3,
      id: w.id,
      name: w.name,
      path: w.path,
      kind: withPattern(w.type, w.pattern),
      change: '-',
      status: w.status,
      planVersion: w.planVersion,
      updatedAt: w.updatedAt,
      etc: etcOf(w),
    }));

  const fromIa = ia.flatMap((r): ScreenRow[] => {
    const base = {
      depth1: r.depth1,
      depth2: r.depth2,
      depth3: r.depth3,
      id: r.id,
      change: r.change || '-',
    };
    const kind = IA_KIND_LABEL[r.kind] ?? r.kind;
    const matched = works.filter((w) => w.id === r.id);
    if (matched.length === 0) {
      return [
        {
          ...base,
          key: `ia|${r.no}`,
          name: iaName(r),
          kind: kind || '-',
          status: '미작업',
          planVersion: '-',
          updatedAt: '-',
          etc: etcOf(undefined, r.note),
        },
      ];
    }
    return matched.map((w) => ({
      ...base,
      key: `ia|${r.no}|${w.name}`,
      name: w.name,
      path: w.path,
      kind: withPattern(kind, w.pattern),
      status: w.status,
      planVersion: w.planVersion,
      updatedAt: w.updatedAt,
      etc: etcOf(w, r.note),
    }));
  });

  return [...custom, ...fromIa];
}
