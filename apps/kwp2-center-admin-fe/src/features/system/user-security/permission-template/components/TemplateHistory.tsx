import {
  DateRangeField,
  Field,
  Infobox,
  Pagination,
  ResultFooter,
  SearchPanel,
  SectionHeading,
  SelectBox,
  StatusView,
  type GridPlaceholderColumn,
  type SearchResultPage,
} from '@kiwoompay/design-system';
import { IbsheetGrid } from '@kiwoompay/design-system/ibsheet';
import { useEffect, useState } from 'react';
import { useCodeOptions } from '@/hooks/useCodeOptions';
import { fetchTemplateHistory } from '@/features/system/permissionTemplate.api';
import type {
  TemplateHistoryItem,
  TemplateHistoryParams,
} from '@/features/system/permissionTemplate.types';
import { codeLabel } from '@/utils/code';
import { rangeOfQuickPeriod } from '@/utils/period';

const PAGE_SIZE = 5;

/** 변경 이력 검색 초기값 — 변경일시 최근 3개월 · 변경유형 전체 (TODO(정책) 기본 기간) */
const createHistoryParams = (): TemplateHistoryParams => ({
  period: rangeOfQuickPeriod('3m'),
  type: 'all',
});

// 폭은 기획서 비율 — TODO(시안)
const COLUMNS: GridPlaceholderColumn<TemplateHistoryItem>[] = [
  { key: 'changedAt', header: '변경일시', width: 140 },
  { key: 'changedBy', header: '변경자', width: 100 },
  {
    key: 'type',
    header: '변경유형',
    width: 100,
    render: (h) => codeLabel('TEMPLATE_CHANGE_TYPE', h.type),
  },
  { key: 'item', header: '변경항목', align: 'left' },
  { key: 'before', header: '변경 전', width: 180, align: 'left' },
  { key: 'after', header: '변경 후', width: 180, align: 'left' },
];

interface TemplateHistoryProps {
  templateId: string;
  /** 저장할 때마다 올린다 — 이력을 다시 받는다 */
  version: number;
}

/**
 * 화면설계서 KWPC10010302 권한 템플릿 관리 - 변경 이력 (권한 템플릿 관리 [변경 이력] 버튼 탭).
 * 선택한 템플릿의 이력만 · 조회 전용 · 변경일시 최신순 · 5건씩. 검색: 변경일시 기간 · 변경유형
 */
export function TemplateHistory({ templateId, version }: TemplateHistoryProps) {
  const types = useCodeOptions('TEMPLATE_CHANGE_TYPE', { withAll: true });
  const [params, setParams] = useState(createHistoryParams);
  const [applied, setApplied] = useState(createHistoryParams);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<SearchResultPage<TemplateHistoryItem> | null>(null);
  const [error, setError] = useState(false);

  const load = async (search: TemplateHistoryParams, nextPage: number) => {
    try {
      setData(await fetchTemplateHistory(templateId, search, nextPage, PAGE_SIZE));
      setPage(nextPage);
      setError(false);
    } catch {
      setError(true);
    }
  };

  // 템플릿을 바꾸면 조건을 처음으로, 저장(version)하면 지금 조건으로 1페이지부터
  useEffect(() => {
    const initial = createHistoryParams();
    setParams(initial);
    setApplied(initial);
    void load(initial, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);
  useEffect(() => {
    if (version > 0) void load(applied, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  const search = () => {
    setApplied(params);
    void load(params, 1);
  };

  return (
    <>
      {/* 건수는 표 아래 ResultFooter Total만 — 제목 줄 위 건수 없음 (사용자 결정) */}
      <SectionHeading size="md" as="h3" title="변경 이력" />
      <SearchPanel variant="box" title={null} onSearch={search}>
        <Field label="변경일시">
          <DateRangeField
            value={params.period}
            onChange={(period) => setParams({ ...params, period })}
          />
        </Field>
        <Field label="변경유형">
          <SelectBox
            options={types}
            value={params.type}
            onChange={(type) => setParams({ ...params, type })}
          />
        </Field>
      </SearchPanel>
      {error ? (
        <StatusView status="error" />
      ) : data && data.total === 0 ? (
        <StatusView status="empty" />
      ) : (
        data && (
          <>
            <IbsheetGrid columns={COLUMNS} rows={data.items} rowKey={(h) => h.id} />
            <ResultFooter total={data.total}>
              <Pagination
                totalPages={Math.ceil(data.total / PAGE_SIZE)}
                page={page}
                onChange={(next) => void load(applied, next)}
              />
            </ResultFooter>
            {/* 섹션 안내 = 카드 맨 아래 · neutral, 문구는 기획서 화면의 ※ 그대로 (내용이 없으면 안내도 없음) */}
            <Infobox tone="neutral">
              <Infobox.Item
                bullets={[
                  '선택된 템플릿의 등록·수정·권한 변경 이력만 조회합니다. 기존 사용자에게 이미 부여된 권한은 변경되지 않습니다.',
                  '조회 전용 · 변경일시 최신순 · 템플릿 생성·권한·기본정보·사용 상태 변경을 이력으로 남깁니다.',
                ]}
              />
            </Infobox>
          </>
        )
      )}
    </>
  );
}
