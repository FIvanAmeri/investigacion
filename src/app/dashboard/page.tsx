import { redirect } from "next/navigation";
import { obtenerUsuarioDashboard } from "@/lib/dashboard";

export default async function DashboardPage() {
  const usuario = await obtenerUsuarioDashboard();

  if (!usuario) {
    redirect("/zona-investigadores");
  }

  return (
    <section>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
          Panel principal
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-slate-950">
          Bienvenido, {usuario.nombre}
        </h1>

        <p className="mt-3 text-slate-600">
          Este es tu panel de investigación.
        </p>
      </div>

      {usuario.esSuperAdmin && (
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">
              Administración
            </p>

            <h2 className="mt-2 text-xl font-semibold text-slate-950">
              Usuarios
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Gestioná registros, aprobaciones y roles.
            </p>
          </div>

          <div className="border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">
              Plataforma
            </p>

            <h2 className="mt-2 text-xl font-semibold text-slate-950">
              Sistemas
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Administrá los sistemas disponibles.
            </p>
          </div>

          <div className="border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">
              Sitio web
            </p>

            <h2 className="mt-2 text-xl font-semibold text-slate-950">
              Contenido
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Modificá menús, páginas y secciones.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}