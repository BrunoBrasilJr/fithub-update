"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import type { Matricula } from "@/types";
import { Badge } from "@/components/ui/Badge";
import styles from "./plano.module.css";

export default function PlanoPage() {
  const { getUser } = useAuth();
  const [matricula, setMatricula] = useState<Matricula | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!user) return;
    api
      .get<Matricula[]>(`/aluno/matriculas?alunoId=${user.id}`)
      .then((data) => {
        const ativa = data.find((m) => m.status === "ATIVA") || data[0] || null;
        setMatricula(ativa);
      })
      .finally(() => setLoading(false));
  }, []);

  const statusVariant: Record<string, "ativa" | "inativa" | "pendente"> = {
    ATIVA: "ativa",
    INATIVA: "inativa",
    PENDENTE: "pendente",
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Meu Plano</h1>
        <p className={styles.subtitle}>Informações sobre sua matrícula</p>
      </div>

      {loading ? (
        <p className={styles.empty}>Carregando...</p>
      ) : !matricula ? (
        <p className={styles.empty}>Nenhuma matrícula encontrada.</p>
      ) : (
        <div className={styles.card}>
          <p className={styles.planName}>{matricula.plano?.nome}</p>
          <p className={styles.planValue}>
            R$ {Number(matricula.plano?.valor).toFixed(2)}
          </p>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Status</span>
            <Badge
              label={matricula.status}
              variant={statusVariant[matricula.status]}
            />
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Tipo</span>
            <span className={styles.infoValue}>{matricula.plano?.tipo}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Início</span>
            <span className={styles.infoValue}>
              {new Date(matricula.dataInicio).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Vencimento</span>
            <span className={styles.infoValue}>
              {new Date(matricula.dataFim).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
