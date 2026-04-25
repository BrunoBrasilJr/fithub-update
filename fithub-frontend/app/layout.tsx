import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "FitHub — Gestão de Academia",
  description: "Plataforma moderna de gestão para academias",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
