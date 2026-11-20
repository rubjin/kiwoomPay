// 예시 데이터: 특수권한 결재 32건 (화면설계서 예시 10건 반복, 날짜는 오늘 기준)
// system/specialApproval.api.ts가 쓴다. TODO(API) 실제 API로 바꾸면 이 파일을 지운다
import {
  type ApprovalStatus,
  type GrantStatus,
  type SpecialApproval,
} from '@/features/system/specialApproval.types';
import { maskName, maskId, pad } from '@/mocks/utils';

type Seed = [
  no: string,
  id: string,
  name: string,
  code: string,
  specialName: string,
  requestedAt: string,
  wish: [string, string],
  approval: ApprovalStatus,
  approvedAt: string | null,
  grant: GrantStatus,
  grantPeriod: [string, string] | null,
  grantedBy: string | null,
];

const SEED: Seed[] = [
  [
    '1037',
    'kimds',
    '김도성',
    'SP0002',
    '개인정보 원문 다운로드',
    '2026-10-21 15:20',
    ['10-23', '10-30'],
    'APPROVED',
    '2026-10-22 10:30',
    'PENDING',
    null,
    null,
  ],
  [
    '1036',
    'leejh',
    '이재현',
    'SP0001',
    '개인정보 마스킹 해제',
    '2026-10-20 09:05',
    ['10-22', '10-28'],
    'APPROVED',
    '2026-10-21 16:20',
    'PENDING',
    null,
    null,
  ],
  [
    '1035',
    'yoosh',
    '유소희',
    'SP0003',
    '정산계좌 변경',
    '2026-10-20 14:12',
    ['10-24', '10-25'],
    'WAITING',
    null,
    'NONE',
    null,
    null,
  ],
  [
    '1034',
    'parksy',
    '박서연',
    'SP0002',
    '개인정보 원문 다운로드',
    '2026-10-16 11:23',
    ['10-20', '10-31'],
    'APPROVED',
    '2026-10-17 12:10',
    'ACTIVE',
    ['10-20', '10-31'],
    'admin01',
  ],
  [
    '1033',
    'ohjs',
    '오준석',
    'SP0001',
    '개인정보 마스킹 해제',
    '2026-10-15 10:15',
    ['10-18', '10-20'],
    'REJECTED',
    '2026-10-16 13:18',
    'NONE',
    null,
    null,
  ],
  [
    '1032',
    'kimyj',
    '김유진',
    'SP0003',
    '정산계좌 변경',
    '2026-10-15 09:04',
    ['10-25', '10-28'],
    'APPROVED',
    '2026-10-16 11:50',
    'SCHEDULED',
    ['10-25', '10-28'],
    'admin02',
  ],
  [
    '1031',
    'leesh',
    '이상훈',
    'SP0002',
    '개인정보 원문 다운로드',
    '2026-10-05 11:32',
    ['10-09', '10-15'],
    'APPROVED',
    '2026-10-06 15:44',
    'EXPIRED',
    ['10-09', '10-15'],
    'admin01',
  ],
  [
    '1030',
    'chosm',
    '조수미',
    'SP0003',
    '정산계좌 변경',
    '2026-10-04 16:20',
    ['10-08', '10-13'],
    'APPROVED',
    '2026-10-05 09:31',
    'REVOKED',
    ['10-08', '10-13'],
    'admin02',
  ],
  [
    '1029',
    'choiyg',
    '최영경',
    'SP0001',
    '개인정보 마스킹 해제',
    '2026-10-03 14:12',
    ['10-27', '10-30'],
    'WAITING',
    null,
    'NONE',
    null,
    null,
  ],
  [
    '1028',
    'jungms',
    '정민수',
    'SP0002',
    '개인정보 원문 다운로드',
    '2026-10-01 10:30',
    ['10-19', '10-28'],
    'APPROVED',
    '2026-10-02 14:26',
    'ACTIVE',
    ['10-19', '10-28'],
    'admin01',
  ],
];

/** 예시 기준일(2026-10-23, 기획서 작성일 다음 날)에서 오늘까지 일수 — 예시 날짜를 오늘 기준으로 옮겨 기본 기간(최근 30일)에 보이게 */
const TODAY_OFFSET = Math.round(
  (Date.now() - new Date('2026-10-23T00:00:00').getTime()) / 86_400_000,
);

const shift = (text: string, days: number) => {
  const d = new Date(`${text.slice(0, 10)}T00:00:00`);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}${text.slice(10)}`;
};

type SpecialApprovalRow = SpecialApproval & { rawId: string; rawName: string };

const REASONS: Record<string, string> = {
  SP0001: '고객 문의 대응을 위한 원문 확인 필요',
  SP0002: '정산 보고를 위한 원문자료 다운로드 필요',
  SP0003: '가맹점 정산계좌 변경 요청 처리',
};

export const SPECIAL_APPROVALS: SpecialApprovalRow[] = Array.from({ length: 32 }, (_, i) => {
  const [
    no,
    id,
    name,
    code,
    specialName,
    requestedAt,
    wish,
    approval,
    approvedAt,
    grant,
    grantPeriod,
    grantedBy,
  ] = SEED[i % SEED.length]!;
  const days = TODAY_OFFSET - Math.floor(i / SEED.length) * 21;
  const day = (md: string) => shift(`2026-${md}`, days);
  const at = (text: string | null) => (text ? shift(text, days) : null);
  const reqAt = shift(requestedAt, days);
  return {
    no: String(Number(no) - Math.floor(i / SEED.length) * 40),
    rawId: id,
    rawName: name,
    applicant: maskName(name),
    specialCode: code,
    specialName,
    requestedAt: reqAt,
    wishPeriod: { start: day(wish[0]), end: day(wish[1]) },
    approvalStatus: approval,
    approvedAt: at(approvedAt),
    approvalNo:
      approval === 'WAITING'
        ? `DO-${reqAt.slice(0, 10).replace(/-/g, '')}-00${i % 90}`
        : `DO-${(approvedAt ? at(approvedAt)! : reqAt).slice(0, 10).replace(/-/g, '')}-00${41 + (i % 50)}`,
    approver: approval === 'WAITING' ? null : '장*신', // 결재 승인자 (마스킹, 화면설계서 예시)
    grantStatus: grant,
    grantPeriod: grantPeriod ? { start: day(grantPeriod[0]), end: day(grantPeriod[1]) } : null,
    grantedBy: grantedBy ? maskId(grantedBy) : null,
    reason: REASONS[code] ?? '업무 처리',
  };
});
