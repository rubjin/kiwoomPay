import type { LnbMenuItem } from '../components/navigation';

// 즐겨찾기 편집 · LNB 예시 메뉴 — Figma KWPC1301 즐겨찾기 편집 팝업(29348:37)의 IA 트리.
// Figma에 하위 메뉴가 보이지 않는 2Depth는 "… 현황" 예시 메뉴 1개를 넣었다 (/* 예시 */, 임의 작업)
export const FAVORITE_MENU: LnbMenuItem[] = [
  {
    id: 'm1',
    label: '거래내역',
    children: [
      {
        id: 'm1-1',
        label: '통합 거래 및 예외 관리',
        children: [
          { id: 'm1-1-1', label: '통합 거래 내역' },
          { id: 'm1-1-2', label: '통합 수납/다운로드 관리' },
          { id: 'm1-1-3', label: '통합 수납 집계 내역' },
          { id: 'm1-1-4', label: '특수/예외 취소 관리' },
          { id: 'm1-1-5', label: '전화로 결제' },
        ],
      },
      {
        id: 'm1-2',
        label: '카드 & 간편결제',
        children: [
          { id: 'm1-2-1', label: '신용카드 거래/주문 내역' },
          { id: 'm1-2-2', label: '간편결제 거래/주문 내역' },
        ],
      },
      {
        id: 'm1-3',
        label: '계좌 & 현금성 결제',
        children: [{ id: 'm1-3-1', label: '계좌 & 현금성 결제 현황' } /* 예시 */],
      },
      {
        id: 'm1-4',
        label: '포인트 & 소액결제',
        children: [{ id: 'm1-4-1', label: '포인트 & 소액결제 현황' } /* 예시 */],
      },
    ],
  },
  {
    id: 'm2',
    label: '통계내역',
    children: [
      {
        id: 'm2-1',
        label: '매출 분석 및 통계',
        children: [{ id: 'm2-1-1', label: '매출 분석 및 통계 현황' } /* 예시 */],
      },
      {
        id: 'm2-2',
        label: '리스크 & RM 관리',
        children: [{ id: 'm2-2-1', label: '리스크 & RM 관리 현황' } /* 예시 */],
      },
      {
        id: 'm2-3',
        label: '대손 및 채권 관리',
        children: [{ id: 'm2-3-1', label: '대손 및 채권 관리 현황' } /* 예시 */],
      },
      {
        id: 'm2-4',
        label: '보고자료 센터',
        children: [{ id: 'm2-4-1', label: '보고자료 센터 현황' } /* 예시 */],
      },
    ],
  },
  {
    id: 'm3',
    label: '정산내역',
    children: [
      {
        id: 'm3-1',
        label: '가맹점 정산 관리',
        children: [
          { id: 'm3-1-1', label: '통합 정산 내역' },
          { id: 'm3-1-2', label: '가맹점 정산 실행/처리' },
          { id: 'm3-1-3', label: '정산 예정 금액 조회' },
          { id: 'm3-1-4', label: '승인/정산 캘린더' },
          { id: 'm3-1-5', label: '정산 자료 추출/다운로드' },
          { id: 'm3-1-6', label: '정산 내역 검증' },
          { id: 'm3-1-7', label: '정산 운영현황' },
        ],
      },
      {
        id: 'm3-2',
        label: '지급 및 예외 정산 관리',
        children: [{ id: 'm3-2-1', label: '지급 및 예외 정산 관리 현황' } /* 예시 */],
      },
      {
        id: 'm3-3',
        label: '청구 & 원천사 정산',
        children: [{ id: 'm3-3-1', label: '청구 & 원천사 정산 현황' } /* 예시 */],
      },
      {
        id: 'm3-4',
        label: '원천사 입금 & 차액 정산',
        children: [{ id: 'm3-4-1', label: '원천사 입금 & 차액 정산 현황' } /* 예시 */],
      },
      {
        id: 'm3-5',
        label: '환불 관리',
        children: [{ id: 'm3-5-1', label: '환불 관리 현황' } /* 예시 */],
      },
      {
        id: 'm3-6',
        label: '수수료 & 대리점 정산',
        children: [{ id: 'm3-6-1', label: '수수료 & 대리점 정산 현황' } /* 예시 */],
      },
      {
        id: 'm3-7',
        label: '세무 & 정산 증빙',
        children: [{ id: 'm3-7-1', label: '세무 & 정산 증빙 현황' } /* 예시 */],
      },
      {
        id: 'm3-8',
        label: '정산 정책·스케줄 관리',
        children: [{ id: 'm3-8-1', label: '정산 정책·스케줄 관리 현황' } /* 예시 */],
      },
      {
        id: 'm3-9',
        label: '지급/이체 관리',
        children: [{ id: 'm3-9-1', label: '지급/이체 관리 현황' } /* 예시 */],
      },
      {
        id: 'm3-10',
        label: '대사·마감·정산자료',
        children: [{ id: 'm3-10-1', label: '대사·마감·정산자료 현황' } /* 예시 */],
      },
      {
        id: 'm3-11',
        label: '분배정산',
        children: [{ id: 'm3-11-1', label: '분배정산 현황' } /* 예시 */],
      },
    ],
  },
  {
    id: 'm4',
    label: '운영관리',
    children: [
      {
        id: 'm4-1',
        label: '가맹점 & 계약 통합 관리',
        children: [{ id: 'm4-1-1', label: '가맹점 & 계약 통합 관리 현황' } /* 예시 */],
      },
      {
        id: 'm4-2',
        label: '가맹점·대행사 계정 & 권한 관리',
        children: [{ id: 'm4-2-1', label: '가맹점·대행사 계정 & 권한 관리 현황' } /* 예시 */],
      },
      {
        id: 'm4-3',
        label: '원천사 연동 관리',
        children: [{ id: 'm4-3-1', label: '원천사 연동 관리 현황' } /* 예시 */],
      },
      {
        id: 'm4-4',
        label: '게시판 & CS 관리',
        children: [{ id: 'm4-4-1', label: '게시판 & CS 관리 현황' } /* 예시 */],
      },
      {
        id: 'm4-5',
        label: '리스크 & 차단 관리',
        children: [{ id: 'm4-5-1', label: '리스크 & 차단 관리 현황' } /* 예시 */],
      },
      {
        id: 'm4-6',
        label: 'AML/KYC 관리',
        children: [{ id: 'm4-6-1', label: 'AML/KYC 관리 현황' } /* 예시 */],
      },
      {
        id: 'm4-7',
        label: '신규 계약/청약 관리',
        children: [{ id: 'm4-7-1', label: '신규 계약/청약 관리 현황' } /* 예시 */],
      },
      {
        id: 'm4-8',
        label: '오프라인 PG 관리',
        children: [{ id: 'm4-8-1', label: '오프라인 PG 관리 현황' } /* 예시 */],
      },
      {
        id: 'm4-9',
        label: '프로모션 관리',
        children: [{ id: 'm4-9-1', label: '프로모션 관리 현황' } /* 예시 */],
      },
      {
        id: 'm4-10',
        label: '원가관리',
        children: [
          { id: 'm4-10-1', label: '원천사별 원가확정' },
          { id: 'm4-10-2', label: 'ERP(SAP) 연계' },
          { id: 'm4-10-3', label: 'VAN-PG Share 매출' },
          { id: 'm4-10-4', label: 'VAN FEE/적용단가' },
        ],
      },
      {
        id: 'm4-11',
        label: '전화로결제/ARS',
        children: [{ id: 'm4-11-1', label: '전화로결제/ARS 현황' } /* 예시 */],
      },
    ],
  },
  {
    id: 'm5',
    label: '부가서비스',
    children: [
      {
        id: 'm5-1',
        label: '지급대행 서비스',
        children: [{ id: 'm5-1-1', label: '지급대행 서비스 현황' } /* 예시 */],
      },
      {
        id: 'm5-2',
        label: '인증 서비스',
        children: [{ id: 'm5-2-1', label: '인증 서비스 현황' } /* 예시 */],
      },
      {
        id: 'm5-3',
        label: '선/직불 & 다우머니',
        children: [{ id: 'm5-3-1', label: '선/직불 & 다우머니 현황' } /* 예시 */],
      },
      {
        id: 'm5-4',
        label: '기타 부가서비스',
        children: [{ id: 'm5-4-1', label: '기타 부가서비스 현황' } /* 예시 */],
      },
      {
        id: 'm5-5',
        label: '해외결제 관리',
        children: [{ id: 'm5-5-1', label: '해외결제 관리 현황' } /* 예시 */],
      },
    ],
  },
  {
    id: 'm6',
    label: 'RM관리',
    children: [
      {
        id: 'm6-1',
        label: '이상거래 모니터링(FDS)',
        children: [{ id: 'm6-1-1', label: '이상거래 모니터링(FDS) 현황' } /* 예시 */],
      },
      {
        id: 'm6-2',
        label: '가맹점 리스크 평가',
        children: [{ id: 'm6-2-1', label: '가맹점 리스크 평가 현황' } /* 예시 */],
      },
      {
        id: 'm6-3',
        label: '지급보류 관리',
        children: [{ id: 'm6-3-1', label: '지급보류 관리 현황' } /* 예시 */],
      },
      {
        id: 'm6-4',
        label: '리스크 현황·이력',
        children: [{ id: 'm6-4-1', label: '리스크 현황·이력 현황' } /* 예시 */],
      },
    ],
  },
  {
    id: 'm7',
    label: '시스템관리',
    children: [
      {
        id: 'm7-1',
        label: '내부사용자·권한 관리',
        children: [{ id: 'm7-1-1', label: '내부사용자·권한 관리 현황' } /* 예시 */],
      },
      {
        id: 'm7-2',
        label: '인증·보안 정책 관리',
        children: [{ id: 'm7-2-1', label: '인증·보안 정책 관리 현황' } /* 예시 */],
      },
      {
        id: 'm7-3',
        label: '기준정보·코드 관리',
        children: [{ id: 'm7-3-1', label: '기준정보·코드 관리 현황' } /* 예시 */],
      },
      {
        id: 'm7-4',
        label: '외부연계 관리',
        children: [{ id: 'm7-4-1', label: '외부연계 관리 현황' } /* 예시 */],
      },
      {
        id: 'm7-5',
        label: '배치·작업 관리',
        children: [{ id: 'm7-5-1', label: '배치·작업 관리 현황' } /* 예시 */],
      },
      {
        id: 'm7-6',
        label: '알림·메시지 관리',
        children: [{ id: 'm7-6-1', label: '알림·메시지 관리 현황' } /* 예시 */],
      },
      {
        id: 'm7-7',
        label: '로그·감사이력 관리',
        children: [{ id: 'm7-7-1', label: '로그·감사이력 관리 현황' } /* 예시 */],
      },
      {
        id: 'm7-8',
        label: '시스템 환경설정',
        children: [{ id: 'm7-8-1', label: '시스템 환경설정 현황' } /* 예시 */],
      },
      {
        id: 'm7-9',
        label: '시스템 모니터링',
        children: [{ id: 'm7-9-1', label: '시스템 모니터링 현황' } /* 예시 */],
      },
      {
        id: 'm7-10',
        label: 'VAN 라우팅 관리',
        children: [{ id: 'm7-10-1', label: 'VAN 라우팅 관리 현황' } /* 예시 */],
      },
    ],
  },
];

/** 시안의 선택 예 (5 / 10): 통합 거래 내역 · 신용카드 거래/주문 내역 · 통합 정산 내역 · 통합 수납 집계 내역 · 가맹점 정산 실행/처리 */
export const FAVORITE_SELECTED = ['m1-1-1', 'm1-2-1', 'm3-1-1', 'm1-1-3', 'm3-1-2'];
