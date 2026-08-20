import Image from "next/image";

import { imagenesDeSeccion } from "./contenidoPaginaHelpers";
import { SeccionPublica } from "./contenidoPaginaTipos";

export default function ImagenesOpcionales({
  seccion,
}: {
  seccion: SeccionPublica;
}) {
  const imagenes = imagenesDeSeccion(seccion);

  if (imagenes.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2">
      {imagenes.map((imagen) => (
        <figure
          key={imagen.id}
          className="overflow-hidden border border-slate-200 bg-slate-100"
        >
          <Image
            src={imagen.url}
            alt={
              imagen.alt || seccion.titulo
            }
            width={1200}
            height={700}
            className="h-auto w-full object-cover"
          />

          {imagen.principal && (
            <figcaption className="border-t border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-600">
              Imagen principal
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}