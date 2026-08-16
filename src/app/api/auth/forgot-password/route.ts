import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDatabase } from "@/lib/db";
import { User } from "@/entities/Usuario";
import { enviarCorreoRecuperacion } from "@/lib/mail";

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();

    const correo =
      typeof body.correo === "string"
        ? body.correo.trim().toLowerCase()
        : "";

    if (!correo) {
      return NextResponse.json(
        {
          error:
            "El correo es obligatorio",
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
        where: { correo },
      });

    if (usuario) {
      const token =
        crypto.randomBytes(32).toString("hex");

      usuario.tokenRecuperacion = token;

      usuario.tokenRecuperacionExpira =
        new Date(
          Date.now() +
            1000 * 60 * 30,
        );

      await repository.save(usuario);

      await enviarCorreoRecuperacion(
        usuario.correo,
        usuario.nombre,
        token,
      );
    }

    return NextResponse.json({
      message:
        "Si el correo existe, recibirás instrucciones para recuperar tu contraseña.",
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Error interno del servidor",
      },
      { status: 500 },
    );
  }
}