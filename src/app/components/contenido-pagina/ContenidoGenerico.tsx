"use client";

import Image from "next/image";

import Fuente from "./Fuente";
import ImagenesOpcionales from "./ImagenesOpcionales";
import {
  configuracion,
} from "./contenidoPaginaHelpers";
import {
  SeccionPublica,
} from "./contenidoPaginaTipos";

export default function ContenidoGenerico({
  secciones,
}: {
  secciones: SeccionPublica[];
}) {
  return (
    <main className="bg-white">
      {secciones.map(
        (seccion, index) => {
          const config =
            configuracion(seccion);

          const personas =
            Array.isArray(
              config.personas,
            )
              ? config.personas
              : [];

          const esPersona =
            config.tipo === "PERSONA" ||
            personas.length > 0;

          if (
            esPersona &&
            personas.length > 0
          ) {
            return (
              <section
                key={seccion.id}
                className={
                  index % 2 === 0
                    ? "bg-white"
                    : "bg-slate-50"
                }
              >
                <div className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
                  <div className="max-w-4xl">
                    {config.etiqueta && (
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
                        {config.etiqueta}
                      </p>
                    )}

                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                      {seccion.titulo}
                    </h2>

                    {config.descripcion && (
                      <p className="mt-3 text-base leading-7 text-slate-600">
                        {config.descripcion}
                      </p>
                    )}
                  </div>

                  <div className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                    {personas.map(
                      (persona) => (
                        <article
                          key={
                            persona.id
                          }
                        >
                          {persona.imagenUrl && (
                            <div className="relative aspect-[4/5] overflow-hidden bg-slate-200">
                              <Image
                                src={
                                  persona.imagenUrl
                                }
                                alt={
                                  persona.imagenAlt ||
                                  persona.nombre
                                }
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover"
                              />
                            </div>
                          )}

                          <div className="pt-3">
                            <div className="mb-2 h-px w-8 bg-cyan-500" />

                            <h3 className="text-lg font-semibold text-slate-950">
                              {
                                persona.nombre
                              }
                            </h3>

                            {persona.rol && (
                              <p className="mt-1 text-sm text-slate-500">
                                {
                                  persona.rol
                                }
                              </p>
                            )}

                            {persona.contenido && (
                              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                                {
                                  persona.contenido
                                }
                              </p>
                            )}
                          </div>
                        </article>
                      ),
                    )}
                  </div>
                </div>
              </section>
            );
          }

          return (
            <section
              key={seccion.id}
              className={
                index % 2 === 0
                  ? "bg-white"
                  : "bg-slate-50"
              }
            >
              <div className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
                <div className="max-w-4xl">
                  {config.etiqueta && (
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
                      {config.etiqueta}
                    </p>
                  )}

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    {seccion.titulo}
                  </h2>

                  {config.descripcion && (
                    <p className="mt-3 text-base leading-7 text-slate-600">
                      {config.descripcion}
                    </p>
                  )}

                  {seccion.contenido && (
                    <div className="mt-4 whitespace-pre-line text-base leading-7 text-slate-700">
                      {seccion.contenido}
                    </div>
                  )}

                  <ImagenesOpcionales
                    seccion={seccion}
                  />

                  <Fuente
                    seccion={seccion}
                  />
                </div>
              </div>
            </section>
          );
        },
      )}
    </main>
  );
}