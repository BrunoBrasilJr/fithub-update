import styles from "./Badge.module.css";

interface BadgeProps {
  label: string;
  variant: "ativa" | "inativa" | "pendente" | "admin" | "aluno";
}

export function Badge({ label, variant }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{label}</span>;
}
