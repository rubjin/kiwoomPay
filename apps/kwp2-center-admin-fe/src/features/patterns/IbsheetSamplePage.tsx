import {
  Button,
  ControlGroup,
  PageLayout,
  Pagination,
  ResultFooter,
  Text,
} from '@kiwoompay/design-system';
import { useEffect, useRef, useState } from 'react';
import {
  IB_CELL,
  IB_DATE_BUTTON_WIDTH,
  checkedRowClass,
  headerCheckEvents,
  ibBadge,
  ibButton,
  ibsheetOptions,
  type IbBadgeTone,
} from '@kiwoompay/design-system/ibsheet';

/**
 * IBSheet8 모양 확인 (개발 서버 전용, 임의 작업) — KWP 테마(기본 테마 + 디자인 시스템 토큰)의 그리드 · 달력.
 * 테마: packages/design-system/src/styles/ibsheet/ibsheet-theme.scss, 공통 옵션 · 셀 도우미: @kiwoompay/design-system/ibsheet.
 * vendor/ibsheet가 있어야 한다
 */

interface SheetLike {
  dispose: () => void;
  /** 데이터 바꿔 넣기 (기존 데이터 제거 후 로드 — 매뉴얼 funcs/core/load-search-data) */
  loadSearchData: (data: object[]) => void;
}

interface IbsheetLike {
  create: (args: { id: string; el: HTMLElement; options: object; data?: object[] }) => SheetLike;
  showCalendar: (
    option: object,
    position: { X: number; Y: number },
    callback: (value: string | number) => void,
  ) => unknown;
  dateToString: (ms: number, format: string) => string;
}

const getIBSheet = () => (window as unknown as { IBSheet?: IbsheetLike }).IBSheet;

const PAY_METHODS = ['신용카드', '계좌이체', '가상계좌', '휴대폰'];
const STATUSES = ['승인', '취소', '부분취소', '오류'];
const STATUS_TONE: IbBadgeTone[] = ['success', 'neutral', 'warning', 'error'];

const SAMPLE_ROWS = Array.from({ length: 30 }, (_, i) => ({
  check: i % 7 === 0 ? 1 : 0,
  txId: `TX2026111${String(i).padStart(4, '0')}`,
  merchant: ['키움상점', '다우마켓', '한빛몰', '서울카페'][i % 4],
  payMethod: String(i % PAY_METHODS.length),
  status: String(i % STATUSES.length),
  amount: (i + 1) * 12_340,
  payDate: `2026-11-${String((i % 17) + 1).padStart(2, '0')}`,
  memo: i % 5 === 0 ? '긴 메모 예시입니다 — 칸보다 길면 말줄임으로 보이는지 확인' : '',
}));

// IBSheet 데이터: 거래상태는 Badge HTML로
const SHEET_ROWS = SAMPLE_ROWS.map((r) => ({
  ...r,
  statusBadge: ibBadge(STATUSES[Number(r.status)] ?? '', STATUS_TONE[Number(r.status)]),
}));

const enumOf = (labels: string[]) => ({
  Enum: `|${labels.join('|')}`,
  EnumKeys: `|${labels.map((_, i) => i).join('|')}`,
});

interface IbClickEvent {
  row: Record<string, unknown>;
}

/** 칸 종류별 예시 — 링크 · Badge · 금액(조회 전용) / 셀렉트 · 달력 · 입력(편집) / 버튼 */
const createCols = (onPick: (text: string) => void) => [
  // 머리는 전체선택 체크박스만 (공통 옵션 HeaderCheck)
  // 빈 문자열이면 열 이름이 머리에 나온다. 정렬을 끄지 않으면 머리 전체선택을 눌렀을 때 정렬된다
  { Header: ' ', Name: 'check', Type: 'Bool', Width: 44, CanSort: 0 },
  {
    Header: '거래번호 (링크)',
    Name: 'txId',
    Type: 'Text',
    Width: 150,
    Class: IB_CELL.link,
    CanEdit: 0,
    OnClick: (e: IbClickEvent) => onPick(`링크: ${String(e.row.txId)}`),
  },
  { Header: '가맹점명', Name: 'merchant', Type: 'Text', Width: 120, Align: 'Left', CanEdit: 0 },
  { Header: '거래상태 (Badge)', Name: 'statusBadge', Type: 'Html', Width: 120, CanEdit: 0 },
  {
    Header: '거래금액',
    Name: 'amount',
    Type: 'Int',
    Width: 110,
    Format: '#,##0',
    Align: 'Right',
    CanEdit: 0,
  },
  {
    Header: '결제수단 (셀렉트)',
    Name: 'payMethod',
    Type: 'Enum',
    Width: 140,
    Class: IB_CELL.input,
    ...enumOf(PAY_METHODS),
  },
  // 셀을 누르면 IBSheet 달력 (그리드 셀 달력)
  {
    Header: '결제일 (달력)',
    Name: 'payDate',
    Type: 'Date',
    Width: 150,
    Class: IB_CELL.input,
    WidthPad: IB_DATE_BUTTON_WIDTH,
    Format: 'yyyy-MM-dd',
    DataFormat: 'yyyy-MM-dd',
  },
  {
    Header: '메모 (입력)',
    Name: 'memo',
    Type: 'Text',
    RelWidth: 1,
    MinWidth: 200,
    Align: 'Left',
    Class: IB_CELL.input,
  },
  {
    Header: '관리 (버튼)',
    Name: 'action',
    Type: 'Button',
    Width: 90,
    Button: 'Html',
    ButtonText: ibButton('상세'),
    OnClick: (e: IbClickEvent) => onPick(`버튼: ${String(e.row.txId)} 상세`),
  },
];

// 페이지 나눔 — 실제 화면은 서버가 페이지 단위로 주고(SearchResultPage), 여기서는 예시 데이터를 잘라 쓴다
const PAGE_SIZE = 10;
const TOTAL_PAGES = Math.ceil(SHEET_ROWS.length / PAGE_SIZE);
const rowsOfPage = (page: number) => SHEET_ROWS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
// 표 높이 = 머리 40 + 줄 40 × 10 + 아래 선 (줄 · 머리 높이는 ibsheetOptions)
const GRID_HEIGHT = 40 + 48 * PAGE_SIZE + 2; // 머리 40 + 줄 48 × 10 (페이지 표)

export function IbsheetSamplePage() {
  const [picked, setPicked] = useState('');
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<SheetLike | null>(null);
  const ibsheet = getIBSheet();

  useEffect(() => {
    const el = gridRef.current;
    if (!ibsheet || !el) return;
    const sheet = ibsheet.create({
      id: 'ibsheetSample',
      el,
      options: ibsheetOptions({
        Def: { Row: checkedRowClass('check') }, // 체크한 줄 배경
        Events: headerCheckEvents('check'), // 머리 일부 선택(–)
        Cols: createCols(setPicked),
      }),
      data: rowsOfPage(1),
    });
    sheetRef.current = sheet;
    return () => {
      sheetRef.current = null;
      sheet.dispose();
    };
  }, [ibsheet]);

  const changePage = (next: number) => {
    setPage(next);
    sheetRef.current?.loadSearchData(rowsOfPage(next));
  };

  const openCalendar = (anchor: HTMLElement, range: boolean) => {
    if (!ibsheet) return;
    const rect = anchor.getBoundingClientRect();
    ibsheet.showCalendar(
      {
        Format: 'yyyy-MM-dd',
        Range: range ? 1 : 0,
        Buttons: range ? 7 : 3,
        Texts: { Ok: '선택', Clear: '지우기', Today: '오늘' },
      },
      { X: rect.left + window.scrollX, Y: rect.bottom + window.scrollY + 8 },
      (value) => {
        const text = String(value)
          .split(';')
          .map((part) =>
            part
              .split('~')
              .map((ms) => ibsheet.dateToString(Number(ms), 'yyyy-MM-dd'))
              .join(' ~ '),
          )
          .join(', ');
        setPicked(text);
      },
    );
  };

  return (
    <>
      <PageLayout.Title title="IBSheet 샘플" />

      <PageLayout.Section
        title="달력"
        titleAddon="IBSheet.showCalendar — 날짜 필드(DateField · DateRangeField)가 여는 달력과 같다"
      >
        {!ibsheet ? (
          <Text>
            IBSheet가 로드되지 않았습니다. vendor/ibsheet 폴더를 확인하세요 (vendor/README.md).
          </Text>
        ) : (
          <ControlGroup>
            <Button
              variant="neutral"
              appearance="line"
              onClick={(e) => openCalendar(e.currentTarget, false)}
            >
              단일 날짜 달력
            </Button>
            <Button
              variant="neutral"
              appearance="line"
              onClick={(e) => openCalendar(e.currentTarget, true)}
            >
              기간 달력 (드래그 → 선택)
            </Button>
            <Text>{picked ? `고른 값: ${picked}` : '달력에서 고른 값이 여기에 보입니다'}</Text>
          </ControlGroup>
        )}
      </PageLayout.Section>

      <PageLayout.Section
        title="그리드 (IBSheet)"
        titleAddon={`칸 종류별 예시 — 링크 · Badge · 셀렉트 · 달력 · 입력 · 버튼${picked ? ` · ${picked}` : ''}`}
      >
        {/* IBSheet는 el의 인라인 크기로 그린다 (매뉴얼 static/create) */}
        {/* eslint-disable-next-line react/forbid-dom-props -- IBSheet 크기는 인라인으로 받는다 */}
        <div ref={gridRef} style={{ width: '100%', height: GRID_HEIGHT }} />
      </PageLayout.Section>

      {/* 표 아래 Total · Pagination — 앱 조회 화면과 같은 디자인 시스템 ResultFooter (IBSheet 자체 페이지 줄은 쓰지 않음) */}
      <ResultFooter total={SHEET_ROWS.length}>
        <Pagination totalPages={TOTAL_PAGES} page={page} onChange={changePage} />
      </ResultFooter>
    </>
  );
}
