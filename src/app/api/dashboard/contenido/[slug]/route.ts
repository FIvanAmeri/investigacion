import { NextResponse } from "next/server";
import { obtenerSeccionesPagina } from "@/lib/contenido";

interface RutaContext {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  _request: Request,
  context: RutaContext,
) {
  const { slug } = await context.params;

  if (!slug || slug.length > 150) {
    return NextResponse.json(
      { error: "Página inválida." },
      { status: 400 },
    );
  }

  try {
    const secciones =
      await obtenerSeccionesPagina(slug);

    return NextResponse.json({
      secciones,
    });
  } catch (error) {
    console.error(
      "ERROR GET /api/contenido/[slug]:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "No se pudo obtener el contenido de la página.",
      },
      { status: 500 },
    );
  }
}
