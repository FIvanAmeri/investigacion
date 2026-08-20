import { NextRequest, NextResponse } from "next/server";
import { obtenerSuperAdminDashboard } from "@/lib/dashboard";

const TIPOS_PERMITIDOS = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const TAMANO_MAXIMO = 5 * 1024 * 1024;

function extensionParaTipo(tipo: string): string {
  switch (tipo) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/avif":
      return "avif";
    default:
      return "bin";
  }
}

export async function POST(request: NextRequest) {
  const superAdmin = await obtenerSuperAdminDashboard();

  if (!superAdmin) {
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 403 },
    );
  }

  const formData = await request.formData();
  const archivo = formData.get("file");

  if (!(archivo instanceof File)) {
    return NextResponse.json(
      { error: "No se recibió ninguna imagen." },
      { status: 400 },
    );
  }

  if (!TIPOS_PERMITIDOS.has(archivo.type)) {
    return NextResponse.json(
      { error: "Formato de imagen no permitido." },
      { status: 400 },
    );
  }

  if (archivo.size < 1 || archivo.size > TAMANO_MAXIMO) {
    return NextResponse.json(
      { error: "La imagen debe pesar entre 1 byte y 5 MB." },
      { status: 400 },
    );
  }

  const extension = extensionParaTipo(archivo.type);
  const nombre = `contenido/${crypto.randomUUID()}.${extension}`;

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "El almacenamiento de imágenes no está configurado." },
        { status: 500 },
      );
    }

    const buffer = Buffer.from(await archivo.arrayBuffer());
    const response = await fetch(
      `https://blob.vercel-storage.com/${nombre}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": archivo.type,
          "x-content-type": archivo.type,
          "x-api-version": "7",
        },
        body: buffer,
      },
    );

    const data = (await response.json()) as {
      url?: string;
      error?: { message?: string };
    };

    if (!response.ok || !data.url) {
      throw new Error(
        data.error?.message ?? "No se pudo almacenar la imagen.",
      );
    }

    return NextResponse.json({
      url: data.url,
    });
  } catch (error) {
    console.error(
      "ERROR POST /api/dashboard/contenido/imagen:",
      error,
    );

    return NextResponse.json(
      { error: "No se pudo almacenar la imagen." },
      { status: 500 },
    );
  }
}
