"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import type { Treino, Exercicio } from "@/types";
import styles from "./treino.module.css";
import jsPDF from "jspdf";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RegistroCarga {
  id: string;
  carga: string;
  registradoEm: string;
}

interface CargaInfo {
  valor: string;
  ultima: string;
}

export default function TreinoPage() {
  useAuth();
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [selected, setSelected] = useState<Treino | null>(null);
  const [concluidos, setConcluidos] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [concluindo, setConcluindo] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [jaFeito, setJaFeito] = useState(false);
  const [checkando, setCheckando] = useState(false);
  const [modalCarga, setModalCarga] = useState(false);
  const [cargas, setCargas] = useState<Record<string, CargaInfo>>({});
  const [loadingCargas, setLoadingCargas] = useState(false);
  const [evolucaoEx, setEvolucaoEx] = useState<Exercicio | null>(null);
  const [evolucaoData, setEvolucaoData] = useState<RegistroCarga[]>([]);
  const [loadingEvolucao, setLoadingEvolucao] = useState(false);
  const [nomeAluno, setNomeAluno] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("fithub_user");
    if (userStr) setNomeAluno(JSON.parse(userStr).nome || "");

    api
      .get<Treino[]>("/aluno/treinos")
      .then((data) => {
        setTreinos(data);
        if (data.length > 0) {
          setSelected(data[0]);
          verificarConcluido(data[0].id);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function verificarConcluido(treinoId: string) {
    setCheckando(true);
    try {
      const res = await api.get<{ concluido: boolean }>(
        `/aluno/treinos/${treinoId}/concluido-semana`,
      );
      setJaFeito(res.concluido);
    } catch {
      setJaFeito(false);
    } finally {
      setCheckando(false);
    }
  }

  function toggleExercicio(id: string) {
    if (jaFeito) return;
    setConcluidos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSelecionarTreino(t: Treino) {
    setSelected(t);
    setConcluidos(new Set());
    setCargas({});
    setSucesso(false);
    await verificarConcluido(t.id);
  }

  async function abrirModalCarga() {
    if (!selected) return;
    setLoadingCargas(true);
    setModalCarga(true);

    const infos: Record<string, CargaInfo> = {};
    await Promise.all(
      selected.exercicios.map(async (ex) => {
        try {
          const res = await api.get<{ carga: string }>(
            `/aluno/exercicios/${ex.id}/ultima-carga`,
          );
          infos[ex.id] = { valor: "", ultima: res.carga };
        } catch {
          infos[ex.id] = { valor: "", ultima: "" };
        }
      }),
    );
    setCargas(infos);
    setLoadingCargas(false);
  }

  function handleCargaChange(exId: string, raw: string) {
    const numeros = raw.replace(/\D/g, "");
    const mascarado = numeros ? `${numeros}kg` : "";
    setCargas((prev) => ({
      ...prev,
      [exId]: { ...prev[exId], valor: mascarado },
    }));
  }

  function getComparacao(
    exId: string,
  ): "progresso" | "regresso" | "igual" | null {
    const info = cargas[exId];
    if (!info?.valor || !info?.ultima) return null;
    const atual = parseFloat(info.valor);
    const ultima = parseFloat(info.ultima);
    if (isNaN(atual) || isNaN(ultima)) return null;
    if (atual > ultima) return "progresso";
    if (atual < ultima) return "regresso";
    return "igual";
  }

  async function handleConfirmarCarga() {
    if (!selected) return;
    setConcluindo(true);
    try {
      await Promise.all(
        selected.exercicios
          .filter((ex) => cargas[ex.id]?.valor?.trim())
          .map((ex) =>
            api.post(`/aluno/exercicios/${ex.id}/carga`, {
              carga: cargas[ex.id].valor,
            }),
          ),
      );
      await api.post(`/aluno/treinos/${selected.id}/concluir`, {});
      setModalCarga(false);
      setSucesso(true);
      setJaFeito(true);
      setConcluidos(new Set());
    } finally {
      setConcluindo(false);
    }
  }

  async function abrirEvolucao(ex: Exercicio, e: React.MouseEvent) {
    e.stopPropagation();
    setEvolucaoEx(ex);
    setLoadingEvolucao(true);
    try {
      const data = await api.get<RegistroCarga[]>(
        `/aluno/exercicios/${ex.id}/evolucao`,
      );
      setEvolucaoData(data);
    } finally {
      setLoadingEvolucao(false);
    }
  }

  async function gerarPDF() {
    if (!selected) return;

    const config = await api
      .get<{
        nomeAcademia: string;
        corPrimaria: string;
        logoUrl: string;
      }>("/public/configuracao")
      .catch(() => ({
        nomeAcademia: "FitHub",
        corPrimaria: "#16a34a",
        logoUrl: "",
      }));

    const cor = config.corPrimaria || "#16a34a";
    const r = parseInt(cor.slice(1, 3), 16);
    const g = parseInt(cor.slice(3, 5), 16);
    const b = parseInt(cor.slice(5, 7), 16);

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(r, g, b);
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setTextColor(255, 255, 255);

    if (config.logoUrl) {
      try {
        doc.addImage(config.logoUrl, "JPEG", 15, 8, 24, 24);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text(config.nomeAcademia, 44, 18);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text("Ficha de Treino", 44, 28);
      } catch {
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text(config.nomeAcademia, 20, 18);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text("Ficha de Treino", 20, 28);
      }
    } else {
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text(config.nomeAcademia, 20, 18);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Ficha de Treino", 20, 28);
    }

    doc.text(new Date().toLocaleDateString("pt-BR"), pageWidth - 20, 28, {
      align: "right",
    });
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(nomeAluno, 20, 55);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(
      `${selected.nome}${selected.diaSemana ? ` — ${selected.diaSemana}` : ""}`,
      20,
      63,
    );
    if (selected.descricao) doc.text(selected.descricao, 20, 70);

    doc.setDrawColor(220, 220, 220);
    doc.line(20, 75, pageWidth - 20, 75);

    let y = 85;
    doc.setFillColor(245, 245, 245);
    doc.rect(20, y - 6, pageWidth - 40, 10, "F");
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("EXERCÍCIO", 24, y);
    doc.text("SÉRIES", 110, y);
    doc.text("REPETIÇÕES", 135, y);
    doc.text("CARGA", 170, y);

    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    selected.exercicios.forEach((ex, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(252, 252, 252);
        doc.rect(20, y - 5, pageWidth - 40, 12, "F");
      }
      doc.setTextColor(30, 30, 30);
      doc.text(ex.nome, 24, y + 2);
      doc.setTextColor(80, 80, 80);
      doc.text(String(ex.series), 114, y + 2);
      doc.text(ex.repeticoes, 138, y + 2);
      doc.text(ex.carga || "—", 173, y + 2);

      if (ex.observacao) {
        y += 10;
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(8);
        doc.text(`  Obs: ${ex.observacao}`, 24, y + 2);
        doc.setFontSize(10);
      }

      doc.setDrawColor(235, 235, 235);
      doc.line(20, y + 7, pageWidth - 20, y + 7);
      y += 14;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.setTextColor(180, 180, 180);
    doc.setFontSize(8);
    doc.text(`Gerado por ${config.nomeAcademia}`, pageWidth / 2, 285, {
      align: "center",
    });
    doc.save(`treino-${selected.nome.toLowerCase().replace(/\s/g, "-")}.pdf`);
  }

  const totalExercicios = selected?.exercicios?.length || 0;
  const totalConcluidos =
    selected?.exercicios?.filter((ex) => concluidos.has(ex.id)).length || 0;
  const todosFeitos =
    totalExercicios > 0 && totalConcluidos === totalExercicios;

  const chartData = evolucaoData.map((r) => ({
    data: new Date(r.registradoEm).toLocaleDateString("pt-BR"),
    kg: parseFloat(r.carga) || 0,
  }));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Meu Treino</h1>
          <p className={styles.subtitle}>
            Marque os exercícios conforme avança
          </p>
        </div>
        {selected && (
          <button className={styles.pdfBtn} onClick={gerarPDF}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2V10M8 10L5 7M8 10L11 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12V14H14V12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Baixar PDF
          </button>
        )}
      </div>

      {loading ? (
        <div className={styles.empty}>Carregando...</div>
      ) : treinos.length === 0 ? (
        <div className={styles.empty}>Nenhum treino cadastrado ainda.</div>
      ) : (
        <>
          <div className={styles.tabs}>
            {treinos.map((t) => (
              <button
                key={t.id}
                className={`${styles.tab} ${selected?.id === t.id ? styles.active : ""}`}
                onClick={() => handleSelecionarTreino(t)}
              >
                {t.nome}
                {t.diaSemana ? ` — ${t.diaSemana}` : ""}
              </button>
            ))}
          </div>

          {selected && (
            <div className={styles.treinoCard}>
              <div className={styles.treinoHeader}>
                <p className={styles.treinoNome}>{selected.nome}</p>
                {selected.descricao && (
                  <p className={styles.treinoDesc}>{selected.descricao}</p>
                )}
                {!jaFeito && !checkando && (
                  <p className={styles.progresso}>
                    {totalConcluidos}/{totalExercicios} exercícios concluídos
                  </p>
                )}
              </div>

              {selected.exercicios?.map((ex) => (
                <div
                  key={ex.id}
                  className={styles.exercicioItem}
                  style={{
                    opacity: jaFeito ? 0.7 : 1,
                    cursor: jaFeito ? "default" : "pointer",
                  }}
                  onClick={() => toggleExercicio(ex.id)}
                >
                  <div
                    className={`${styles.exercicioCheck} ${concluidos.has(ex.id) || jaFeito ? styles.checked : ""} ${jaFeito ? styles.checkedFinal : ""}`}
                  >
                    {(concluidos.has(ex.id) || jaFeito) && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M2 5L4 7L8 3"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className={styles.exercicioInfo}>
                    <p
                      className={`${styles.exercicioNome} ${jaFeito || concluidos.has(ex.id) ? styles.done : ""}`}
                    >
                      {ex.nome}
                    </p>
                    <p className={styles.exercicioMeta}>
                      {ex.series}x {ex.repeticoes}
                      {ex.carga ? ` — ${ex.carga}` : ""}
                      {ex.observacao ? ` · ${ex.observacao}` : ""}
                    </p>
                    <button
                      className={styles.evolucaoBtn}
                      onClick={(e) => abrirEvolucao(ex, e)}
                    >
                      Ver evolução de carga
                    </button>
                  </div>
                </div>
              ))}

              {sucesso && (
                <div className={styles.sucessoAlert}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M5 8L7 10L11 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Treino registrado no histórico!
                </div>
              )}

              {jaFeito && !sucesso && (
                <div className={styles.jafeitoAlert}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M5 8L7 10L11 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Treino já concluído esta semana. Volte na semana que vem!
                </div>
              )}

              <button
                className={`${styles.concluirBtn} ${todosFeitos && !jaFeito ? styles.concluirAtivo : ""}`}
                onClick={abrirModalCarga}
                disabled={!todosFeitos || jaFeito || checkando}
              >
                {checkando
                  ? "Verificando..."
                  : jaFeito
                    ? "Concluído esta semana"
                    : todosFeitos
                      ? "Concluir Treino"
                      : `Faltam ${totalExercicios - totalConcluidos} exercícios`}
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal de carga */}
      {modalCarga && selected && (
        <div
          className={styles.evolucaoModal}
          onClick={() => setModalCarga(false)}
        >
          <div
            className={styles.evolucaoBox}
            onClick={(e) => e.stopPropagation()}
          >
            <p className={styles.evolucaoTitulo}>Registrar cargas</p>
            <p className={styles.evolucaoSubtitulo}>
              Opcional — compare com o último treino
            </p>
            {loadingCargas ? (
              <p className={styles.evolucaoEmpty}>Carregando...</p>
            ) : (
              selected.exercicios.map((ex) => {
                const info = cargas[ex.id];
                const comp = getComparacao(ex.id);
                return (
                  <div key={ex.id} className={styles.cargaModalItem}>
                    <div className={styles.cargaModalInfo}>
                      <p className={styles.cargaModalNome}>{ex.nome}</p>
                      {info?.ultima && (
                        <p className={styles.cargaUltima}>
                          Último: {info.ultima}
                        </p>
                      )}
                    </div>
                    <div className={styles.cargaInputWrapper}>
                      <input
                        className={`${styles.cargaInput} ${comp === "progresso" ? styles.cargaProgresso : comp === "regresso" ? styles.cargaRegresso : ""}`}
                        placeholder="0kg"
                        value={info?.valor || ""}
                        onChange={(e) =>
                          handleCargaChange(ex.id, e.target.value)
                        }
                      />
                      {comp === "progresso" && (
                        <span className={styles.compProgresso}>▲</span>
                      )}
                      {comp === "regresso" && (
                        <span className={styles.compRegresso}>▼</span>
                      )}
                      {comp === "igual" && (
                        <span className={styles.compIgual}>═</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div className={styles.modalBtns}>
              <button
                className={styles.evolucaoFechar}
                onClick={() => setModalCarga(false)}
              >
                Cancelar
              </button>
              <button
                className={styles.confirmarBtn}
                onClick={handleConfirmarCarga}
                disabled={concluindo}
              >
                {concluindo ? "Salvando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de evolução com gráfico */}
      {evolucaoEx && (
        <div
          className={styles.evolucaoModal}
          onClick={() => setEvolucaoEx(null)}
        >
          <div
            className={styles.evolucaoBox}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.evolucaoModalHeader}>
              <p className={styles.evolucaoTitulo}>
                Evolução — {evolucaoEx.nome}
              </p>
              <button
                className={styles.evolucaoFecharX}
                onClick={() => setEvolucaoEx(null)}
              >
                ✕
              </button>
            </div>

            {loadingEvolucao ? (
              <p className={styles.evolucaoEmpty}>Carregando...</p>
            ) : evolucaoData.length === 0 ? (
              <p className={styles.evolucaoEmpty}>
                Nenhum registro de carga ainda. Conclua um treino para começar.
              </p>
            ) : (
              <>
                {evolucaoData.length >= 1 && (
                  <div className={styles.chartWrapper}>
                    <ResponsiveContainer width="100%" height={180}>
                      <LineChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.05)"
                        />
                        <XAxis
                          dataKey="data"
                          tick={{ fontSize: 10, fill: "#888" }}
                        />
                        <YAxis
                          tick={{ fontSize: 10, fill: "#888" }}
                          unit="kg"
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                          formatter={(value) => [`${value}kg`, "Carga"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="kg"
                          stroke="#16a34a"
                          strokeWidth={2}
                          dot={{ fill: "#16a34a", r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className={styles.evolucaoTabela}>
                  <div className={styles.evolucaoTabelaHeader}>
                    <span>Data</span>
                    <span>Carga</span>
                    <span>Variação</span>
                  </div>
                  {evolucaoData.map((r, i) => {
                    const anterior = evolucaoData[i - 1];
                    let comp: "progresso" | "regresso" | "igual" | null = null;
                    let diff = "";
                    if (anterior) {
                      const atual = parseFloat(r.carga);
                      const ant = parseFloat(anterior.carga);
                      if (!isNaN(atual) && !isNaN(ant)) {
                        const d = atual - ant;
                        if (d > 0) {
                          comp = "progresso";
                          diff = `+${d}kg`;
                        } else if (d < 0) {
                          comp = "regresso";
                          diff = `${d}kg`;
                        } else {
                          comp = "igual";
                          diff = "=";
                        }
                      }
                    }
                    return (
                      <div key={r.id} className={styles.evolucaoTabelaRow}>
                        <span className={styles.evolucaoData}>
                          {new Date(r.registradoEm).toLocaleDateString("pt-BR")}
                        </span>
                        <span className={styles.evolucaoCargaValor}>
                          {r.carga}
                        </span>
                        <span
                          className={`${styles.evolucaoVariacao} ${comp === "progresso" ? styles.cargaProgresso : comp === "regresso" ? styles.cargaRegresso : ""}`}
                        >
                          {diff || "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <button
              className={styles.evolucaoFechar}
              onClick={() => setEvolucaoEx(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
