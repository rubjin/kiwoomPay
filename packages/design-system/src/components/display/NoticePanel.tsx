import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../Icon';
import styles from './NoticePanel.module.scss';

export interface NoticePanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 제목 (13 SemiBold, 앞에 Info 아이콘 16) */
  title: ReactNode;
  /** 글머리표 목록 (13 Regular). children 대신 쓴다 */
  items?: ReactNode[];
  /** 자유 내용 (items가 없을 때) */
  children?: ReactNode;
}

/**
 * 안내 상자: 제목 줄 + 아래 목록 (Primary 50 · 테두리 Primary 200 · 반경 8 · 여백 12/16, 사이 8).
 * Infobox(제목 · 설명이 한 줄)와 달리 제목 아래로 여러 줄 안내를 둔다. Figma 비밀번호 변경 "비밀번호 설정 안내"
 */
export const NoticePanel = forwardRef<HTMLDivElement, NoticePanelProps>(
  ({ title, items, children, className, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.panel, className)}>
      <div className={styles.header}>
        <span className={styles.icon} aria-hidden>
          <Icon name="info-circle" size={16} />
        </span>
        <p className={styles.title}>{title}</p>
      </div>
      <div className={styles.body}>
        {items ? (
          <ul className={styles.list}>
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          children
        )}
      </div>
    </div>
  ),
);
NoticePanel.displayName = 'NoticePanel';
