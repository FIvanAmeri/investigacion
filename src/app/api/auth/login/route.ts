import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDatabase } from "@/lib/db";
import {
  EstadoUsuario,
  User,
} from "@/entities/Usuario";
import { setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const correo =
      typeof body.correo === "string"
        ? body.correo.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!correo || !password) {
      return NextResponse.json(
        {
          error:
            "Correo y contraseña son obligatorios.",
        },
        { status: 400 },
      );
    }

    const database = await getDatabase();

    const repository =
      database.getRepository<User>("User");

    const usuario = await repository.findOne({
      where: {
        correo,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        {
          error:
            "Correo o contraseña incorrectos.",
        },
        { status: 401 },
      );
    }

    const passwordCorrecta =
      await bcrypt.compare(
        password,
        usuario.password,
      );

    if (!passwordCorrecta) {
      return NextResponse.json(
        {
          error:
            "Correo o contraseña incorrectos.",
        },
        { status: 401 },
      );
    }

    if (!usuario.correoVerificado) {
      return NextResponse.json(
        {
          error:
            "Primero tenés que confirmar tu correo electrónico.",
        },
        { status: 403 },
      );
    }

    if (
      usuario.estado ===
      EstadoUsuario.PENDIENTE
    ) {
      return NextResponse.json(
        {
          error:
            "Tu cuenta está pendiente de aprobación por el administrador.",
        },
        { status: 403 },
      );
    }

    if (
      usuario.estado ===
      EstadoUsuario.DENEGADO
    ) {
      return NextResponse.json(
        {
          error:
            "Tu solicitud de acceso fue denegada.",
        },
        { status: 403 },
      );
    }

    if (
      usuario.estado !==
      EstadoUsuario.APROBADO
    ) {
      return NextResponse.json(
        {
          error:
            "Tu cuenta todavía no está habilitada.",
        },
        { status: 403 },
      );
    }

    await setSessionCookie(usuario);

    return NextResponse.json({
      mensaje: "Logeado exitosamente.",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: usuario.rol,
        esSuperAdmin: usuario.esSuperAdmin,
      },
    });
  } catch (error) {
    console.error(
      "ERROR EN /api/auth/login:",
      error,
    );

    return NextResponse.json(
      {
        error: "Error interno del servidor.",
        detalle:
          error instanceof Error
            ? error.message
            : "Error desconocido.",
      },
      { status: 500 },
    );
  }
}