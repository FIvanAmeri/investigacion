import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import {
  EstadoUsuario,
  User,
} from "@/entities/Usuario";

export async function GET(
  request: Request,
) {
  try {
    const url = new URL(request.url);
    const token =
      url.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Token de verificación inexistente",
        },
        { status: 400 },
      );
    }

    const database =
      await getDatabase();

    const repository =
      database.getRepository(User);

    const usuario =
      await repository.findOne({
        where: {
          tokenVerificacion: token,
        },
      });

    if (!usuario) {
      return NextResponse.json(
        {
          error:
            "El enlace de verificación no es válido",
        },
        { status: 400 },
      );
    }

    usuario.correoVerificado = true;
    usuario.tokenVerificacion = null;

    if (
      usuario.estado ===
      EstadoUsuario.PENDIENTE
    ) {
      usuario.estado =
        EstadoUsuario.PENDIENTE;
    }

    await repository.save(usuario);

    return NextResponse.redirect(
      new URL(
        "/investigacion?verificado=1",
        process.env.APP_URL ??
          "http://localhost:3000",
      ),
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "No se pudo verificar el correo",
      },
      { status: 500 },
    );
  }
}