import { SuperSidebar } from "@/components/super/SuperSidebar";

export default function SuperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SuperSidebar />
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
