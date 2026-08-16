import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import {
  EstadoUsuario,
  User,
} from "@/entities/Usuario";
import {
  getSession,
} from "@/lib/auth";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const session = await getSession();

    if (!session || !session.esSuperAdmin) {
      return NextResponse.json(
        {
          error: "Acceso denegado.",
        },
        {
          status: 403,
        },
      );
    }

    const { id } = await context.params;

    const body = (await request.json()) as {
      accion?: "aprobar" | "denegar";
    };

    if (
      body.accion !== "aprobar" &&
      body.accion !== "denegar"
    ) {
      return NextResponse.json(
        {
          error: "Acción inválida.",
        },
        {
          status: 400,
        },
      );
    }

    const database = await getDatabase();
    const repository = database.getRepository(User);

    const usuario = await repository.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!usuario) {
      return NextResponse.json(
        {
          error: "Usuario no encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    if (usuario.esSuperAdmin) {
      return NextResponse.json(
        {
          error:
            "No se puede modificar la cuenta de un superadmin.",
        },
        {
          status: 400,
        },
      );
    }

    if (body.accion === "aprobar") {
      usuario.estado = EstadoUsuario.APROBADO;

      await repository.save(usuario);

      return NextResponse.json({
        mensaje: "Usuario aprobado correctamente.",
      });
    }

    await repository.remove(usuario);

    return NextResponse.json({
      mensaje:
        "Usuario denegado y eliminado correctamente.",
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "No se pudo procesar la solicitud.",
      },
      {
        status: 500,
      },
    );
  }
}