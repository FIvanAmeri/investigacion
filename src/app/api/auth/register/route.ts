import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getDatabase } from "@/lib/db";
import {
  EstadoUsuario,
  RolUsuario,
  User,
} from "@/entities/Usuario";
import { enviarCorreoVerificacion } from "@/lib/mail";

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();

    const nombre =
      typeof body.nombre === "string"
        ? body.nombre.trim()
        : "";

    const apellido =
      typeof body.apellido === "string"
        ? body.apellido.trim()
        : "";

    const localidad =
      typeof body.localidad === "string"
        ? body.localidad.trim()
        : "";

    const centroMedico =
      typeof body.centroMedico ===
      "string"
        ? body.centroMedico.trim()
        : "";

    const especialidad =
      typeof body.especialidad ===
      "string"
        ? body.especialidad.trim()
        : "";

    const correo =
      typeof body.correo === "string"
        ? body.correo.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (
      !nombre ||
      !apellido ||
      !localidad ||
      !centroMedico ||
      !especialidad ||
      !correo ||
      !password
    ) {
      return NextResponse.json(
        {
          error:
            "Todos los campos son obligatorios",
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

    const usuarioExistente =
      await repository.findOne({
        where: { correo },
      });

    if (usuarioExistente) {
      return NextResponse.json(
        {
          error:
            "Ya existe un usuario con ese correo",
        },
        { status: 409 },
      );
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

    const tokenVerificacion =
      crypto.randomBytes(32).toString("hex");

    const usuario =
      repository.create({
        nombre,
        apellido,
        localidad,
        centroMedico,
        especialidad,
        correo,
        password: passwordHash,
        estado:
          EstadoUsuario.PENDIENTE,
        rol:
          RolUsuario.INVESTIGADOR,
        correoVerificado: false,
        esSuperAdmin: false,
        tokenVerificacion,
        tokenRecuperacion: null,
        tokenRecuperacionExpira: null,
      });

    await repository.save(usuario);

    try {
      await enviarCorreoVerificacion(
        correo,
        nombre,
        tokenVerificacion,
      );
    } catch {
      await repository.remove(usuario);

      return NextResponse.json(
        {
          error:
            "No se pudo enviar el correo de verificación",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message:
          "Registro realizado. Revisá tu correo electrónico para confirmar tu cuenta.",
      },
      { status: 201 },
    );
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