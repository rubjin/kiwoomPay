import {
  // 팝업 틀 · 탭
  Modal,
  Tab,
  // 조회 전용 상세 (P02 V01)
  DetailTarget,
  DetailTabs,
  DetailSection,
  DetailCard,
} from '@kiwoompay/design-system';
import { useState } from 'react';

/** Modal md 620 · 높이 고정 (탭 · 상태가 바뀌어도 같은 크기 — 가장 긴 결제 오류 · 결제정보 탭 기준) */
const DETAIL_HEIGHT = 655;

// 기본정보 탭 (Figma 29443:106622)
const MERCHANT_INFO = [
  { label: '가맹점명', value: 'ABC쇼핑몰' },
  { label: 'CPID', value: 'CTS1511467' },
  { label: '상담전화', value: '02-3410-5078' },
  { label: '서비스명', value: '키움페이 결제서비스' },
  { label: 'URL', value: 'https://www.example.com', span: 2 },
];

const TX_INFO = [
  { label: '거래번호', value: 'T202608310001' },
  { label: '주문번호', value: 'O202608310001' },
  { label: '거래원천', value: 'PG' },
  { label: '승인일시', value: '2026-08-31 09:12:30' },
  { label: '결제상태', value: '승인' },
  { label: '결제금액', value: '120,000원' },
];

interface P02DetailModalProps {
  open: boolean;
  onClose: () => void;
  /** 결제 오류 거래 (결제상태 오류 · 에러코드 · 에러내용 빨간 글자) */
  error?: boolean;
}

/**
 * P02 V01 조회 전용 상세 팝업 템플릿 (Figma KWPC04010101 거래 상세정보 · PG, 예시 값).
 * 구성: Modal.Header → DetailTarget(대상) → DetailTabs(제목 탭) → Body(DetailSection + DetailCard). Footer 없음
 */
export function P02DetailModal({ open, onClose, error = false }: P02DetailModalProps) {
  const [tab, setTab] = useState(error ? 'pay' : 'basic');
  return (
    <Modal open={open} onClose={onClose} size="md" height={DETAIL_HEIGHT}>
      <Modal.Header title="거래 상세정보 · PG" closeButton />
      <DetailTarget value="T202608310001" />
      <DetailTabs>
        <Tab variant="title" fullWidth value={tab} onChange={setTab}>
          <Tab.Item value="basic">기본정보</Tab.Item>
          <Tab.Item value="pay">결제정보</Tab.Item>
        </Tab>
      </DetailTabs>
      <Modal.Body>
        {tab === 'pay' ? (
          <DetailSection
            title="결제정보"
            description={
              error
                ? '선택한 PG 거래의 결제정보 및 오류정보를 조회합니다'
                : '선택한 PG 거래의 결제 관련 정보를 조회합니다.'
            }
          >
            <DetailCard
              title="결제정보"
              items={[
                { label: '결제서비스', value: '신용카드' },
                { label: '카드사', value: 'ABC카드' },
                { label: '승인일시', value: '2026-08-31 09:12:30' },
                error
                  ? { label: '결제상태', value: '오류', tone: 'error' }
                  : { label: '결제상태', value: '승인' },
                { label: '결제금액', value: '120,000원' },
                { label: '카드번호', value: '1234-5678-****-9012' },
                { label: '매입상태', value: error ? '승인' : undefined },
                { label: '할부개월' },
                { label: '정산예정일' },
                { label: '예상수수료' },
              ]}
            />
            <DetailCard
              title="결제 고객 정보"
              items={[
                { label: '결제 고객 ID', value: 'user***23' },
                { label: '고객명', value: '홍*동' },
                ...(error
                  ? [
                      { label: '에러코드', value: '에러코드명', tone: 'error' as const },
                      { label: '에러내용', value: '오류 메시지 내용', tone: 'error' as const },
                    ]
                  : []),
              ]}
            />
            <DetailCard title="부분취소 이력" emptyText="표시할 이력이 없습니다." />
          </DetailSection>
        ) : (
          <DetailSection
            title="기본정보"
            description="선택한 PG 거래의 가맹점 및 거래 기본정보를 조회합니다"
          >
            <DetailCard title="가맹점 정보" items={MERCHANT_INFO} />
            <DetailCard title="거래 기본정보" items={TX_INFO} />
          </DetailSection>
        )}
      </Modal.Body>
    </Modal>
  );
}
