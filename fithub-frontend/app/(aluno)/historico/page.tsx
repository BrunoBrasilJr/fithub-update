"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import styles from "./historico.module.css";

interface HistoricoTreino {
  id: string;
  treinoId: string;
  treinoNome: string;
  diaSemana?: string;
  concluidoEm: string;
}

export default function HistoricoPage() {
  useAuth();
  const [historico, setHistorico] = useState<HistoricoTreino[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<HistoricoTreino[]>("/aluno/historico")
      .then(setHistorico)
      .finally(() => setLoading(false));
  }, []);

  function formatarData(iso: string) {
    const d = new Date(iso);
    return (
      d.toLocaleDateString("pt-BR") +
      " às " +
      d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Histórico de Treinos</h1>
        <p className={styles.subtitle}>
          {historico.length} treino{historico.length !== 1 ? "s" : ""} concluído
          {historico.length !== 1 ? "s" : ""}
        </p>
      </div>

      {loading ? (
        <p className={styles.empty}>Carregando...</p>
      ) : historico.length === 0 ? (
        <p className={styles.empty}>Nenhum treino concluído ainda.</p>
      ) : (
        <div className={styles.list}>
          {historico.map((h) => (
            <div key={h.id} className={styles.card}>
              <div className={styles.cardIcon}>
                <svg viewBox="0 0 20 20" fill="none">
                  <path
                    d="M2 10H4M16 10H18M4 10C4 10 4 7 7 7C10 7 10 13 13 13C16 13 16 10 16 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className={styles.cardInfo}>
                <p className={styles.cardNome}>{h.treinoNome}</p>
                <p className={styles.cardMeta}>
                  {h.diaSemana ? `${h.diaSemana} · ` : ""}
                  {formatarData(h.concluidoEm)}
                </p>
              </div>
              <div className={styles.cardBadge}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle
                    cx="8"
                    cy="8"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M5 8L7 10L11 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Concluído
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
