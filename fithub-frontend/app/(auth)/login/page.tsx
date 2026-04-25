"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { AuthResponse, LoginPayload } from "@/types";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !senha) {
      setError("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await api.post<AuthResponse>("/auth/login", {
        email,
        senha,
      } as LoginPayload);

      localStorage.setItem("fithub_token", data.token);
      localStorage.setItem("fithub_user", JSON.stringify(data.user));

      if (data.user.primeiroAcesso) {
        router.push("/trocar-senha");
        return;
      }

      if (data.user.role === "ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/painel");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Credenciais inválidas.");
      } else {
        setError("Credenciais inválidas.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.grid} />
      </div>

      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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
                x="8"
                y="10"
                width="16"
                height="12"
                rx="3"
                fill="currentColor"
                opacity="0.3"
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
          </div>
          <span className={styles.logoText}>FitHub</span>
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Bem-vindo de volta</h1>
          <p className={styles.subtitle}>
            Entre com suas credenciais para acessar a plataforma
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              E-mail
            </label>
            <div className={styles.inputWrapper}>
              <svg className={styles.inputIcon} viewBox="0 0 20 20" fill="none">
                <path
                  d="M2.5 6.5L10 11.5L17.5 6.5M3 4.5H17C17.8284 4.5 18.5 5.17157 18.5 6V14C18.5 14.8284 17.8284 15.5 17 15.5H3C2.17157 15.5 1.5 14.8284 1.5 14V6C1.5 5.17157 2.17157 4.5 3 4.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="senha">
              Senha
            </label>
            <div className={styles.inputWrapper}>
              <svg className={styles.inputIcon} viewBox="0 0 20 20" fill="none">
                <path
                  d="M7 9V6.5C7 4.567 8.567 3 10.5 3C12.433 3 14 4.567 14 6.5V9M5 9H16C16.5523 9 17 9.44772 17 10V16C17 16.5523 16.5523 17 16 17H5C4.44772 17 4 16.5523 4 16V10C4 9.44772 4.44772 9 5 9Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                id="senha"
                type={showPassword ? "text" : "password"}
                className={styles.input}
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword((p) => !p)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg viewBox="0 0 20 20" fill="none">
                    <path
                      d="M2.5 10C2.5 10 5 4.5 10 4.5C15 4.5 17.5 10 17.5 10C17.5 10 15 15.5 10 15.5C5 15.5 2.5 10 2.5 10Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="10"
                      cy="10"
                      r="2.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3 3L17 17"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="none">
                    <path
                      d="M2.5 10C2.5 10 5 4.5 10 4.5C15 4.5 17.5 10 17.5 10C17.5 10 15 15.5 10 15.5C5 15.5 2.5 10 2.5 10Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="10"
                      cy="10"
                      r="2.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <svg viewBox="0 0 16 16" fill="none">
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
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <>
                <span>Entrar na plataforma</span>
                <svg viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8H13M9 4L13 8L9 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <span>FitHub © {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}
