"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import type { Matricula } from "@/types";
import { Badge } from "@/components/ui/Badge";
import styles from "./vencimentos.module.css";

export default function VencimentosPage() {
  useAuth("ADMIN");
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Matricula[]>("/admin/dashboard/vencimentos")
      .then(setMatriculas)
      .finally(() => setLoading(false));
  }, []);

  function diasRestantes(dataFim: string) {
    const hoje = new Date();
    const fim = new Date(dataFim);
    const diff = Math.ceil(
      (fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Alertas de Vencimento</h1>
          <p className={styles.subtitle}>
            Matrículas vencendo nos próximos 7 dias
          </p>
        </div>
        <div className={styles.badge}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle
              cx="8"
              cy="8"
              r="7"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 5V8.5M8 11H8.01"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {matriculas.length} alerta{matriculas.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span className={styles.tableHeaderCell}>Aluno</span>
          <span className={styles.tableHeaderCell}>Plano</span>
          <span className={styles.tableHeaderCell}>Vencimento</span>
          <span className={styles.tableHeaderCell}>Dias restantes</span>
          <span className={styles.tableHeaderCell}>Status</span>
        </div>

        {loading ? (
          <div className={styles.empty}>Carregando...</div>
        ) : matriculas.length === 0 ? (
          <div className={styles.empty}>
            <svg className={styles.emptyIcon} viewBox="0 0 48 48" fill="none">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M24 14V26M24 32H24.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <p>Nenhuma matrícula vencendo nos próximos 7 dias</p>
          </div>
        ) : (
          matriculas.map((m) => {
            const dias = diasRestantes(m.dataFim);
            return (
              <div key={m.id} className={styles.tableRow}>
                <div>
                  <p className={styles.cellName}>{m.aluno?.nome}</p>
                  <p className={styles.cellSub}>{m.aluno?.email}</p>
                </div>
                <span className={styles.cell}>{m.plano?.nome}</span>
                <span className={styles.cell}>
                  {new Date(m.dataFim).toLocaleDateString("pt-BR")}
                </span>
                <span
                  className={`${styles.dias} ${dias <= 2 ? styles.critico : dias <= 5 ? styles.atencao : styles.ok}`}
                >
                  {dias === 0
                    ? "Vence hoje"
                    : dias === 1
                      ? "1 dia"
                      : `${dias} dias`}
                </span>
                <Badge label={m.status} variant="ativa" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
