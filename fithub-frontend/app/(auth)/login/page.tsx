"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { AuthResponse } from "@/types";
import styles from "./login.module.css";

interface AcademiaConfig {
  id: string;
  dominio: string;
  nomeAcademia: string;
  corPrimaria: string;
  logoUrl: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [academia, setAcademia] = useState<AcademiaConfig | null>(null);
  const [loadingTema, setLoadingTema] = useState(false);
  const [corBotao, setCorBotao] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const partes = login.split("@");
    if (partes.length !== 2 || partes[1].trim() === "") {
      resetTema();
      setAcademia(null);
      setCorBotao(null);
      return;
    }

    const dominio = partes[1].trim().toLowerCase();
    if (dominio.includes(".")) {
      resetTema();
      setAcademia(null);
      setCorBotao(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoadingTema(true);
      try {
        const res = await fetch(
          `http://localhost:8080/public/academia?dominio=${dominio}`,
        );
        if (!res.ok) {
          resetTema();
          setAcademia(null);
          setCorBotao(null);
          return;
        }
        const data: AcademiaConfig = await res.json();
        setAcademia(data);
        setCorBotao(data.corPrimaria);
        aplicarTema(data.corPrimaria);
      } catch {
        resetTema();
        setAcademia(null);
        setCorBotao(null);
      } finally {
        setLoadingTema(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [login]);

  function aplicarTema(cor: string) {
    const root = document.documentElement;
    root.style.setProperty("--green", cor);
    root.style.setProperty("--green-subtle", cor + "20");
    root.style.setProperty("--shadow-green", `0 4px 24px ${cor}40`);
  }

  function resetTema() {
    const root = document.documentElement;
    root.style.removeProperty("--green");
    root.style.removeProperty("--green-subtle");
    root.style.removeProperty("--shadow-green");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!login || !senha) {
      setError("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await api.post<AuthResponse>("/auth/login", {
        login,
        senha,
      });

      localStorage.setItem("fithub_token", data.token);
      localStorage.setItem("fithub_user", JSON.stringify(data.user));
      if (academia) {
        localStorage.setItem("fithub_academia", JSON.stringify(academia));
      }

      if (data.user.primeiroAcesso) {
        router.push("/trocar-senha");
        return;
      }

      if (data.user.role === "SUPER_ADMIN") {
        setCorBotao("#a855f7");
        aplicarTema("#a855f7");
        setTimeout(() => router.push("/super-dashboard"), 300);
        return;
      } else if (data.user.role === "ADMIN") {
        router.push("/dashboard");
      } else if (data.user.role === "PERSONAL") {
        router.push("/personal-painel");
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

  const corAtiva = corBotao || academia?.corPrimaria || "#22c55e";

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.grid} />
      </div>

      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoIcon} style={{ color: corAtiva }}>
            {academia?.logoUrl ? (
              <img
                src={academia.logoUrl}
                alt={academia.nomeAcademia}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "6px",
                }}
              />
            ) : (
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
            )}
          </div>
          <span className={styles.logoText}>
            {academia ? academia.nomeAcademia : "FitHub"}
          </span>
          {loadingTema && <span className={styles.temaBadge}>...</span>}
          {academia && !loadingTema && (
            <span
              className={styles.temaBadge}
              style={{ background: corAtiva + "20", color: corAtiva }}
            >
              {academia.dominio}
            </span>
          )}
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Bem-vindo de volta</h1>
          <p className={styles.subtitle}>
            Entre com suas credenciais para acessar a plataforma
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="login">
              Login
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
                id="login"
                type="text"
                className={styles.input}
                placeholder="usuario@academia ou email@email.com"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                autoComplete="username"
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
            style={{ background: corAtiva }}
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
