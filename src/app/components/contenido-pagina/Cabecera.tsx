import Image from "next/image";

import {
  configuracion,
  imagenPrincipal,
  tieneImagen,
} from "./contenidoPaginaHelpers";
import { SeccionPublica } from "./contenidoPaginaTipos";

export default function Cabecera({
  seccion,
}: {
  seccion: SeccionPublica;
}) {
  const config = configuracion(seccion);

  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:py-10">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-cyan-500" />

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
            {config.etiqueta || "Contenido"}
          </p>
        </div>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {seccion.titulo}
        </h1>

        {config.descripcion && (
          <p className="mt-2 max-w-3xl text-base leading-6 text-slate-600 sm:text-lg">
            {config.descripcion}
          </p>
        )}

        {tieneImagen(seccion) && (
          <div className="relative mt-6 max-w-4xl overflow-hidden border border-slate-200 bg-white">
            <Image
              src={imagenPrincipal(seccion)?.url ?? ""}
              alt={
                imagenPrincipal(seccion)?.alt ||
                seccion.titulo
              }
              width={1400}
              height={700}
              className="h-auto w-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}