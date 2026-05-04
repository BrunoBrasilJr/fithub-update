"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import type { User } from "@/types";
import styles from "./SidebarAluno.module.css";

interface AcademiaConfig {
  id: string;
  dominio: string;
  nomeAcademia: string;
  corPrimaria: string;
  logoUrl: string;
}

const navItems = [
  {
    href: "/painel",
    label: "Meu Painel",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <rect
          x="2"
          y="2"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="11"
          y="2"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="2"
          y="11"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="11"
          y="11"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    href: "/treino",
    label: "Meu Treino",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path
          d="M2 10H4M16 10H18M4 10C4 10 4 7 7 7C10 7 10 13 13 13C16 13 16 10 16 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/historico",
    label: "Histórico",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M10 6V10L13 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/plano",
    label: "Meu Plano",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <rect
          x="3"
          y="3"
          width="14"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M7 10H13M7 7H13M7 13H10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/perfil",
    label: "Meu Perfil",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M4 17C4 14.2386 6.68629 12 10 12C13.3137 12 16 14.2386 16 17"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function SidebarAluno() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [fotoUrl, setFotoUrl] = useState("");
  const [academia, setAcademia] = useState<AcademiaConfig | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("fithub_user");
    if (userStr) setUser(JSON.parse(userStr));

    const academiaStr = localStorage.getItem("fithub_academia");
    if (academiaStr) setAcademia(JSON.parse(academiaStr));

    import("@/lib/api").then(({ api }) => {
      api
        .get<{ fotoUrl: string }>("/user/foto")
        .then((res) => setFotoUrl(res.fotoUrl || ""))
        .catch(() => {});
    });
  }, []);

  const corAtiva = academia?.corPrimaria || "var(--green)";

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        {academia?.logoUrl ? (
          <img
            src={academia.logoUrl}
            alt={academia.nomeAcademia}
            style={{
              width: "28px",
              height: "28px",
              objectFit: "contain",
              borderRadius: "6px",
              flexShrink: 0,
            }}
          />
        ) : (
          <svg
            className={styles.logoIcon}
            viewBox="0 0 32 32"
            fill="none"
            style={{ color: corAtiva }}
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
              x="10"
              y="12"
              width="12"
              height="8"
              rx="2"
              fill="currentColor"
            />
          </svg>
        )}
        <span className={styles.logoText}>
          {academia?.nomeAcademia || "FitHub"}
        </span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${pathname === item.href ? styles.active : ""}`}
            style={
              pathname === item.href
                ? { color: corAtiva, background: corAtiva + "18" }
                : {}
            }
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.user}>
          {fotoUrl ? (
            <img src={fotoUrl} alt={user?.nome} className={styles.avatarImg} />
          ) : academia?.logoUrl ? (
            <img
              src={academia.logoUrl}
              alt={academia.nomeAcademia}
              style={{
                width: "32px",
                height: "32px",
                objectFit: "contain",
                borderRadius: "50%",
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              className={styles.avatar}
              style={{ background: corAtiva + "20", color: corAtiva }}
            >
              {user?.nome?.charAt(0).toUpperCase() || "A"}
            </div>
          )}
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.nome || "Aluno"}</p>
            <p className={styles.userRole}>Aluno</p>
          </div>
        </div>
        <button
          onClick={logout}
          className={styles.navItem}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            textAlign: "left",
          }}
        >
          <svg className={styles.navIcon} viewBox="0 0 20 20" fill="none">
            <path
              d="M7 3H4C3.44772 3 3 3.44772 3 4V16C3 16.5523 3.44772 17 4 17H7M13 14L17 10M17 10L13 6M17 10H7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Sair
        </button>
      </div>
    </aside>
  );
}
