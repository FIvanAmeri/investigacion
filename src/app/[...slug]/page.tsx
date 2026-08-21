import { notFound } from "next/navigation";
import ContenidoPaginaClient from "@/app/components/ContenidoPaginaClient";
import { getDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PaginaRuta {
  id: number;
  tipo: "MENU" | "SUBMENU";
  slug: string;
  padreId: number | null;
}

interface RutaProps {
  params: Promise<{
    slug: string[];
  }>;
}

function decodificarSegmento(
  segmento: string,
): string {
  return decodeURIComponent(segmento).trim();
}

function construirRuta(
  pagina: PaginaRuta,
  paginas: PaginaRuta[],
): string[] | null {
  const ruta: string[] = [];
  const visitados = new Set<number>();

  let actual: PaginaRuta | undefined =
    pagina;

  while (actual) {
    if (visitados.has(actual.id)) {
      return null;
    }

    visitados.add(actual.id);
    ruta.unshift(actual.slug);

    if (actual.padreId === null) {
      break;
    }

    actual = paginas.find(
      (item) =>
        item.id === actual?.padreId,
    );
  }

  if (
    !actual ||
    ruta.length === 0
  ) {
    return null;
  }

  return ruta;
}

export default async function PaginaPublicaDinamica({
  params,
}: RutaProps) {
  const { slug } = await params;

  const segmentos = slug
    .map(decodificarSegmento)
    .filter(Boolean);

  if (segmentos.length === 0) {
    notFound();
  }

  const database =
    await getDatabase();

  const paginas =
    await database.query<PaginaRuta[]>(
      `
        SELECT
          id,
          tipo,
          slug,
          padre_id AS "padreId"
        FROM contenido_pagina
        WHERE tipo IN ('MENU', 'SUBMENU')
          AND activo = TRUE
        ORDER BY id ASC
      `,
    );

  const ultimoSegmento =
    segmentos[
      segmentos.length - 1
    ];

  const candidatos =
    paginas.filter(
      (pagina) =>
        pagina.slug ===
        ultimoSegmento,
    );

  const pagina = candidatos.find(
    (candidato) => {
      const ruta =
        construirRuta(
          candidato,
          paginas,
        );

      if (!ruta) {
        return false;
      }

      if (
        ruta.length !==
        segmentos.length
      ) {
        return false;
      }

      return ruta.every(
        (segmento, index) =>
          segmento ===
          segmentos[index],
      );
    },
  );

  if (!pagina) {
    notFound();
  }

  return (
    <ContenidoPaginaClient
      paginaSlug={pagina.slug}
      vista="GENERICO"
    />
  );
}