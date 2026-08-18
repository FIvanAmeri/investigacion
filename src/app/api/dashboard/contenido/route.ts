import { NextRequest, NextResponse } from "next/server";
import { obtenerSuperAdminDashboard } from "@/lib/dashboard";
import { getDatabase } from "@/lib/db";
import { ContenidoTipo } from "@/lib/contenido";

interface CrearContenidoBody {
  tipo: ContenidoTipo;
  titulo: string;
  slug: string;
  contenido?: string | null;
  configuracion?: Record<string, unknown> | null;
  orden?: number;
  activo?: boolean;
  padreId?: number | null;
}

interface ContenidoCreado {
  id: number;
  tipo: string;
  titulo: string;
  slug: string;
  contenido: string | null;
  configuracion: Record<string, unknown> | null;
  orden: number;
  activo: boolean;
  padreId: number | null;
}

function esTipoContenido(
  valor: unknown,
): valor is ContenidoTipo {
  return (
    valor === "MENU" ||
    valor === "SUBMENU" ||
    valor === "SECCION"
  );
}

export async function GET(request: NextRequest) {
  const superAdmin =
    await obtenerSuperAdminDashboard();

  if (!superAdmin) {
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 403 },
    );
  }

  const tipoParametro =
    request.nextUrl.searchParams.get("tipo");

  const database = await getDatabase();

  const parametros: unknown[] = [];
  let where = "";

  if (esTipoContenido(tipoParametro)) {
    parametros.push(tipoParametro);
    where = "WHERE tipo = $1";
  }

  const contenidos =
    await database.query<ContenidoCreado[]>(
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
          padre_id AS "padreId"
        FROM contenido_pagina
        ${where}
        ORDER BY orden ASC, id ASC
      `,
      parametros,
    );

  return NextResponse.json({
    contenidos,
  });
}

export async function POST(
  request: NextRequest,
) {
  const superAdmin =
    await obtenerSuperAdminDashboard();

  if (!superAdmin) {
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 403 },
    );
  }

  const body =
    (await request.json()) as CrearContenidoBody;

  if (!esTipoContenido(body.tipo)) {
    return NextResponse.json(
      {
        error: "Tipo de contenido inválido.",
      },
      { status: 400 },
    );
  }

  const titulo = body.titulo?.trim();
  const slug = body.slug?.trim();

  if (!titulo || !slug) {
    return NextResponse.json(
      {
        error:
          "El título y el slug son obligatorios.",
      },
      { status: 400 },
    );
  }

  if (
    body.tipo === "MENU" &&
    body.padreId !== null &&
    body.padreId !== undefined
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
    body.tipo !== "MENU" &&
    !body.padreId
  ) {
    return NextResponse.json(
      {
        error:
          "Los submenús y las secciones necesitan un elemento padre.",
      },
      { status: 400 },
    );
  }

  const database = await getDatabase();

  if (
    body.tipo !== "MENU" &&
    body.padreId
  ) {
    const padre = await database.query<
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
      [body.padreId],
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
      body.tipo === "SUBMENU" &&
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
      body.tipo === "SECCION" &&
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

  try {
    const resultado =
      await database.query<ContenidoCreado[]>(
        `
          INSERT INTO contenido_pagina
          (
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
          )
          VALUES
          (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            NOW(),
            NOW()
          )
          RETURNING
            id,
            tipo,
            titulo,
            slug,
            contenido,
            configuracion,
            orden,
            activo,
            padre_id AS "padreId"
        `,
        [
          body.tipo,
          titulo,
          slug,
          body.tipo === "SECCION"
            ? body.contenido ?? null
            : null,
          body.configuracion ?? {},
          body.orden ?? 1,
          body.activo ?? true,
          body.tipo === "MENU"
            ? null
            : body.padreId ?? null,
        ],
      );

    return NextResponse.json(
      {
        contenido: resultado[0],
      },
      { status: 201 },
    );
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
      "ERROR POST /api/dashboard/contenido:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "No se pudo crear el contenido.",
      },
      { status: 500 },
    );
  }
}