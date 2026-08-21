import { redirect } from "next/navigation";

import { obtenerContenido } from "@/lib/contenido";
import { obtenerSuperAdminDashboard } from "@/lib/dashboard";

import ContenidoBuscador from "@/app/dashboard/contenido/ContenidoBuscador";
import ContenidoNavegacion from "@/app/dashboard/contenido/ContenidoNavegacion";

import SeccionesPanel from "./SeccionesPanel";

export default async function SeccionesDashboardPage() {
  const superAdmin =
    await obtenerSuperAdminDashboard();

  if (!superAdmin) {
    redirect("/dashboard");
  }

  const [
    secciones,
    menus,
    submenus,
  ] = await Promise.all([
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
      const menuPadre =
        menus.find(
          (menu) =>
            menu.id ===
            submenu.padreId,
        );

      return {
        id: submenu.id,
        tipo: "SUBMENU" as const,
        titulo: submenu.titulo,
        slug: submenu.slug,
        padreTitulo:
          menuPadre?.titulo ??
          null,
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
        Administrá el contenido real de las
        páginas públicas desde un único lugar.
      </p>

      <ContenidoNavegacion actual="secciones" />

      <ContenidoBuscador
        placeholder="Buscar sección por nombre, página o contenido..."
        cantidad={secciones.length}
        singular="sección"
        plural="secciones"
      >
        <div className="mt-8">
          <SeccionesPanel
            seccionesIniciales={
              secciones
            }
            paginas={paginas}
          />
        </div>
      </ContenidoBuscador>
    </section>
  );
}