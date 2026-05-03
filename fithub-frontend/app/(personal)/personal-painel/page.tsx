"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import styles from "./painel.module.css";

interface AlunoResumo {
  id: number;
  nome: string;
  email: string;
}

export default function PersonalPainelPage() {
  useAuth("PERSONAL");
  const { getUser } = useAuth();
  const [alunos, setAlunos] = useState<AlunoResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [nome, setNome] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite");

    const user = getUser();
    setNome(user?.nome?.split(" ")[0] || "");

    api
      .get<AlunoResumo[]>("/personal/alunos")
      .then(setAlunos)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.greeting}>
          {greeting}, {nome}
        </h1>
        <p className={styles.subtitle}>
          Resumo da sua area de personal trainer
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <svg viewBox="0 0 20 20" fill="none">
              <circle
                cx="10"
                cy="7"
                r="3"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M3 17C3 14.2386 6.13401 12 10 12C13.866 12 17 14.2386 17 17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className={styles.cardValue}>{alunos.length}</p>
          <p className={styles.cardLabel}>Alunos ativos</p>
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Meus Alunos</p>
        {loading ? (
          <p className={styles.empty}>Carregando...</p>
        ) : alunos.length === 0 ? (
          <p className={styles.empty}>Nenhum aluno vinculado ainda.</p>
        ) : (
          <div className={styles.treinos}>
            {alunos.map((aluno) => (
              <div key={aluno.id} className={styles.treinoCard}>
                <div>
                  <p className={styles.treinoNome}>{aluno.nome}</p>
                  <p className={styles.treinoDia}>{aluno.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
