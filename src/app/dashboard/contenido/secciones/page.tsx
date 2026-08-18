import { redirect } from "next/navigation";
import { obtenerContenido } from "@/lib/contenido";
import { obtenerSuperAdminDashboard } from "@/lib/dashboard";
import ContenidoPanel from "@/app/dashboard/contenido/ContenidoPanel";

export default async function SeccionesDashboardPage() {
  const superAdmin =
    await obtenerSuperAdminDashboard();

  if (!superAdmin) {
    redirect("/dashboard");
  }

  const [secciones, menus, submenus] =
    await Promise.all([
      obtenerContenido("SECCION"),
      obtenerContenido("MENU"),
      obtenerContenido("SUBMENU"),
    ]);

  const paginas = [
    ...menus.map((menu) => ({
      id: menu.id,
      tipo: "MENU" as const,
      titulo: menu.titulo,
      slug: menu.slug,
      padreTitulo: null,
    })),
    ...submenus.map((submenu) => {
      const menuPadre = menus.find(
        (menu) => menu.id === submenu.padreId,
      );

      return {
        id: submenu.id,
        tipo: "SUBMENU" as const,
        titulo: submenu.titulo,
        slug: submenu.slug,
        padreTitulo: menuPadre?.titulo ?? null,
      };
    }),
  ];

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
        Administración del sitio
      </p>

      <h1 className="mt-3 text-3xl font-semibold text-slate-950">
        Secciones
      </h1>

      <p className="mt-3 max-w-3xl text-slate-600">
        Administrá directamente el contenido que se muestra dentro de cada página pública.
      </p>

      <div className="mt-8">
        <ContenidoPanel
          tipo="SECCION"
          contenidosIniciales={secciones}
          paginas={paginas}
        />
      </div>
    </section>
  );
}
