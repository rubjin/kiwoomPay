import { Button, ControlGroup, PageLayout, Segmented, Stack, Text } from '@kiwoompay/design-system';
import { useEffect, useRef, useState } from 'react';

/**
 * IBSheet8 모양 확인 (개발 서버 전용, 임의 작업) — 기본 테마 8종의 그리드 · 달력을 바꿔 가며 본다.
 * KWP 테마(토큰 색 · 글자)를 만들기 전에 어느 테마를 바탕으로 할지 고르는 용도. vendor/ibsheet가 있어야 한다
 */

// 테마 폴더 · Prefix (매뉴얼 props/cfg/style). default_img는 default와 Prefix가 같아 뺀다
const THEMES = [
  { folder: 'default', prefix: 'IB', label: '기본' },
  { folder: 'grace', prefix: 'IBGR', label: 'grace' },
  { folder: 'gray', prefix: 'IBGY', label: 'gray' },
  { folder: 'material', prefix: 'IBMR', label: 'material' },
  { folder: 'mint', prefix: 'IBMT', label: 'mint' },
  { folder: 'simple', prefix: 'IBSP', label: 'simple' },
  { folder: 'krds', prefix: 'IBKD', label: 'krds' },
] as const;

type ThemeFolder = (typeof THEMES)[number]['folder'];

interface IbsheetLike {
  create: (args: { id: string; el: HTMLElement; options: object; data?: object[] }) => {
    dispose: () => void;
  };
  showCalendar: (
    option: object,
    position: { X: number; Y: number },
    callback: (value: string | number) => void,
  ) => unknown;
  dateToString: (ms: number, format: string) => string;
}

const getIBSheet = () => (window as unknown as { IBSheet?: IbsheetLike }).IBSheet;

/** 테마 CSS를 한 번만 붙이고, 다 읽으면 끝나는 Promise */
function loadThemeCss(folder: ThemeFolder) {
  const href = `/ibsheet/css/${folder}/main.css`;
  const existing = document.querySelector<HTMLLinkElement>(`link[href="${href}"]`);
  if (existing) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => resolve();
    document.head.appendChild(link);
  });
}

const PAY_METHODS = ['신용카드', '계좌이체', '가상계좌', '휴대폰'];
const STATUSES = ['승인', '취소', '부분취소', '오류'];

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

const COLS = [
  { Header: '선택', Name: 'check', Type: 'Bool', Width: 50 },
  { Header: '거래번호', Name: 'txId', Type: 'Text', Width: 150, Align: 'Center' },
  { Header: '가맹점명', Name: 'merchant', Type: 'Text', Width: 140 },
  {
    Header: '결제수단',
    Name: 'payMethod',
    Type: 'Enum',
    Width: 110,
    Enum: `|${PAY_METHODS.join('|')}`,
    EnumKeys: `|${PAY_METHODS.map((_, i) => i).join('|')}`,
  },
  {
    Header: '거래상태',
    Name: 'status',
    Type: 'Enum',
    Width: 100,
    Enum: `|${STATUSES.join('|')}`,
    EnumKeys: `|${STATUSES.map((_, i) => i).join('|')}`,
  },
  { Header: '거래금액', Name: 'amount', Type: 'Int', Width: 120, Format: '#,##0' },
  // 셀을 누르면 IBSheet 달력 (그리드 셀 달력)
  { Header: '결제일', Name: 'payDate', Type: 'Date', Width: 120, Format: 'yyyy-MM-dd', DataFormat: 'yyyy-MM-dd' },
  { Header: '메모', Name: 'memo', Type: 'Text', RelWidth: 1, MinWidth: 160 },
];

export function IbsheetSamplePage() {
  const [theme, setTheme] = useState<ThemeFolder>('default');
  const [picked, setPicked] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);
  const ibsheet = getIBSheet();
  const prefix = THEMES.find((t) => t.folder === theme)?.prefix ?? 'IB';

  useEffect(() => {
    const el = gridRef.current;
    if (!ibsheet || !el) return;
    let sheet: { dispose: () => void } | null = null;
    let cancelled = false;
    void loadThemeCss(theme).then(() => {
      if (cancelled) return;
      sheet = ibsheet.create({
        id: 'ibsheetSample',
        el,
        options: {
          Cfg: { Style: prefix, SearchMode: 0 },
          Def: { Header: { Align: 'Center' } },
          Cols: COLS,
        },
        data: SAMPLE_ROWS,
      });
    });
    return () => {
      cancelled = true;
      sheet?.dispose();
    };
  }, [ibsheet, theme, prefix]);

  const openCalendar = (anchor: HTMLElement, range: boolean) => {
    if (!ibsheet) return;
    const rect = anchor.getBoundingClientRect();
    ibsheet.showCalendar(
      {
        Format: 'yyyy-MM-dd',
        Range: range ? 1 : 0,
        Buttons: range ? 7 : 3,
        Class: `${prefix}Pick`,
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
      <PageLayout.Title title="IBSheet 샘플 (임의 작업)" />

      <PageLayout.Section
        title="테마"
        titleAddon="IBSheet8 기본 테마 — KWP 테마(토큰 색 · 글자)의 바탕을 고르는 용도"
      >
        {!ibsheet ? (
          <Text>
            IBSheet가 로드되지 않았습니다. vendor/ibsheet 폴더를 확인하세요 (vendor/README.md).
          </Text>
        ) : (
          <Stack gap={16}>
            <Segmented value={theme} onChange={(v) => setTheme(v as ThemeFolder)} aria-label="테마">
              {THEMES.map((t) => (
                <Segmented.Item key={t.folder} value={t.folder}>
                  {t.label}
                </Segmented.Item>
              ))}
            </Segmented>
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
          </Stack>
        )}
      </PageLayout.Section>

      <PageLayout.Section title="그리드" titleAddon="결제일 셀을 누르면 그리드 셀 달력, 결제수단 · 거래상태는 드롭다운">
        {/* IBSheet는 el의 인라인 크기로 그린다 (매뉴얼 static/create) */}
        <div ref={gridRef} style={{ width: '100%', height: 480 }} />
      </PageLayout.Section>
    </>
  );
}
