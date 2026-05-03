"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import styles from "./perfil.module.css";

export default function PerfilPage() {
  const { getUser } = useAuth();
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const user = getUser();
    setNome(user?.nome || "");
    setEmail(user?.email || "");
    setRole(user?.role || "");

    api
      .get<{ fotoUrl: string }>("/user/foto")
      .then((res) => setFotoUrl(res.fotoUrl))
      .catch(() => {});
  }, []);

  async function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      alert("A imagem deve ter no máximo 500KB.");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        await api.put("/user/foto", { fotoUrl: base64 });
        setFotoUrl(base64);
      } catch {
        alert("Erro ao salvar foto.");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Meu Perfil</h1>
        <p className={styles.subtitle}>Suas informações pessoais</p>
      </div>

      <div className={styles.card}>
        <div className={styles.avatarWrapper}>
          {fotoUrl ? (
            <img
              src={fotoUrl}
              alt="Foto de perfil"
              className={styles.avatarImg}
            />
          ) : (
            <div className={styles.avatar}>
              {nome?.charAt(0).toUpperCase() || "A"}
            </div>
          )}
          <button
            className={styles.avatarEdit}
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              "..."
            ) : (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M11 2L14 5L5 14H2V11L11 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFoto}
          />
        </div>

        <p className={styles.name}>{nome}</p>
        <p className={styles.email}>{email}</p>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Perfil</span>
          <span className={styles.infoValue}>
            {role === "ADMIN" ? "Administrador" : "Aluno"}
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Status</span>
          <span className={styles.infoValue}>Ativo</span>
        </div>

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
