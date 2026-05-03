"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import type { Aluno } from "@/types";
import styles from "./aniversariantes.module.css";

export default function AniversariantesPage() {
  useAuth("ADMIN");
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Aluno[]>("/admin/dashboard/aniversariantes")
      .then(setAlunos)
      .finally(() => setLoading(false));
  }, []);

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const mesAtual = meses[new Date().getMonth()];

  function formatarData(data: string) {
    const [, mes, dia] = data.split("-");
    return `${dia}/${mes}`;
  }

  function isHoje(data: string) {
    const hoje = new Date();
    const [, mes, dia] = data.split("-");
    return (
      parseInt(dia) === hoje.getDate() && parseInt(mes) === hoje.getMonth() + 1
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Aniversariantes</h1>
          <p className={styles.subtitle}>
            Alunos que fazem aniversário em {mesAtual}
          </p>
        </div>
        <div className={styles.badge}>
          🎂 {alunos.length} aniversariante{alunos.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className={styles.grid}>
        {loading ? (
          <div className={styles.empty}>Carregando...</div>
        ) : alunos.length === 0 ? (
          <div className={styles.empty}>
            <svg className={styles.emptyIcon} viewBox="0 0 48 48" fill="none">
              <path
                d="M24 8C24 8 20 12 20 16C20 18.2091 21.7909 20 24 20C26.2091 20 28 18.2091 28 16C28 12 24 8 24 8Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <rect
                x="8"
                y="24"
                width="32"
                height="16"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M8 28H40" stroke="currentColor" strokeWidth="2" />
            </svg>
            <p>Nenhum aniversariante em {mesAtual}</p>
          </div>
        ) : (
          alunos.map((aluno) => (
            <div
              key={aluno.id}
              className={`${styles.card} ${aluno.dataNascimento && isHoje(aluno.dataNascimento) ? styles.hoje : ""}`}
            >
              <div className={styles.avatar}>
                {aluno.nome.charAt(0).toUpperCase()}
              </div>
              <div className={styles.info}>
                <p className={styles.nome}>{aluno.nome}</p>
                <p className={styles.email}>{aluno.email}</p>
                {aluno.telefone && (
                  <p className={styles.telefone}>{aluno.telefone}</p>
                )}
              </div>
              <div className={styles.data}>
                <p className={styles.dia}>
                  {aluno.dataNascimento
                    ? formatarData(aluno.dataNascimento)
                    : "—"}
                </p>
                {aluno.dataNascimento && isHoje(aluno.dataNascimento) && (
                  <span className={styles.hojeTag}>Hoje! 🎉</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
