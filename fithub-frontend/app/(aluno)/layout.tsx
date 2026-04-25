import { SidebarAluno } from "@/components/aluno/SidebarAluno";

export default function AlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SidebarAluno />
      <main
        style={{
          flex: 1,
          marginLeft: "240px",
          padding: "2rem",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}
