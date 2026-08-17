import { NextResponse } from "next/server";
import {
  getSession,
  refreshSessionCookie,
} from "@/lib/auth";

export async function POST() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Sesión expirada.",
        },
        {
          status: 401,
        },
      );
    }

    await refreshSessionCookie(session);

    return NextResponse.json({
      mensaje: "Sesión actualizada.",
    });
  } catch {
    return NextResponse.json(
      {
        error: "No se pudo actualizar la sesión.",
      },
      {
        status: 500,
      },
    );
  }
}