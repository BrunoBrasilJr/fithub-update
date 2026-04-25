"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import type { Matricula, Aluno, Plano } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Select, Input } from "@/components/ui/Input";
import styles from "./matriculas.module.css";

export default function MatriculasPage() {
  useAuth("ADMIN");
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalCriar, setModalCriar] = useState(false);
  const [modalDeletar, setModalDeletar] = useState<Matricula | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    alunoId: "",
    planoId: "",
    status: "ATIVA",
    dataInicio: "",
    dataFim: "",
  });

  function fetchAll() {
    Promise.all([
      api.get<Matricula[]>("/admin/matriculas"),
      api.get<Aluno[]>("/admin/alunos"),
      api.get<Plano[]>("/admin/planos"),
    ])
      .then(([m, a, p]) => {
        setMatriculas(m);
        setAlunos(a);
        setPlanos(p);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchAll();
  }, []);

  async function handleCriar() {
    setSaving(true);
    try {
      await api.post("/admin/matriculas", form);
      fetchAll();
      setModalCriar(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletar() {
    if (!modalDeletar) return;
    setSaving(true);
    try {
      await api.delete(`/admin/matriculas/${modalDeletar.id}`);
      fetchAll();
      setModalDeletar(null);
    } finally {
      setSaving(false);
    }
  }

  const statusVariant: Record<string, "ativa" | "inativa" | "pendente"> = {
    ATIVA: "ativa",
    INATIVA: "inativa",
    PENDENTE: "pendente",
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Matrículas</h1>
          <p className={styles.subtitle}>
            {matriculas.length} matrícula{matriculas.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => {
            setForm({
              alunoId: "",
              planoId: "",
              status: "ATIVA",
              dataInicio: "",
              dataFim: "",
            });
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
          Nova Matrícula
        </Button>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span className={styles.tableHeaderCell}>Aluno</span>
          <span className={styles.tableHeaderCell}>Plano</span>
          <span className={styles.tableHeaderCell}>Status</span>
          <span className={styles.tableHeaderCell}>Vigência</span>
          <span className={styles.tableHeaderCell}></span>
        </div>

        {loading ? (
          <div className={styles.empty}>Carregando...</div>
        ) : matriculas.length === 0 ? (
          <div className={styles.empty}>Nenhuma matrícula cadastrada</div>
        ) : (
          matriculas.map((m) => (
            <div key={m.id} className={styles.tableRow}>
              <div>
                <p className={styles.cellName}>{m.aluno?.nome}</p>
                <p className={styles.cellSub}>{m.aluno?.email}</p>
              </div>
              <span className={styles.cell}>{m.plano?.nome}</span>
              <Badge label={m.status} variant={statusVariant[m.status]} />
              <span className={styles.cell}>
                {new Date(m.dataInicio).toLocaleDateString("pt-BR")} —{" "}
                {new Date(m.dataFim).toLocaleDateString("pt-BR")}
              </span>
              <div className={styles.actions}>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setModalDeletar(m)}
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
          title="Nova Matrícula"
          onClose={() => setModalCriar(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalCriar(false)}>
                Cancelar
              </Button>
              <Button loading={saving} onClick={handleCriar}>
                Salvar
              </Button>
            </>
          }
        >
          <div className={styles.form}>
            <div className={styles.formRow}>
              <Select
                label="Aluno"
                value={form.alunoId}
                onChange={(e) => setForm({ ...form, alunoId: e.target.value })}
              >
                <option value="">Selecione...</option>
                {alunos.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nome}
                  </option>
                ))}
              </Select>
              <Select
                label="Plano"
                value={form.planoId}
                onChange={(e) => setForm({ ...form, planoId: e.target.value })}
              >
                <option value="">Selecione...</option>
                {planos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </Select>
            </div>
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="ATIVA">Ativa</option>
              <option value="PENDENTE">Pendente</option>
              <option value="INATIVA">Inativa</option>
            </Select>
            <div className={styles.formRow}>
              <Input
                label="Data de Início"
                type="date"
                value={form.dataInicio}
                onChange={(e) =>
                  setForm({ ...form, dataInicio: e.target.value })
                }
              />
              <Input
                label="Data de Fim"
                type="date"
                value={form.dataFim}
                onChange={(e) => setForm({ ...form, dataFim: e.target.value })}
              />
            </div>
          </div>
        </Modal>
      )}

      {modalDeletar && (
        <Modal
          title="Remover Matrícula"
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
            Tem certeza que deseja remover a matrícula de{" "}
            <span className={styles.confirmName}>
              {modalDeletar.aluno?.nome}
            </span>
            ?
          </p>
        </Modal>
      )}
    </div>
  );
}
