import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDatabase } from "@/lib/db";
import {
  EstadoUsuario,
  User,
} from "@/entities/Usuario";

export async function GET() {
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
    const database = await getDatabase();
    const repositorio =
      database.getRepository(User);

    const investigadores =
      await repositorio.find({
        where: {
          esSuperAdmin: false,
          estado: EstadoUsuario.PENDIENTE,
        },
        order: {
          createdAt: "ASC",
        },
      });

    return NextResponse.json({
      investigadores: investigadores.map(
        (usuario) => ({
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          localidad: usuario.localidad,
          centroMedico:
            usuario.centroMedico,
          especialidad:
            usuario.especialidad,
          correo: usuario.correo,
          correoVerificado:
            usuario.correoVerificado,
          estado: usuario.estado,
          createdAt: usuario.createdAt,
        }),
      ),
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "No se pudieron obtener los investigadores pendientes.",
      },
      { status: 500 },
    );
  }
}