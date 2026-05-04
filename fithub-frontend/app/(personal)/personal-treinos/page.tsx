"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import styles from "./treinos.module.css";

interface Exercicio {
  id: string;
  nome: string;
  series: number;
  repeticoes: string;
  carga?: string;
  observacao?: string;
}

interface Treino {
  id: string;
  nome: string;
  descricao?: string;
  diaSemana?: string;
  alunoId: string;
  alunoNome: string;
  exercicios: Exercicio[];
}

interface Aluno {
  id: string;
  nome: string;
  email: string;
  fotoUrl?: string;
}

const DIAS = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

function PersonalTreinosContent() {
  useAuth("PERSONAL");
  const searchParams = useSearchParams();
  const alunoFiltroParam = searchParams.get("aluno");

  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalCriar, setModalCriar] = useState(false);
  const [modalEditar, setModalEditar] = useState<Treino | null>(null);
  const [modalDetalhe, setModalDetalhe] = useState<Treino | null>(null);
  const [modalDeletar, setModalDeletar] = useState<Treino | null>(null);
  const [saving, setSaving] = useState(false);
  const [busca, setBusca] = useState("");
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    diaSemana: "",
    alunoId: "",
    exercicios: [
      { nome: "", series: 3, repeticoes: "12", carga: "", observacao: "" },
    ],
  });

  function fetchTreinos() {
    api
      .get<Treino[]>("/personal/treinos")
      .then(setTreinos)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    api.get<Aluno[]>("/personal/alunos").then((a) => {
      setAlunos(a);
      if (alunoFiltroParam) {
        const aluno = a.find((al) => al.id === alunoFiltroParam);
        if (aluno) setAlunoSelecionado(aluno);
      }
    });
    fetchTreinos();
  }, []);

  const alunosFiltrados = alunos.filter(
    (a) =>
      a.nome.toLowerCase().includes(busca.toLowerCase()) ||
      a.email.toLowerCase().includes(busca.toLowerCase()),
  );

  const treinosFiltrados = alunoSelecionado
    ? treinos.filter((t) => t.alunoId === alunoSelecionado.id)
    : [];

  function addExercicio() {
    setForm((f) => ({
      ...f,
      exercicios: [
        ...f.exercicios,
        { nome: "", series: 3, repeticoes: "12", carga: "", observacao: "" },
      ],
    }));
  }

  function removeExercicio(i: number) {
    setForm((f) => ({
      ...f,
      exercicios: f.exercicios.filter((_, idx) => idx !== i),
    }));
  }

  function updateExercicio(i: number, field: string, value: string | number) {
    setForm((f) => {
      const exs = [...f.exercicios];
      exs[i] = { ...exs[i], [field]: value };
      return { ...f, exercicios: exs };
    });
  }

  function abrirCriar() {
    setForm({
      nome: "",
      descricao: "",
      diaSemana: "",
      alunoId: alunoSelecionado?.id || "",
      exercicios: [
        { nome: "", series: 3, repeticoes: "12", carga: "", observacao: "" },
      ],
    });
    setModalCriar(true);
  }

  function abrirEditar(treino: Treino) {
    setForm({
      nome: treino.nome,
      descricao: treino.descricao || "",
      diaSemana: treino.diaSemana || "",
      alunoId: treino.alunoId,
      exercicios: treino.exercicios.map((e) => ({
        nome: e.nome,
        series: e.series,
        repeticoes: e.repeticoes,
        carga: e.carga || "",
        observacao: e.observacao || "",
      })),
    });
    setModalEditar(treino);
  }

  async function handleCriar() {
    setSaving(true);
    try {
      await api.post("/personal/treinos", form);
      fetchTreinos();
      setModalCriar(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleEditar() {
    if (!modalEditar) return;
    setSaving(true);
    try {
      await api.put(`/personal/treinos/${modalEditar.id}`, form);
      fetchTreinos();
      setModalEditar(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletar() {
    if (!modalDeletar) return;
    setSaving(true);
    try {
      await api.delete(`/personal/treinos/${modalDeletar.id}`);
      fetchTreinos();
      setModalDeletar(null);
    } finally {
      setSaving(false);
    }
  }

  function AlunoAvatar({ aluno }: { aluno: Aluno }) {
    if (aluno.fotoUrl)
      return (
        <img
          src={aluno.fotoUrl}
          alt={aluno.nome}
          className={styles.buscaAvatarImg}
        />
      );
    return (
      <div className={styles.buscaAvatar}>
        {aluno.nome.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Treinos</h1>
          <p className={styles.subtitle}>
            {alunoSelecionado
              ? `Treinos de ${alunoSelecionado.nome}`
              : "Busque um aluno para ver os treinos"}
          </p>
        </div>
        {alunoSelecionado && (
          <button className={styles.novoBtn} onClick={abrirCriar}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3V13M3 8H13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Novo Treino
          </button>
        )}
      </div>

      <div className={styles.buscaSection}>
        <div className={styles.buscaWrapper}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <circle
              cx="9"
              cy="9"
              r="6"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M15 15L18 18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            className={styles.buscaInput}
            placeholder="Buscar aluno por nome ou email..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setAlunoSelecionado(null);
            }}
          />
          {(busca || alunoSelecionado) && (
            <button
              className={styles.buscaLimpar}
              onClick={() => {
                setBusca("");
                setAlunoSelecionado(null);
              }}
            >
              ✕
            </button>
          )}
        </div>

        {busca && !alunoSelecionado && (
          <div className={styles.buscaResultados}>
            {alunosFiltrados.length === 0 ? (
              <p className={styles.buscaVazio}>Nenhum aluno encontrado</p>
            ) : (
              alunosFiltrados.map((a) => (
                <button
                  key={a.id}
                  className={styles.buscaItem}
                  onClick={() => {
                    setAlunoSelecionado(a);
                    setBusca("");
                  }}
                >
                  <AlunoAvatar aluno={a} />
                  <div>
                    <p className={styles.buscaNome}>{a.nome}</p>
                    <p className={styles.buscaEmail}>{a.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {alunoSelecionado && (
          <div className={styles.alunoSelecionado}>
            <AlunoAvatar aluno={alunoSelecionado} />
            <div>
              <p className={styles.buscaNome}>{alunoSelecionado.nome}</p>
              <p className={styles.buscaEmail}>{alunoSelecionado.email}</p>
            </div>
            <button
              className={styles.trocarAluno}
              onClick={() => setAlunoSelecionado(null)}
            >
              Trocar aluno
            </button>
          </div>
        )}
      </div>

      {!alunoSelecionado ? (
        <div className={styles.estadoVazio}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle
              cx="21"
              cy="21"
              r="14"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.3"
            />
            <path
              d="M33 33L42 42"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.3"
            />
          </svg>
          <p>Busque um aluno para ver e gerenciar os treinos</p>
        </div>
      ) : loading ? (
        <p className={styles.empty}>Carregando...</p>
      ) : treinosFiltrados.length === 0 ? (
        <div className={styles.estadoVazio}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              d="M6 24H10M38 24H42M10 24C10 24 10 17 17 17C24 17 24 31 31 31C38 31 38 24 38 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.3"
            />
          </svg>
          <p>Nenhum treino criado para {alunoSelecionado.nome}</p>
          <button className={styles.novoBtn} onClick={abrirCriar}>
            Criar primeiro treino
          </button>
        </div>
      ) : (
        <div className={styles.list}>
          {treinosFiltrados.map((treino) => (
            <div key={treino.id} className={styles.card}>
              <div className={styles.cardMain}>
                <div>
                  <p className={styles.nome}>{treino.nome}</p>
                  <p className={styles.meta}>
                    {treino.diaSemana || "Sem dia"} · {treino.exercicios.length}{" "}
                    exercícios
                  </p>
                </div>
                <div className={styles.cardActions}>
                  <button
                    className={styles.btnVer}
                    onClick={() => setModalDetalhe(treino)}
                  >
                    Ver
                  </button>
                  <button
                    className={styles.btnEditar}
                    onClick={() => abrirEditar(treino)}
                  >
                    Editar
                  </button>
                  <button
                    className={styles.btnDeletar}
                    onClick={() => setModalDeletar(treino)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(modalCriar || modalEditar) && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            setModalCriar(false);
            setModalEditar(null);
          }}
        >
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <p className={styles.modalTitulo}>
                {modalCriar ? "Novo Treino" : "Editar Treino"}
              </p>
              <button
                className={styles.modalFechar}
                onClick={() => {
                  setModalCriar(false);
                  setModalEditar(null);
                }}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalForm}>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Aluno</label>
                  <select
                    className={styles.select}
                    value={form.alunoId}
                    onChange={(e) =>
                      setForm({ ...form, alunoId: e.target.value })
                    }
                  >
                    <option value="">Selecione um aluno</option>
                    {alunos.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Dia da Semana</label>
                  <select
                    className={styles.select}
                    value={form.diaSemana}
                    onChange={(e) =>
                      setForm({ ...form, diaSemana: e.target.value })
                    }
                  >
                    <option value="">Selecione</option>
                    {DIAS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Nome do Treino</label>
                <input
                  className={styles.input}
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Ex: Treino A - Peito e Tríceps"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Descrição (opcional)</label>
                <input
                  className={styles.input}
                  value={form.descricao}
                  onChange={(e) =>
                    setForm({ ...form, descricao: e.target.value })
                  }
                  placeholder="Observações gerais"
                />
              </div>
              <div className={styles.exerciciosSection}>
                <div className={styles.exerciciosHeader}>
                  <p className={styles.exerciciosTitulo}>Exercícios</p>
                  <button className={styles.addExBtn} onClick={addExercicio}>
                    + Adicionar
                  </button>
                </div>
                {form.exercicios.map((ex, i) => (
                  <div key={i} className={styles.exercicioForm}>
                    <div className={styles.exercicioFormHeader}>
                      <p className={styles.exercicioNum}>Exercício {i + 1}</p>
                      {form.exercicios.length > 1 && (
                        <button
                          className={styles.removeExBtn}
                          onClick={() => removeExercicio(i)}
                        >
                          Remover
                        </button>
                      )}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Nome</label>
                      <input
                        className={styles.input}
                        value={ex.nome}
                        onChange={(e) =>
                          updateExercicio(i, "nome", e.target.value)
                        }
                        placeholder="Ex: Supino reto"
                      />
                    </div>
                    <div className={styles.formRow3}>
                      <div className={styles.field}>
                        <label className={styles.label}>Séries</label>
                        <input
                          className={styles.input}
                          type="number"
                          value={ex.series}
                          onChange={(e) =>
                            updateExercicio(
                              i,
                              "series",
                              parseInt(e.target.value),
                            )
                          }
                          min={1}
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>Repetições</label>
                        <input
                          className={styles.input}
                          value={ex.repeticoes}
                          onChange={(e) =>
                            updateExercicio(i, "repeticoes", e.target.value)
                          }
                          placeholder="Ex: 12"
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>Carga</label>
                        <input
                          className={styles.input}
                          value={ex.carga}
                          onChange={(e) =>
                            updateExercicio(i, "carga", e.target.value)
                          }
                          placeholder="Ex: 20kg"
                        />
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Observação</label>
                      <input
                        className={styles.input}
                        value={ex.observacao}
                        onChange={(e) =>
                          updateExercicio(i, "observacao", e.target.value)
                        }
                        placeholder="Ex: Executar devagar"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setModalCriar(false);
                  setModalEditar(null);
                }}
              >
                Cancelar
              </button>
              <button
                className={styles.salvarBtn}
                onClick={modalCriar ? handleCriar : handleEditar}
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalDetalhe && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModalDetalhe(null)}
        >
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <p className={styles.modalTitulo}>{modalDetalhe.nome}</p>
              <button
                className={styles.modalFechar}
                onClick={() => setModalDetalhe(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalForm}>
              <p className={styles.detalheAluno}>
                {modalDetalhe.alunoNome} ·{" "}
                {modalDetalhe.diaSemana || "Sem dia definido"}
              </p>
              {modalDetalhe.descricao && (
                <p className={styles.detalheDesc}>{modalDetalhe.descricao}</p>
              )}
              <div className={styles.exerciciosList}>
                {modalDetalhe.exercicios.map((ex, i) => (
                  <div key={ex.id} className={styles.exercicioDetalhe}>
                    <div className={styles.exercicioNum2}>{i + 1}</div>
                    <div>
                      <p className={styles.exercicioNome}>{ex.nome}</p>
                      <p className={styles.exercicioMeta}>
                        {ex.series}x {ex.repeticoes}
                        {ex.carga ? ` · ${ex.carga}` : ""}
                        {ex.observacao ? ` · ${ex.observacao}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setModalDetalhe(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalDeletar && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModalDeletar(null)}
        >
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <p className={styles.modalTitulo}>Remover Treino</p>
              <button
                className={styles.modalFechar}
                onClick={() => setModalDeletar(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalForm}>
              <p className={styles.confirmText}>
                Tem certeza que deseja remover o treino{" "}
                <strong>{modalDeletar.nome}</strong>?
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setModalDeletar(null)}
              >
                Cancelar
              </button>
              <button
                className={styles.deletarBtn}
                onClick={handleDeletar}
                disabled={saving}
              >
                {saving ? "Removendo..." : "Remover"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PersonalTreinosPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "2rem", color: "var(--text-muted)" }}>
          Carregando...
        </div>
      }
    >
      <PersonalTreinosContent />
    </Suspense>
  );
}
