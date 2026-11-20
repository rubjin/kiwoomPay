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
  | 'SETTLEMENT_PAY_METHOD'
  | 'SETTLEMENT_TYPE'
  | 'SETTLEMENT_REASON'
  | 'BIZ_TYPE'
  | 'MERCHANT_STATUS'
  | 'COUNTRY'
  | 'CONTACT_ROLE'
  | 'DOWNLOAD_AREA'
  | 'DOWNLOAD_STATUS'
  | 'DOWNLOAD_FILE_STATUS'
  | 'PERMISSION_REQUEST_TYPE'
  | 'PERMISSION_REQUEST_STATUS'
  | 'PAY_HOLD_REASON'
  | 'LOGIN_RESULT'
  | 'LOGIN_STATE'
  | 'ACCOUNT_STATUS'
  | 'PERMISSION_CHANGE_TYPE'
  | 'PERMISSION_CHANGE_KIND'
  | 'NOTIFICATION_TYPE'
  | 'MENU_TYPE'
  | 'FUNCTION_TYPE'
  | 'PERMISSION_KIND'
  | 'SPECIAL_APPLY'
  | 'TEMPLATE_CHANGE_TYPE'
  | 'GENERAL_PERMISSION_TYPE'
  | 'DEPARTMENT'
  | 'APPROVAL_STATUS'
  | 'GRANT_STATUS';

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
    { value: 'M2_END', label: 'M+2월말' },
    { value: 'M2_START', label: 'M+2월초' },
    { value: 'M1_END', label: 'M+1월말' },
    { value: 'M1_START', label: 'M+1월초' },
    { value: 'M1_25', label: 'M+1월 25일' },
    { value: 'MONTH2', label: '월 2회' },
    { value: 'MONTH4', label: '월 4회' },
    { value: 'WEEK', label: '주' },
    { value: 'D1', label: 'D+1 영업일' },
    { value: 'D2', label: 'D+2 영업일' },
    { value: 'D3', label: 'D+3 영업일' },
    { value: 'D4', label: 'D+4 영업일' },
    { value: 'D5', label: 'D+5 영업일' },
    { value: 'D7', label: 'D+7 영업일' },
    { value: 'D5_WEEKDAY', label: 'D+5 평일' },
    { value: 'D7_WEEKDAY', label: 'D+7 평일' },
    { value: 'WEEK2_MONTH', label: '익익주 월 지급' },
    { value: 'YEAR1', label: '연 1회' },
    { value: 'INTERNAL', label: '내부정산' },
    { value: 'SPECIAL', label: '특수' },
    { value: 'FORYOU_MONTH2', label: '포유소프트 전용 월 2회' },
    { value: 'CARD_EASY', label: '카드·간편결제 전용 주기' },
    { value: 'ACCOUNT_CMS', label: '계좌·가상계좌·CMS 전용 주기' },
    { value: 'CARD_KCP', label: '신용카드 KCP 전용 주기' },
  ],
  // 정산 결제수단 (Figma 29620:102092 — 시안 목록 끝의 정산구분 8개는 복사 오류로 보고 뺌, Q82)
  SETTLEMENT_PAY_METHOD: [
    { value: '신용카드', label: '신용카드' },
    { value: '신용카드K', label: '신용카드K' },
    { value: 'ARS700', label: 'ARS700' },
    { value: '폰빌', label: '폰빌' },
    { value: '휴대폰', label: '휴대폰' },
    { value: '계좌이체', label: '계좌이체' },
    { value: '가상계좌', label: '가상계좌' },
    { value: 'CMS', label: 'CMS' },
    { value: '해피머니', label: '해피머니' },
    { value: '도서문화상품권', label: '도서문화상품권' },
    { value: '문화상품권', label: '문화상품권' },
    { value: '게임문화상품권', label: '게임문화상품권' },
    { value: '에그머니', label: '에그머니' },
    { value: '틴캐시', label: '틴캐시' },
    { value: '티머니', label: '티머니' },
    { value: '모바일팝', label: '모바일팝' },
    { value: '카카오페이', label: '카카오페이' },
    { value: '네이버페이', label: '네이버페이' },
    { value: '삼성페이', label: '삼성페이' },
    { value: '페이코', label: '페이코' },
    { value: '애플페이', label: '애플페이' },
    { value: '알리페이', label: '알리페이' },
    { value: '해외카드', label: '해외카드' },
    { value: '가상자산', label: '가상자산' },
  ],
  // 정산구분 (Figma 29620:102092) — 값 = 코드
  SETTLEMENT_TYPE: [
    { value: '01', label: '01 일반' },
    { value: '02', label: '02 조정' },
    { value: '03', label: '03 체납이관' },
    { value: '04', label: '04 당사환불' },
    { value: '05', label: '05 관리비' },
    { value: '06', label: '06 분리정산' },
    { value: '11', label: '11 취소정산' },
    { value: '07', label: '07 가입비' },
    { value: '12', label: '12 유보재정산' },
    { value: '13', label: '13 감액조정' },
    { value: '14', label: '14 미수재정산' },
    { value: '15', label: '15 인증비' },
    { value: '16', label: '16 취소한도초과 지급조정' },
    { value: '17', label: '17 가맹점 별도입금' },
    { value: '19', label: '19 부도(국내 카드)' },
    { value: '21', label: '21 해외카드 일반' },
    { value: '22', label: '22 해외카드 취소' },
    { value: '23', label: '23 가맹점 입금후 취소' },
    { value: '24', label: '24 체크카드 일반' },
    { value: '25', label: '25 체크카드 취소' },
    { value: '26', label: '26 상계 취소' },
    { value: '27', label: '27 강제 취소' },
    { value: '28', label: '28 카드사직권 취소' },
    { value: '29', label: '29 부도(카드)' },
    { value: '31', label: '31 스미싱건 수수료 반환' },
    { value: '32', label: '32 CTI인증비' },
    { value: '33', label: '33 가맹점 입금후 취소 반송' },
    { value: '34', label: '34 상계 취소 반송' },
    { value: '35', label: '35 강제 취소 반송' },
    { value: '36', label: '36 카드사직권 취소 반송' },
    { value: '37', label: '37 가맹점 입금후 취소 반송해제' },
    { value: '38', label: '38 가맹점 입금후 취소(K해외)' },
    { value: '51', label: '51 실시간-성공' },
    { value: '52', label: '52 배치-성공' },
    { value: '53', label: '53 실시간-요청' },
    { value: '54', label: '54 배치-요청' },
    { value: '55', label: '55 실시간-성공취소' },
    { value: '56', label: '56 배치-성공취소' },
    { value: '61', label: '61 카페24 분배정산(차감)' },
    { value: '62', label: '62 카페24 분배정산(가산)' },
    { value: '01DISC', label: '01DISC 차액정산 일반' },
    { value: '11DISC', label: '11DISC 차액정산 취소정산' },
    { value: '13DISC', label: '13DISC 차액정산 감액조정' },
    { value: '21DISC', label: '21DISC 차액정산 해외카드 일반' },
    { value: '22DISC', label: '22DISC 차액정산 해외카드 취소' },
    { value: '23DISC', label: '23DISC 차액정산 가맹점 입금후 취소' },
    { value: '24DISC', label: '24DISC 차액정산 체크카드 일반' },
    { value: '25DISC', label: '25DISC 차액정산 체크카드 취소' },
    { value: '26DISC', label: '26DISC 차액정산 상계 취소' },
    { value: '27DISC', label: '27DISC 차액정산 강제 취소' },
    { value: '28DISC', label: '28DISC 차액정산 카드사직권 취소' },
    { value: '33DISC', label: '33DISC 차액정산 가맹점 입금후 취소 반송' },
    { value: '34DISC', label: '34DISC 차액정산 상계 취소 반송' },
    { value: '35DISC', label: '35DISC 차액정산 강제 취소 반송' },
    { value: '36DISC', label: '36DISC 차액정산 카드사직권 취소 반송' },
    { value: '37DISC', label: '37DISC 차액정산 가맹점 입금후 취소 반송해제' },
  ],
  // 처리사유 (Figma 29620:102092)
  SETTLEMENT_REASON: [
    { value: 'NONE', label: '처리사유 없음' },
    { value: 'HOLDER_MISMATCH', label: '계좌 예금주 불일치' },
    { value: 'LIMIT_ADJUST', label: '지급한도 초과 조정' },
    { value: 'GROUP_OFFSET', label: '상계그룹 내 상계' },
    { value: 'FEE_FIX', label: '수수료 정정' },
    { value: 'PARTIAL_OFFSET', label: '부분상계·잔액 이월' },
    { value: 'CYCLE_MISMATCH', label: '정산주기 불일치' },
    { value: 'PARTIAL_PAY', label: '한도 내 부분지급·이월' },
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
  // 마이페이지 권한 신청 현황: 구분 · 상태
  PERMISSION_REQUEST_TYPE: [
    { value: 'MENU', label: '메뉴권한' },
    { value: 'SPECIAL', label: '특수권한' },
    { value: 'DATA_SCOPE', label: '데이터 접근 범위' },
  ],
  PERMISSION_REQUEST_STATUS: [
    { value: 'PENDING', label: '승인대기' },
    { value: 'APPROVED', label: '승인' },
    { value: 'REJECTED', label: '반려' },
  ],
  // 정산 원장 지급보류 사유 (시안 기본값 '운영자 수동 지급 보류' 외는 예시)
  PAY_HOLD_REASON: [
    { value: 'MANUAL', label: '운영자 수동 지급 보류' },
    { value: 'LIMIT', label: '한도 초과' },
    { value: 'AML', label: 'AML 미이행' },
    { value: 'ETC', label: '기타' },
  ],
  // 마이페이지 로그인 이력 · 계정 상태 이력
  LOGIN_RESULT: [
    { value: 'SUCCESS', label: '성공' },
    { value: 'FAIL', label: '실패' },
    { value: 'UNLOCK', label: '해제' },
  ],
  LOGIN_STATE: [
    { value: 'NORMAL', label: '정상' },
    { value: 'LOCKED', label: '잠금' },
  ],
  ACCOUNT_STATUS: [
    { value: 'TEMP', label: '임시' },
    { value: 'NORMAL', label: '정상' },
    { value: 'SUSPENDED', label: '사용중지' },
  ],
  // 마이페이지 권한 변경 이력 (Figma 권한 변경 이력 팝업, 회수 · 부여 · 제외 외는 시안 값)
  PERMISSION_CHANGE_TYPE: [
    { value: 'MENU', label: '메뉴권한' },
    { value: 'TEMPLATE', label: '권한 템플릿' },
    { value: 'SPECIAL', label: '특수권한' },
    { value: 'DATA_SCOPE', label: '데이터 접근 범위' },
  ],
  PERMISSION_CHANGE_KIND: [
    { value: 'ADD', label: '개별 권한 추가' },
    { value: 'REMOVE', label: '개별 권한 제외' },
    { value: 'TEMPLATE', label: '템플릿 변경' },
    { value: 'GRANT', label: '권한 부여' },
    { value: 'REVOKE', label: '권한 회수' },
    { value: 'SCOPE', label: '범위 변경' },
  ],
  // 알림센터 업무유형 (Figma 알림센터 · 마이페이지 칩)
  NOTIFICATION_TYPE: [
    { value: 'SETTLEMENT', label: '정산' },
    { value: 'RISK', label: '리스크/FDS' },
    { value: 'PAYOUT', label: '지급' },
    { value: 'REVIEW', label: '심사/계약' },
    { value: 'CS', label: '문의/민원' },
  ],
  // 화면설계서 KWPC10010201 메뉴 관리: 그룹 = 하위 펼침 / 업무 화면 · 탭 화면 = PROG_LINK 이동
  MENU_TYPE: [
    { value: 'GROUP', label: '그룹 메뉴' },
    { value: 'PAGE', label: '업무 화면' },
    { value: 'TAB', label: '탭 화면' },
  ],
  // 화면설계서 KWPC10010202 기능 코드 관리
  FUNCTION_TYPE: [
    { value: 'TAB', label: '탭' },
    { value: 'BUTTON', label: '버튼·기능' },
  ],
  PERMISSION_KIND: [
    { value: 'NORMAL', label: '일반' },
    { value: 'SPECIAL', label: '특수' },
  ],
  SPECIAL_APPLY: [
    { value: 'BUTTON', label: '버튼 노출' },
    { value: 'OPTION', label: '옵션 노출' },
    { value: 'EXECUTE', label: '실행 시 검증' },
  ],
  // 화면설계서 KWPC10010302 권한 템플릿 변경 이력
  TEMPLATE_CHANGE_TYPE: [
    { value: 'CREATE', label: '신규 등록' },
    { value: 'INFO', label: '정보 수정' },
    { value: 'USE', label: '사용 변경' },
    { value: 'PERMISSION', label: '권한 변경' },
  ],
  // 화면설계서 KWPC10010501 일반 메뉴·기능 권한 — 권한유형
  GENERAL_PERMISSION_TYPE: [
    { value: 'MENU', label: '메뉴' },
    { value: 'FUNCTION', label: '기능' },
    { value: 'BOTH', label: '메뉴·기능' },
  ],
  // 신청자 부서 (임의 작업: 값 목록 — 조직관리 연동 전)
  DEPARTMENT: [
    { value: '정산팀', label: '정산팀' },
    { value: '영업팀', label: '영업팀' },
    { value: '운영팀', label: '운영팀' },
    { value: 'CS팀', label: 'CS팀' },
    { value: 'RM팀', label: 'RM팀' },
  ],
  // 화면설계서 KWPC10010403 특수권한 결재 현황 — 다우오피스 결재 상태 · 부여 상태
  APPROVAL_STATUS: [
    { value: 'WAITING', label: '승인 대기' },
    { value: 'APPROVED', label: '승인완료' },
    { value: 'REJECTED', label: '반려' },
  ],
  GRANT_STATUS: [
    { value: 'PENDING', label: '부여 대기' },
    { value: 'SCHEDULED', label: '사용 예정' },
    { value: 'ACTIVE', label: '사용 중' },
    { value: 'EXPIRED', label: '기간 만료' },
    { value: 'REVOKED', label: '회수' },
    { value: 'NONE', label: '미부여' },
  ],
};
