import { Footer as FooterBase } from '@kiwoompay/design-system';
import logoFooter from '@/assets/logo/logo-footer.svg';

// 회사 정보 Footer (로고: 어두운 배경용 흰색, 110 × 16)
export function Footer() {
  return (
    <FooterBase
      logo={<img src={logoFooter} alt="DAOU DATA" width={110} height={16} />}
      items={[
        '대표이사 : 김상준',
        '사업자등록번호 : 220-81-01733',
        '04156 서울특별시 마포구 독막로 311 (염리동, 재화스퀘어) 3층, 5층',
        '대표전화 : 1588-5984',
        'FAX : 02-6280-3268',
      ]}
      copyright="Copyright ⓒ DAOU Tech Inc. All Rights Reserved."
    />
  );
}
