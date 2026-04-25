"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import type { DashboardMetrics } from "@/types";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  useAuth("ADMIN");
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<DashboardMetrics>("/admin/dashboard")
      .then(setMetrics)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Total de Alunos",
      value: metrics?.totalAlunos ?? 0,
      icon: (
        <svg viewBox="0 0 20 20" fill="none">
          <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M2 17C2 14.2386 4.68629 12 8 12C11.3137 12 14 14.2386 14 17"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M15 8V14M12 11H18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      label: "Alunos Ativos",
      value: metrics?.alunosAtivos ?? 0,
      icon: (
        <svg viewBox="0 0 20 20" fill="none">
          <circle
            cx="10"
            cy="10"
            r="7"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M7 10L9 12L13 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: "Alunos Inativos",
      value: metrics?.alunosInativos ?? 0,
      icon: (
        <svg viewBox="0 0 20 20" fill="none">
          <circle
            cx="10"
            cy="10"
            r="7"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8 8L12 12M12 8L8 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      label: "Planos Cadastrados",
      value: metrics?.totalPlanos ?? 0,
      icon: (
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
      ),
    },
    {
      label: "Matrículas Ativas",
      value: metrics?.matriculasAtivas ?? 0,
      icon: (
        <svg viewBox="0 0 20 20" fill="none">
          <path
            d="M6 2V5M14 2V5M3 8H17M4 4H16C16.5523 4 17 4.44772 17 5V17C17 17.5523 16.5523 18 16 18H4C3.44772 18 3 17.5523 3 17V5C3 4.44772 3.44772 4 4 4Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      label: "Receita Mensal",
      value: metrics
        ? `R$ ${Number(metrics.receitaMensal).toFixed(2)}`
        : "R$ 0,00",
      icon: (
        <svg viewBox="0 0 20 20" fill="none">
          <path
            d="M10 3V17M7 6H11.5C12.3284 6 13 6.67157 13 7.5C13 8.32843 12.3284 9 11.5 9H8.5C7.67157 9 7 9.67157 7 10.5C7 11.3284 7.67157 12 8.5 12H13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Visão geral da academia</p>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => (
          <div key={card.label} className={styles.card}>
            <div className={styles.cardIcon}>{card.icon}</div>
            {loading ? (
              <>
                <div className={`${styles.skeleton} ${styles.skeletonValue}`} />
                <div className={`${styles.skeleton} ${styles.skeletonLabel}`} />
              </>
            ) : (
              <>
                <p className={styles.cardValue}>{card.value}</p>
                <p className={styles.cardLabel}>{card.label}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
