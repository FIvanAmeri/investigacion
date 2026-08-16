import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { getSession } from "@/lib/auth";

interface ContenidoRow {
  id: number;
  titulo: string;
  slug: string;
  descripcion: string | null;
  contenido: string;
  orden: number;
  activo: boolean;
  created_at: Date;
  updated_at: Date;
}

interface CrearContenidoBody {
  titulo?: string;
  slug?: string;
  descripcion?: string;
  contenido?: string;
  orden?: number;
  activo?: boolean;
}

export async function GET() {
  try {
    const database = await getDatabase();

    const contenido = await database.query<ContenidoRow[]>(
      `
        SELECT
          id,
          titulo,
          slug,
          descripcion,
          contenido,
          orden,
          activo,
          created_at,
          updated_at
        FROM contenido
        ORDER BY orden ASC, id ASC
      `,
    );

    return NextResponse.json({
      contenido,
    });
  } catch {
    return NextResponse.json(
      {
        error: "No se pudo obtener el contenido.",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "No autenticado.",
        },
        { status: 401 },
      );
    }

    if (!session.esSuperAdmin) {
      return NextResponse.json(
        {
          error: "Acceso denegado.",
        },
        { status: 403 },
      );
    }

    const body =
      (await request.json()) as CrearContenidoBody;

    const titulo =
      typeof body.titulo === "string"
        ? body.titulo.trim()
        : "";

    const slug =
      typeof body.slug === "string"
        ? body.slug.trim()
        : "";

    const contenido =
      typeof body.contenido === "string"
        ? body.contenido
        : "";

    if (!titulo || !slug || !contenido) {
      return NextResponse.json(
        {
          error:
            "Título, slug y contenido son obligatorios.",
        },
        { status: 400 },
      );
    }

    const descripcion =
      typeof body.descripcion === "string"
        ? body.descripcion.trim()
        : null;

    const orden =
      typeof body.orden === "number"
        ? body.orden
        : 0;

    const activo =
      typeof body.activo === "boolean"
        ? body.activo
        : true;

    const database = await getDatabase();

    const resultado =
      await database.query<ContenidoRow[]>(
        `
          INSERT INTO contenido (
            titulo,
            slug,
            descripcion,
            contenido,
            orden,
            activo
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING
            id,
            titulo,
            slug,
            descripcion,
            contenido,
            orden,
            activo,
            created_at,
            updated_at
        `,
        [
          titulo,
          slug,
          descripcion,
          contenido,
          orden,
          activo,
        ],
      );

    return NextResponse.json(
      {
        mensaje:
          "Contenido creado correctamente.",
        contenido: resultado[0],
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "No se pudo crear el contenido.",
      },
      { status: 500 },
    );
  }
}