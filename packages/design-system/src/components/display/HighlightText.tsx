import { Fragment } from 'react';
import styles from './HighlightText.module.scss';

export interface HighlightTextProps {
  text: string;
  /** 강조할 검색어 (대소문자 무시). 비어 있으면 그대로 */
  query?: string;
}

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * 글자 안의 검색어를 Primary 글자색으로 강조한다 (굵기 · 크기는 둘러싼 글자 그대로).
 * Figma 알림센터 검색 결과 "자동정산 처리가 완료되었습니다."
 */
export function HighlightText({ text, query }: HighlightTextProps) {
  const keyword = query?.trim();
  if (!keyword) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escape(keyword)})`, 'gi'));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <mark key={index} className={styles.mark}>
            {part}
          </mark>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
