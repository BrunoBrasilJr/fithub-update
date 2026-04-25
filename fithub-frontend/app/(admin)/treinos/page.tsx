"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import type { Treino, Aluno } from "@/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import styles from "./treinos.module.css";

interface ExercicioForm {
  nome: string;
  series: string;
  repeticoes: string;
  carga: string;
  observacao: string;
}

export default function TreinosPage() {
  useAuth("ADMIN");
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalCriar, setModalCriar] = useState(false);
  const [modalDeletar, setModalDeletar] = useState<Treino | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    diaSemana: "",
    alunoId: "",
  });
  const [exercicios, setExercicios] = useState<ExercicioForm[]>([
    { nome: "", series: "", repeticoes: "", carga: "", observacao: "" },
  ]);

  function fetchAll() {
    Promise.all([
      api.get<Treino[]>("/admin/treinos"),
      api.get<Aluno[]>("/admin/alunos"),
    ])
      .then(([t, a]) => {
        setTreinos(t);
        setAlunos(a);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchAll();
  }, []);

  function addExercicio() {
    setExercicios([
      ...exercicios,
      { nome: "", series: "", repeticoes: "", carga: "", observacao: "" },
    ]);
  }

  function updateExercicio(index: number, field: string, value: string) {
    const updated = [...exercicios];
    updated[index] = { ...updated[index], [field]: value };
    setExercicios(updated);
  }

  function removeExercicio(index: number) {
    setExercicios(exercicios.filter((_, i) => i !== index));
  }

  async function handleCriar() {
    setSaving(true);
    try {
      await api.post("/admin/treinos", {
        ...form,
        exercicios: exercicios.map((e) => ({
          ...e,
          series: parseInt(e.series) || 0,
        })),
      });
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
      await api.delete(`/admin/treinos/${modalDeletar.id}`);
      fetchAll();
      setModalDeletar(null);
    } finally {
      setSaving(false);
    }
  }

  const diasSemana = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Treinos</h1>
          <p className={styles.subtitle}>
            {treinos.length} treino{treinos.length !== 1 ? "s" : ""} cadastrado
            {treinos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => {
            setForm({ nome: "", descricao: "", diaSemana: "", alunoId: "" });
            setExercicios([
              {
                nome: "",
                series: "",
                repeticoes: "",
                carga: "",
                observacao: "",
              },
            ]);
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
          Novo Treino
        </Button>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span className={styles.tableHeaderCell}>Treino</span>
          <span className={styles.tableHeaderCell}>Aluno</span>
          <span className={styles.tableHeaderCell}>Dia</span>
          <span className={styles.tableHeaderCell}></span>
        </div>

        {loading ? (
          <div className={styles.empty}>Carregando...</div>
        ) : treinos.length === 0 ? (
          <div className={styles.empty}>Nenhum treino cadastrado</div>
        ) : (
          treinos.map((treino) => (
            <div key={treino.id} className={styles.tableRow}>
              <div>
                <p className={styles.cellName}>{treino.nome}</p>
                <p className={styles.cellSub}>
                  {treino.exercicios?.length || 0} exercício
                  {(treino.exercicios?.length || 0) !== 1 ? "s" : ""}
                </p>
              </div>
              <span className={styles.cell}>{treino.alunoNome}</span>
              <span className={styles.cell}>{treino.diaSemana || "—"}</span>
              <div className={styles.actions}>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setModalDeletar(treino)}
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
          title="Novo Treino"
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
              <Input
                label="Nome do Treino"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Treino A"
              />
              <Select
                label="Dia da Semana"
                value={form.diaSemana}
                onChange={(e) =>
                  setForm({ ...form, diaSemana: e.target.value })
                }
              >
                <option value="">Selecione...</option>
                {diasSemana.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </div>
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
            <Input
              label="Descrição"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Descrição do treino"
            />

            <div className={styles.exerciciosSection}>
              <p className={styles.exerciciosTitle}>Exercícios</p>
              {exercicios.map((ex, i) => (
                <div key={i} className={styles.exercicioItem}>
                  <div className={styles.formRow}>
                    <Input
                      label="Nome"
                      value={ex.nome}
                      onChange={(e) =>
                        updateExercicio(i, "nome", e.target.value)
                      }
                      placeholder="Ex: Supino"
                    />
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.5rem",
                      }}
                    >
                      <Input
                        label="Séries"
                        type="number"
                        value={ex.series}
                        onChange={(e) =>
                          updateExercicio(i, "series", e.target.value)
                        }
                        placeholder="3"
                      />
                      <Input
                        label="Reps"
                        value={ex.repeticoes}
                        onChange={(e) =>
                          updateExercicio(i, "repeticoes", e.target.value)
                        }
                        placeholder="12"
                      />
                    </div>
                  </div>
                  <div
                    className={styles.formRow}
                    style={{ marginTop: "0.5rem" }}
                  >
                    <Input
                      label="Carga"
                      value={ex.carga}
                      onChange={(e) =>
                        updateExercicio(i, "carga", e.target.value)
                      }
                      placeholder="Ex: 20kg"
                    />
                    <Input
                      label="Observação"
                      value={ex.observacao}
                      onChange={(e) =>
                        updateExercicio(i, "observacao", e.target.value)
                      }
                      placeholder="Opcional"
                    />
                  </div>
                  {exercicios.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExercicio(i)}
                      style={{ marginTop: "0.5rem" }}
                    >
                      Remover
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="secondary"
                size="sm"
                onClick={addExercicio}
                className={styles.addExercicio}
              >
                + Adicionar Exercício
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {modalDeletar && (
        <Modal
          title="Remover Treino"
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
            Tem certeza que deseja remover o treino{" "}
            <span className={styles.confirmName}>{modalDeletar.nome}</span>?
          </p>
        </Modal>
      )}
    </div>
  );
}
