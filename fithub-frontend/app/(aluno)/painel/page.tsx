"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import type { Treino, Matricula } from "@/types";
import { Badge } from "@/components/ui/Badge";
import styles from "./painel.module.css";

export default function PainelPage() {
  const { getUser } = useAuth();
  const user = getUser();
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.get<Treino[]>(`/aluno/treinos?alunoId=${user.id}`),
      api.get<Matricula[]>(`/admin/matriculas/aluno/${user.id}`),
    ])
      .then(([t, m]) => {
        setTreinos(t);
        setMatriculas(m);
      })
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const matriculaAtiva = matriculas.find((m) => m.status === "ATIVA");

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.greeting}>
          {greeting}, {user?.nome?.split(" ")[0]} 👋
        </h1>
        <p className={styles.subtitle}>Aqui está um resumo da sua conta</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
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
          <p className={styles.cardValue}>{treinos.length}</p>
          <p className={styles.cardLabel}>Treinos cadastrados</p>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <svg viewBox="0 0 20 20" fill="none">
              <rect
                x="3"
                y="3"
                width="14"
                height="14"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M7 10H13M7 7H13M7 13H10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className={styles.cardValue}>
            {matriculaAtiva ? matriculaAtiva.plano?.nome : "—"}
          </p>
          <p className={styles.cardLabel}>Plano atual</p>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <svg viewBox="0 0 20 20" fill="none">
              <path
                d="M6 2V5M14 2V5M3 8H17M4 4H16C16.5523 4 17 4.44772 17 5V17C17 17.5523 16.5523 18 16 18H4C3.44772 18 3 17.5523 3 17V5C3 4.44772 3.44772 4 4 4Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className={styles.cardValue}>
            {matriculaAtiva
              ? new Date(matriculaAtiva.dataFim).toLocaleDateString("pt-BR")
              : "—"}
          </p>
          <p className={styles.cardLabel}>Vencimento do plano</p>
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Meus Treinos</p>
        {loading ? (
          <p className={styles.empty}>Carregando...</p>
        ) : treinos.length === 0 ? (
          <p className={styles.empty}>Nenhum treino cadastrado ainda.</p>
        ) : (
          <div className={styles.treinos}>
            {treinos.map((treino) => (
              <div key={treino.id} className={styles.treinoCard}>
                <div>
                  <p className={styles.treinoNome}>{treino.nome}</p>
                  <p className={styles.treinoDia}>
                    {treino.diaSemana || "Sem dia definido"}
                  </p>
                </div>
                <p className={styles.treinoCount}>
                  {treino.exercicios?.length || 0} exercícios
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
