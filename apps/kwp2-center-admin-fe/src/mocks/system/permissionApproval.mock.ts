// 예시 데이터: 일반권한 신청 28건 (화면설계서 예시 10건 반복, 날짜는 오늘 기준)
// system/permissionApproval.api.ts가 쓴다. TODO(API) 실제 API로 바꾸면 이 파일을 지운다
import type {
  GeneralPermissionRequest,
  GeneralPermissionType,
  RequestStatus,
} from '@/features/system/permissionApproval.types';
import { maskName, maskId } from '@/mocks/utils';

type Seed = [
  no: string,
  /** 원문 계정 ID · 이름 (검색용) → 화면에는 마스킹 */
  id: string,
  name: string,
  department: string,
  type: GeneralPermissionType,
  items: string,
  reason: string,
  requestedAt: string,
  status: RequestStatus,
  processor?: string,
  processedAt?: string,
];

const SEED: Seed[] = [
  [
    '1031',
    'kimds',
    '김도성',
    '정산팀',
    'BOTH',
    '정산내역 > 통합 정산 내역 외 2건',
    '정산카드 신규 배치 업무로 통합 정산 내역 조회와 엑셀 다운로드가 필요합니다.',
    '2026-10-14 16:20',
    'PENDING',
  ],
  [
    '1030',
    'yoosh',
    '유소희',
    '영업팀',
    'FUNCTION',
    '거래내역 > 일반 다운로드 외 1건',
    '월말 보고서 작성',
    '2026-10-14 10:05',
    'PENDING',
  ],
  [
    '1029',
    'leejh',
    '이재현',
    '운영팀',
    'MENU',
    '정산내역 > 정산정보 관리',
    '업무 담당 변경',
    '2026-10-13 15:42',
    'PENDING',
  ],
  [
    '1027',
    'kimds',
    '김도성',
    '정산팀',
    'BOTH',
    '정산내역 > 가맹점 정산 관리 외 1건',
    '환불 업무 지원',
    '2026-10-10 09:30',
    'APPROVED',
    'admin01',
    '2026-10-11 11:02',
  ],
  [
    '1025',
    'yoosh',
    '유소희',
    '영업팀',
    'FUNCTION',
    '거래내역 > 승인취소 관리',
    '원문 처리 권한 요청',
    '2026-10-08 14:11',
    'REJECTED',
    'admin01',
    '2026-10-08 17:40',
  ],
  [
    '1024',
    'leejh',
    '이재현',
    '운영팀',
    'MENU',
    '정산내역 > 정산 예정 금액 조회',
    '업무 변경',
    '2026-10-02 09:50',
    'APPROVED',
    'admin02',
    '2026-10-02 10:15',
  ],
  [
    '1022',
    'kimds',
    '김도성',
    '정산팀',
    'FUNCTION',
    '정산내역 > 결과 파일 다운로드',
    '자료 추출',
    '2026-09-30 16:30',
    'APPROVED',
    'admin02',
    '2026-10-01 09:12',
  ],
  [
    '1019',
    'kimds',
    '김도성',
    '정산팀',
    'FUNCTION',
    '정산내역 > 업무 처리 외 2건',
    '정산 승인 대응',
    '2026-09-28 13:22',
    'APPROVED',
    'admin01',
    '2026-09-28 13:50',
  ],
  [
    '1017',
    'yoosh',
    '유소희',
    '영업팀',
    'MENU',
    '거래내역 > 통합 거래 내역',
    '이력 조회',
    '2026-09-26 16:08',
    'REJECTED',
    'admin01',
    '2026-09-27 09:21',
  ],
  [
    '1015',
    'yoosh',
    '유소희',
    '영업팀',
    'FUNCTION',
    '정산내역 > 통합 정산 내역 조회',
    '고객 지원 점검',
    '2026-09-24 11:08',
    'REJECTED',
    'admin02',
    '2026-09-24 15:31',
  ],
];

/** 예시 기준일(2026-10-18)에서 오늘까지 일수 */
const TODAY_OFFSET = Math.round(
  (Date.now() - new Date('2026-10-18T00:00:00').getTime()) / 86_400_000,
);

export type GeneralRequestRow = GeneralPermissionRequest & {
  rawId: string;
  rawName: string;
  opinion: string | null;
};

// 28건이 되도록 예시를 이어 붙인다 (신청번호 · 일시만 앞당김)
export const GENERAL_REQUESTS: GeneralRequestRow[] = Array.from({ length: 28 }, (_, i) => {
  const [
    no,
    id,
    name,
    department,
    type,
    items,
    reason,
    requestedAt,
    status,
    processor,
    processedAt,
  ] = SEED[i % SEED.length]!;
  const round = Math.floor(i / SEED.length);
  const shiftDay = (text: string) => {
    const d = new Date(text.replace(' ', 'T'));
    // 예시 날짜를 오늘 기준으로 옮긴다 (가장 최근 신청 = 4일 전) — 기본 기간(최근 30일)에 보이게
    d.setDate(d.getDate() - round * 21 + TODAY_OFFSET);
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${text.slice(11)}`;
  };
  return {
    no: String(Number(no) - round * 30),
    rawId: id,
    rawName: name,
    applicant: maskName(name),
    department,
    type,
    items,
    reason,
    requestedAt: shiftDay(requestedAt),
    status,
    processor: processor ? maskId(processor) : null,
    processedAt: processedAt ? shiftDay(processedAt) : null,
    opinion:
      status === 'REJECTED'
        ? '업무 범위 확인 후 다시 신청해 주세요.'
        : status === 'APPROVED'
          ? '승인합니다.'
          : null,
  };
});
