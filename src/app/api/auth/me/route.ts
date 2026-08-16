import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { User } from "@/entities/Usuario";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      {
        autenticado: false,
      },
      { status: 401 },
    );
  }

  const database = await getDatabase();

  const usuario = await database
    .getRepository(User)
    .findOne({
      where: {
        id: session.userId,
      },
    });

  if (!usuario) {
    return NextResponse.json(
      {
        autenticado: false,
      },
      { status: 401 },
    );
  }

  return NextResponse.json({
    autenticado: true,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      localidad: usuario.localidad,
      centroMedico: usuario.centroMedico,
      especialidad: usuario.especialidad,
      rol: usuario.rol,
      esSuperAdmin: usuario.esSuperAdmin,
      estado: usuario.estado,
      correoVerificado: usuario.correoVerificado,
    },
  });
}