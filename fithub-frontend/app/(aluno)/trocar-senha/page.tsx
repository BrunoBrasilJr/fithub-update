"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import styles from "./trocar-senha.module.css";

export default function TrocarSenhaPage() {
  const { getUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmar: "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSalvar() {
    if (form.novaSenha !== form.confirmar) {
      setError("As senhas não coincidem.");
      return;
    }
    if (form.novaSenha.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await api.put("/aluno/trocar-senha", {
        senhaAtual: form.senhaAtual,
        novaSenha: form.novaSenha,
      });
      setSuccess(true);
      setTimeout(() => router.push("/aluno/painel"), 2000);
    } catch {
      setError("Senha atual incorreta.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Trocar Senha</h1>
        <p className={styles.subtitle}>Atualize sua senha de acesso</p>
      </div>

      <div className={styles.card}>
        {success && (
          <div className={styles.success}>
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
            Senha alterada com sucesso! Redirecionando...
          </div>
        )}
        {error && (
          <div className={styles.error}>
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
            {error}
          </div>
        )}
        <div className={styles.form}>
          <Input
            label="Senha Atual"
            type="password"
            value={form.senhaAtual}
            onChange={(e) => setForm({ ...form, senhaAtual: e.target.value })}
            placeholder="••••••••"
          />
          <Input
            label="Nova Senha"
            type="password"
            value={form.novaSenha}
            onChange={(e) => setForm({ ...form, novaSenha: e.target.value })}
            placeholder="Mínimo 6 caracteres"
          />
          <Input
            label="Confirmar Nova Senha"
            type="password"
            value={form.confirmar}
            onChange={(e) => setForm({ ...form, confirmar: e.target.value })}
            placeholder="Repita a nova senha"
          />
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button loading={saving} onClick={handleSalvar}>
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
