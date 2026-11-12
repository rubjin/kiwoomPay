// TODO(코드) 선택지는 공통코드 API로 바꾼다 (임의 작업: 값 목록)
export const BIZ_TYPES = [
  { value: 'corp', label: '법인사업자' },
  { value: 'personal', label: '개인사업자' },
  { value: 'nonprofit', label: '비영리' },
];
export const MERCHANT_STATUSES = [
  { value: 'normal', label: '정상' },
  { value: 'suspended', label: '휴업' },
  { value: 'closed', label: '폐업' },
];
export const COUNTRIES = [
  { value: 'KR', label: '대한민국' },
  { value: 'US', label: '미국' },
  { value: 'JP', label: '일본' },
];
export const CONTACT_ROLES = [
  { value: '계약', label: '계약' },
  { value: '정산', label: '정산' },
  { value: '개발', label: '개발' },
  { value: '상담', label: '상담' },
];
export const CPID_TABS = [
  'CPID 기본 정보',
  'RM 관리',
  '영업 정보',
  '정산계좌 정보',
  '담당자 정보',
  '공지메일 발송정보',
  '지급보류',
  '공동 영업 수익 배분',
  '결제수단별 설정',
];
