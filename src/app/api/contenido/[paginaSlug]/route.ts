import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import type { ContenidoTipo } from "@/lib/contenido";

interface RutaContext {
  params: Promise<{
    paginaSlug: string;
  }>;
}

interface PaginaContenido {
  id: number;
  tipo: ContenidoTipo;
  titulo: string;
  slug: string;
  activo: boolean;
}

interface SeccionPublica {
  id: number;
  titulo: string;
  slug: string;
  contenido: string | null;
  configuracion: Record<string, unknown> | null;
  orden: number;
}

export async function GET(
  _request: Request,
  context: RutaContext,
) {
  try {
    const { paginaSlug } = await context.params;

    const slug = decodeURIComponent(
      paginaSlug,
    ).trim();

    if (!slug) {
      return NextResponse.json(
        {
          error:
            "El slug de la página es obligatorio.",
        },
        { status: 400 },
      );
    }

    const database = await getDatabase();

    const paginaResultado =
      await database.query<PaginaContenido[]>(
        `
          SELECT
            id,
            tipo,
            titulo,
            slug,
            activo
          FROM contenido_pagina
          WHERE slug = $1
            AND tipo IN ('MENU', 'SUBMENU')
            AND activo = TRUE
          ORDER BY
            CASE
              WHEN tipo = 'MENU' THEN 0
              ELSE 1
            END,
            id ASC
          LIMIT 1
        `,
        [slug],
      );

    const pagina = paginaResultado[0];

    if (!pagina) {
      return NextResponse.json(
        {
          error: "Página no encontrada.",
        },
        { status: 404 },
      );
    }

    const secciones =
      await database.query<SeccionPublica[]>(
        `
          SELECT
            id,
            titulo,
            slug,
            contenido,
            configuracion,
            orden
          FROM contenido_pagina
          WHERE padre_id = $1
            AND tipo = 'SECCION'
            AND activo = TRUE
          ORDER BY orden ASC, id ASC
        `,
        [pagina.id],
      );

    return NextResponse.json({
      pagina: {
        id: pagina.id,
        tipo: pagina.tipo,
        titulo: pagina.titulo,
        slug: pagina.slug,
      },
      secciones,
    });
  } catch (error) {
    console.error(
      "ERROR GET /api/contenido/[paginaSlug]:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "No se pudo obtener el contenido.",
      },
      { status: 500 },
    );
  }
}