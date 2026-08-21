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
import {
  enviarCorreoAprobacion,
  enviarCorreoRechazo,
} from "@/lib/mail";

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
          localidad:
            usuario.localidad,
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

    const body =
      await request.json();

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

    if (
      accion === "aprobar"
    ) {
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

      await repository.save(
        usuario,
      );

      try {
        await enviarCorreoAprobacion(
          usuario.correo,
          usuario.nombre,
        );
      } catch {
        return NextResponse.json(
          {
            error:
              "El usuario fue aprobado, pero no se pudo enviar el correo de aprobación.",
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        message:
          "Usuario aprobado correctamente y correo enviado",
      });
    }

    if (
      accion === "denegar"
    ) {
      const correo =
        usuario.correo;

      const nombre =
        usuario.nombre;

      try {
        await enviarCorreoRechazo(
          correo,
          nombre,
        );
      } catch {
        return NextResponse.json(
          {
            error:
              "No se pudo enviar el correo de rechazo. El usuario no fue eliminado.",
          },
          { status: 500 },
        );
      }

      await repository.remove(
        usuario,
      );

      return NextResponse.json({
        message:
          "Usuario denegado, eliminado y correo enviado correctamente",
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

      await repository.save(
        usuario,
      );

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