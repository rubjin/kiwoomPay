import {
  // 화면 틀 · 호출 화면
  PageLayout,
  FormSection,
  FormGroup,
  SectionHeading,
  FormTable,
  // 호출 필드 · 흐름 훅
  LookupField,
  useLookup,
  // Lookup Modal 본문
  Modal,
  Tab,
  LookupSearch,
  LookupSearchEmpty,
  AddressSearch,
  type AddressItem,
  Field,
  SelectBox,
  TextField,
  Button,
  GridPlaceholder,
  type GridPlaceholderColumn,
} from '@kiwoompay/design-system';
import { useState } from 'react';

/**
 * 레이아웃 패턴 P03 Lookup → Apply 템플릿 (화면 확인용, 임의 작업).
 * 호출 필드 [찾기] → Lookup Modal(분류로 찾기 · 키워드로 찾기) → 행 [선택] → 값 반영, 닫으면 원래 값 유지.
 * 가이드: Storybook Patterns/P03 Lookup Apply
 */

// ── 예시 데이터 (Figma KWPC07010101 팝업 표준산업분류코드조회) ──────
interface Industry {
  code: string;
  large: string;
  mid: string;
  small: string;
  detail: string;
}

const CAR_PARTS = '자동차 신품 부품 및 내장품 판매업';
const INDUSTRIES: Industry[] = (
  [
    [
      '42500',
      '건설업(41~42)',
      '전문직별 공사업',
      '시설물 유지관리 공사업',
      '시설물 유지관리 공사업',
    ],
    ['42600', '건설업(41~42)', '전문직별 공사업', '건설장비 운영업', '건설장비 운영업'],
    [
      '45110',
      '도매 및 소매업(45~47)',
      '자동차 및 부품 판매업',
      '자동차 신품 판매업',
      '자동차 신품 판매업',
    ],
    [
      '45120',
      '도매 및 소매업(45~47)',
      '자동차 및 부품 판매업',
      '중고 자동차 판매업',
      '중고 자동차 판매업',
    ],
    [
      '45211',
      '도매 및 소매업(45~47)',
      '자동차 및 부품 판매업',
      CAR_PARTS,
      '자동차 신품 타이어 및 튜브 판매업',
    ],
    [
      '45212',
      '도매 및 소매업(45~47)',
      '자동차 및 부품 판매업',
      CAR_PARTS,
      '자동차용 전용 신품 부품 판매업',
    ],
    [
      '45213',
      '도매 및 소매업(45~47)',
      '자동차 및 부품 판매업',
      CAR_PARTS,
      '자동차 내장용 신품 전기·전자·정밀 기기 판매업',
    ],
    [
      '45219',
      '도매 및 소매업(45~47)',
      '자동차 및 부품 판매업',
      CAR_PARTS,
      '기타 자동차 신품 부품 및 내장품 판매업',
    ],
    [
      '45220',
      '도매 및 소매업(45~47)',
      '자동차 및 부품 판매업',
      CAR_PARTS,
      '자동차 중고 부품 및 내장품 판매업',
    ],
    [
      '45301',
      '도매 및 소매업(45~47)',
      '자동차 및 부품 판매업',
      '모터사이클 및 부품 판매업',
      '모터사이클 및 부품 도매업',
    ],
  ] as const
).map(([code, large, mid, small, detail]) => ({ code, large, mid, small, detail }));

const unique = (values: string[]) => [...new Set(values)].map((v) => ({ value: v, label: v }));

type Mode = 'category' | 'keyword';
interface Criteria {
  large: string;
  mid: string;
  small: string;
  code: string;
  name: string;
}
const EMPTY: Criteria = { large: '', mid: '', small: '', code: '', name: '' };

const search = (mode: Mode, c: Criteria) =>
  INDUSTRIES.filter((r) =>
    mode === 'category'
      ? (!c.large || r.large === c.large) &&
        (!c.mid || r.mid === c.mid) &&
        (!c.small || r.small === c.small)
      : (!c.code || r.code.startsWith(c.code)) &&
        (!c.name || [r.small, r.detail].some((v) => v.includes(c.name))),
  );

// Figma 결과 그리드 높이 (머리 + 10행). 조회 전에도 Modal 높이가 바뀌지 않도록 자리를 잡는다 — IBSheet 연결 후 그리드 높이로
const RESULT_HEIGHT = 517;
// 결과 없음 안내는 그리드 머리(40 + 위 선 1) 아래 남은 높이
const EMPTY_HEIGHT = RESULT_HEIGHT - 41;

/** 표준산업 분류코드 조회 Lookup Modal (P03). 결과 행 [선택] → onSelect, Footer 없음 */
function IndustryLookupModal({
  open,
  onSelect,
  onClose,
}: {
  open: boolean;
  onSelect: (row: Industry) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<Mode>('category');
  const [criteria, setCriteria] = useState<Criteria>(EMPTY);
  const [results, setResults] = useState<Industry[] | null>(null);
  const set = (patch: Partial<Criteria>) => setCriteria((c) => ({ ...c, ...patch }));

  const columns: GridPlaceholderColumn<Industry>[] = [
    { key: 'code', header: '표준산업분류코드', width: 113 },
    { key: 'large', header: '대분류' },
    { key: 'small', header: '세분류', width: 203 },
    { key: 'detail', header: '세세분류', width: 271 },
    {
      key: 'select',
      header: '선택',
      width: 61,
      render: (row) => (
        <Button size="sm" variant="neutral" appearance="line" onClick={() => onSelect(row)}>
          선택
        </Button>
      ),
    },
  ];

  const byLarge = INDUSTRIES.filter((r) => !criteria.large || r.large === criteria.large);
  const byMid = byLarge.filter((r) => !criteria.mid || r.mid === criteria.mid);

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <Modal.Header title="표준산업 분류코드 조회" closeButton />
      <Modal.Body>
        <LookupSearch
          header={
            <Tab
              variant="button"
              fullWidth
              value={mode}
              onChange={(v) => {
                setMode(v as Mode);
                setResults(null);
              }}
            >
              <Tab.Item value="category">분류로 찾기</Tab.Item>
              <Tab.Item value="keyword">키워드로 찾기</Tab.Item>
            </Tab>
          }
          keyword={mode === 'keyword'}
          label="분류명"
          placeholder="분류명을 입력해주세요"
          query={criteria.name}
          onQueryChange={(name) => set({ name })}
          searchLabel={mode === 'category' ? '전체조회' : '조회'}
          onReset={mode === 'category' ? () => set({ large: '', mid: '', small: '' }) : undefined}
          onSearch={() => setResults(search(mode, criteria))}
          extraFields={
            mode === 'category' ? (
              <>
                {(
                  [
                    ['large', '대분류', unique(INDUSTRIES.map((r) => r.large))],
                    ['mid', '중분류', unique(byLarge.map((r) => r.mid))],
                    ['small', '소분류', unique(byMid.map((r) => r.small))],
                  ] as const
                ).map(([key, placeholder, options]) => (
                  <SelectBox
                    key={key}
                    style={{ flex: 1, minWidth: 0 }}
                    fullWidth
                    aria-label={placeholder}
                    placeholder={placeholder}
                    options={options}
                    value={criteria[key] || undefined}
                    onChange={(value) =>
                      // 상위 분류가 바뀌면 하위 분류는 비운다
                      set(
                        key === 'large'
                          ? { large: value, mid: '', small: '' }
                          : key === 'mid'
                            ? { mid: value, small: '' }
                            : { small: value },
                      )
                    }
                  />
                ))}
              </>
            ) : (
              <Field label="표준산업분류코드" style={{ flex: 1 }}>
                <TextField
                  fullWidth
                  placeholder="입력해주세요"
                  value={criteria.code}
                  onChange={(e) => set({ code: e.target.value })}
                />
              </Field>
            )
          }
        >
          <div style={{ minHeight: RESULT_HEIGHT }}>
            {results && (
              <GridPlaceholder
                columns={columns}
                rows={results}
                rowKey={(r) => r.code}
                empty={<LookupSearchEmpty style={{ height: EMPTY_HEIGHT }} />}
              />
            )}
          </div>
        </LookupSearch>
      </Modal.Body>
    </Modal>
  );
}

// ── 탭 없는 Lookup: 찾기 방식이 하나 (Figma Modal/Lookup 사업자번호 검색) ──────
interface Business {
  bizNo: string;
  name: string;
  ceo: string;
}

const BUSINESSES: Business[] = (
  [
    ['123-45-67890', '(주)ABC커머스', '홍길동'],
    ['123-45-67891', '(주)ABC네트웍스', '김철수'],
    ['220-81-01733', '키움유통', '이영희'],
    ['000-00-00004', '새봄리테일', '박민수'],
    ['000-00-00005', '온누리마켓', '최지은'],
  ] as const
).map(([bizNo, name, ceo]) => ({ bizNo, name, ceo }));

/** 사업자번호 검색 Lookup Modal (P03, 탭 없음). 검색어 하나 + 결과 행 [선택] */
function BizLookupModal({
  open,
  onSelect,
  onClose,
}: {
  open: boolean;
  onSelect: (row: Business) => void;
  onClose: () => void;
}) {
  const find = (q: string) =>
    BUSINESSES.filter((b) => !q || b.name.includes(q) || b.bizNo.includes(q));
  const [results, setResults] = useState<Business[] | null>(null);

  const columns: GridPlaceholderColumn<Business>[] = [
    { key: 'bizNo', header: '사업자번호', width: 160 },
    { key: 'name', header: '업체명' },
    { key: 'ceo', header: '대표자명', width: 160 },
    {
      key: 'select',
      header: '선택',
      width: 61,
      render: (row) => (
        <Button size="sm" variant="neutral" appearance="line" onClick={() => onSelect(row)}>
          선택
        </Button>
      ),
    },
  ];

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <Modal.Header title="사업자번호 검색" closeButton />
      <Modal.Body>
        <LookupSearch
          label="업체명"
          placeholder="업체명 또는 사업자번호를 입력해주세요"
          onSearch={(q) => setResults(find(q))}
        >
          <div style={{ minHeight: RESULT_HEIGHT }}>
            {results && (
              <GridPlaceholder
                columns={columns}
                rows={results}
                rowKey={(r) => r.bizNo}
                empty={<LookupSearchEmpty style={{ height: EMPTY_HEIGHT }} />}
              />
            )}
          </div>
        </LookupSearch>
      </Modal.Body>
    </Modal>
  );
}

// ── 주소 검색 Lookup: 기존 AddressSearch 본문 + Modal lg 880 ──────
const ADDRESSES: AddressItem[] = [
  {
    zipCode: '04155',
    roadAddress: '서울특별시 마포구 독막로 314 (염리동)',
    jibunAddress: '서울특별시 마포구 염리동 172-10',
  },
  {
    zipCode: '04153',
    roadAddress: '서울특별시 마포구 독막로 268 (대흥동)',
    jibunAddress: '서울특별시 마포구 대흥동 660',
  },
  {
    zipCode: '04096',
    roadAddress: '서울특별시 마포구 독막로 47 (합정동)',
    jibunAddress: '서울특별시 마포구 합정동 366-9',
  },
  {
    zipCode: '46757',
    roadAddress: '부산광역시 강서구 녹산산업중로 333',
    jibunAddress: '부산광역시 강서구 송정동 1612',
  },
];

/** 주소 검색 Lookup Modal (P03). 결과 줄 [선택] → onSelect */
function AddressLookupModal({
  open,
  onSelect,
  onClose,
}: {
  open: boolean;
  onSelect: (item: AddressItem) => void;
  onClose: () => void;
}) {
  const find = (q: string) => ADDRESSES.filter((a) => q && a.roadAddress.includes(q));
  const [results, setResults] = useState<AddressItem[] | undefined>();
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <Modal.Header title="주소 검색" closeButton />
      <Modal.Body>
        <AddressSearch
          results={results}
          onSearch={(q) => setResults(find(q))}
          onSelect={onSelect}
        />
      </Modal.Body>
    </Modal>
  );
}

export function P03LookupApplyPage() {
  const lookup = useLookup<Industry>();
  const [industry, setIndustry] = useState<Industry | null>(INDUSTRIES[2]!);
  // 탭 없는 Lookup (사업자번호)
  const bizLookup = useLookup<Business>();
  const [biz, setBiz] = useState<Business | null>(null);
  const findBiz = async () => {
    const picked = await bizLookup.open();
    if (picked) setBiz(picked);
  };
  // 주소 검색 Lookup: 우편번호 · 도로명은 선택값, 상세주소는 직접 입력
  const addressLookup = useLookup<AddressItem>();
  const [address, setAddress] = useState<AddressItem | null>(null);
  const [detail, setDetail] = useState('');
  const findAddress = async () => {
    const picked = await addressLookup.open();
    if (picked) setAddress(picked);
  };

  const find = async () => {
    const picked = await lookup.open();
    if (picked) setIndustry(picked); // 취소(null)면 원래 값 유지
  };

  return (
    <>
      <PageLayout.Title title="P03 Lookup → Apply (레이아웃 패턴)" />
      <FormSection>
        <FormGroup>
          <SectionHeading title="기본 정보" />
          <FormTable>
            <FormTable.Row>
              <FormTable.Label required>업종</FormTable.Label>
              <FormTable.Cell colSpan={3}>
                <LookupField
                  fullWidth
                  style={{ flex: 1 }}
                  readOnly
                  placeholder="표준산업분류를 찾아주세요"
                  value={industry ? `${industry.code} ${industry.detail}` : ''}
                  onFind={find}
                />
              </FormTable.Cell>
              <FormTable.Label>대분류</FormTable.Label>
              <FormTable.Cell colSpan={3}>{industry?.large ?? '-'}</FormTable.Cell>
            </FormTable.Row>
            <FormTable.Row>
              <FormTable.Label required>사업자번호</FormTable.Label>
              <FormTable.Cell colSpan={3}>
                <LookupField
                  fullWidth
                  style={{ flex: 1 }}
                  readOnly
                  placeholder="사업자번호를 찾아주세요"
                  value={biz?.bizNo ?? ''}
                  onFind={findBiz}
                />
              </FormTable.Cell>
              <FormTable.Label>업체명</FormTable.Label>
              <FormTable.Cell colSpan={3}>{biz?.name ?? '-'}</FormTable.Cell>
            </FormTable.Row>
            <FormTable.Row>
              <FormTable.Label required>사업장 주소</FormTable.Label>
              <FormTable.Cell colSpan={7}>
                <LookupField
                  readOnly
                  findLabel="주소 검색"
                  inputWidth={200}
                  placeholder="우편번호"
                  value={address?.zipCode ?? ''}
                  onFind={findAddress}
                />
                <TextField
                  readOnly
                  style={{ flex: '1 1 0' }}
                  fullWidth
                  placeholder="주소 검색으로 입력해주세요"
                  value={address?.roadAddress ?? ''}
                />
                <TextField
                  style={{ flex: '1 1 0' }}
                  fullWidth
                  placeholder="상세주소를 입력해주세요"
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                />
              </FormTable.Cell>
            </FormTable.Row>
          </FormTable>
        </FormGroup>
      </FormSection>
      <IndustryLookupModal open={lookup.isOpen} onSelect={lookup.select} onClose={lookup.cancel} />
      <BizLookupModal
        open={bizLookup.isOpen}
        onSelect={bizLookup.select}
        onClose={bizLookup.cancel}
      />
      <AddressLookupModal
        open={addressLookup.isOpen}
        onSelect={addressLookup.select}
        onClose={addressLookup.cancel}
      />
    </>
  );
}
