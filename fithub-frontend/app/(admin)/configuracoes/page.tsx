"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import styles from "./configuracoes.module.css";

interface Configuracao {
  nomeAcademia: string;
  corPrimaria: string;
  logoUrl: string;
}

export default function ConfiguracoesPage() {
  useAuth("ADMIN");
  const [form, setForm] = useState<Configuracao>({
    nomeAcademia: "",
    corPrimaria: "#16a34a",
    logoUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api
      .get<Configuracao>("/admin/configuracao")
      .then((data) => {
        setForm(data);
        setLogoPreview(data.logoUrl || "");
      })
      .finally(() => setLoading(false));
  }, []);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      alert("A imagem deve ter no máximo 500KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setLogoPreview(base64);
      setForm((f) => ({ ...f, logoUrl: base64 }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSalvar() {
    setSaving(true);
    setSucesso(false);
    try {
      await api.put("/admin/configuracao", form);
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className={styles.loading}>Carregando...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Configurações</h1>
        <p className={styles.subtitle}>Personalize o sistema da sua academia</p>
      </div>

      <div className={styles.card}>
        <p className={styles.sectionTitle}>Identidade da Academia</p>

        <div className={styles.logoSection}>
          <div
            className={styles.logoWrapper}
            onClick={() => fileRef.current?.click()}
          >
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo"
                className={styles.logoPreview}
              />
            ) : (
              <div className={styles.logoPlaceholder}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect
                    x="2"
                    y="13"
                    width="6"
                    height="6"
                    rx="2"
                    fill="currentColor"
                  />
                  <rect
                    x="24"
                    y="13"
                    width="6"
                    height="6"
                    rx="2"
                    fill="currentColor"
                  />
                  <rect
                    x="10"
                    y="12"
                    width="12"
                    height="8"
                    rx="2"
                    fill="currentColor"
                  />
                </svg>
                <span>Adicionar logo</span>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleLogoChange}
          />
          <div className={styles.logoInfo}>
            <p className={styles.logoHint}>
              Clique na logo para alterar · Máx 500KB
            </p>
            {logoPreview && (
              <button
                className={styles.removeBtn}
                onClick={() => {
                  setLogoPreview("");
                  setForm((f) => ({ ...f, logoUrl: "" }));
                }}
              >
                Remover logo
              </button>
            )}
          </div>
        </div>

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Nome da Academia</label>
            <input
              className={styles.input}
              value={form.nomeAcademia}
              onChange={(e) =>
                setForm({ ...form, nomeAcademia: e.target.value })
              }
              placeholder="Ex: FitHub Academia"
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
                placeholder="#16a34a"
              />
              <div
                className={styles.colorPreview}
                style={{ backgroundColor: form.corPrimaria }}
              />
            </div>
            <p className={styles.colorHint}>
              Esta cor será usada nos PDFs gerados pelo sistema
            </p>
          </div>
        </div>

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
            Configurações salvas com sucesso!
          </div>
        )}

        <button
          className={styles.salvarBtn}
          onClick={handleSalvar}
          disabled={saving}
        >
          {saving ? "Salvando..." : "Salvar Configurações"}
        </button>
      </div>
    </div>
  );
}
