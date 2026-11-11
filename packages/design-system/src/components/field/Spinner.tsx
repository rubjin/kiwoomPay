import styles from './Spinner.module.scss';

/** SelectBox · MultiSelect 로딩 표시. 패키지 내부용이다. */
export function Spinner() {
  return (
    <svg className={styles.spinner} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle className={styles.track} cx="10" cy="10" r="7" strokeWidth="2" />
      <path className={styles.arc} d="M17 10a7 7 0 0 0-7-7" strokeWidth="2" strokeLinecap="round">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 10 10"
          to="360 10 10"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}
