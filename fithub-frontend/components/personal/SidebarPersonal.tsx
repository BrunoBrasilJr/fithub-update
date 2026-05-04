"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import type { User } from "@/types";
import styles from "./SidebarPersonal.module.css";

const navItems = [
  {
    href: "/personal-painel",
    label: "Painel",
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
    href: "/personal-treinos",
    label: "Treinos",
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
    href: "/personal-perfil",
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

export function SidebarPersonal() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [fotoUrl, setFotoUrl] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("fithub_user");
    if (userStr) setUser(JSON.parse(userStr));

    import("@/lib/api").then(({ api }) => {
      api
        .get<{ fotoUrl: string }>("/personal/perfil")
        .then((res) => setFotoUrl(res.fotoUrl || ""))
        .catch(() => {});
    });
  }, []);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <svg className={styles.logoIcon} viewBox="0 0 32 32" fill="none">
          <rect x="2" y="13" width="6" height="6" rx="2" fill="currentColor" />
          <rect x="24" y="13" width="6" height="6" rx="2" fill="currentColor" />
          <rect
            x="10"
            y="12"
            width="12"
            height="8"
            rx="2"
            fill="currentColor"
          />
        </svg>
        <span className={styles.logoText}>FitHub</span>
      </div>

      <nav className={styles.nav}>
        <p className={styles.navLabel}>Personal</p>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${pathname === item.href ? styles.active : ""}`}
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
          ) : (
            <div className={styles.avatar}>
              {user?.nome?.charAt(0).toUpperCase() || "P"}
            </div>
          )}
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.nome || ""}</p>
            <p className={styles.userRole}>Personal Trainer</p>
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
