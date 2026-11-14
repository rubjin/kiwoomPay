/** KWPC07010101 가맹점 기본/계약 정보 관리 — 주소 */
export interface Address {
  country: string;
  zipCode: string;
  address1: string;
  address2: string;
}

/** 기본 정보 */
export interface MerchantBasicInfo {
  bizNo: string;
  bizType: string;
  /** 영중소 구분 (조회 값, 입력 없음) */
  smeGrade: string;
  trust: 'none' | 'yes';
  corpRegNo: string;
  industryCode: string;
  status: string;
  virtualAsset: 'yes' | 'no';
  businessItem: string;
  businessType: string;
  nameKo: string;
  nameEn: string;
  phone: string;
  email: string;
  foundedAt: string;
  ceo: string;
  serviceUrl: string;
  bizAddress: Address;
  headOfficeSame: boolean;
  headOfficeAddress: Address;
  raType: string;
  raDate: string;
}

/** 담당자 1행 */
export interface MerchantContact {
  key: string;
  role: string;
  name: string;
  mobile: string;
  extension: string;
  email: string;
}

export interface MerchantRecord {
  basic: MerchantBasicInfo;
  contacts: MerchantContact[];
  /** 선택 CPID (없으면 신규) */
  cpid?: { id: string; name: string; contract: string; service: string };
}
