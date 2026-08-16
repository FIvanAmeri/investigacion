import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDatabase } from "@/lib/db";
import { User } from "@/entities/Usuario";

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();

    const token =
      typeof body.token === "string"
        ? body.token.trim()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!token || !password) {
      return NextResponse.json(
        {
          error:
            "Token y contraseña son obligatorios",
        },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error:
            "La contraseña debe tener al menos 8 caracteres",
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
          tokenRecuperacion: token,
        },
      });

    if (!usuario) {
      return NextResponse.json(
        {
          error:
            "El enlace de recuperación no es válido",
        },
        { status: 400 },
      );
    }

    if (
      !usuario.tokenRecuperacionExpira ||
      usuario.tokenRecuperacionExpira.getTime() <
        Date.now()
    ) {
      return NextResponse.json(
        {
          error:
            "El enlace de recuperación expiró",
        },
        { status: 400 },
      );
    }

    usuario.password =
      await bcrypt.hash(
        password,
        12,
      );

    usuario.tokenRecuperacion = null;
    usuario.tokenRecuperacionExpira =
      null;

    await repository.save(usuario);

    return NextResponse.json({
      message:
        "La contraseña fue actualizada correctamente",
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