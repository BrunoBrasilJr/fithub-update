"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { User } from "@/types";
import styles from "./SuperSidebar.module.css";

export function SuperSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("fithub_user");
    if (userStr) {
      const u = JSON.parse(userStr);
      if (u.role !== "SUPER_ADMIN") {
        router.push("/login");
      }
      setUser(u);
    } else {
      router.push("/login");
    }
  }, []);

  function logout() {
    localStorage.removeItem("fithub_token");
    localStorage.removeItem("fithub_user");
    router.push("/login");
  }

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
        <span className={styles.superBadge}>SUPER</span>
      </div>

      <nav className={styles.nav}>
        <div>
          <p className={styles.navLabel}>Gerenciamento</p>
          <Link
            href="/super-dashboard"
            className={`${styles.navItem} ${pathname === "/super-dashboard" ? styles.active : ""}`}
          >
            <svg className={styles.navIcon} viewBox="0 0 20 20" fill="none">
              <path
                d="M3 10L10 3L17 10V17H13V13H7V17H3V10Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            Academias
          </Link>
        </div>
      </nav>

      <div className={styles.footer}>
        <div className={styles.user}>
          <div className={styles.avatar}>
            {user?.nome?.charAt(0).toUpperCase() || "S"}
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.nome || ""}</p>
            <p className={styles.userRole}>Super Admin</p>
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
