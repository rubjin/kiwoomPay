import clsx from 'clsx';
import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { NumberBadge } from '../Badge';
import { Button } from '../Button';
import { SearchField, type SearchFieldProps } from '../field';
import { Icon, type IconName } from '../Icon';
import styles from './Header.module.scss';

/** 초 → 'HH:MM:SS' (hours) 또는 'MM:SS' */
export function formatRemaining(seconds: number, hours = false): string {
  const s = Math.max(0, Math.floor(seconds));
  const pad = (n: number) => String(n).padStart(2, '0');
  const mm = pad(Math.floor((s % 3600) / 60));
  const ss = pad(s % 60);
  return hours ? `${pad(Math.floor(s / 3600))}:${mm}:${ss}` : `${pad(Math.floor(s / 60))}:${ss}`;
}

export type HeaderProps = HTMLAttributes<HTMLDivElement>;

/**
 * App Header 내용 (PageLayout `header` 슬롯에 넣는다). 조각을 왼쪽부터 순서대로 배치한다.
 *   <Header>
 *     <Header.Search />
 *     <Header.UserInfo items={…} />
 *     <Header.Divider />
 *     <Header.Session remaining={…} onExtend={…} />
 *     <Header.Divider />
 *     <Header.Masking unmasked={…} … />
 *     <Header.Divider />
 *     <Header.Download count={1} />
 *     <Header.Actions>
 *       <Header.IconButton icon="user" label="내 정보" />
 *     </Header.Actions>
 *   </Header>
 */
const HeaderRoot = forwardRef<HTMLDivElement, HeaderProps>(({ className, ...rest }, ref) => (
  <div {...rest} ref={ref} className={clsx(styles.header, className)} />
));
HeaderRoot.displayName = 'Header';

/** 공통 검색 (CPID · 상호명 · 사업자번호). 남는 폭을 채운다 */
const HeaderSearch = forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ className, placeholder = 'CPID / 상호명 / 사업자번호를 검색해보세요', ...rest }, ref) => (
    <div className={clsx(styles.search, className)}>
      <SearchField {...rest} ref={ref} placeholder={placeholder} fullWidth />
    </div>
  ),
);
HeaderSearch.displayName = 'Header.Search';

export interface HeaderUserInfoItem {
  label: ReactNode;
  value: ReactNode;
}

export interface HeaderUserInfoProps extends HTMLAttributes<HTMLDListElement> {
  /** 아이디 · 이름 · 소속 · 권한 (마스킹은 화면에서 처리한 값을 넣는다) */
  items: HeaderUserInfoItem[];
}

/** 로그인 사용자 정보. 항목 이름 위 · 값 아래, 항목 사이 구분선 */
const HeaderUserInfo = forwardRef<HTMLDListElement, HeaderUserInfoProps>(
  ({ items, className, ...rest }, ref) => (
    <dl {...rest} ref={ref} className={clsx(styles.userInfo, className)}>
      {items.map((item, index) => (
        <div key={index} className={styles.infoItem}>
          <dt className={styles.infoLabel}>{item.label}</dt>
          <dd className={styles.infoValue}>{item.value}</dd>
        </div>
      ))}
    </dl>
  ),
);
HeaderUserInfo.displayName = 'Header.UserInfo';

/** 영역 구분선 (높이 40) */
const HeaderDivider = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...rest }, ref) => (
    <span {...rest} ref={ref} role="separator" className={clsx(styles.divider, className)} />
  ),
);
HeaderDivider.displayName = 'Header.Divider';

export interface HeaderSessionProps extends HTMLAttributes<HTMLDivElement> {
  /** 세션 남은 시간(초). 카운트다운은 화면에서 관리한다 */
  remaining: number;
  onExtend?: () => void;
  extendLabel?: ReactNode;
}

/** 로그인 세션 남은 시간 + [연장] */
const HeaderSession = forwardRef<HTMLDivElement, HeaderSessionProps>(
  ({ remaining, onExtend, extendLabel = '연장', className, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.session, className)}>
      <span className={styles.timer} role="timer" aria-label="세션 남은 시간">
        {formatRemaining(remaining, true)}
      </span>
      <Button variant="neutral" appearance="line" onClick={onExtend}>
        {extendLabel}
      </Button>
    </div>
  ),
);
HeaderSession.displayName = 'Header.Session';

export interface HeaderMaskingProps extends HTMLAttributes<HTMLDivElement> {
  /** 마스킹 해제 중 여부 */
  unmasked?: boolean;
  /** 해제 남은 시간(초). unmasked일 때 표시 */
  remaining?: number;
  /** [마스킹 해제] — 사유 입력 등은 화면에서 Modal로 처리 */
  onUnmask?: () => void;
  /** 해제 중 [연장] */
  onExtend?: () => void;
  /** 해제 중 [마스킹 적용] */
  onApply?: () => void;
}

/** 개인정보 마스킹: 기본은 [마스킹 해제], 해제 중이면 초록 상자(남은 시간 · 연장 · 마스킹 적용) */
const HeaderMasking = forwardRef<HTMLDivElement, HeaderMaskingProps>(
  ({ unmasked = false, remaining = 0, onUnmask, onExtend, onApply, className, ...rest }, ref) =>
    unmasked ? (
      <div {...rest} ref={ref} className={clsx(styles.masking, className)}>
        <span className={styles.maskingStatus}>
          <span className={styles.maskingDot} aria-hidden />
          마스킹 해제 중
          <span className={styles.maskingTime} role="timer">
            {formatRemaining(remaining)}
          </span>
        </span>
        <Button size="sm" variant="neutral" appearance="line" onClick={onExtend}>
          연장
        </Button>
        <Button size="sm" onClick={onApply}>
          마스킹 적용
        </Button>
      </div>
    ) : (
      <div {...rest} ref={ref} className={className}>
        <Button onClick={onUnmask}>마스킹 해제</Button>
      </div>
    ),
);
HeaderMasking.displayName = 'Header.Masking';

export interface HeaderDownloadProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'type'
> {
  /** 받을 수 있는 파일 수 (0이면 숨김) */
  count?: number;
  label?: ReactNode;
}

/** [다운로드 센터] — Primary Line 버튼 + 건수 */
const HeaderDownload = forwardRef<HTMLButtonElement, HeaderDownloadProps>(
  ({ count = 0, label = '다운로드 센터', ...rest }, ref) => (
    <Button {...rest} ref={ref} appearance="line" leadingIcon={<Icon name="download" />}>
      <span className={styles.download}>
        {label}
        <NumberBadge count={count} />
      </span>
    </Button>
  ),
);
HeaderDownload.displayName = 'Header.Download';

/** 오른쪽 아이콘 버튼 묶음 (간격 8) */
const HeaderActions = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div {...rest} ref={ref} className={clsx(styles.actions, className)} />
  ),
);
HeaderActions.displayName = 'Header.Actions';

export interface HeaderIconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  icon: IconName;
  /** 스크린리더 · 툴팁(title) 문구 */
  label: string;
  /** 새 알림 점 (bell은 bell-on 아이콘으로 바뀜) */
  dot?: boolean;
}

const HeaderIconButton = forwardRef<HTMLButtonElement, HeaderIconButtonProps>(
  ({ icon, label, dot = false, className, type = 'button', ...rest }, ref) => (
    <button
      {...rest}
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={clsx(styles.iconButton, className)}
    >
      <Icon name={dot && icon === 'bell' ? 'bell-on' : icon} size={24} />
    </button>
  ),
);
HeaderIconButton.displayName = 'Header.IconButton';

export const Header = Object.assign(HeaderRoot, {
  Search: HeaderSearch,
  UserInfo: HeaderUserInfo,
  Divider: HeaderDivider,
  Session: HeaderSession,
  Masking: HeaderMasking,
  Download: HeaderDownload,
  Actions: HeaderActions,
  IconButton: HeaderIconButton,
});
