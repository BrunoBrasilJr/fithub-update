import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.wrapper}>
        <input className={`${styles.input} ${className || ""}`} {...props} />
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export function Select({
  label,
  error,
  children,
  className,
  ...props
}: SelectProps) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.wrapper}>
        <select
          className={`${styles.input} ${styles.select} ${className || ""}`}
          {...props}
        >
          {children}
        </select>
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
