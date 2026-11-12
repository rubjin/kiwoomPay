import clsx from 'clsx';
import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../Icon';
import styles from './Infobox.module.scss';

export type InfoboxTone = 'info' | 'neutral';

export interface InfoboxProps extends HTMLAttributes<HTMLDivElement> {
  /** info: 파란 배경(화면 안내) · neutral: 회색 배경(보조 안내) */
  tone?: InfoboxTone;
  /** Infobox.Item을 1개 이상 넣는다. 여러 줄이면 제목 · 설명 열이 맞춰진다 */
  children: ReactNode;
}

/**
 * 화면 상단 등에 고정으로 보여주는 안내 상자.
 *   <Infobox>
 *     <Infobox.Item title="계정정보 변경 안내" actionLabel="변경 요청"
 *       action={<Infobox.Link href="mailto:pg-admin@…">pg-admin@…</Infobox.Link>}>
 *       기본 계정정보는 직접 수정할 수 없습니다.
 *     </Infobox.Item>
 *   </Infobox>
 */
const InfoboxRoot = forwardRef<HTMLDivElement, InfoboxProps>(
  ({ tone = 'info', className, children, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.infobox, styles[tone], className)}>
      {children}
    </div>
  ),
);
InfoboxRoot.displayName = 'Infobox';

export interface InfoboxItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 안내 제목 (굵게). 없으면 설명이 제목 자리부터 이어진다 (한 줄 안내) */
  title?: ReactNode;
  /** 오른쪽 보조 문구 (예: "변경 요청") */
  actionLabel?: ReactNode;
  /** 오른쪽 끝 요소 (예: Infobox.Link, TextButton) */
  action?: ReactNode;
  /** 아이콘 바꾸기. 기본은 Info 아이콘, null이면 숨김 */
  icon?: ReactNode;
  /** 설명 */
  children?: ReactNode;
}

const InfoboxItem = forwardRef<HTMLDivElement, InfoboxItemProps>(
  ({ title, actionLabel, action, icon, className, children, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.item, className)}>
      <span className={styles.icon}>
        {icon === undefined ? <Icon name="info-box" size={20} /> : icon}
      </span>
      {title !== undefined && <strong className={styles.title}>{title}</strong>}
      <span className={clsx(styles.text, title === undefined && styles.textWide)}>{children}</span>
      {(actionLabel !== undefined || action !== undefined) && (
        <span className={styles.action}>
          {actionLabel !== undefined && <span className={styles.label}>{actionLabel}</span>}
          {action}
        </span>
      )}
    </div>
  ),
);
InfoboxItem.displayName = 'Infobox.Item';

export type InfoboxLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

/** 오른쪽 끝 연락처 · 이동 링크 (Primary 13 Bold) */
const InfoboxLink = forwardRef<HTMLAnchorElement, InfoboxLinkProps>(
  ({ className, ...rest }, ref) => (
    <a {...rest} ref={ref} className={clsx(styles.link, className)} />
  ),
);
InfoboxLink.displayName = 'Infobox.Link';

export const Infobox = Object.assign(InfoboxRoot, { Item: InfoboxItem, Link: InfoboxLink });
