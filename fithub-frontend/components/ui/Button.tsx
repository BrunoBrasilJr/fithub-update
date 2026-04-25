import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${size !== "md" ? styles[size] : ""} ${className || ""}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span
          className={`${styles.spinner} ${variant === "primary" ? styles.primarySpinner : styles.secondarySpinner}`}
        />
      ) : (
        children
      )}
    </button>
  );
}
