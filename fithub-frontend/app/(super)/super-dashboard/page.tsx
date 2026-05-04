"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./super-dashboard.module.css";

interface Academia {
  id: string;
  dominio: string;
  nomeAcademia: string;
  corPrimaria: string;
  logoUrl: string;
  ativo: boolean;
}

export default function SuperDashboardPage() {
  const router = useRouter();
  const [academias, setAcademias] = useState<Academia[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Academia | null>(null);
  const [form, setForm] = useState({
    dominio: "",
    nomeAcademia: "",
    corPrimaria: "#22c55e",
    logoUrl: "",
  });
  const [salvando, setSalvando] = useState(false);
  const [error, setError] = useState("");

  function getToken() {
    return localStorage.getItem("fithub_token") || "";
  }

  async function carregar() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/super/academias", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.status === 403) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setAcademias(data);
    } catch {
      setError("Erro ao carregar academias.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirNova() {
    setEditando(null);
    setForm({
      dominio: "",
      nomeAcademia: "",
      corPrimaria: "#22c55e",
      logoUrl: "",
    });
    setShowModal(true);
  }

  function abrirEditar(academia: Academia) {
    setEditando(academia);
    setForm({
      dominio: academia.dominio,
      nomeAcademia: academia.nomeAcademia,
      corPrimaria: academia.corPrimaria,
      logoUrl: academia.logoUrl,
    });
    setShowModal(true);
  }

  async function salvar() {
    setSalvando(true);
    setError("");
    try {
      const url = editando
        ? `http://localhost:8080/super/academias/${editando.id}`
        : "http://localhost:8080/super/academias";
      const method = editando ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Erro ao salvar.");
        return;
      }
      setShowModal(false);
      carregar();
    } catch {
      setError("Erro ao salvar academia.");
    } finally {
      setSalvando(false);
    }
  }

  async function deletar(id: string) {
    if (!confirm("Tem certeza que deseja deletar esta academia?")) return;
    await fetch(`http://localhost:8080/super/academias/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    carregar();
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Academias</h1>
          <p className={styles.subtitle}>
            Gerencie todas as academias da plataforma
          </p>
        </div>
        <button className={styles.btnNova} onClick={abrirNova}>
          <svg viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3V13M3 8H13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Nova Academia
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>Carregando...</div>
      ) : (
        <div className={styles.grid}>
          {academias.map((a) => (
            <div key={a.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div
                  className={styles.colorDot}
                  style={{ background: a.corPrimaria }}
                />
                <span className={styles.dominio}>@{a.dominio}</span>
                <span
                  className={`${styles.badge} ${a.ativo ? styles.ativo : styles.inativo}`}
                >
                  {a.ativo ? "Ativa" : "Inativa"}
                </span>
              </div>
              <h3 className={styles.nomeAcademia}>{a.nomeAcademia}</h3>
              <div className={styles.cardFooter}>
                <button
                  className={styles.btnEditar}
                  onClick={() => abrirEditar(a)}
                >
                  Editar
                </button>
                <button
                  className={styles.btnDeletar}
                  onClick={() => deletar(a.id)}
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>
              {editando ? "Editar Academia" : "Nova Academia"}
            </h2>

            <div className={styles.field}>
              <label className={styles.label}>Domínio</label>
              <input
                className={styles.input}
                placeholder="ex: movimento"
                value={form.dominio}
                onChange={(e) => setForm({ ...form, dominio: e.target.value })}
                disabled={!!editando}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Nome da Academia</label>
              <input
                className={styles.input}
                placeholder="ex: Academia Movimento"
                value={form.nomeAcademia}
                onChange={(e) =>
                  setForm({ ...form, nomeAcademia: e.target.value })
                }
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Cor Primária</label>
              <div className={styles.colorRow}>
                <input
                  type="color"
                  className={styles.colorPicker}
                  value={form.corPrimaria}
                  onChange={(e) =>
                    setForm({ ...form, corPrimaria: e.target.value })
                  }
                />
                <input
                  className={styles.input}
                  value={form.corPrimaria}
                  onChange={(e) =>
                    setForm({ ...form, corPrimaria: e.target.value })
                  }
                  placeholder="#22c55e"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Logo URL</label>
              <input
                className={styles.input}
                placeholder="https://..."
                value={form.logoUrl}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.modalFooter}>
              <button
                className={styles.btnCancelar}
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className={styles.btnSalvar}
                onClick={salvar}
                disabled={salvando}
              >
                {salvando ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
