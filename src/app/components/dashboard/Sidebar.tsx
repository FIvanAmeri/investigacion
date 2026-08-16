"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarProps {
  esSuperAdmin: boolean;
  rol: string;
  nombre: string;
  apellido: string;
}

interface ItemSidebar {
  href: string;
  titulo: string;
}

export default function Sidebar({
  esSuperAdmin,
  rol,
  nombre,
  apellido,
}: SidebarProps) {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  const itemsPrincipales: ItemSidebar[] = [
    {
      href: "/dashboard",
      titulo: "Inicio",
    },
  ];

  const itemsInvestigador: ItemSidebar[] = [
    {
      href: "/dashboard/sistemas",
      titulo: "Mis sistemas",
    },
  ];

  const itemsSuperAdmin: ItemSidebar[] = [
    {
      href: "/dashboard/usuarios",
      titulo: "Usuarios",
    },
    {
      href: "/dashboard/sistemas",
      titulo: "Sistemas",
    },
    {
      href: "/dashboard/contenido",
      titulo: "Contenido de la página",
    },
  ];

  const items =
    esSuperAdmin
      ? itemsSuperAdmin
      : [
          ...itemsPrincipales,
          ...itemsInvestigador,
        ];

  const estaActivo = (href: string): boolean => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white lg:hidden"
      >
        Menú
      </button>

      {abierto && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setAbierto(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          abierto
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-200 px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
            Investigación
          </p>

          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            Dashboard
          </h2>
        </div>

        <div className="border-b border-slate-200 px-6 py-5">
          <p className="font-semibold text-slate-900">
            {nombre} {apellido}
          </p>

          <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-500">
            {esSuperAdmin
              ? "SuperAdmin"
              : rol}
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setAbierto(false)}
              className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                estaActivo(item.href)
                  ? "bg-cyan-50 text-cyan-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              {item.titulo}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <Link
            href="/zona-investigadores"
            className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          >
            Volver al sitio
          </Link>
        </div>
      </aside>
    </>
  );
}