import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import {
  EstadoUsuario,
  RolUsuario,
  User,
} from "@/entities/Usuario";
import { UsuarioSistema } from "@/entities/UsuarioSistema";
import { getSession } from "@/lib/auth";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface ActualizarUsuarioBody {
  accion?: "aprobar" | "denegar";
  rol?: RolUsuario;
  sistemasIds?: number[];
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const session = await getSession();

    if (!session || !session.esSuperAdmin) {
      return NextResponse.json(
        {
          error: "Acceso denegado.",
        },
        {
          status: 403,
        },
      );
    }

    const { id } = await context.params;

    const body =
      (await request.json()) as ActualizarUsuarioBody;

    if (
      body.accion !== "aprobar" &&
      body.accion !== "denegar"
    ) {
      return NextResponse.json(
        {
          error: "Acción inválida.",
        },
        {
          status: 400,
        },
      );
    }

    const database = await getDatabase();

    const repository =
      database.getRepository(User);

    const usuario = await repository.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!usuario) {
      return NextResponse.json(
        {
          error: "Usuario no encontrado.",
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
            "No se puede modificar la cuenta de un superadmin.",
        },
        {
          status: 400,
        },
      );
    }

    if (body.accion === "aprobar") {
      if (
        body.rol !== RolUsuario.INVESTIGADOR &&
        body.rol !== RolUsuario.COLABORADOR
      ) {
        return NextResponse.json(
          {
            error:
              "Debés seleccionar un rol válido.",
          },
          {
            status: 400,
          },
        );
      }

      const sistemasIds = Array.isArray(
        body.sistemasIds,
      )
        ? [
            ...new Set(
              body.sistemasIds.filter(
                (idSistema) =>
                  Number.isInteger(idSistema) &&
                  idSistema > 0,
              ),
            ),
          ]
        : [];

      if (sistemasIds.length === 0) {
        return NextResponse.json(
          {
            error:
              "Debés asignar al menos un sistema.",
          },
          {
            status: 400,
          },
        );
      }

      const sistemasExistentes =
        await database.query<{ id: number }[]>(
          `
            SELECT id
            FROM sistemas
            WHERE id = ANY($1::int[])
              AND activo = true
          `,
          [sistemasIds],
        );

      if (
        sistemasExistentes.length !==
        sistemasIds.length
      ) {
        return NextResponse.json(
          {
            error:
              "Uno o más sistemas seleccionados no existen o están inactivos.",
          },
          {
            status: 400,
          },
        );
      }

      usuario.estado =
        EstadoUsuario.APROBADO;

      usuario.rol = body.rol;

      await repository.save(usuario);

      const usuarioSistemaRepository =
        database.getRepository(
          UsuarioSistema,
        );

      await usuarioSistemaRepository.delete({
        usuarioId: usuario.id,
      });

      const asignaciones =
        sistemasIds.map((sistemaId) =>
          usuarioSistemaRepository.create({
            usuarioId: usuario.id,
            sistemaId,
          }),
        );

      await usuarioSistemaRepository.save(
        asignaciones,
      );

      return NextResponse.json({
        mensaje:
          "Usuario aprobado y sistemas asignados correctamente.",
        usuario: {
          id: usuario.id,
          estado: usuario.estado,
          rol: usuario.rol,
          sistemasIds,
        },
      });
    }

    await repository.remove(usuario);

    return NextResponse.json({
      mensaje:
        "Usuario denegado y eliminado correctamente.",
    });
  } catch (error) {
    console.error(
      "ERROR EN /api/dashboard/usuarios/[id]:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "No se pudo procesar la solicitud.",
      },
      {
        status: 500,
      },
    );
  }
}