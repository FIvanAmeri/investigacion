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
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-cyan-500" />

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
            {config.etiqueta || "Contenido"}
          </p>
        </div>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          {seccion.titulo}
        </h1>

        {config.descripcion && (
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            {config.descripcion}
          </p>
        )}

        {tieneImagen(seccion) && (
          <div className="relative mt-10 max-w-4xl overflow-hidden border border-slate-200 bg-white">
            <Image
              src={
                imagenPrincipal(seccion)?.url ??
                ""
              }
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