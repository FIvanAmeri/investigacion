import Image from "next/image";

import {
  configuracion,
  imagenPrincipal,
  imagenesDeSeccion,
  tieneImagen,
} from "./contenidoPaginaHelpers";
import { SeccionPublica } from "./contenidoPaginaTipos";

export default function Equipo({
  secciones,
}: {
  secciones: SeccionPublica[];
}) {
  const personas: Array<{
    id: string;
    titulo: string;
    contenido: string;
    rol: string;
    imagenUrl: string;
    imagenAlt: string;
    destacado: boolean;
  }> = [];

  for (const seccion of secciones) {
    const config =
      configuracion(seccion);

    if (
      config.tipo === "PERSONA" &&
      Array.isArray(config.personas) &&
      config.personas.length > 0
    ) {
      for (const persona of config.personas) {
        personas.push({
          id: `${seccion.id}-${persona.id}`,
          titulo: persona.nombre,
          contenido: persona.contenido,
          rol: persona.rol,
          imagenUrl: persona.imagenUrl,
          imagenAlt:
            persona.imagenAlt ||
            persona.nombre,
          destacado:
            config.destacado === true &&
            personas.length === 0,
        });
      }

      continue;
    }

    if (config.tipo === "PERSONA") {
      const imagen =
        imagenPrincipal(seccion);

      personas.push({
        id: String(seccion.id),
        titulo: seccion.titulo,
        contenido:
          seccion.contenido ?? "",
        rol:
          config.rol ||
          "Integrante de la Subcomisión de Uroginecología",
        imagenUrl:
          imagen?.url ?? "",
        imagenAlt:
          imagen?.alt ||
          seccion.titulo,
        destacado:
          config.destacado === true,
      });

      continue;
    }

    if (
      config.tipo === "TEXTO" &&
      tieneImagen(seccion)
    ) {
      const imagenes =
        imagenesDeSeccion(seccion);

      imagenes.forEach(
        (imagen, index) => {
          personas.push({
            id: `${seccion.id}-${imagen.id}`,
            titulo:
              imagen.alt ||
              `Integrante ${index + 1}`,
            contenido:
              index === 0
                ? seccion.contenido ??
                  ""
                : "",
            rol:
              index === 0
                ? "Coordinación"
                : "Integrante del equipo de investigación",
            imagenUrl:
              imagen.url,
            imagenAlt:
              imagen.alt ||
              seccion.titulo,
            destacado:
              index === 0,
          });
        },
      );
    }
  }

  const destacada =
    personas.find(
      (persona) =>
        persona.destacado,
    ) ?? personas[0];

  const integrantes =
    personas.filter(
      (persona) =>
        persona.id !==
        destacada?.id,
    );

  return (
    <main className="bg-white">
      {secciones.some(
        (seccion) =>
          configuracion(seccion)
            .tipo === "TEXTO" &&
          tieneImagen(seccion),
      ) && (
        <section className="mx-auto max-w-7xl px-6 pt-16 sm:pt-20">
          {secciones
            .filter(
              (seccion) =>
                configuracion(
                  seccion,
                ).tipo ===
                  "TEXTO" &&
                tieneImagen(seccion),
            )
            .map((seccion) => {
              const config =
                configuracion(
                  seccion,
                );

              return (
                <div
                  key={seccion.id}
                  className="max-w-4xl"
                >
                  {config.etiqueta && (
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                      {config.etiqueta}
                    </p>
                  )}

                  {config.descripcion && (
                    <p className="mt-5 text-lg leading-8 text-slate-600">
                      {config.descripcion}
                    </p>
                  )}

                  {seccion.contenido && (
                    <p className="mt-5 whitespace-pre-line text-base leading-8 text-slate-700">
                      {seccion.contenido}
                    </p>
                  )}
                </div>
              );
            })}
        </section>
      )}

      {destacada && (
        <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {destacada.rol ||
              "Coordinación"}
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {destacada.titulo}
          </h2>

          <article className="mt-10 grid overflow-hidden border border-slate-200 bg-slate-50 md:grid-cols-[400px_1fr]">
            {destacada.imagenUrl && (
              <div className="relative aspect-[4/5] bg-slate-200 md:aspect-auto md:min-h-[500px]">
                <Image
                  src={
                    destacada.imagenUrl
                  }
                  alt={
                    destacada.imagenAlt ||
                    destacada.titulo
                  }
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex items-center p-8 sm:p-12 lg:p-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                  {destacada.rol ||
                    "Integrante"}
                </p>

                <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  {destacada.titulo}
                </h3>

                {destacada.contenido && (
                  <p className="mt-6 max-w-xl whitespace-pre-line text-base leading-7 text-slate-600">
                    {
                      destacada.contenido
                    }
                  </p>
                )}
              </div>
            </div>
          </article>
        </section>
      )}

      {integrantes.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Equipo de trabajo
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Integrantes
            </h2>

            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {integrantes.map(
                (integrante) => (
                  <article
                    key={
                      integrante.id
                    }
                  >
                    {integrante.imagenUrl && (
                      <div className="relative aspect-[4/5] overflow-hidden bg-slate-200">
                        <Image
                          src={
                            integrante.imagenUrl
                          }
                          alt={
                            integrante.imagenAlt ||
                            integrante.titulo
                          }
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                        />
                      </div>
                    )}

                    <div className="pt-5">
                      <div className="mb-3 h-px w-8 bg-cyan-500" />

                      <h3 className="text-lg font-semibold text-slate-950">
                        {
                          integrante.titulo
                        }
                      </h3>

                      <p className="mt-2 text-sm text-slate-500">
                        {
                          integrante.rol
                        }
                      </p>
                    </div>
                  </article>
                ),
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}