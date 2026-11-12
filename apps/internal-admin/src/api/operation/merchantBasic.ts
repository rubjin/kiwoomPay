import type {
  Address,
  MerchantBasicInfo,
  MerchantContact,
  MerchantRecord,
} from '@/types/operation/merchantBasic';

// TODO(API) 가맹점 기본 정보 조회 · 저장 API가 정해지면 axios 호출로 바꾼다. 지금은 Figma 조회수정 예시 값

const emptyAddress: Address = { country: '', zipCode: '', address1: '', address2: '' };

let seq = 0;
export const newContact = (): MerchantContact => ({
  key: `new-${(seq += 1)}`,
  role: '',
  name: '',
  mobile: '',
  extension: '',
  email: '',
});

export const emptyBasic = (bizNo = ''): MerchantBasicInfo => ({
  bizNo,
  bizType: '',
  smeGrade: '',
  trust: 'yes',
  corpRegNo: '',
  industryCode: '',
  status: '',
  virtualAsset: 'no',
  businessItem: '',
  businessType: '',
  nameKo: '',
  nameEn: '',
  phone: '',
  email: '',
  foundedAt: '',
  ceo: '',
  serviceUrl: '',
  bizAddress: { ...emptyAddress },
  headOfficeSame: false,
  headOfficeAddress: { ...emptyAddress },
  raType: '',
  raDate: '',
});

const SAMPLE_ADDRESS: Address = {
  country: 'KR',
  zipCode: '46757',
  address1: '부산광역시 강서구 녹산산단382로14번가길 10(송정동)',
  address2: '5층',
};

const SAMPLE: MerchantRecord = {
  basic: {
    bizNo: '123-45-67890',
    bizType: 'corp',
    smeGrade: '중소2',
    trust: 'yes',
    corpRegNo: '1234567891012',
    industryCode: '47911',
    status: 'normal',
    virtualAsset: 'no',
    businessItem:
      '전자상거래 및 온라인 플랫폼 운영 디지털 콘텐츠 판매와 광고 서비스 및 솔루션 개발 제공업',
    businessType:
      '정보통신업 및 전자상거래업 전문과학기술서비스업 광고대행업 소프트웨어 개발 및 공급업 제조업',
    nameKo: '㈜ABC커머스',
    nameEn: 'ABC COMMERCE',
    phone: '070-1234-5678',
    email: 'abccmc@naver.com',
    foundedAt: '2008-01-01',
    ceo: '홍길동',
    serviceUrl: 'https://kwp20-gdiper.atlassian.net/jira/software/projects/KAN/list',
    bizAddress: { ...SAMPLE_ADDRESS },
    headOfficeSame: true,
    headOfficeAddress: { ...SAMPLE_ADDRESS },
    raType: '',
    raDate: '',
  },
  contacts: [
    ['계약', '최계약', '010-1111-2222', '1234', 'choi@company.com'],
    ['정산', '김정산', '010-3333-4444', '5678', 'kim@company.com'],
    ['개발', '이개발', '010-5555-6666', '9012', 'lee@company.com'],
    ['상담', '박상담', '010-7777-8888', '3456', 'park@company.com'],
  ].map(([role, name, mobile, extension, email], i) => ({
    key: `c${i}`,
    role: role as string,
    name: name as string,
    mobile: mobile as string,
    extension: extension as string,
    email: email as string,
  })),
  cpid: { id: 'CTS123456', name: 'ABC몰', contract: '계약 · 완료', service: '서비스 · 사용중' },
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** 가맹점 조회 (조회수정) */
export async function fetchMerchant(): Promise<MerchantRecord> {
  await wait(100);
  return structuredClone(SAMPLE);
}

/** 신규 등록 · 저장 */
export async function saveMerchant(record: MerchantRecord) {
  await wait(300);
  return { bizNo: record.basic.bizNo };
}
