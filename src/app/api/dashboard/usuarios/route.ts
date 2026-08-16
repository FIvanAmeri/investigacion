import { NextResponse } from "next/server";
import {
  EstadoUsuario,
  RolUsuario,
  User,
} from "@/entities/Usuario";
import { getDatabase } from "@/lib/db";
import { obtenerSuperAdminDashboard } from "@/lib/dashboard";

export async function PATCH(
  request: Request,
) {
  try {
    const superAdmin =
      await obtenerSuperAdminDashboard();

    if (!superAdmin) {
      return NextResponse.json(
        {
          error:
            "No tenés permisos para realizar esta acción.",
        },
        {
          status: 403,
        },
      );
    }

    const body = await request.json();

    const usuarioId = Number(body.usuarioId);
    const accion = body.accion;
    const rol = body.rol;

    if (
      !Number.isInteger(usuarioId) ||
      usuarioId <= 0
    ) {
      return NextResponse.json(
        {
          error: "El usuario indicado no es válido.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      accion !== "aprobar" &&
      accion !== "rechazar"
    ) {
      return NextResponse.json(
        {
          error: "La acción indicada no es válida.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      accion === "aprobar" &&
      rol !== RolUsuario.INVESTIGADOR &&
      rol !== RolUsuario.COLABORADOR
    ) {
      return NextResponse.json(
        {
          error:
            "Para aprobar un usuario tenés que asignar Investigador o Colaborador.",
        },
        {
          status: 400,
        },
      );
    }

    const database = await getDatabase();
    const repository = database.getRepository(User);

    const usuario = await repository.findOne({
      where: {
        id: usuarioId,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        {
          error: "El usuario no existe.",
        },
        {
          status: 404,
        },
      );
    }

    if (usuario.esSuperAdmin) {
      return NextResponse.json(
        {
          error:
            "El SuperAdmin no puede ser modificado desde esta sección.",
        },
        {
          status: 400,
        },
      );
    }

    if (accion === "aprobar") {
      usuario.estado = EstadoUsuario.APROBADO;
      usuario.rol = rol as RolUsuario;
    }

    if (accion === "rechazar") {
      usuario.estado = EstadoUsuario.DENEGADO;
    }

    await repository.save(usuario);

    return NextResponse.json({
      ok: true,
      usuario: {
        id: usuario.id,
        estado: usuario.estado,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error(
      "Error actualizando usuario:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Ocurrió un error al actualizar el usuario.",
      },
      {
        status: 500,
      },
    );
  }
}