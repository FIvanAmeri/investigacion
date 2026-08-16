import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDatabase } from "@/lib/db";
import {
  EstadoUsuario,
  User,
} from "@/entities/Usuario";

interface AprobarBody {
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
    const body = (await request.json()) as AprobarBody;

    if (!body.id) {
      return NextResponse.json(
        {
          error:
            "El ID del investigador es obligatorio.",
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
        },
      });

    if (!investigador) {
      return NextResponse.json(
        {
          error: "Investigador no encontrado.",
        },
        { status: 404 },
      );
    }

    if (!investigador.correoVerificado) {
      return NextResponse.json(
        {
          error:
            "El investigador todavía no confirmó su correo electrónico.",
        },
        { status: 400 },
      );
    }

    if (
      investigador.estado !==
      EstadoUsuario.PENDIENTE
    ) {
      return NextResponse.json(
        {
          error:
            "La cuenta no está pendiente de aprobación.",
        },
        { status: 400 },
      );
    }

    investigador.estado =
      EstadoUsuario.APROBADO;

    await repositorio.save(investigador);

    return NextResponse.json({
      mensaje:
        "Investigador aprobado correctamente.",
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "No se pudo aprobar al investigador.",
      },
      { status: 500 },
    );
  }
}