import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDatabase } from "@/lib/db";
import {
  EstadoUsuario,
  User,
} from "@/entities/Usuario";

interface RechazarBody {
  id?: number;
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session || !session.esSuperAdmin) {
    return NextResponse.json(
      {
        error: "No autorizado.",
      },
      { status: 403 },
    );
  }

  try {
    const body = (await request.json()) as RechazarBody;

    if (!body.id) {
      return NextResponse.json(
        {
          error:
            "El ID del investigador es obligatorio.",
        },
        { status: 400 },
      );
    }

    if (body.id === session.userId) {
      return NextResponse.json(
        {
          error:
            "No podés eliminar tu propia cuenta.",
        },
        { status: 400 },
      );
    }

    const database = await getDatabase();
    const repositorio =
      database.getRepository(User);

    const investigador =
      await repositorio.findOne({
        where: {
          id: body.id,
          esSuperAdmin: false,
          estado: EstadoUsuario.PENDIENTE,
        },
      });

    if (!investigador) {
      return NextResponse.json(
        {
          error:
            "Investigador no encontrado o no está pendiente de aprobación.",
        },
        { status: 404 },
      );
    }

    await repositorio.remove(investigador);

    return NextResponse.json({
      mensaje:
        "Investigador rechazado y eliminado correctamente.",
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "No se pudo rechazar al investigador.",
      },
      { status: 500 },
    );
  }
}