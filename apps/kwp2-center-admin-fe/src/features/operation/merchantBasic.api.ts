import type {
  Address,
  MerchantBasicInfo,
  MerchantContact,
  MerchantRecord,
} from '@/features/operation/merchantBasic.types';
import { wait } from '@/mocks/utils';
import { MERCHANT_RECORD } from '@/mocks/operation/merchantBasic.mock';

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

/** 가맹점 조회 (조회수정) */
export async function fetchMerchant(): Promise<MerchantRecord> {
  await wait(100);
  return structuredClone(MERCHANT_RECORD);
}

/** 신규 등록 · 저장 */
export async function saveMerchant(record: MerchantRecord) {
  await wait(300);
  return { bizNo: record.basic.bizNo };
}
