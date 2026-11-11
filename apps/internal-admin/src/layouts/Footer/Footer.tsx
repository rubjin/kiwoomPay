import { Footer as FooterBase } from '@kiwoompay/design-system';

// 회사 정보 Footer. TODO(시안): 로고 SVG 파일을 받으면 logo를 이미지로 교체
export function Footer() {
  return (
    <FooterBase
      logo={<strong>DAOU DATA</strong>}
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
