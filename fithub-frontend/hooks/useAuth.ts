import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types";

export function useAuth(requiredRole?: "ADMIN" | "ALUNO" | "PERSONAL") {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("fithub_token");
    const userStr = localStorage.getItem("fithub_user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    if (requiredRole) {
      const user: User = JSON.parse(userStr);
      if (user.role !== requiredRole && requiredRole === "ADMIN") {
        if (user.role === "PERSONAL") {
          router.push("/personal-painel");
        } else {
          router.push("/painel");
        }
        return;
      }
    }
  }, [router, requiredRole]);

  function getUser(): User | null {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("fithub_user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  }

  function logout() {
    localStorage.removeItem("fithub_token");
    localStorage.removeItem("fithub_user");
    router.push("/login");
  }

  return { getUser, logout };
}
