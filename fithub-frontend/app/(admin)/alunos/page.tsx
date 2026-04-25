"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import type { Aluno } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import styles from "./alunos.module.css";

export default function AlunosPage() {
  useAuth("ADMIN");
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalCriar, setModalCriar] = useState(false);
  const [modalDeletar, setModalDeletar] = useState<Aluno | null>(null);
  const [modalEditar, setModalEditar] = useState<Aluno | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    dataNascimento: "",
  });

  function fetchAlunos() {
    api
      .get<Aluno[]>("/admin/alunos")
      .then(setAlunos)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchAlunos();
  }, []);

  function openEditar(aluno: Aluno) {
    setForm({
      nome: aluno.nome,
      email: aluno.email,
      telefone: aluno.telefone || "",
      dataNascimento: aluno.dataNascimento || "",
    });
    setModalEditar(aluno);
  }

  function openCriar() {
    setForm({ nome: "", email: "", telefone: "", dataNascimento: "" });
    setModalCriar(true);
  }

  async function handleCriar() {
    setSaving(true);
    try {
      await api.post("/admin/alunos", form);
      fetchAlunos();
      setModalCriar(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleEditar() {
    if (!modalEditar) return;
    setSaving(true);
    try {
      await api.put(`/admin/alunos/${modalEditar.id}`, {
        ...form,
        ativo: true,
      });
      fetchAlunos();
      setModalEditar(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletar() {
    if (!modalDeletar) return;
    setSaving(true);
    try {
      await api.delete(`/admin/alunos/${modalDeletar.id}`);
      fetchAlunos();
      setModalDeletar(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Alunos</h1>
          <p className={styles.subtitle}>
            {alunos.length} aluno{alunos.length !== 1 ? "s" : ""} cadastrado
            {alunos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={openCriar}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3V13M3 8H13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Novo Aluno
        </Button>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span className={styles.tableHeaderCell}>Aluno</span>
          <span className={styles.tableHeaderCell}>Telefone</span>
          <span className={styles.tableHeaderCell}>Status</span>
          <span className={styles.tableHeaderCell}>Cadastro</span>
          <span className={styles.tableHeaderCell}></span>
        </div>

        {loading ? (
          <div className={styles.empty}>Carregando...</div>
        ) : alunos.length === 0 ? (
          <div className={styles.empty}>
            <svg className={styles.emptyIcon} viewBox="0 0 48 48" fill="none">
              <circle
                cx="20"
                cy="16"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M4 40C4 32.268 11.163 26 20 26"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M32 30V42M26 36H38"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <p>Nenhum aluno cadastrado</p>
          </div>
        ) : (
          alunos.map((aluno) => (
            <div key={aluno.id} className={styles.tableRow}>
              <div>
                <p className={styles.cellName}>{aluno.nome}</p>
                <p className={styles.cellSub}>{aluno.email}</p>
              </div>
              <span className={styles.cell}>{aluno.telefone || "—"}</span>
              <Badge
                label={aluno.ativo ? "Ativo" : "Inativo"}
                variant={aluno.ativo ? "ativa" : "inativa"}
              />
              <span className={styles.cell}>
                {new Date(aluno.createdAt).toLocaleDateString("pt-BR")}
              </span>
              <div className={styles.actions}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openEditar(aluno)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setModalDeletar(aluno)}
                >
                  Remover
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {(modalCriar || modalEditar) && (
        <Modal
          title={modalCriar ? "Novo Aluno" : "Editar Aluno"}
          onClose={() => {
            setModalCriar(false);
            setModalEditar(null);
          }}
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setModalCriar(false);
                  setModalEditar(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                loading={saving}
                onClick={modalCriar ? handleCriar : handleEditar}
              >
                Salvar
              </Button>
            </>
          }
        >
          <div className={styles.form}>
            <div className={styles.formRow}>
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
                disabled={!!modalEditar}
              />
            </div>
            <div className={styles.formRow}>
              <Input
                label="Telefone"
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
              <Input
                label="Data de Nascimento"
                type="date"
                value={form.dataNascimento}
                onChange={(e) =>
                  setForm({ ...form, dataNascimento: e.target.value })
                }
              />
            </div>
          </div>
        </Modal>
      )}

      {modalDeletar && (
        <Modal
          title="Remover Aluno"
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
            Tem certeza que deseja remover o aluno{" "}
            <span className={styles.confirmName}>{modalDeletar.nome}</span>?
            Esta ação não pode ser desfeita.
          </p>
        </Modal>
      )}
    </div>
  );
}
