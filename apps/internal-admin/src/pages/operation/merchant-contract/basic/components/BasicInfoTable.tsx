import {
  Button,
  Checkbox,
  DateField,
  FormTable,
  Radio,
  RadioGroup,
  SelectBox,
  TextField,
} from '@kiwoompay/design-system';
import type { ReactNode } from 'react';
import type { Address, MerchantBasicInfo } from '@/types/operation/merchantBasic';
import { useCodeOptions } from '@/hooks/useCodeOptions';

interface Props {
  value: MerchantBasicInfo;
  onChange: (patch: Partial<MerchantBasicInfo>) => void;
  /** create: 신규등록 · edit: 조회수정 (사업자번호 [수정] 버튼) */
  mode: 'create' | 'edit';
  onAction: (name: string) => void;
}

const { Row, Label, Cell, InlineLabel } = FormTable;

/** 주소 칸: 국가 · 우편번호 [찾기] · 주소 · 상세 주소 (Figma 사업장 주소) */
function AddressCell({
  value,
  onChange,
  onFind,
  before,
  disabled,
}: {
  value: Address;
  onChange: (next: Address) => void;
  onFind: () => void;
  before?: ReactNode;
  disabled?: boolean;
}) {
  const countries = useCodeOptions('COUNTRY');
  const set = (patch: Partial<Address>) => onChange({ ...value, ...patch });
  return (
    <Cell colSpan={7}>
      {before}
      <InlineLabel>국가</InlineLabel>
      <SelectBox
        aria-label="국가"
        placeholder="선택"
        fullWidth
        style={{ width: 192, flex: 'none' }}
        options={countries}
        value={value.country}
        disabled={disabled}
        onChange={(country) => set({ country })}
      />
      <InlineLabel>우편번호</InlineLabel>
      <span style={{ display: 'flex', gap: 8 }}>
        <TextField
          aria-label="우편번호"
          style={{ width: 200 }}
          value={value.zipCode}
          disabled={disabled}
          onChange={(e) => set({ zipCode: e.target.value })}
        />
        <Button variant="neutral" appearance="line" disabled={disabled} onClick={onFind}>
          찾기
        </Button>
      </span>
      <InlineLabel>주소</InlineLabel>
      <TextField
        aria-label="주소"
        fullWidth
        style={{ flex: '1 1 0' }}
        value={value.address1}
        disabled={disabled}
        onChange={(e) => set({ address1: e.target.value })}
      />
      <TextField
        aria-label="상세 주소"
        fullWidth
        style={{ flex: '1 1 0' }}
        value={value.address2}
        disabled={disabled}
        onChange={(e) => set({ address2: e.target.value })}
      />
    </Cell>
  );
}

/** 기본 정보 표 (Figma KWPC07010101 기본 정보: 4쌍 × 8줄) */
export function BasicInfoTable({ value: v, onChange, mode, onAction }: Props) {
  const bizTypes = useCodeOptions('BIZ_TYPE');
  const merchantStatuses = useCodeOptions('MERCHANT_STATUS');
  const text = (key: keyof MerchantBasicInfo, label: string) => (
    <TextField
      aria-label={label}
      fullWidth
      value={String(v[key] ?? '')}
      onChange={(e) => onChange({ [key]: e.target.value } as Partial<MerchantBasicInfo>)}
    />
  );

  return (
    <FormTable>
      <Row>
        <Label required>사업자번호</Label>
        <Cell>
          {mode === 'edit' ? (
            <>
              {/* 조회수정: 사업자번호는 [수정] 팝업으로만 바꾼다 */}
              <TextField aria-label="사업자번호" fullWidth readOnly value={v.bizNo} />
              <Button
                variant="neutral"
                appearance="line"
                onClick={() => onAction('사업자번호 변경')}
              >
                수정
              </Button>
            </>
          ) : (
            text('bizNo', '사업자번호')
          )}
        </Cell>
        <Label required>사업자구분</Label>
        <Cell>
          <SelectBox
            aria-label="사업자구분"
            fullWidth
            placeholder="선택"
            options={bizTypes}
            value={v.bizType}
            onChange={(bizType) => onChange({ bizType })}
          />
        </Cell>
        <Label>영중소 구분</Label>
        <Cell>{v.smeGrade}</Cell>
        <Label required>신탁 구분</Label>
        <Cell>
          <RadioGroup
            direction="horizontal"
            aria-label="신탁 구분"
            value={v.trust}
            onChange={(trust) => onChange({ trust: trust as MerchantBasicInfo['trust'] })}
          >
            <Radio value="none" label="해당없음" />
            <Radio value="yes" label="해당있음" />
          </RadioGroup>
        </Cell>
      </Row>
      <Row>
        <Label>법인등록번호</Label>
        <Cell>{text('corpRegNo', '법인등록번호')}</Cell>
        <Label required>표준산업 분류코드</Label>
        <Cell style={{ gap: 8 }}>
          {text('industryCode', '표준산업 분류코드')}
          <Button
            variant="neutral"
            appearance="line"
            onClick={() => onAction('표준산업분류코드 조회')}
          >
            찾기
          </Button>
        </Cell>
        <Label required>업체상태</Label>
        <Cell>
          <SelectBox
            aria-label="업체상태"
            fullWidth
            placeholder="선택"
            options={merchantStatuses}
            value={v.status}
            onChange={(status) => onChange({ status })}
          />
        </Cell>
        <Label required>가상자산사업자 여부</Label>
        <Cell>
          <RadioGroup
            direction="horizontal"
            aria-label="가상자산사업자 여부"
            value={v.virtualAsset}
            onChange={(va) => onChange({ virtualAsset: va as MerchantBasicInfo['virtualAsset'] })}
          >
            <Radio value="yes" label="예" />
            <Radio value="no" label="아니오" />
          </RadioGroup>
        </Cell>
      </Row>
      <Row>
        <Label required>업종</Label>
        <Cell colSpan={3}>{text('businessItem', '업종')}</Cell>
        <Label required>업태</Label>
        <Cell colSpan={3}>{text('businessType', '업태')}</Cell>
      </Row>
      <Row>
        <Label required>회사명(국문)</Label>
        <Cell>{text('nameKo', '회사명(국문)')}</Cell>
        <Label required>회사명(영문)</Label>
        <Cell>{text('nameEn', '회사명(영문)')}</Cell>
        <Label required>회사 전화번호</Label>
        <Cell>{text('phone', '회사 전화번호')}</Cell>
        <Label>회사 이메일</Label>
        <Cell>{text('email', '회사 이메일')}</Cell>
      </Row>
      <Row>
        <Label required>설립일자</Label>
        <Cell>
          <DateField
            aria-label="설립일자"
            value={v.foundedAt}
            onChange={(foundedAt) => onChange({ foundedAt })}
          />
        </Cell>
        <Label required>대표자</Label>
        <Cell>{text('ceo', '대표자')}</Cell>
        <Label>서비스 URL</Label>
        <Cell colSpan={3}>{text('serviceUrl', '서비스 URL')}</Cell>
      </Row>
      <Row>
        <Label required>사업장 주소</Label>
        <AddressCell
          value={v.bizAddress}
          onChange={(bizAddress) =>
            onChange(
              v.headOfficeSame
                ? { bizAddress, headOfficeAddress: { ...bizAddress } }
                : { bizAddress },
            )
          }
          onFind={() => onAction('주소 검색')}
        />
      </Row>
      <Row>
        <Label required>사업장 본점 소재지 주소</Label>
        <AddressCell
          value={v.headOfficeAddress}
          onChange={(headOfficeAddress) => onChange({ headOfficeAddress })}
          onFind={() => onAction('주소 검색')}
          before={
            <Checkbox
              label="사업장 주소와 동일"
              checked={v.headOfficeSame}
              onChange={(e) =>
                onChange({
                  headOfficeSame: e.target.checked,
                  ...(e.target.checked ? { headOfficeAddress: { ...v.bizAddress } } : {}),
                })
              }
            />
          }
        />
      </Row>
      <Row>
        <Label>RA 구분</Label>
        <Cell colSpan={3}>{v.raType}</Cell>
        <Label>RA 수행일자</Label>
        <Cell colSpan={3}>{v.raDate}</Cell>
      </Row>
    </FormTable>
  );
}
