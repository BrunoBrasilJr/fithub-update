"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import type { User } from "@/types";
import styles from "./Sidebar.module.css";

const navItems = [
  {
    label: "Visão Geral",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: (
          <svg className={styles.navIcon} viewBox="0 0 20 20" fill="none">
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
    ],
  },
  {
    label: "Gestão",
    items: [
      {
        href: "/alunos",
        label: "Alunos",
        icon: (
          <svg className={styles.navIcon} viewBox="0 0 20 20" fill="none">
            <circle
              cx="8"
              cy="6"
              r="3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M2 17C2 14.2386 4.68629 12 8 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M13 14L14.5 15.5L17 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="15"
              cy="14.5"
              r="3.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        ),
      },
      {
        href: "/planos",
        label: "Planos",
        icon: (
          <svg className={styles.navIcon} viewBox="0 0 20 20" fill="none">
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
        href: "/matriculas",
        label: "Matrículas",
        icon: (
          <svg className={styles.navIcon} viewBox="0 0 20 20" fill="none">
            <path
              d="M6 2V5M14 2V5M3 8H17M4 4H16C16.5523 4 17 4.44772 17 5V17C17 17.5523 16.5523 18 16 18H4C3.44772 18 3 17.5523 3 17V5C3 4.44772 3.44772 4 4 4Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ),
      },
      {
        href: "/treinos",
        label: "Treinos",
        icon: (
          <svg className={styles.navIcon} viewBox="0 0 20 20" fill="none">
            <path
              d="M2 10H4M16 10H18M4 10C4 10 4 7 7 7C10 7 10 13 13 13C16 13 16 10 16 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ),
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth("ADMIN");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("fithub_user");
    if (userStr) setUser(JSON.parse(userStr));
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
        {navItems.map((group) => (
          <div key={group.label}>
            <p className={styles.navLabel}>{group.label}</p>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${pathname === item.href ? styles.active : ""}`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.user}>
          <div className={styles.avatar}>
            {user?.nome?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <p className={styles.userName}>{user?.nome || ""}</p>
            <p className={styles.userRole}>Administrador</p>
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
