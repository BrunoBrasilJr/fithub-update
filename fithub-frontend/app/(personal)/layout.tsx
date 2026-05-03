import { SidebarPersonal } from "@/components/personal/SidebarPersonal";

export default function PersonalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SidebarPersonal />
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
