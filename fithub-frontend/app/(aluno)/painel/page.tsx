"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import type { Treino, Matricula } from "@/types";
import styles from "./painel.module.css";

export default function PainelPage() {
  const { getUser } = useAuth();
  const [nome, setNome] = useState("");
  const [greeting, setGreeting] = useState("");
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!user) return;

    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite");
    setNome(user.nome?.split(" ")[0] || "");

    Promise.all([
      api.get<Treino[]>(`/aluno/treinos?alunoId=${user.id}`),
      api.get<Matricula[]>(`/aluno/matriculas?alunoId=${user.id}`),
    ])
      .then(([t, m]) => {
        setTreinos(t);
        setMatriculas(m);
      })
      .finally(() => setLoading(false));
  }, []);

  const matriculaAtiva = matriculas.find((m) => m.status === "ATIVA");

  function diasParaVencer(dataFim: string) {
    const hoje = new Date();
    const fim = new Date(dataFim);
    return Math.ceil((fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  }

  const diasRestantes = matriculaAtiva
    ? diasParaVencer(matriculaAtiva.dataFim)
    : null;
  const vencendoEmBreve =
    diasRestantes !== null && diasRestantes <= 7 && diasRestantes >= 0;
  const vencido = diasRestantes !== null && diasRestantes < 0;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.greeting}>
          {greeting}, {nome}
        </h1>
        <p className={styles.subtitle}>Aqui está um resumo da sua conta</p>
      </div>

      {vencido && (
        <div className={styles.alertaDanger}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle
              cx="10"
              cy="10"
              r="8"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M10 6V10.5M10 13H10.01"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Seu plano venceu há {Math.abs(diasRestantes!)} dia
          {Math.abs(diasRestantes!) !== 1 ? "s" : ""}. Entre em contato com a
          academia para renovar.
        </div>
      )}

      {vencendoEmBreve && (
        <div className={styles.alertaWarning}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle
              cx="10"
              cy="10"
              r="8"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M10 6V10.5M10 13H10.01"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Seu plano vence em {diasRestantes} dia{diasRestantes !== 1 ? "s" : ""}
          . Renove em breve para não perder o acesso.
        </div>
      )}

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
