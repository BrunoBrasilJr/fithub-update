"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import styles from "./painel.module.css";

interface AlunoResumo {
  id: string;
  nome: string;
  email: string;
  fotoUrl?: string;
}

interface TreinoResumo {
  id: string;
  nome: string;
}

export default function PersonalPainelPage() {
  const { getUser } = useAuth("PERSONAL");
  const router = useRouter();
  const [alunos, setAlunos] = useState<AlunoResumo[]>([]);
  const [treinos, setTreinos] = useState<TreinoResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [nome, setNome] = useState("");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite");

    const userStr = localStorage.getItem("fithub_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setNome(user?.nome?.split(" ")[0] || "");
    }

    Promise.all([
      api.get<AlunoResumo[]>("/personal/alunos"),
      api.get<TreinoResumo[]>("/personal/treinos"),
    ])
      .then(([a, t]) => {
        setAlunos(a);
        setTreinos(t);
      })
      .finally(() => setLoading(false));
  }, []);

  const alunosFiltrados = alunos.filter(
    (a) =>
      a.nome.toLowerCase().includes(busca.toLowerCase()) ||
      a.email.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.greeting}>
          {greeting}, {nome}
        </h1>
        <p className={styles.subtitle}>
          Resumo da sua área de personal trainer
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
          <p className={styles.cardLabel}>Alunos</p>
        </div>
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
          <p className={styles.cardLabel}>Treinos criados</p>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTitle}>Meus Alunos</p>
          <button
            className={styles.verTreinos}
            onClick={() => router.push("/personal-treinos")}
          >
            Gerenciar Treinos →
          </button>
        </div>

        <div className={styles.buscaWrapper}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <circle
              cx="9"
              cy="9"
              r="6"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M15 15L18 18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            className={styles.buscaInput}
            placeholder="Buscar aluno por nome ou email..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {busca && (
            <button className={styles.buscaLimpar} onClick={() => setBusca("")}>
              ✕
            </button>
          )}
        </div>

        {loading ? (
          <p className={styles.empty}>Carregando...</p>
        ) : alunosFiltrados.length === 0 ? (
          <p className={styles.empty}>
            {busca
              ? "Nenhum aluno encontrado."
              : "Nenhum aluno vinculado ainda."}
          </p>
        ) : (
          <div className={styles.alunosList}>
            {alunosFiltrados.map((aluno) => (
              <div key={aluno.id} className={styles.alunoCard}>
                {aluno.fotoUrl ? (
                  <img
                    src={aluno.fotoUrl}
                    alt={aluno.nome}
                    className={styles.alunoAvatar}
                  />
                ) : (
                  <div className={styles.alunoAvatarPlaceholder}>
                    {aluno.nome.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className={styles.alunoInfo}>
                  <p className={styles.alunoNome}>{aluno.nome}</p>
                  <p className={styles.alunoEmail}>{aluno.email}</p>
                </div>
                <button
                  className={styles.verBtn}
                  onClick={() =>
                    router.push(`/personal-treinos?aluno=${aluno.id}`)
                  }
                >
                  Ver treinos
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
