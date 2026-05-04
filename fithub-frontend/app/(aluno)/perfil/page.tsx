"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import type { Matricula, Treino } from "@/types";
import styles from "./perfil.module.css";

interface AlunoInfo {
  nome: string;
  email: string;
  telefone?: string;
  dataNascimento?: string;
  fotoUrl?: string;
}

interface HistoricoTreino {
  id: string;
  treinoNome: string;
  concluidoEm: string;
}

export default function PerfilPage() {
  const { getUser } = useAuth();
  const router = useRouter();
  const [alunoInfo, setAlunoInfo] = useState<AlunoInfo | null>(null);
  const [matricula, setMatricula] = useState<Matricula | null>(null);
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [ultimoTreino, setUltimoTreino] = useState<HistoricoTreino | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!user) return;

    Promise.all([
      api
        .get<{
          fotoUrl: string;
          telefone?: string;
          dataNascimento?: string;
        }>("/user/foto")
        .catch(() => ({ fotoUrl: "", telefone: "", dataNascimento: "" })),
      api.get<Matricula[]>("/aluno/matriculas").catch(() => []),
      api.get<Treino[]>("/aluno/treinos").catch(() => []),
      api.get<HistoricoTreino[]>("/aluno/historico").catch(() => []),
    ])
      .then(([userInfo, matriculas, t, historico]) => {
        setAlunoInfo({
          nome: user.nome,
          email: user.email,
          fotoUrl: userInfo.fotoUrl,
          telefone: userInfo.telefone,
          dataNascimento: userInfo.dataNascimento,
        });
        const ativa =
          matriculas.find((m) => m.status === "ATIVA") || matriculas[0] || null;
        setMatricula(ativa);
        setTreinos(t);
        setUltimoTreino(historico[0] || null);
      })
      .finally(() => setLoading(false));
  }, []);

  function formatarData(iso: string) {
    return new Date(iso).toLocaleDateString("pt-BR");
  }

  function calcularIdade(dataNascimento: string) {
    const hoje = new Date();
    const nasc = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade;
  }

  function diasParaVencer(dataFim: string) {
    const hoje = new Date();
    const fim = new Date(dataFim);
    return Math.ceil((fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  }

  const diasRestantes = matricula ? diasParaVencer(matricula.dataFim) : null;

  if (loading)
    return (
      <div className={styles.page}>
        <p style={{ color: "var(--text-muted)" }}>Carregando...</p>
      </div>
    );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Meu Perfil</h1>
        <p className={styles.subtitle}>Suas informações pessoais</p>
      </div>

      <div className={styles.card}>
        <div className={styles.perfilTopo}>
          <div className={styles.avatarWrapper}>
            {alunoInfo?.fotoUrl ? (
              <img
                src={alunoInfo.fotoUrl}
                alt="Foto de perfil"
                className={styles.avatarImg}
              />
            ) : (
              <div className={styles.avatar}>
                {alunoInfo?.nome?.charAt(0).toUpperCase() || "A"}
              </div>
            )}
          </div>
          <div>
            <p className={styles.name}>{alunoInfo?.nome}</p>
            <p className={styles.email}>{alunoInfo?.email}</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statValue}>{treinos.length}</p>
            <p className={styles.statLabel}>Treinos</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statValue}>
              {diasRestantes !== null && diasRestantes >= 0
                ? `${diasRestantes}d`
                : "—"}
            </p>
            <p className={styles.statLabel}>Dias restantes</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statValue}>{matricula?.plano?.nome || "—"}</p>
            <p className={styles.statLabel}>Plano</p>
          </div>
        </div>

        <p className={styles.secao}>Informações Pessoais</p>

        {alunoInfo?.telefone && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Telefone</span>
            <span className={styles.infoValue}>{alunoInfo.telefone}</span>
          </div>
        )}

        {alunoInfo?.dataNascimento && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Data de Nascimento</span>
            <span className={styles.infoValue}>
              {formatarData(alunoInfo.dataNascimento)} ·{" "}
              {calcularIdade(alunoInfo.dataNascimento)} anos
            </span>
          </div>
        )}

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Perfil</span>
          <span className={styles.infoValue}>Aluno</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Status</span>
          <span className={styles.infoValueGreen}>Ativo</span>
        </div>

        <p className={styles.secao}>Matrícula</p>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Plano</span>
          <span className={styles.infoValue}>
            {matricula?.plano?.nome || "—"}
          </span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Início</span>
          <span className={styles.infoValue}>
            {matricula ? formatarData(matricula.dataInicio) : "—"}
          </span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Vencimento</span>
          <span
            className={`${styles.infoValue} ${diasRestantes !== null && diasRestantes <= 7 ? styles.infoValueRed : diasRestantes !== null && diasRestantes <= 30 ? styles.infoValueWarning : ""}`}
          >
            {matricula ? formatarData(matricula.dataFim) : "—"}
          </span>
        </div>

        {ultimoTreino && (
          <>
            <p className={styles.secao}>Último Treino</p>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>
                {ultimoTreino.treinoNome}
              </span>
              <span className={styles.infoValue}>
                {formatarData(ultimoTreino.concluidoEm)}
              </span>
            </div>
          </>
        )}

        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={() => router.push("/trocar-senha")}
          >
            Trocar Senha
          </Button>
        </div>
      </div>
    </div>
  );
}
