import Image from "next/image";

import {
  configuracion,
  imagenPrincipal,
  imagenesDeSeccion,
  tieneImagen,
} from "./contenidoPaginaHelpers";
import { SeccionPublica } from "./contenidoPaginaTipos";

interface PersonaRender {
  id: string;
  titulo: string;
  contenido: string;
  rol: string;
  imagenUrl: string;
  imagenAlt: string;
  destacado: boolean;
}

export default function Equipo({
  secciones,
}: {
  secciones: SeccionPublica[];
}) {
  const personas: PersonaRender[] = [];

  for (const seccion of secciones) {
    const config = configuracion(seccion);
    const imagenes = imagenesDeSeccion(seccion);

    if (
      config.tipo === "PERSONA" &&
      Array.isArray(config.personas) &&
      config.personas.length > 0
    ) {
      config.personas.forEach((persona, index) => {
        const imagen = imagenes[index];

        personas.push({
          id: `${seccion.id}-${persona.id}`,
          titulo:
            persona.nombre ||
            imagen?.alt ||
            `Integrante ${index + 1}`,
          contenido:
            persona.contenido ||
            (index === 0
              ? seccion.contenido ?? ""
              : ""),
          rol:
            persona.rol ||
            config.rol ||
            "Integrante de la Subcomisión de Uroginecología",
          imagenUrl:
            persona.imagenUrl ||
            imagen?.url ||
            "",
          imagenAlt:
            persona.imagenAlt ||
            imagen?.alt ||
            persona.nombre ||
            seccion.titulo,
          destacado:
            config.destacado === true &&
            index === 0,
        });
      });

      continue;
    }

    if (
      config.tipo === "PERSONA" &&
      imagenes.length > 0
    ) {
      imagenes.forEach((imagen, index) => {
        personas.push({
          id: `${seccion.id}-${imagen.id}`,
          titulo:
            imagen.alt ||
            (index === 0
              ? seccion.titulo
              : `Integrante ${index + 1}`),
          contenido:
            index === 0
              ? seccion.contenido ?? ""
              : "",
          rol:
            config.rol ||
            (index === 0
              ? "Coordinación"
              : "Integrante del equipo de investigación"),
          imagenUrl: imagen.url,
          imagenAlt:
            imagen.alt ||
            seccion.titulo,
          destacado:
            config.destacado === true &&
            index === 0,
        });
      });

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
      imagenes.forEach(
        (imagen, index) => {
          personas.push({
            id: `${seccion.id}-${imagen.id}`,
            titulo:
              imagen.alt ||
              (index === 0
                ? seccion.titulo
                : `Integrante ${index + 1}`),
            contenido:
              index === 0
                ? seccion.contenido ?? ""
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

  const seccionesConInformacion =
    secciones.filter((seccion) => {
      const config =
        configuracion(seccion);

      return (
        Boolean(config.etiqueta) ||
        Boolean(config.descripcion) ||
        Boolean(seccion.contenido)
      );
    });

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
      {seccionesConInformacion.length >
        0 && (
        <section className="mx-auto max-w-7xl px-6 pt-10 sm:pt-12">
          <div className="max-w-4xl">
            {seccionesConInformacion.map(
              (seccion) => {
                const config =
                  configuracion(
                    seccion,
                  );

                return (
                  <div
                    key={seccion.id}
                    className="mb-8 last:mb-0"
                  >
                    {config.etiqueta && (
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                        {
                          config.etiqueta
                        }
                      </p>
                    )}

                    <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                      {
                        seccion.titulo
                      }
                    </h1>

                    {config.descripcion && (
                      <p className="mt-3 text-lg leading-7 text-slate-600">
                        {
                          config.descripcion
                        }
                      </p>
                    )}

                    {seccion.contenido && (
                      <p className="mt-3 whitespace-pre-line text-base leading-7 text-slate-700">
                        {
                          seccion.contenido
                        }
                      </p>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </section>
      )}

      {destacada && (
        <section className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {destacada.rol ||
              "Coordinación"}
          </p>

          <h2 className="mt-1.5 text-3xl font-semibold tracking-tight text-slate-950">
            {destacada.titulo}
          </h2>

          <article className="mt-6 grid overflow-hidden border border-slate-200 bg-slate-50 md:grid-cols-[400px_1fr]">
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

            <div className="flex items-center p-7 sm:p-9 lg:p-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                  {destacada.rol ||
                    "Integrante"}
                </p>

                <h3 className="mt-2.5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  {destacada.titulo}
                </h3>

                {destacada.contenido && (
                  <p className="mt-4 max-w-xl whitespace-pre-line text-base leading-7 text-slate-600">
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
          <div className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Equipo de trabajo
            </p>

            <h2 className="mt-1.5 text-3xl font-semibold tracking-tight text-slate-950">
              Integrantes
            </h2>

            <div className="mt-7 grid gap-x-7 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
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

                    <div className="pt-3">
                      <div className="mb-2 h-px w-8 bg-cyan-500" />

                      <h3 className="text-lg font-semibold text-slate-950">
                        {
                          integrante.titulo
                        }
                      </h3>

                      {integrante.rol && (
                        <p className="mt-1 text-sm text-slate-500">
                          {
                            integrante.rol
                          }
                        </p>
                      )}

                      {integrante.contenido && (
                        <p className="mt-2.5 whitespace-pre-line text-sm leading-6 text-slate-600">
                          {
                            integrante.contenido
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
      )}
    </main>
  );
}