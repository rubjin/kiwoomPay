import type { Option } from './options';

/**
 * 공통코드 그룹. 서버 공통코드에서 받아 셀렉트 · 라디오 선택지로 쓴다.
 * TODO(API) 서버 그룹 코드 ID가 정해지면 fetchCodes에서 이 이름 → 서버 ID로 바꾼다
 */
export type CodeGroup =
  | 'TX_TYPE'
  | 'PAY_METHOD'
  | 'TX_STATUS'
  | 'TX_SOURCE'
  | 'CANCEL_TYPE'
  | 'SETTLEMENT_CYCLE'
  | 'BIZ_TYPE'
  | 'MERCHANT_STATUS'
  | 'COUNTRY'
  | 'CONTACT_ROLE'
  | 'DOWNLOAD_AREA'
  | 'DOWNLOAD_STATUS'
  | 'DOWNLOAD_FILE_STATUS';

/**
 * 공통코드 임시값 ("전체" 제외). API를 받기 전 · 실패했을 때 쓴다.
 * TODO(API) 공통코드 API가 생기면 화면 확인용으로만 남기거나 지운다 (임의 작업: 값 목록)
 */
export const CODE_FALLBACK: Record<CodeGroup, Option[]> = {
  TX_TYPE: [
    { value: 'approve', label: '승인' },
    { value: 'cancel', label: '취소' },
  ],
  PAY_METHOD: [
    { value: 'card', label: '신용카드' },
    { value: 'easy', label: '간편결제' },
    { value: 'phone', label: '휴대폰결제' },
    { value: 'account', label: '계좌이체' },
  ],
  TX_STATUS: [
    { value: 'done', label: '정상' },
    { value: 'cancelled', label: '취소' },
    { value: 'failed', label: '실패' },
  ],
  TX_SOURCE: [
    { value: 'PG', label: 'PG' },
    { value: 'VAN', label: 'VAN' },
  ],
  CANCEL_TYPE: [
    { value: 'normal', label: '일반취소' },
    { value: 'offset', label: '상계취소' },
    { value: 'force', label: '강제취소' },
  ],
  SETTLEMENT_CYCLE: [
    { value: 'D1', label: 'D+1' },
    { value: 'D5', label: 'D+5' },
    { value: 'M1_END', label: 'M+1 월말' },
    { value: 'M1_START', label: 'M+1 월초' },
  ],
  BIZ_TYPE: [
    { value: 'corp', label: '법인사업자' },
    { value: 'personal', label: '개인사업자' },
    { value: 'nonprofit', label: '비영리' },
  ],
  MERCHANT_STATUS: [
    { value: 'normal', label: '정상' },
    { value: 'suspended', label: '휴업' },
    { value: 'closed', label: '폐업' },
  ],
  COUNTRY: [
    { value: 'KR', label: '대한민국' },
    { value: 'US', label: '미국' },
    { value: 'JP', label: '일본' },
  ],
  CONTACT_ROLE: [
    { value: '계약', label: '계약' },
    { value: '정산', label: '정산' },
    { value: '개발', label: '개발' },
    { value: '상담', label: '상담' },
  ],
  // 다운로드 센터: 업무영역 · 처리상태 · 파일상태
  DOWNLOAD_AREA: [
    { value: 'TRANSACTION', label: '거래내역' },
    { value: 'SETTLEMENT', label: '정산내역' },
    { value: 'ADDON', label: '부가서비스' },
    { value: 'MERCHANT', label: '가맹점정보' },
  ],
  DOWNLOAD_STATUS: [
    { value: 'GENERATING', label: '생성중' },
    { value: 'DONE', label: '완료' },
    { value: 'FAILED', label: '실패' },
  ],
  DOWNLOAD_FILE_STATUS: [
    { value: 'AVAILABLE', label: '다운로드 가능' },
    { value: 'EXPIRED', label: '만료' },
  ],
};
