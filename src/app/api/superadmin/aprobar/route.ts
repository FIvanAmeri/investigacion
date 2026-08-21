import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDatabase } from "@/lib/db";
import {
  EstadoUsuario,
  RolUsuario,
  User,
} from "@/entities/Usuario";
import { enviarCorreoAprobacion } from "@/lib/mail";

interface AprobarBody {
  id?: number;
  rol?: RolUsuario;
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
    const body =
      (await request.json()) as AprobarBody;

    if (!body.id) {
      return NextResponse.json(
        {
          error:
            "El ID del investigador es obligatorio.",
        },
        { status: 400 },
      );
    }

    const rol =
      body.rol === RolUsuario.COLABORADOR
        ? RolUsuario.COLABORADOR
        : RolUsuario.INVESTIGADOR;

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
          error:
            "Investigador no encontrado.",
        },
        { status: 404 },
      );
    }

    if (
      !investigador.correoVerificado
    ) {
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

    investigador.rol = rol;

    investigador.esSuperAdmin = false;

    await repositorio.save(
      investigador,
    );

    try {
      await enviarCorreoAprobacion(
        investigador.correo,
        investigador.nombre,
      );
    } catch (caught) {
      console.error(
        "Error enviando correo de aprobación:",
        caught,
      );
    }

    return NextResponse.json({
      mensaje:
        "Investigador aprobado correctamente.",
      usuario: {
        id: investigador.id,
        estado: investigador.estado,
        rol: investigador.rol,
        sistemasIds: [],
      },
    });
  } catch (caught) {
    console.error(
      "Error aprobando investigador:",
      caught,
    );

    return NextResponse.json(
      {
        error:
          "No se pudo aprobar al investigador.",
      },
      { status: 500 },
    );
  }
}