import type { SearchRequest, SearchResultPage } from '@kiwoompay/design-system';
import type {
  ExceptionFilter,
  ExceptionPermission,
  ExceptionPermissionOverview,
} from '@/features/mypage/exceptionPermission.types';
import { paginate, wait } from '@/api/mock';

// TODO(API) 개별 예외 권한 API가 정해지면 axios 호출로 바꾼다. 지금은 화면 확인용 예시 데이터 (Figma 13건)
type Row = [string, string, string, string, string, string];
const ROWS: Row[] = [
  [
    '운영관리 > 가맹점 & 계약 통합관리 > 가맹점 기본/계약 정보 관리',
    '조회, 수정',
    '등록',
    '수정',
    '2026-09-12 00:00',
    '관리자A',
  ],
  [
    '정산내역 > 가맹점 정산 관리 > 정산 자료 추출/다운로드',
    '조회',
    '처리, 다운로드',
    '',
    '2026-09-10 00:00',
    '관리자A',
  ],
  [
    '정산내역 > 가맹점 정산 관리 > 승인/정산 캘린더',
    '조회, 수정',
    '',
    '수정',
    '2026-09-05 00:00',
    '관리자B',
  ],
  ['통계내역 > 매출 분석 및 통계 > 통합 매출 분석', '', '조회', '', '2026-09-05 00:00', '관리자B'],
  [
    '정산내역 > 가맹점 정산 관리 > 통합 정산 내역',
    '조회, 수정',
    '처리, 다운로드',
    '수정',
    '2026-09-04 00:00',
    '관리자A',
  ],
  [
    '정산내역 > 가맹점 정산 관리 > 가맹점 정산 실행/처리',
    '조회, 수정',
    '처리, 다운로드',
    '수정',
    '2026-09-03 00:00',
    '관리자A',
  ],
  [
    '정산내역 > 가맹점 정산 관리 > 정산 예정 금액 조회',
    '조회, 수정',
    '등록, 다운로드',
    '수정',
    '2026-09-02 00:00',
    '관리자B',
  ],
  [
    '정산내역 > 가맹점 정산 관리 > 정산 내역 검증',
    '조회, 수정',
    '처리, 다운로드',
    '수정',
    '2026-09-01 00:00',
    '관리자A',
  ],
  [
    '정산내역 > 지급 및 예외 정산 관리 > 지급보류 & 상계/차감 관리',
    '조회, 수정',
    '처리, 다운로드',
    '수정',
    '2026-08-31 00:00',
    '관리자A',
  ],
  [
    '정산내역 > 지급 및 예외 정산 관리 > 미지급금 내역 관리',
    '조회, 수정',
    '등록, 다운로드',
    '수정',
    '2026-08-30 00:00',
    '관리자B',
  ],
  [
    '정산내역 > 지급 및 예외 정산 관리 > 원천사 입금 & 차액 정산',
    '조회, 수정',
    '처리, 다운로드',
    '수정',
    '2026-08-29 00:00',
    '관리자A',
  ],
  [
    '운영관리 > 가맹점 & 계약 통합관리 > 계약 정보 변경 이력',
    '조회',
    '수정, 다운로드',
    '조회',
    '2026-08-28 00:00',
    '관리자B',
  ],
  [
    '시스템관리 > 사용자 관리 > 계정 관리',
    '조회, 수정',
    '등록',
    '수정, 삭제',
    '2026-08-27 00:00',
    '관리자A',
  ],
];

const list = (s: string) => (s ? s.split(', ') : []);
const SAMPLE: ExceptionPermission[] = ROWS.map((r, i) => ({
  id: `EX-${i + 1}`,
  menuPath: r[0],
  templateActions: list(r[1]),
  addedActions: list(r[2]),
  excludedActions: list(r[3]),
  appliedAt: r[4],
  processor: r[5],
}));

const sum = (key: 'addedActions' | 'excludedActions') =>
  SAMPLE.reduce((n, r) => n + r[key].length, 0);

export async function fetchExceptionOverview(): Promise<ExceptionPermissionOverview> {
  await wait(200);
  return {
    templateName: '운영관리 기본형',
    addedCount: sum('addedActions'),
    excludedCount: sum('excludedActions'),
  };
}

export async function fetchExceptionPermissions({
  params,
  page,
  pageSize,
}: SearchRequest<{ filter: ExceptionFilter }>): Promise<SearchResultPage<ExceptionPermission>> {
  await wait(300);
  const rows = SAMPLE.filter(
    (r) =>
      params.filter === 'all' ||
      (params.filter === 'added' ? r.addedActions.length > 0 : r.excludedActions.length > 0),
  );
  return paginate(rows, { page, pageSize });
}
