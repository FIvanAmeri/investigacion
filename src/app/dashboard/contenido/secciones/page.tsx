import { redirect } from "next/navigation";
import {
  obtenerContenido,
} from "@/lib/contenido";
import { obtenerSuperAdminDashboard } from "@/lib/dashboard";
import ContenidoPanel from "@/app/dashboard/contenido/ContenidoPanel";

export default async function SeccionesDashboardPage() {
  const superAdmin =
    await obtenerSuperAdminDashboard();

  if (!superAdmin) {
    redirect("/dashboard");
  }

  const secciones =
    await obtenerContenido("SECCION");

  const padres =
    await obtenerContenido("SUBMENU");

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
        Administración del sitio
      </p>

      <h1 className="mt-3 text-3xl font-semibold text-slate-950">
        Secciones
      </h1>

      <p className="mt-3 max-w-3xl text-slate-600">
        Administrá el contenido interno asociado a las
        distintas páginas del sitio público.
      </p>

      <div className="mt-8">
        <ContenidoPanel
          tipo="SECCION"
          contenidosIniciales={secciones}
          padres={padres}
        />
      </div>
    </section>
  );
}