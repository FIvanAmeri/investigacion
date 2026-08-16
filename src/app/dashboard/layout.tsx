import { redirect } from "next/navigation";
import Sidebar from "@/app/components/dashboard/Sidebar";
import { obtenerUsuarioDashboard } from "@/lib/dashboard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const usuario = await obtenerUsuarioDashboard();

  if (!usuario) {
    redirect("/zona-investigadores");
  }

  if (usuario.estado !== "APROBADO") {
    redirect("/zona-investigadores");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        esSuperAdmin={usuario.esSuperAdmin}
        rol={usuario.rol}
        nombre={usuario.nombre}
        apellido={usuario.apellido}
      />

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}