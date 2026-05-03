"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import styles from "./funcionarios.module.css";

interface Funcionario {
  id: string;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
  createdAt: string;
}

export default function FuncionariosPage() {
  useAuth("ADMIN");
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalCriar, setModalCriar] = useState(false);
  const [modalDeletar, setModalDeletar] = useState<Funcionario | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", role: "PERSONAL" });

  function fetchFuncionarios() {
    api
      .get<Funcionario[]>("/admin/funcionarios")
      .then(setFuncionarios)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  async function handleCriar() {
    setSaving(true);
    try {
      await api.post("/admin/funcionarios", form);
      fetchFuncionarios();
      setModalCriar(false);
      setForm({ nome: "", email: "", role: "PERSONAL" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletar() {
    if (!modalDeletar) return;
    setSaving(true);
    try {
      await api.delete(`/admin/funcionarios/${modalDeletar.id}`);
      fetchFuncionarios();
      setModalDeletar(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Funcionários</h1>
          <p className={styles.subtitle}>
            {funcionarios.length} funcionário
            {funcionarios.length !== 1 ? "s" : ""} cadastrado
            {funcionarios.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => {
            setForm({ nome: "", email: "", role: "PERSONAL" });
            setModalCriar(true);
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3V13M3 8H13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Novo Funcionário
        </Button>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span className={styles.tableHeaderCell}>Funcionário</span>
          <span className={styles.tableHeaderCell}>Função</span>
          <span className={styles.tableHeaderCell}>Cadastro</span>
          <span className={styles.tableHeaderCell}></span>
        </div>

        {loading ? (
          <div className={styles.empty}>Carregando...</div>
        ) : funcionarios.length === 0 ? (
          <div className={styles.empty}>Nenhum funcionário cadastrado</div>
        ) : (
          funcionarios.map((f) => (
            <div key={f.id} className={styles.tableRow}>
              <div>
                <p className={styles.cellName}>{f.nome}</p>
                <p className={styles.cellSub}>{f.email}</p>
              </div>
              <Badge
                label={f.role === "PERSONAL" ? "Personal" : f.role}
                variant="aluno"
              />
              <span className={styles.cell}>
                {new Date(f.createdAt).toLocaleDateString("pt-BR")}
              </span>
              <div className={styles.actions}>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setModalDeletar(f)}
                >
                  Remover
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {modalCriar && (
        <Modal
          title="Novo Funcionário"
          onClose={() => setModalCriar(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalCriar(false)}>
                Cancelar
              </Button>
              <Button loading={saving} onClick={handleCriar}>
                Cadastrar
              </Button>
            </>
          }
        >
          <div className={styles.form}>
            <Input
              label="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Nome completo"
            />
            <Input
              label="E-mail"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@exemplo.com"
            />
            <div className={styles.senhaInfo}>
              A senha padrão será <strong>personal123</strong>. O funcionário
              deverá alterá-la no primeiro acesso.
            </div>
          </div>
        </Modal>
      )}

      {modalDeletar && (
        <Modal
          title="Remover Funcionário"
          onClose={() => setModalDeletar(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalDeletar(null)}>
                Cancelar
              </Button>
              <Button variant="danger" loading={saving} onClick={handleDeletar}>
                Remover
              </Button>
            </>
          }
        >
          <p className={styles.confirmText}>
            Tem certeza que deseja remover o funcionário{" "}
            <span className={styles.confirmName}>{modalDeletar.nome}</span>?
          </p>
        </Modal>
      )}
    </div>
  );
}
