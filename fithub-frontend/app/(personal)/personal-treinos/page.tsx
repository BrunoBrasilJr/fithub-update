"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import styles from "./treinos.module.css";

interface TreinoResumo {
  id: number;
  nome: string;
  diaSemana?: string;
  aluno?: { nome: string };
  exercicios?: unknown[];
}

export default function PersonalTreinosPage() {
  useAuth("PERSONAL");
  const [treinos, setTreinos] = useState<TreinoResumo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<TreinoResumo[]>("/personal/treinos")
      .then(setTreinos)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Treinos</h1>
        <p className={styles.subtitle}>
          Treinos que você criou para seus alunos
        </p>
      </div>

      {loading ? (
        <p className={styles.empty}>Carregando...</p>
      ) : treinos.length === 0 ? (
        <p className={styles.empty}>Nenhum treino criado ainda.</p>
      ) : (
        <div className={styles.list}>
          {treinos.map((treino) => (
            <div key={treino.id} className={styles.card}>
              <div>
                <p className={styles.nome}>{treino.nome}</p>
                <p className={styles.meta}>
                  {treino.aluno?.nome && <span>{treino.aluno.nome} · </span>}
                  {treino.diaSemana || "Sem dia definido"}
                </p>
              </div>
              <p className={styles.count}>
                {treino.exercicios?.length || 0} exercícios
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
