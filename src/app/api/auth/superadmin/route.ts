import { NextResponse } from "next/server";
import {
  EstadoUsuario,
  RolUsuario,
  User,
} from "@/entities/Usuario";
import {
  getSession,
} from "@/lib/auth";
import { getDatabase } from "@/lib/db";

export async function GET() {
  try {
    const session =
      await getSession();

    if (
      !session ||
      !session.esSuperAdmin
    ) {
      return NextResponse.json(
        {
          error:
            "No autorizado",
        },
        { status: 403 },
      );
    }

    const database =
      await getDatabase();

    const repository =
      database.getRepository(User);

    const usuarios =
      await repository.find({
        order: {
          createdAt: "DESC",
        },
      });

    return NextResponse.json({
      usuarios: usuarios.map(
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
          estado: usuario.estado,
          rol: usuario.rol,
          correoVerificado:
            usuario.correoVerificado,
          esSuperAdmin:
            usuario.esSuperAdmin,
          createdAt:
            usuario.createdAt,
        }),
      ),
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

export async function POST(
  request: Request,
) {
  try {
    const session =
      await getSession();

    if (
      !session ||
      !session.esSuperAdmin
    ) {
      return NextResponse.json(
        {
          error:
            "No autorizado",
        },
        { status: 403 },
      );
    }

    const body = await request.json();

    const usuarioId =
      Number(body.usuarioId);

    const accion =
      typeof body.accion === "string"
        ? body.accion
        : "";

    if (
      !Number.isInteger(
        usuarioId,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "ID de usuario inválido",
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
          id: usuarioId,
        },
      });

    if (!usuario) {
      return NextResponse.json(
        {
          error:
            "Usuario no encontrado",
        },
        { status: 404 },
      );
    }

    if (accion === "aprobar") {
      const rol =
        body.rol ===
        RolUsuario.SUPERADMIN
          ? RolUsuario.SUPERADMIN
          : RolUsuario.INVESTIGADOR;

      usuario.estado =
        EstadoUsuario.APROBADO;

      usuario.rol = rol;

      usuario.esSuperAdmin =
        rol ===
        RolUsuario.SUPERADMIN;

      await repository.save(usuario);

      return NextResponse.json({
        message:
          "Usuario aprobado correctamente",
      });
    }

    if (accion === "denegar") {
      await repository.remove(usuario);

      return NextResponse.json({
        message:
          "Usuario denegado y eliminado correctamente",
      });
    }

    if (accion === "rol") {
      const rol =
        body.rol ===
        RolUsuario.SUPERADMIN
          ? RolUsuario.SUPERADMIN
          : RolUsuario.INVESTIGADOR;

      usuario.rol = rol;

      usuario.esSuperAdmin =
        rol ===
        RolUsuario.SUPERADMIN;

      await repository.save(usuario);

      return NextResponse.json({
        message:
          "Rol actualizado correctamente",
      });
    }

    return NextResponse.json(
      {
        error:
          "Acción inválida",
      },
      { status: 400 },
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