import { redirect } from "next/navigation";
import {
  obtenerContenido,
} from "@/lib/contenido";
import {
  obtenerSuperAdminDashboard,
} from "@/lib/dashboard";
import ContenidoPanel from "@/app/dashboard/contenido/ContenidoPanel";

export default async function MenusDashboardPage() {
  const superAdmin =
    await obtenerSuperAdminDashboard();

  if (!superAdmin) {
    redirect("/dashboard");
  }

  const menus =
    await obtenerContenido("MENU");

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
        Administración del sitio
      </p>

      <h1 className="mt-3 text-3xl font-semibold text-slate-950">
        Menús
      </h1>

      <p className="mt-3 max-w-3xl text-slate-600">
        Administrá los elementos principales del navbar
        público.
      </p>

      <div className="mt-8">
        <ContenidoPanel
          tipo="MENU"
          contenidosIniciales={menus}
          padres={[]}
        />
      </div>
    </section>
  );
}