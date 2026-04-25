"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import type { Treino } from "@/types";
import styles from "./treino.module.css";

export default function TreinoPage() {
  const { getUser } = useAuth();
  const user = getUser();
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [selected, setSelected] = useState<Treino | null>(null);
  const [concluidos, setConcluidos] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api
      .get<Treino[]>(`/aluno/treinos?alunoId=${user.id}`)
      .then((data) => {
        setTreinos(data);
        if (data.length > 0) setSelected(data[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  function toggleExercicio(id: string) {
    setConcluidos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Meu Treino</h1>
        <p className={styles.subtitle}>Marque os exercícios conforme avança</p>
      </div>

      {loading ? (
        <div className={styles.empty}>Carregando...</div>
      ) : treinos.length === 0 ? (
        <div className={styles.empty}>Nenhum treino cadastrado ainda.</div>
      ) : (
        <>
          <div className={styles.tabs}>
            {treinos.map((t) => (
              <button
                key={t.id}
                className={`${styles.tab} ${selected?.id === t.id ? styles.active : ""}`}
                onClick={() => setSelected(t)}
              >
                {t.nome} {t.diaSemana ? `— ${t.diaSemana}` : ""}
              </button>
            ))}
          </div>

          {selected && (
            <div className={styles.treinoCard}>
              <div className={styles.treinoHeader}>
                <p className={styles.treinoNome}>{selected.nome}</p>
                {selected.descricao && (
                  <p className={styles.treinoDesc}>{selected.descricao}</p>
                )}
              </div>
              {selected.exercicios?.map((ex) => (
                <div
                  key={ex.id}
                  className={styles.exercicioItem}
                  onClick={() => toggleExercicio(ex.id)}
                >
                  <div
                    className={`${styles.exercicioCheck} ${concluidos.has(ex.id) ? styles.checked : ""}`}
                  >
                    {concluidos.has(ex.id) && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M2 5L4 7L8 3"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className={styles.exercicioInfo}>
                    <p
                      className={`${styles.exercicioNome} ${concluidos.has(ex.id) ? styles.done : ""}`}
                    >
                      {ex.nome}
                    </p>
                    <p className={styles.exercicioMeta}>
                      {ex.series}x {ex.repeticoes}
                      {ex.carga ? ` — ${ex.carga}` : ""}
                      {ex.observacao ? ` • ${ex.observacao}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
