"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import styles from "./funcionarios.module.css";

function mascaraTelefone(valor: string): string {
  const nums = valor.replace(/\D/g, "").slice(0, 11);
  if (nums.length <= 2) return `(${nums}`;
  if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
  if (nums.length <= 11)
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
  return valor;
}

interface Funcionario {
  id: string;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
  telefone?: string;
  dataNascimento?: string;
  fotoUrl?: string;
  createdAt: string;
}

export default function FuncionariosPage() {
  useAuth("ADMIN");
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalCriar, setModalCriar] = useState(false);
  const [modalDeletar, setModalDeletar] = useState<Funcionario | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [fotoPreview, setFotoPreview] = useState<string>("");
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    role: "PERSONAL",
    telefone: "",
    dataNascimento: "",
    fotoUrl: "",
  });

  function fetchFuncionarios() {
    api
      .get<Funcionario[]>("/admin/funcionarios")
      .then(setFuncionarios)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  function pararCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraAtiva(false);
  }

  async function abrirCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setCameraAtiva(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch {
      alert("Não foi possível acessar a câmera.");
    }
  }

  function tirarFoto() {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg", 0.7);
    setFotoPreview(base64);
    setForm((f) => ({ ...f, fotoUrl: base64 }));
    pararCamera();
  }

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      alert("A imagem deve ter no máximo 500KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFotoPreview(base64);
      setForm((f) => ({ ...f, fotoUrl: base64 }));
    };
    reader.readAsDataURL(file);
  }

  function abrirModalCriar() {
    setForm({
      nome: "",
      email: "",
      role: "PERSONAL",
      telefone: "",
      dataNascimento: "",
      fotoUrl: "",
    });
    setFotoPreview("");
    setCameraAtiva(false);
    setFormError("");
    setModalCriar(true);
  }

  function fecharModal() {
    pararCamera();
    setFormError("");
    setModalCriar(false);
  }

  async function handleCriar() {
    setSaving(true);
    setFormError("");
    try {
      await api.post("/admin/funcionarios", form);
      fetchFuncionarios();
      fecharModal();
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : "Erro ao cadastrar funcionário.",
      );
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
        <Button onClick={abrirModalCriar}>
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
          <span className={styles.tableHeaderCell}>Telefone</span>
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
              <div className={styles.funcCell}>
                {f.fotoUrl ? (
                  <img
                    src={f.fotoUrl}
                    alt={f.nome}
                    className={styles.funcAvatar}
                  />
                ) : (
                  <div className={styles.funcAvatarPlaceholder}>
                    {f.nome.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className={styles.funcInfo}>
                  <p className={styles.cellName}>{f.nome}</p>
                  <p className={styles.cellSub}>{f.email}</p>
                </div>
              </div>
              <span className={styles.cell}>{f.telefone || "—"}</span>
              <div className={styles.badgeWrapper}>
                <Badge
                  label={f.role === "PERSONAL" ? "Personal" : f.role}
                  variant="aluno"
                />
              </div>
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
          onClose={fecharModal}
          footer={
            <>
              <Button variant="secondary" onClick={fecharModal}>
                Cancelar
              </Button>
              <Button loading={saving} onClick={handleCriar}>
                Cadastrar
              </Button>
            </>
          }
        >
          <div className={styles.form}>
            {formError && (
              <div className={styles.formErrorBox}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle
                    cx="8"
                    cy="8"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 5V8.5M8 11H8.01"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                {formError}
              </div>
            )}

            <div className={styles.fotoSection}>
              {cameraAtiva ? (
                <div className={styles.cameraWrapper}>
                  <video
                    ref={videoRef}
                    className={styles.cameraVideo}
                    autoPlay
                    playsInline
                    muted
                  />
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                  <div className={styles.cameraBtns}>
                    <Button onClick={tirarFoto}>Tirar Foto</Button>
                    <Button variant="secondary" onClick={pararCamera}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.fotoWrapper}>
                    {fotoPreview ? (
                      <img
                        src={fotoPreview}
                        alt="Preview"
                        className={styles.fotoPreview}
                      />
                    ) : (
                      <div className={styles.fotoPlaceholder}>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="8"
                            r="4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span>Sem foto</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.fotoBtns}>
                    <Button variant="secondary" onClick={abrirCamera}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M1 5C1 4.44772 1.44772 4 2 4H3.5L5 2H11L12.5 4H14C14.5523 4 15 4.44772 15 5V13C15 13.5523 14.5523 14 14 14H2C1.44772 14 1 13.5523 1 13V5Z"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                        <circle
                          cx="8"
                          cy="9"
                          r="2.5"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                      </svg>
                      Usar webcam
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => fileRef.current?.click()}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M8 2V10M8 2L5 5M8 2L11 5"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 12V14H14V12"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                      </svg>
                      Upload
                    </Button>
                    {fotoPreview && (
                      <Button
                        variant="danger"
                        onClick={() => {
                          setFotoPreview("");
                          setForm((f) => ({ ...f, fotoUrl: "" }));
                        }}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFotoChange}
                  />
                  <p className={styles.fotoHint}>
                    Webcam ou upload · Máx 500KB
                  </p>
                </>
              )}
            </div>

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
              />
            </div>
            <div className={styles.formRow}>
              <Input
                label="Telefone"
                value={form.telefone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    telefone: mascaraTelefone(e.target.value),
                  })
                }
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
