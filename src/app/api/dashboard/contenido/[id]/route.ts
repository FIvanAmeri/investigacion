import { NextRequest, NextResponse } from "next/server";
import { obtenerSuperAdminDashboard } from "@/lib/dashboard";
import { getDatabase } from "@/lib/db";
import type { ContenidoTipo } from "@/lib/contenido";

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
  tipo: ContenidoTipo;
  padre_id: number | null;
  slug: string;
}

interface ContenidoActualizado {
  id: number;
  tipo: ContenidoTipo;
  titulo: string;
  slug: string;
  contenido: string | null;
  configuracion: Record<string, unknown> | null;
  orden: number;
  activo: boolean;
  padreId: number | null;
  updatedAt: Date;
}

function esObjetoConfiguracion(
  valor: unknown,
): valor is Record<string, unknown> {
  return (
    typeof valor === "object" &&
    valor !== null &&
    !Array.isArray(valor)
  );
}

function normalizarSlug(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

  if (!Number.isInteger(contenidoId) || contenidoId < 1) {
    return NextResponse.json(
      { error: "ID inválido." },
      { status: 400 },
    );
  }

  let body: ActualizarContenidoBody;

  try {
    body =
      (await request.json()) as ActualizarContenidoBody;
  } catch {
    return NextResponse.json(
      { error: "El cuerpo de la solicitud no es válido." },
      { status: 400 },
    );
  }

  const database = await getDatabase();

  const actual =
    await database.query<ContenidoActual[]>(
      `
        SELECT
          id,
          tipo,
          padre_id,
          slug
        FROM contenido_pagina
        WHERE id = $1
        LIMIT 1
      `,
      [contenidoId],
    );

  if (!actual[0]) {
    return NextResponse.json(
      { error: "Contenido no encontrado." },
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
    (!Number.isInteger(padreId) ||
      !padreId ||
      padreId < 1)
  ) {
    return NextResponse.json(
      {
        error:
          "Este contenido necesita un elemento padre válido.",
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
    body.orden !== undefined &&
    (!Number.isInteger(body.orden) ||
      body.orden < 1)
  ) {
    return NextResponse.json(
      { error: "El orden debe ser un entero mayor o igual a 1." },
      { status: 400 },
    );
  }

  if (
    body.activo !== undefined &&
    typeof body.activo !== "boolean"
  ) {
    return NextResponse.json(
      { error: "El estado activo debe ser booleano." },
      { status: 400 },
    );
  }

  if (
    body.configuracion !== undefined &&
    body.configuracion !== null &&
    !esObjetoConfiguracion(body.configuracion)
  ) {
    return NextResponse.json(
      { error: "La configuración debe ser un objeto JSON." },
      { status: 400 },
    );
  }

  const titulo =
    body.titulo !== undefined
      ? body.titulo.trim()
      : undefined;

  const slug =
    body.slug !== undefined
      ? normalizarSlug(body.slug)
      : undefined;

  if (
    titulo !== undefined &&
    !titulo
  ) {
    return NextResponse.json(
      { error: "El título no puede estar vacío." },
      { status: 400 },
    );
  }

  if (
    body.slug !== undefined &&
    !slug
  ) {
    return NextResponse.json(
      { error: "El slug no puede estar vacío." },
      { status: 400 },
    );
  }

  if (
    slug !== undefined &&
    slug !== contenidoActual.slug
  ) {
    const slugExistente =
      await database.query<{ id: number }[]>(
        `
          SELECT id
          FROM contenido_pagina
          WHERE slug = $1
            AND id <> $2
          LIMIT 1
        `,
        [slug, contenidoId],
      );

    if (slugExistente[0]) {
      return NextResponse.json(
        { error: "Ya existe un contenido con ese slug." },
        { status: 409 },
      );
    }
  }

  if (
    contenidoActual.tipo !== "MENU" &&
    padreId
  ) {
    const padre =
      await database.query<
        {
          id: number;
          tipo: ContenidoTipo;
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
        { error: "El elemento padre no existe." },
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
      padre[0].tipo !== "MENU" &&
      padre[0].tipo !== "SUBMENU"
    ) {
      return NextResponse.json(
        {
          error:
            "La sección debe asociarse a una página válida.",
        },
        { status: 400 },
      );
    }
  }

  try {
    const resultado =
      await database.query<ContenidoActualizado[]>(
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
    console.error(
      "ERROR PATCH /api/dashboard/contenido/[id]:",
      error,
    );

    return NextResponse.json(
      { error: "No se pudo actualizar el contenido." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RutaContext,
) {
  void request;

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

  if (!Number.isInteger(contenidoId) || contenidoId < 1) {
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
      { error: "Contenido no encontrado." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    eliminado: true,
  });
}
