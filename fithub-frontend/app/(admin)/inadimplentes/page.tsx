"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import type { Matricula } from "@/types";
import styles from "./inadimplentes.module.css";

export default function InadimplentesPage() {
  useAuth("ADMIN");
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Matricula[]>("/admin/dashboard/inadimplentes")
      .then(setMatriculas)
      .finally(() => setLoading(false));
  }, []);

  function diasVencido(dataFim: string) {
    const hoje = new Date();
    const fim = new Date(dataFim);
    return Math.ceil((hoje.getTime() - fim.getTime()) / (1000 * 60 * 60 * 24));
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Inadimplentes</h1>
          <p className={styles.subtitle}>
            Alunos com matrícula vencida sem renovação
          </p>
        </div>
        <div className={styles.badge}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2L10 6H14L11 9L12 13L8 11L4 13L5 9L2 6H6L8 2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          {matriculas.length} inadimplente{matriculas.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span className={styles.tableHeaderCell}>Aluno</span>
          <span className={styles.tableHeaderCell}>Plano</span>
          <span className={styles.tableHeaderCell}>Venceu em</span>
          <span className={styles.tableHeaderCell}>Dias vencido</span>
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
                d="M16 24L21 29L32 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>Nenhum inadimplente no momento</p>
          </div>
        ) : (
          matriculas.map((m) => (
            <div key={m.id} className={styles.tableRow}>
              <div>
                <p className={styles.cellName}>{m.aluno?.nome}</p>
                <p className={styles.cellSub}>{m.aluno?.email}</p>
              </div>
              <span className={styles.cell}>{m.plano?.nome}</span>
              <span className={styles.cell}>
                {new Date(m.dataFim).toLocaleDateString("pt-BR")}
              </span>
              <span className={styles.diasVencido}>
                {diasVencido(m.dataFim)} dia
                {diasVencido(m.dataFim) !== 1 ? "s" : ""}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
