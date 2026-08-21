import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDatabase } from "@/lib/db";
import {
  EstadoUsuario,
  User,
} from "@/entities/Usuario";
import { UsuarioSistema } from "@/entities/UsuarioSistema";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface SistemasBody {
  sistemasIds?: number[];
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const session = await getSession();

    if (
      !session ||
      !session.esSuperAdmin
    ) {
      return NextResponse.json(
        {
          error: "Acceso denegado.",
        },
        { status: 403 },
      );
    }

    const { id } =
      await context.params;

    const usuarioId = Number(id);

    if (
      !Number.isInteger(usuarioId) ||
      usuarioId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "ID de usuario inválido.",
        },
        { status: 400 },
      );
    }

    const body =
      (await request.json()) as SistemasBody;

    const sistemasIds = Array.isArray(
      body.sistemasIds,
    )
      ? [
          ...new Set(
            body.sistemasIds.filter(
              (sistemaId) =>
                Number.isInteger(
                  sistemaId,
                ) &&
                sistemaId > 0,
            ),
          ),
        ]
      : [];

    const database =
      await getDatabase();

    const usuarioRepository =
      database.getRepository(User);

    const usuario =
      await usuarioRepository.findOne({
        where: {
          id: usuarioId,
        },
      });

    if (!usuario) {
      return NextResponse.json(
        {
          error:
            "Usuario no encontrado.",
        },
        { status: 404 },
      );
    }

    if (usuario.esSuperAdmin) {
      return NextResponse.json(
        {
          error:
            "No se pueden modificar los sistemas de un superadmin.",
        },
        { status: 400 },
      );
    }

    if (
      usuario.estado !==
      EstadoUsuario.APROBADO
    ) {
      return NextResponse.json(
        {
          error:
            "El usuario debe estar aprobado antes de asignarle sistemas.",
        },
        { status: 400 },
      );
    }

    if (sistemasIds.length > 0) {
      const sistemasExistentes =
        await database.query<
          { id: number }[]
        >(
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
          { status: 400 },
        );
      }
    }

    const usuarioSistemaRepository =
      database.getRepository(
        UsuarioSistema,
      );

    await usuarioSistemaRepository.delete({
      usuarioId,
    });

    if (sistemasIds.length > 0) {
      const asignaciones =
        sistemasIds.map(
          (sistemaId) =>
            usuarioSistemaRepository.create(
              {
                usuarioId,
                sistemaId,
              },
            ),
        );

      await usuarioSistemaRepository.save(
        asignaciones,
      );
    }

    return NextResponse.json({
      mensaje:
        "Sistemas actualizados correctamente.",
      sistemasIds,
    });
  } catch (error) {
    console.error(
      "Error actualizando sistemas del usuario:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "No se pudieron actualizar los sistemas.",
      },
      { status: 500 },
    );
  }
}