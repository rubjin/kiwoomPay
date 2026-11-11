import clsx from 'clsx';
import { Fragment, forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styles from './Footer.module.scss';

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /** 회사 로고 (이미지 · SVG) */
  logo?: ReactNode;
  /** 회사 정보 항목 (대표이사 · 사업자등록번호 · 주소 · 대표전화 · FAX …). 항목 사이에 구분선이 들어간다 */
  items: ReactNode[];
  /** 저작권 문구 (마지막 항목) */
  copyright?: ReactNode;
}

/** App Footer 내용 (PageLayout `footer` 슬롯에 넣는다). 로고 + 회사 정보를 한 줄로 가운데 정렬 */
export const Footer = forwardRef<HTMLElement, FooterProps>(
  ({ logo, items, copyright, className, ...rest }, ref) => {
    const all = copyright === undefined ? items : [...items, copyright];
    return (
      <footer {...rest} ref={ref} className={clsx(styles.footer, className)}>
        {logo && <span className={styles.logo}>{logo}</span>}
        <p className={styles.info}>
          {all.map((item, index) => (
            <Fragment key={index}>
              {index > 0 && <span className={styles.divider} aria-hidden />}
              <span className={styles.item}>{item}</span>
            </Fragment>
          ))}
        </p>
      </footer>
    );
  },
);
Footer.displayName = 'Footer';
