"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import styles from "./perfil.module.css";

interface Aluno {
  id: string;
  nome: string;
}

interface Treino {
  id: string;
  nome: string;
  alunoNome: string;
  createdAt: string;
}

export default function PersonalPerfilPage() {
  const { getUser } = useAuth("PERSONAL");
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("fithub_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setNome(user.nome || "");
      setEmail(user.email || "");
    }

    Promise.all([
      api
        .get<{
          fotoUrl: string;
          telefone?: string;
          dataNascimento?: string;
        }>("/personal/perfil")
        .catch(() => ({ fotoUrl: "", telefone: "", dataNascimento: "" })),
      api.get<Aluno[]>("/personal/alunos").catch(() => []),
      api.get<Treino[]>("/personal/treinos").catch(() => []),
    ])
      .then(([perfil, a, t]) => {
        setFotoUrl(perfil.fotoUrl || "");
        setTelefone(perfil.telefone || "");
        setDataNascimento(perfil.dataNascimento || "");
        setAlunos(a);
        setTreinos(t);
      })
      .finally(() => setLoading(false));
  }, []);

  function calcularIdade(data: string) {
    if (!data) return null;
    const hoje = new Date();
    const nasc = new Date(data);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade;
  }

  const ultimoTreino = treinos[0] || null;

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
        <p className={styles.subtitle}>
          Suas informações como personal trainer
        </p>
      </div>

      <div className={styles.card}>
        <div className={styles.perfilTopo}>
          <div className={styles.avatarWrapper}>
            {fotoUrl ? (
              <img src={fotoUrl} alt="Foto" className={styles.avatarImg} />
            ) : (
              <div className={styles.avatar}>
                {nome?.charAt(0).toUpperCase() || "P"}
              </div>
            )}
          </div>
          <div>
            <p className={styles.name}>{nome}</p>
            <p className={styles.email}>{email}</p>
            <span className={styles.badge}>Personal Trainer</span>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statValue}>{alunos.length}</p>
            <p className={styles.statLabel}>Alunos</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statValue}>{treinos.length}</p>
            <p className={styles.statLabel}>Treinos criados</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statValue}>
              {new Set(treinos.map((t) => t.alunoNome)).size}
            </p>
            <p className={styles.statLabel}>Alunos com treino</p>
          </div>
        </div>

        <p className={styles.secao}>Informações Pessoais</p>

        {telefone && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Telefone</span>
            <span className={styles.infoValue}>{telefone}</span>
          </div>
        )}

        {dataNascimento && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Data de Nascimento</span>
            <span className={styles.infoValue}>
              {new Date(dataNascimento).toLocaleDateString("pt-BR")} ·{" "}
              {calcularIdade(dataNascimento)} anos
            </span>
          </div>
        )}

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Função</span>
          <span className={styles.infoValue}>Personal Trainer</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Status</span>
          <span className={styles.infoValueGreen}>Ativo</span>
        </div>

        {ultimoTreino && (
          <>
            <p className={styles.secao}>Último Treino Criado</p>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>{ultimoTreino.nome}</span>
              <span className={styles.infoValue}>{ultimoTreino.alunoNome}</span>
            </div>
          </>
        )}

        <div className={styles.actions}>
          <button
            className={styles.trocarSenhaBtn}
            onClick={() => router.push("/trocar-senha")}
          >
            Trocar Senha
          </button>
        </div>
      </div>
    </div>
  );
}
