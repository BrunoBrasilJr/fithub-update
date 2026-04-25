"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import styles from "./perfil.module.css";

export default function PerfilPage() {
  const { getUser } = useAuth();
  const router = useRouter();
  const user = getUser();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Meu Perfil</h1>
        <p className={styles.subtitle}>Suas informações pessoais</p>
      </div>

      <div className={styles.card}>
        <div className={styles.avatar}>
          {user?.nome?.charAt(0).toUpperCase() || "A"}
        </div>
        <p className={styles.name}>{user?.nome}</p>
        <p className={styles.email}>{user?.email}</p>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Perfil</span>
          <span className={styles.infoValue}>
            {user?.role === "ADMIN" ? "Administrador" : "Aluno"}
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Status</span>
          <span className={styles.infoValue}>Ativo</span>
        </div>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={() => router.push("/aluno/trocar-senha")}
          >
            Trocar Senha
          </Button>
        </div>
      </div>
    </div>
  );
}
