import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { User } from "@/entities/Usuario";
import { UsuarioSistema } from "@/entities/UsuarioSistema";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "No autenticado." },
        { status: 401 },
      );
    }

    if (!session.esSuperAdmin) {
      return NextResponse.json(
        { error: "Acceso denegado." },
        { status: 403 },
      );
    }

    const database = await getDatabase();

    const usuarioRepository =
      database.getRepository(User);

    const superAdmin =
      await usuarioRepository.findOne({
        where: {
          id: session.userId,
          esSuperAdmin: true,
        },
      });

    if (!superAdmin) {
      return NextResponse.json(
        { error: "Acceso denegado." },
        { status: 403 },
      );
    }

    const usuarios =
      await usuarioRepository.find({
        order: {
          createdAt: "DESC",
        },
      });

    const usuarioSistemaRepository =
      database.getRepository(
        UsuarioSistema,
      );

    const asignaciones =
      await usuarioSistemaRepository.find();

    return NextResponse.json({
      usuarios: usuarios.map((usuario) => ({
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        localidad: usuario.localidad,
        centroMedico: usuario.centroMedico,
        especialidad: usuario.especialidad,
        correo: usuario.correo,
        estado: usuario.estado,
        correoVerificado:
          usuario.correoVerificado,
        rol: usuario.rol,
        esSuperAdmin:
          usuario.esSuperAdmin,
        createdAt: usuario.createdAt,
        sistemasIds: asignaciones
          .filter(
            (asignacion) =>
              asignacion.usuarioId ===
              usuario.id,
          )
          .map(
            (asignacion) =>
              asignacion.sistemaId,
          ),
      })),
    });
  } catch (error) {
    console.error(
      "ERROR EN /api/dashboard/usuarios:",
      error,
    );

    return NextResponse.json(
      { error: "No autorizado." },
      { status: 401 },
    );
  }
}