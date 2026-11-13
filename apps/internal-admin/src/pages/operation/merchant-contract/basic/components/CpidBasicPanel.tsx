import {
  // 묶음 · 표
  FormGroup,
  FormTable,
  SectionHeading,
  Tab,
  // 입력 컨트롤
  Button,
  Checkbox,
  ControlGroup,
  DateField,
  Radio,
  RadioGroup,
  SelectBox,
  TextButton,
  TextField,
} from '@kiwoompay/design-system';
import { useState, type ReactNode } from 'react';
import { useCodeOptions } from '@/hooks/useCodeOptions';

const { Row, Label, Cell, Head, InlineLabel } = FormTable;

// (임의 작업) 선택지 · 예시 값 — TODO(API) CPID 상세 조회 · 공통코드
const opt = (...labels: string[]) => labels.map((label) => ({ value: label, label }));
const BIZ_CATEGORIES = opt('실물쇼핑', '디지털콘텐츠', '서비스', '기타');
const RISK_GRADES = opt('일반', '관심', '주의', '경고');
const RM_CATEGORIES = opt('온라인 쇼핑', '디지털콘텐츠', '여행 · 숙박', '기타');
const PRODUCT_REGISTER = opt('URL 등록', '파일 등록');
const AGENCIES = opt(
  '주식회사 케이비즈전자결제서비스 전국가맹점영업대행파트너스',
  '주식회사 결제파트너스',
);
const BRANCHES = opt('케이비즈통합전자결제서비스 서울강남서초권역가맹점영업관리통합대리점');
const BANKS = opt('신한은행', 'KB국민은행', '우리은행', '하나은행');
const HOLD_TYPES = opt('채권양도', '압류', '가압류', '기타');
const VAN_TEAMS = opt('VAN 1팀', 'VAN 2팀');

const YES_NO = [
  { value: 'Y', label: '예' },
  { value: 'N', label: '아니오' },
];

/** 예 · 아니오 라디오 (Figma 칸 안 간격 12) */
function YesNo({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <RadioGroup direction="horizontal" aria-label={name} value={value} onChange={onChange}>
      {YES_NO.map((o) => (
        <Radio key={o.value} value={o.value} label={o.label} />
      ))}
    </RadioGroup>
  );
}

/** 오른쪽 묶음: 이력조회(텍스트) + [추가] [삭제] (Figma 담당자 · 공지메일) */
function ListActions({
  onHistory,
  onAdd,
  onRemove,
}: {
  onHistory: () => void;
  onAdd?: () => void;
  onRemove?: () => void;
}) {
  return (
    <>
      <TextButton size="sm" onClick={onHistory}>
        이력조회
      </TextButton>
      {(onAdd || onRemove) && (
        <ControlGroup>
          {onAdd && (
            <Button size="sm" variant="neutral" appearance="line" onClick={onAdd}>
              추가
            </Button>
          )}
          {onRemove && (
            <Button size="sm" variant="neutral" appearance="line" onClick={onRemove}>
              삭제
            </Button>
          )}
        </ControlGroup>
      )}
    </>
  );
}

interface CpidContact {
  key: string;
  role: string;
  name: string;
  mobile: string;
  extension: string;
  email: string;
  payNotice: boolean;
}

interface NoticeReceiver {
  key: string;
  use: string;
  name: string;
  email: string;
  mobile: string;
}

const CONTACTS: CpidContact[] = [
  {
    key: 'c1',
    role: '계약',
    name: '최계약',
    mobile: '010-1111-2222',
    extension: '1234',
    email: 'choi@company.com',
    payNotice: false,
  },
  {
    key: 'c2',
    role: '정산',
    name: '김정산',
    mobile: '010-3333-4444',
    extension: '5678',
    email: 'kim@company.com',
    payNotice: true,
  },
  {
    key: 'c3',
    role: '개발',
    name: '이개발',
    mobile: '010-5555-6666',
    extension: '9012',
    email: 'lee@company.com',
    payNotice: false,
  },
  {
    key: 'c4',
    role: '상담',
    name: '박상담',
    mobile: '010-7777-8888',
    extension: '3456',
    email: 'park@company.com',
    payNotice: false,
  },
];

const RECEIVERS: NoticeReceiver[] = [
  { key: 'n1', use: 'N', name: '홍길동', email: 'hong@company.com', mobile: '010-1111-2222' },
  { key: 'n2', use: 'Y', name: '김영희', email: 'kim@company.com', mobile: '010-3333-4444' },
];

// 담당자 · 공지메일 표: 체크 36 + 항목 (Figma 머리 36 "항목")
const LIST_COLUMNS = '36px minmax(0, 1fr)';
/** 한 칸에 여러 입력이 이어지는 줄 (담당자 · 공지메일): 줄바꿈 없이 입력 칸이 나눠 줄어든다 */
const LINE_CELL = { flexWrap: 'nowrap' } as const;
const SHRINK = { flex: '1 1 0', minWidth: 0 } as const;

// 지급보류: 구분 Select 246 + 칸 여백 16 (Figma)
const HOLD_COLUMNS = '138px 262px 138px minmax(0, 1fr)';

/** 선택 체크 열 머리 · 칸 */
function SelectAll<T extends { key: string }>({
  rows,
  selected,
  onChange,
}: {
  rows: T[];
  selected: string[];
  onChange: (keys: string[]) => void;
}) {
  const all = rows.length > 0 && rows.every((r) => selected.includes(r.key));
  return (
    <Checkbox
      aria-label="전체 선택"
      checked={all}
      indeterminate={!all && selected.length > 0}
      onChange={() => onChange(all ? [] : rows.map((r) => r.key))}
    />
  );
}

function toggle(list: string[], key: string) {
  return list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
}

/** CPID 기본 정보 탭의 섹션 (오른쪽 탭 = 섹션 바로가기) */
export const CPID_SECTIONS = [
  'CPID 기본 정보',
  'RM 관리',
  '영업 정보',
  '정산계좌 정보',
  '담당자 정보',
  '공지메일 발송정보',
  '지급보류',
  '공동 영업 수익 배분',
] as const;

/** 바로가기 대상 id */
export const cpidSectionId = (name: string) => `cpid-section-${CPID_SECTIONS_ALL.indexOf(name)}`;
/** 결제수단별 설정까지 포함한 바로가기 순서 */
export const CPID_SECTIONS_ALL: string[] = [...CPID_SECTIONS, '결제수단별 설정'];

/** 바로가기로 이동했을 때 섹션 위 여백 */
const ANCHOR = { scrollMarginTop: 16 } as const;
const anchor = (name: string) => ({ id: cpidSectionId(name), style: ANCHOR });

interface CpidBasicPanelProps {
  /** 아직 연결 안 된 버튼 (찾기 · 등록 · 이력조회 등) */
  onAction: (name: string) => void;
}

/**
 * KWPC07010101 조회수정 — 선택 CPID · CPID 기본 정보 탭 (Figma 28387:38523).
 * 묶음 = SectionHeading(18 Bold + 설명) + FormTable, 묶음 사이 16 (FormSection 규칙)
 */
export function CpidBasicPanel({ onAction }: CpidBasicPanelProps) {
  const bizTypes = useCodeOptions('BIZ_TYPE');
  const [v, setV] = useState({
    bizType: bizTypes[0]?.value ?? '',
    openMarketMaster: 'N',
    payAgent: 'N',
    savingsEndDate: '2008-01-01',
    sellerApp: 'N',
    serviceName: 'ABC몰',
    bizCategory: '실물쇼핑',
    subMallCheck: 'N',
    monthlyLimitUse: 'N',
    monthlyLimit: '0',
    smsNotice: 'N',
    serviceUrl: 'https://www.example.com/shop',
    productRegister: '',
    productUrl: 'https://www.example.com/products',
    riskGrade: '',
    rmCategory: '',
    maxAmount: '',
    salesManager: '홍길동',
    agency: AGENCIES[0]!.value,
    branch: BRANCHES[0]!.value,
    bank: '신한은행',
    accountNo: '123456-78-901234',
    holder: '(주)ABC커머스',
    holdType: '채권양도',
    holdReason: '',
    revenueShare: 'N',
    vanTeam: '',
  });
  const set = (patch: Partial<typeof v>) => setV((prev) => ({ ...prev, ...patch }));
  const [accountTab, setAccountTab] = useState('register');
  const [contacts, setContacts] = useState(CONTACTS);
  const [contactSel, setContactSel] = useState<string[]>(['c4']);
  const [receivers, setReceivers] = useState(RECEIVERS);
  const [receiverSel, setReceiverSel] = useState<string[]>([]);

  const setContact = (key: string, patch: Partial<CpidContact>) =>
    setContacts((rows) => rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const setReceiver = (key: string, patch: Partial<NoticeReceiver>) =>
    setReceivers((rows) => rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  const text = (
    key: keyof typeof v,
    label: string,
    extra?: { placeholder?: string },
  ): ReactNode => (
    <TextField
      aria-label={label}
      fullWidth
      placeholder={extra?.placeholder}
      value={v[key]}
      onChange={(e) => set({ [key]: e.target.value })}
    />
  );
  const select = (
    key: keyof typeof v,
    label: string,
    options: { value: string; label: string }[],
    width?: number,
  ): ReactNode => (
    <SelectBox
      aria-label={label}
      fullWidth
      placeholder="선택"
      style={width ? { width, flex: 'none' } : undefined}
      options={options}
      value={v[key]}
      onChange={(value) => set({ [key]: value })}
    />
  );
  const yesNo = (key: keyof typeof v, label: string) => (
    <YesNo name={label} value={v[key]} onChange={(value) => set({ [key]: value })} />
  );

  return (
    <>
      {/* CPID 기본 정보 */}
      <FormGroup {...anchor('CPID 기본 정보')}>
        <SectionHeading
          title="CPID 기본 정보"
          description="CPID 기준 기본 식별정보 및 서비스 운영 정보"
        />
        <FormTable>
          <Row>
            <Label>CPID</Label>
            <Cell>CTS123456</Cell>
            <Label>사업자구분</Label>
            <Cell>{select('bizType', '사업자구분', bizTypes)}</Cell>
            <Label>오픈마켓 마스터 여부</Label>
            <Cell>{yesNo('openMarketMaster', '오픈마켓 마스터 여부')}</Cell>
            <Label>지급대행 여부</Label>
            <Cell>{yesNo('payAgent', '지급대행 여부')}</Cell>
          </Row>
          <Row>
            <Label>키움저축파일 전송종료일</Label>
            <Cell>
              <DateField
                aria-label="키움저축파일 전송종료일"
                fullWidth
                value={v.savingsEndDate}
                onChange={(savingsEndDate) => set({ savingsEndDate })}
              />
            </Cell>
            <Label>판매자APP전용 CPID</Label>
            <Cell>{yesNo('sellerApp', '판매자APP전용 CPID')}</Cell>
            <Label>서비스명</Label>
            <Cell>{text('serviceName', '서비스명')}</Cell>
            <Label>업체분류</Label>
            <Cell>{select('bizCategory', '업체분류', BIZ_CATEGORIES)}</Cell>
          </Row>
          <Row>
            <Label>2차PG 하위몰 정보 체크</Label>
            <Cell>{yesNo('subMallCheck', '2차PG 하위몰 정보 체크')}</Cell>
            <Label>월 승인한도 제한여부</Label>
            <Cell>{yesNo('monthlyLimitUse', '월 승인한도 제한여부')}</Cell>
            <Label>월 승인한도 금액</Label>
            <Cell>
              {text('monthlyLimit', '월 승인한도 금액')}
              <span>원</span>
            </Cell>
            <Label>가맹점 SMS 발송여부</Label>
            <Cell>{yesNo('smsNotice', '가맹점 SMS 발송여부')}</Cell>
          </Row>
          <Row>
            <Label>서비스 URL</Label>
            <Cell colSpan={3}>{text('serviceUrl', '서비스 URL')}</Cell>
            <Label>상품등록</Label>
            <Cell colSpan={3}>
              {select('productRegister', '상품등록', PRODUCT_REGISTER, 200)}
              <ControlGroup grow>
                {text('productUrl', '상품 URL')}
                <Button
                  size="sm"
                  variant="neutral"
                  appearance="line"
                  onClick={() => onAction('상품 등록/수정')}
                >
                  등록/수정
                </Button>
                <Button
                  size="sm"
                  variant="dark"
                  appearance="line"
                  onClick={() => onAction('상품 삭제')}
                >
                  삭제
                </Button>
              </ControlGroup>
            </Cell>
          </Row>
        </FormTable>
      </FormGroup>

      {/* RM 관리 */}
      <FormGroup {...anchor('RM 관리')}>
        <SectionHeading
          title="RM 관리"
          description="CPID 거래 모니터링 및 알림 기준 정보"
          actions={
            <Button
              size="sm"
              variant="neutral"
              appearance="line"
              onClick={() => onAction('알림 설정')}
            >
              알림 설정
            </Button>
          }
        />
        <FormTable pairs={3}>
          <Row>
            <Label>유의등급</Label>
            <Cell>{select('riskGrade', '유의등급', RISK_GRADES)}</Cell>
            <Label>업종분류</Label>
            <Cell>{select('rmCategory', '업종분류', RM_CATEGORIES)}</Cell>
            <Label>최대거래금액(알림)</Label>
            <Cell>{text('maxAmount', '최대거래금액(알림)', { placeholder: '입력해주세요' })}</Cell>
          </Row>
        </FormTable>
      </FormGroup>

      {/* 영업 정보 */}
      <FormGroup {...anchor('영업 정보')}>
        <SectionHeading title="영업 정보" description="다우데이타 영업담당자 및 영업대행사 정보" />
        <FormTable template="138px 220px 138px minmax(0, 1fr) 138px minmax(0, 1fr)">
          <Row>
            <Label>영업 담당자</Label>
            <Cell>
              <ControlGroup>
                <TextField
                  aria-label="영업 담당자"
                  readOnly
                  style={{ width: 100 }}
                  value={v.salesManager}
                />
                <Button
                  variant="neutral"
                  appearance="line"
                  onClick={() => onAction('영업 담당자 찾기')}
                >
                  찾기
                </Button>
              </ControlGroup>
            </Cell>
            <Label>영업 대행사</Label>
            <Cell>
              <ControlGroup grow>
                {select('agency', '영업 대행사', AGENCIES)}
                <Button
                  variant="neutral"
                  appearance="line"
                  onClick={() => onAction('영업 대행사 등록')}
                >
                  등록
                </Button>
              </ControlGroup>
            </Cell>
            <Label>대리점</Label>
            <Cell>{select('branch', '대리점', BRANCHES)}</Cell>
          </Row>
        </FormTable>
      </FormGroup>

      {/* 정산계좌 정보 */}
      <FormGroup {...anchor('정산계좌 정보')}>
        <SectionHeading
          title="정산계좌 정보"
          description="정산 업무에서 사용하는 기준 정보"
          actions={
            <Tab size="sm" value={accountTab} onChange={setAccountTab} aria-label="정산계좌">
              <Tab.Item value="register">계좌등록</Tab.Item>
              <Tab.Item value="history">계좌이력</Tab.Item>
            </Tab>
          }
        />
        <FormTable pairs={3}>
          <Row>
            <Label>거래은행</Label>
            <Cell>{select('bank', '거래은행', BANKS)}</Cell>
            <Label>계좌번호</Label>
            <Cell>{text('accountNo', '계좌번호')}</Cell>
            <Label>예금주</Label>
            <Cell>
              <ControlGroup grow>
                {text('holder', '예금주')}
                <Button variant="neutral" appearance="line" onClick={() => onAction('예금주 조회')}>
                  예금주 조회
                </Button>
              </ControlGroup>
            </Cell>
          </Row>
        </FormTable>
      </FormGroup>

      {/* 담당자 정보 */}
      <FormGroup {...anchor('담당자 정보')}>
        <SectionHeading
          title="담당자 정보"
          description="계약 · 정산 · 개발 · 상담 담당자 정보"
          actions={
            <ListActions
              onHistory={() => onAction('담당자 이력조회')}
              onAdd={() =>
                setContacts((rows) => [
                  ...rows,
                  {
                    key: `c${Date.now()}`,
                    role: '',
                    name: '',
                    mobile: '',
                    extension: '',
                    email: '',
                    payNotice: false,
                  },
                ])
              }
              onRemove={() => {
                setContacts((rows) => rows.filter((r) => !contactSel.includes(r.key)));
                setContactSel([]);
              }}
            />
          }
        />
        <FormTable template={LIST_COLUMNS} aria-label="CPID 담당자 정보">
          <Row>
            <Head size="sm">
              <SelectAll rows={contacts} selected={contactSel} onChange={setContactSel} />
            </Head>
            <Head size="sm">항목</Head>
          </Row>
          {contacts.map((row) => (
            <Row key={row.key}>
              <Cell center>
                <Checkbox
                  aria-label="선택"
                  checked={contactSel.includes(row.key)}
                  onChange={() => setContactSel((s) => toggle(s, row.key))}
                />
              </Cell>
              <Cell style={LINE_CELL}>
                <InlineLabel>구분</InlineLabel>
                <SelectBox
                  aria-label="구분"
                  placeholder="선택"
                  style={{ width: 200, flex: 'none' }}
                  fullWidth
                  options={opt('계약', '정산', '개발', '상담')}
                  value={row.role}
                  onChange={(role) => setContact(row.key, { role })}
                />
                <TextField
                  aria-label="이름"
                  style={{ width: 84, flex: 'none' }}
                  value={row.name}
                  onChange={(e) => setContact(row.key, { name: e.target.value })}
                />
                <InlineLabel>휴대폰번호</InlineLabel>
                <TextField
                  aria-label="휴대폰번호"
                  fullWidth
                  style={SHRINK}
                  value={row.mobile}
                  onChange={(e) => setContact(row.key, { mobile: e.target.value })}
                />
                <InlineLabel>내선번호</InlineLabel>
                <TextField
                  aria-label="내선번호"
                  fullWidth
                  style={SHRINK}
                  value={row.extension}
                  onChange={(e) => setContact(row.key, { extension: e.target.value })}
                />
                <InlineLabel>이메일</InlineLabel>
                <ControlGroup grow>
                  <TextField
                    aria-label="이메일"
                    fullWidth
                    style={SHRINK}
                    value={row.email}
                    onChange={(e) => setContact(row.key, { email: e.target.value })}
                  />
                  <Button
                    variant="neutral"
                    appearance="line"
                    style={{ flex: 'none' }}
                    onClick={() => onAction('공지대상 등록')}
                  >
                    공지대상 등록
                  </Button>
                </ControlGroup>
                <Checkbox
                  label="결제내역통보"
                  checked={row.payNotice}
                  onChange={(e) => setContact(row.key, { payNotice: e.target.checked })}
                />
              </Cell>
            </Row>
          ))}
        </FormTable>
      </FormGroup>

      {/* 공지메일 발송정보 */}
      <FormGroup {...anchor('공지메일 발송정보')}>
        <SectionHeading
          title="공지메일 발송정보"
          description="CPID 공지메일 수신 담당자 정보"
          actions={
            <ListActions
              onHistory={() => onAction('공지메일 이력조회')}
              onAdd={() =>
                setReceivers((rows) => [
                  ...rows,
                  { key: `n${Date.now()}`, use: 'Y', name: '', email: '', mobile: '' },
                ])
              }
              onRemove={() => {
                setReceivers((rows) => rows.filter((r) => !receiverSel.includes(r.key)));
                setReceiverSel([]);
              }}
            />
          }
        />
        <FormTable template={LIST_COLUMNS} aria-label="공지메일 발송정보">
          <Row>
            <Head size="sm">
              <SelectAll rows={receivers} selected={receiverSel} onChange={setReceiverSel} />
            </Head>
            <Head size="sm">항목</Head>
          </Row>
          {receivers.map((row) => (
            <Row key={row.key}>
              <Cell center>
                <Checkbox
                  aria-label="선택"
                  checked={receiverSel.includes(row.key)}
                  onChange={() => setReceiverSel((s) => toggle(s, row.key))}
                />
              </Cell>
              <Cell style={LINE_CELL}>
                <InlineLabel>공지메일 사용 여부</InlineLabel>
                <RadioGroup
                  direction="horizontal"
                  aria-label="공지메일 사용 여부"
                  value={row.use}
                  onChange={(use) => setReceiver(row.key, { use })}
                >
                  <Radio value="Y" label="사용" />
                  <Radio value="N" label="미사용" />
                </RadioGroup>
                <InlineLabel>이름</InlineLabel>
                <TextField
                  aria-label="이름"
                  fullWidth
                  style={SHRINK}
                  value={row.name}
                  onChange={(e) => setReceiver(row.key, { name: e.target.value })}
                />
                <InlineLabel>이메일</InlineLabel>
                <TextField
                  aria-label="이메일"
                  fullWidth
                  style={SHRINK}
                  value={row.email}
                  onChange={(e) => setReceiver(row.key, { email: e.target.value })}
                />
                <InlineLabel>휴대폰번호</InlineLabel>
                <TextField
                  aria-label="휴대폰번호"
                  fullWidth
                  style={SHRINK}
                  value={row.mobile}
                  onChange={(e) => setReceiver(row.key, { mobile: e.target.value })}
                />
              </Cell>
            </Row>
          ))}
        </FormTable>
      </FormGroup>

      {/* 지급보류 */}
      <FormGroup {...anchor('지급보류')}>
        <SectionHeading
          title="지급보류"
          description="CPID 지급보류 정보 등록 및 관리"
          actions={<ListActions onHistory={() => onAction('지급보류 이력조회')} />}
        />
        <FormTable template={HOLD_COLUMNS}>
          <Row>
            <Label>구분</Label>
            <Cell>{select('holdType', '구분', HOLD_TYPES)}</Cell>
            <Label>사유</Label>
            <Cell>
              <ControlGroup grow>
                {text('holdReason', '사유', { placeholder: '지급보류 사유 입력' })}
                <Button
                  variant="neutral"
                  appearance="line"
                  onClick={() => onAction('지급보류 등록')}
                >
                  등록
                </Button>
              </ControlGroup>
            </Cell>
          </Row>
        </FormTable>
      </FormGroup>

      {/* 공동 영업 수익 배분 */}
      <FormGroup {...anchor('공동 영업 수익 배분')}>
        <SectionHeading title="공동 영업 수익 배분" description="공동 영업 수익 배분 적용 정보" />
        <FormTable pairs={2}>
          <Row>
            <Label>수익 분배 여부</Label>
            <Cell>{yesNo('revenueShare', '수익 분배 여부')}</Cell>
            <Label>공동 영업 VAN 사업팀</Label>
            <Cell>{select('vanTeam', '공동 영업 VAN 사업팀', VAN_TEAMS)}</Cell>
          </Row>
        </FormTable>
      </FormGroup>
    </>
  );
}
