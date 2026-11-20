import { InfoStrip } from '@kiwoompay/design-system';

/** 다운로드 요청 당시 조회조건 (라벨 값 | 라벨 값 …) */
export function RequestConditions({ items }: { items: { label: string; value: string }[] }) {
  return <InfoStrip layout="divided" items={items} />;
}
