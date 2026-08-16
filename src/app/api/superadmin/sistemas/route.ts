import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { getSession } from "@/lib/auth";

interface SistemaRow {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  url: string | null;
  imagen: string | null;
  activo: boolean;
  orden: number;
  created_at: Date;
  updated_at: Date;
}

interface CrearSistemaBody {
  nombre?: string;
  slug?: string;
  descripcion?: string;
  url?: string;
  imagen?: string;
  activo?: boolean;
  orden?: number;
}

export async function GET() {
  try {
    const database = await getDatabase();

    const sistemas =
      await database.query<SistemaRow[]>(
        `
          SELECT
            id,
            nombre,
            slug,
            descripcion,
            url,
            imagen,
            activo,
            orden,
            created_at,
            updated_at
          FROM sistemas
          WHERE activo = true
          ORDER BY orden ASC, id ASC
        `,
      );

    return NextResponse.json({
      sistemas,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "No se pudieron obtener los sistemas.",
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
      (await request.json()) as CrearSistemaBody;

    const nombre =
      typeof body.nombre === "string"
        ? body.nombre.trim()
        : "";

    const slug =
      typeof body.slug === "string"
        ? body.slug.trim()
        : "";

    if (!nombre || !slug) {
      return NextResponse.json(
        {
          error:
            "Nombre y slug son obligatorios.",
        },
        { status: 400 },
      );
    }

    const descripcion =
      typeof body.descripcion === "string"
        ? body.descripcion.trim()
        : null;

    const url =
      typeof body.url === "string"
        ? body.url.trim()
        : null;

    const imagen =
      typeof body.imagen === "string"
        ? body.imagen.trim()
        : null;

    const activo =
      typeof body.activo === "boolean"
        ? body.activo
        : true;

    const orden =
      typeof body.orden === "number"
        ? body.orden
        : 0;

    const database = await getDatabase();

    const resultado =
      await database.query<SistemaRow[]>(
        `
          INSERT INTO sistemas (
            nombre,
            slug,
            descripcion,
            url,
            imagen,
            activo,
            orden
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING
            id,
            nombre,
            slug,
            descripcion,
            url,
            imagen,
            activo,
            orden,
            created_at,
            updated_at
        `,
        [
          nombre,
          slug,
          descripcion,
          url,
          imagen,
          activo,
          orden,
        ],
      );

    return NextResponse.json(
      {
        mensaje:
          "Sistema creado correctamente.",
        sistema: resultado[0],
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "No se pudo crear el sistema.",
      },
      { status: 500 },
    );
  }
}