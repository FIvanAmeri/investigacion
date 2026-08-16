import { redirect } from "next/navigation";
import { obtenerSuperAdminDashboard } from "@/lib/dashboard";

export default async function ContenidoDashboardPage() {
  const superAdmin =
    await obtenerSuperAdminDashboard();

  if (!superAdmin) {
    redirect("/dashboard");
  }

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
        Administración del sitio
      </p>

      <h1 className="mt-3 text-3xl font-semibold text-slate-950">
        Contenido de la página
      </h1>

      <p className="mt-3 max-w-3xl text-slate-600">
        Desde este módulo el SuperAdmin podrá administrar
        el navbar público, submenús, páginas y secciones
        completas del sitio.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-950">
            Menús
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Crear, editar, ordenar y eliminar elementos
            del navbar.
          </p>
        </div>

        <div className="border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-950">
            Submenús
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Crear estructuras padre/hijo para la navegación.
          </p>
        </div>

        <div className="border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-950">
            Secciones
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Crear, modificar, ordenar y eliminar contenido
            de las páginas.
          </p>
        </div>
      </div>
    </section>
  );
}