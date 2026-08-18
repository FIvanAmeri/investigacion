import { NextResponse } from "next/server";
import { obtenerNavegacionPublica } from "@/lib/contenido";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const navigation =
      await obtenerNavegacionPublica();

    return NextResponse.json(
      {
        navigation,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      },
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "No se pudo obtener la navegación.",
      },
      { status: 500 },
    );
  }
}