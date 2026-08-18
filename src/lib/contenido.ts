import { getDatabase } from "@/lib/db";

export type ContenidoTipo =
  | "MENU"
  | "SUBMENU"
  | "SECCION";

export interface ContenidoPagina {
  id: number;
  tipo: ContenidoTipo;
  titulo: string;
  slug: string;
  contenido: string | null;
  configuracion: Record<string, unknown> | null;
  orden: number;
  activo: boolean;
  padreId: number | null;
  createdAt: string;
  updatedAt: string;
}

interface ContenidoPaginaRow {
  id: number;
  tipo: string;
  titulo: string;
  slug: string;
  contenido: string | null;
  configuracion: Record<string, unknown> | null;
  orden: number;
  activo: boolean;
  padre_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface NavegacionItem {
  label: string;
  href: string;
}

export interface NavegacionMenu {
  id: number;
  label: string;
  href?: string;
  items?: NavegacionItem[];
}

function mapearContenido(
  fila: ContenidoPaginaRow,
): ContenidoPagina {
  return {
    id: fila.id,
    tipo: fila.tipo as ContenidoTipo,
    titulo: fila.titulo,
    slug: fila.slug,
    contenido: fila.contenido,
    configuracion: fila.configuracion,
    orden: fila.orden,
    activo: fila.activo,
    padreId: fila.padre_id,
    createdAt: fila.created_at.toISOString(),
    updatedAt: fila.updated_at.toISOString(),
  };
}

export async function obtenerContenido(
  tipo?: ContenidoTipo,
): Promise<ContenidoPagina[]> {
  const database = await getDatabase();

  const filas = tipo
    ? await database.query<ContenidoPaginaRow[]>(
        `
          SELECT
            id,
            tipo,
            titulo,
            slug,
            contenido,
            configuracion,
            orden,
            activo,
            padre_id,
            created_at,
            updated_at
          FROM contenido_pagina
          WHERE tipo = $1
          ORDER BY orden ASC, id ASC
        `,
        [tipo],
      )
    : await database.query<ContenidoPaginaRow[]>(
        `
          SELECT
            id,
            tipo,
            titulo,
            slug,
            contenido,
            configuracion,
            orden,
            activo,
            padre_id,
            created_at,
            updated_at
          FROM contenido_pagina
          ORDER BY tipo ASC, orden ASC, id ASC
        `,
      );

  return filas.map(mapearContenido);
}

function obtenerHref(
  contenido: ContenidoPagina,
): string {
  const configuracion =
    contenido.configuracion ?? {};

  const href = configuracion.href;

  if (
    typeof href === "string" &&
    href.trim()
  ) {
    return href;
  }

  if (contenido.slug === "inicio") {
    return "/";
  }

  return `/${contenido.slug}`;
}

export async function obtenerNavegacionPublica(): Promise<
  NavegacionMenu[]
> {
  const contenidos =
    await obtenerContenido();

  const menus = contenidos
    .filter(
      (contenido) =>
        contenido.tipo === "MENU" &&
        contenido.activo,
    )
    .sort((a, b) => {
      if (a.orden !== b.orden) {
        return a.orden - b.orden;
      }

      return a.id - b.id;
    });

  const submenus = contenidos
    .filter(
      (contenido) =>
        contenido.tipo === "SUBMENU" &&
        contenido.activo,
    )
    .sort((a, b) => {
      if (a.orden !== b.orden) {
        return a.orden - b.orden;
      }

      return a.id - b.id;
    });

  return menus.map((menu) => {
    const hijos = submenus
      .filter(
        (submenu) =>
          submenu.padreId === menu.id,
      )
      .map((submenu) => ({
        label: submenu.titulo,
        href: obtenerHref(submenu),
      }));

    return {
      id: menu.id,
      label: menu.titulo,
      ...(hijos.length > 0
        ? { items: hijos }
        : { href: obtenerHref(menu) }),
    };
  });
}