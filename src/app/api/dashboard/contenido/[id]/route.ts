import { NextRequest, NextResponse } from "next/server";
import { obtenerSuperAdminDashboard } from "@/lib/dashboard";
import { getDatabase } from "@/lib/db";

interface ActualizarContenidoBody {
  titulo?: string;
  slug?: string;
  contenido?: string | null;
  configuracion?: Record<string, unknown> | null;
  orden?: number;
  activo?: boolean;
  padreId?: number | null;
}

interface RutaContext {
  params: Promise<{
    id: string;
  }>;
}

interface ContenidoActual {
  id: number;
  tipo: "MENU" | "SUBMENU" | "SECCION";
  padre_id: number | null;
}

interface ContenidoActualizado {
  id: number;
  tipo: string;
  titulo: string;
  slug: string;
  contenido: string | null;
  configuracion: Record<string, unknown> | null;
  orden: number;
  activo: boolean;
  padreId: number | null;
  updatedAt: Date;
}

export async function PATCH(
  request: NextRequest,
  context: RutaContext,
) {
  const superAdmin =
    await obtenerSuperAdminDashboard();

  if (!superAdmin) {
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 403 },
    );
  }

  const { id } = await context.params;
  const contenidoId = Number(id);

  if (!Number.isInteger(contenidoId)) {
    return NextResponse.json(
      { error: "ID inválido." },
      { status: 400 },
    );
  }

  const body =
    (await request.json()) as ActualizarContenidoBody;

  const database = await getDatabase();

  const actual =
    await database.query<ContenidoActual[]>(
      `
        SELECT
          id,
          tipo,
          padre_id
        FROM contenido_pagina
        WHERE id = $1
        LIMIT 1
      `,
      [contenidoId],
    );

  if (!actual[0]) {
    return NextResponse.json(
      {
        error:
          "Contenido no encontrado.",
      },
      { status: 404 },
    );
  }

  const contenidoActual = actual[0];

  const padreId =
    body.padreId !== undefined
      ? body.padreId
      : contenidoActual.padre_id;

  if (
    contenidoActual.tipo === "MENU" &&
    padreId !== null
  ) {
    return NextResponse.json(
      {
        error:
          "Un menú principal no puede tener padre.",
      },
      { status: 400 },
    );
  }

  if (
    contenidoActual.tipo !== "MENU" &&
    padreId === null
  ) {
    return NextResponse.json(
      {
        error:
          "Este contenido necesita un elemento padre.",
      },
      { status: 400 },
    );
  }

  if (padreId === contenidoId) {
    return NextResponse.json(
      {
        error:
          "Un elemento no puede ser padre de sí mismo.",
      },
      { status: 400 },
    );
  }

  if (
    contenidoActual.tipo !== "MENU" &&
    padreId
  ) {
    const padre =
      await database.query<
        {
          id: number;
          tipo:
            | "MENU"
            | "SUBMENU"
            | "SECCION";
        }[]
      >(
        `
          SELECT
            id,
            tipo
          FROM contenido_pagina
          WHERE id = $1
          LIMIT 1
        `,
        [padreId],
      );

    if (!padre[0]) {
      return NextResponse.json(
        {
          error:
            "El elemento padre no existe.",
        },
        { status: 400 },
      );
    }

    if (
      contenidoActual.tipo === "SUBMENU" &&
      padre[0].tipo !== "MENU"
    ) {
      return NextResponse.json(
        {
          error:
            "Un submenú solamente puede pertenecer a un menú.",
        },
        { status: 400 },
      );
    }

    if (
      contenidoActual.tipo === "SECCION" &&
      padre[0].tipo !== "SUBMENU"
    ) {
      return NextResponse.json(
        {
          error:
            "Una sección solamente puede pertenecer a un submenú.",
        },
        { status: 400 },
      );
    }
  }

  const titulo =
    body.titulo !== undefined
      ? body.titulo.trim()
      : undefined;

  const slug =
    body.slug !== undefined
      ? body.slug.trim()
      : undefined;

  if (
    titulo !== undefined &&
    !titulo
  ) {
    return NextResponse.json(
      {
        error:
          "El título no puede estar vacío.",
      },
      { status: 400 },
    );
  }

  if (
    slug !== undefined &&
    !slug
  ) {
    return NextResponse.json(
      {
        error:
          "El slug no puede estar vacío.",
      },
      { status: 400 },
    );
  }

  try {
    const resultado =
      await database.query<
        ContenidoActualizado[]
      >(
        `
          UPDATE contenido_pagina
          SET
            titulo =
              COALESCE($1, titulo),
            slug =
              COALESCE($2, slug),
            contenido =
              CASE
                WHEN $3::boolean = true
                  THEN $4
                ELSE contenido
              END,
            configuracion =
              CASE
                WHEN $5::boolean = true
                  THEN $6
                ELSE configuracion
              END,
            orden =
              COALESCE($7, orden),
            activo =
              COALESCE($8, activo),
            padre_id =
              $9,
            updated_at =
              NOW()
          WHERE id = $10
          RETURNING
            id,
            tipo,
            titulo,
            slug,
            contenido,
            configuracion,
            orden,
            activo,
            padre_id AS "padreId",
            updated_at AS "updatedAt"
        `,
        [
          titulo ?? null,
          slug ?? null,
          body.contenido !== undefined,
          body.contenido ?? null,
          body.configuracion !== undefined,
          body.configuracion ?? null,
          body.orden ?? null,
          body.activo ?? null,
          padreId,
          contenidoId,
        ],
      );

    return NextResponse.json({
      contenido: resultado[0],
    });
  } catch (error) {
    const codigo =
      error &&
      typeof error === "object" &&
      "code" in error
        ? error.code
        : null;

    if (codigo === "23505") {
      return NextResponse.json(
        {
          error:
            "Ya existe un contenido con ese slug.",
        },
        { status: 409 },
      );
    }

    console.error(
      "ERROR PATCH /api/dashboard/contenido/[id]:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "No se pudo actualizar el contenido.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RutaContext,
) {
  const superAdmin =
    await obtenerSuperAdminDashboard();

  if (!superAdmin) {
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 403 },
    );
  }

  const { id } = await context.params;
  const contenidoId = Number(id);

  if (!Number.isInteger(contenidoId)) {
    return NextResponse.json(
      { error: "ID inválido." },
      { status: 400 },
    );
  }

  const database = await getDatabase();

  const hijos = await database.query<
    { id: number }[]
  >(
    `
      SELECT id
      FROM contenido_pagina
      WHERE padre_id = $1
      LIMIT 1
    `,
    [contenidoId],
  );

  if (hijos.length > 0) {
    return NextResponse.json(
      {
        error:
          "No se puede eliminar porque tiene contenido asociado. Eliminá primero sus elementos hijos.",
      },
      { status: 409 },
    );
  }

  const resultado =
    await database.query<{ id: number }[]>(
      `
        DELETE FROM contenido_pagina
        WHERE id = $1
        RETURNING id
      `,
      [contenidoId],
    );

  if (!resultado[0]) {
    return NextResponse.json(
      {
        error:
          "Contenido no encontrado.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    eliminado: true,
  });
}