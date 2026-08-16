import { redirect } from "next/navigation";
import { obtenerSuperAdminDashboard } from "@/lib/dashboard";

export default async function UsuariosDashboardPage() {
  const superAdmin =
    await obtenerSuperAdminDashboard();

  if (!superAdmin) {
    redirect("/dashboard");
  }

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
        Administración
      </p>

      <h1 className="mt-3 text-3xl font-semibold text-slate-950">
        Usuarios
      </h1>

      <p className="mt-3 max-w-2xl text-slate-600">
        Desde acá vas a poder revisar registros,
        aprobarlos, rechazarlos y asignarles el rol
        correspondiente.
      </p>

      <div className="mt-8 border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Registros pendientes
        </p>

        <div className="mt-6">
          La tabla de usuarios se conectará con la API
          de administración.
        </div>
      </div>
    </section>
  );
}