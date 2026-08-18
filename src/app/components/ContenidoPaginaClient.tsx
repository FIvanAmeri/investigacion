"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export type ContenidoPaginaVista =
  | "INSTITUCION"
  | "INVESTIGADORES"
  | "TRATAMIENTOS"
  | "PATOLOGIAS"
  | "RECURSOS";

interface ConfiguracionPublica {
  tipo?:
    | "CABECERA"
    | "TEXTO"
    | "TRATAMIENTO"
    | "PATOLOGIA"
    | "RECURSO"
    | "PERSONA";
  etiqueta?: string;
  descripcion?: string;
  rol?: string;
  categoria?: string;
  imagenUrl?: string;
  imagenAlt?: string;
  mostrarImagen?: boolean;
  fuenteNombre?: string;
  fuenteUrl?: string;
  mostrarFuente?: boolean;
  palabrasClave?: string[];
  destacado?: boolean;
}

interface SeccionPublica {
  id: number;
  titulo: string;
  slug: string;
  contenido: string | null;
  configuracion: ConfiguracionPublica | null;
  orden: number;
}

interface ContenidoPaginaClientProps {
  paginaSlug: string;
  vista: ContenidoPaginaVista;
}

function configuracion(
  seccion: SeccionPublica,
): ConfiguracionPublica {
  return seccion.configuracion ?? {};
}

function palabrasClave(
  seccion: SeccionPublica,
): string[] {
  const valores = configuracion(seccion).palabrasClave;
  return Array.isArray(valores) ? valores : [];
}

function tieneImagen(
  seccion: SeccionPublica,
): boolean {
  const config = configuracion(seccion);
  return Boolean(
    config.mostrarImagen &&
      config.imagenUrl?.trim(),
  );
}

function tieneFuente(
  seccion: SeccionPublica,
): boolean {
  const config = configuracion(seccion);
  return Boolean(
    config.mostrarFuente &&
      config.fuenteNombre?.trim(),
  );
}

function esCabecera(
  seccion: SeccionPublica,
): boolean {
  return configuracion(seccion).tipo === "CABECERA";
}

function obtenerCabecera(
  secciones: SeccionPublica[],
): SeccionPublica | undefined {
  return secciones.find(esCabecera);
}

function obtenerItems(
  secciones: SeccionPublica[],
): SeccionPublica[] {
  return secciones.filter(
    (seccion) => !esCabecera(seccion),
  );
}

function Cabecera({
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
              src={config.imagenUrl!}
              alt={config.imagenAlt || seccion.titulo}
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

function Fuente({
  seccion,
  compact = false,
}: {
  seccion: SeccionPublica;
  compact?: boolean;
}) {
  const config = configuracion(seccion);

  if (!tieneFuente(seccion)) {
    return null;
  }

  const contenido = (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
        Fuente
      </p>
      {config.fuenteUrl ? (
        <a
          href={config.fuenteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block text-sm leading-6 text-slate-700 transition-colors hover:text-cyan-600"
        >
          {config.fuenteNombre}
        </a>
      ) : (
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {config.fuenteNombre}
        </p>
      )}
    </>
  );

  return (
    <div
      className={`${compact ? "mt-6" : "mt-8"} border-l-2 border-cyan-500 bg-slate-50 px-5 py-4`}
    >
      {contenido}
    </div>
  );
}

function ImagenOpcional({
  seccion,
}: {
  seccion: SeccionPublica;
}) {
  const config = configuracion(seccion);

  if (!tieneImagen(seccion)) {
    return null;
  }

  return (
    <div className="relative mt-8 overflow-hidden border border-slate-200 bg-slate-100">
      <Image
        src={config.imagenUrl!}
        alt={config.imagenAlt || seccion.titulo}
        width={1200}
        height={700}
        className="h-auto w-full object-cover"
      />
    </div>
  );
}

function TextoInstitucional({
  secciones,
}: {
  secciones: SeccionPublica[];
}) {
  return (
    <main className="bg-white">
      {secciones.map((seccion, index) => {
        const config = configuracion(seccion);

        return (
          <section
            key={seccion.id}
            className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
          >
            <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
              <div className="max-w-4xl">
                {config.etiqueta && (
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                    {config.etiqueta}
                  </p>
                )}

                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  {seccion.titulo}
                </h2>

                {config.descripcion && (
                  <p className="mt-5 text-lg leading-8 text-slate-600">
                    {config.descripcion}
                  </p>
                )}

                {seccion.contenido && (
                  <div className="mt-7 whitespace-pre-line text-base leading-8 text-slate-700">
                    {seccion.contenido}
                  </div>
                )}

                <ImagenOpcional seccion={seccion} />
                <Fuente seccion={seccion} />
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}

function Equipo({
  secciones,
}: {
  secciones: SeccionPublica[];
}) {
  const personas = secciones.filter(
    (seccion) =>
      configuracion(seccion).tipo === "PERSONA",
  );

  const destacada =
    personas.find(
      (persona) =>
        configuracion(persona).destacado,
    ) ?? personas[0];

  const integrantes = personas.filter(
    (persona) => persona.id !== destacada?.id,
  );

  return (
    <main className="bg-white">
      {destacada && (
        <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {configuracion(destacada).etiqueta || "Coordinación"}
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {destacada.titulo}
          </h2>

          <article className="mt-10 grid overflow-hidden border border-slate-200 bg-slate-50 md:grid-cols-[400px_1fr]">
            {tieneImagen(destacada) && (
              <div className="relative aspect-[4/5] bg-slate-200 md:aspect-auto md:min-h-[500px]">
                <Image
                  src={configuracion(destacada).imagenUrl!}
                  alt={configuracion(destacada).imagenAlt || destacada.titulo}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex items-center p-8 sm:p-12 lg:p-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                  {configuracion(destacada).rol || "Integrante"}
                </p>

                <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  {destacada.titulo}
                </h3>

                {destacada.contenido && (
                  <p className="mt-6 max-w-xl whitespace-pre-line text-base leading-7 text-slate-600">
                    {destacada.contenido}
                  </p>
                )}

                <Fuente seccion={destacada} />
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
              {integrantes.map((integrante) => (
                <article key={integrante.id}>
                  {tieneImagen(integrante) && (
                    <div className="relative aspect-[4/5] overflow-hidden bg-slate-200">
                      <Image
                        src={configuracion(integrante).imagenUrl!}
                        alt={configuracion(integrante).imagenAlt || integrante.titulo}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                      />
                    </div>
                  )}

                  <div className="pt-5">
                    <div className="mb-3 h-px w-8 bg-cyan-500" />
                    <h3 className="text-lg font-semibold text-slate-950">
                      {integrante.titulo}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {configuracion(integrante).rol || "Integrante de la Subcomisión de Uroginecología"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function Listado({
  secciones,
  tipo,
}: {
  secciones: SeccionPublica[];
  tipo: "TRATAMIENTO" | "PATOLOGIA";
}) {
  const [busqueda, setBusqueda] = useState("");
  const [abiertos, setAbiertos] = useState<Set<number>>(new Set());

  const resultados = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase();

    return secciones.filter((seccion) => {
      const config = configuracion(seccion);
      if (
        config.tipo &&
        config.tipo !== tipo
      ) {
        return false;
      }

      if (!termino) {
        return true;
      }

      const texto = [
        seccion.titulo,
        config.descripcion,
        seccion.contenido,
        ...(config.palabrasClave ?? []),
        config.fuenteNombre,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();

      return texto.includes(termino);
    });
  }, [busqueda, secciones, tipo]);

  const toggle = (id: number) => {
    setAbiertos((actuales) => {
      const nuevas = new Set(actuales);
      if (nuevas.has(id)) {
        nuevas.delete(id);
      } else {
        nuevas.add(id);
      }
      return nuevas;
    });
  };

  const etiqueta =
    tipo === "TRATAMIENTO"
      ? "Tratamiento"
      : "Patología";

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Buscar contenido
        </p>
        <input
          type="search"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder={`Buscar ${tipo === "TRATAMIENTO" ? "tratamiento" : "patología"}...`}
          className="mt-4 h-11 w-full border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
        />
        <p className="mt-3 text-xs text-slate-400">
          {resultados.length} {resultados.length === 1 ? "resultado" : "resultados"}
        </p>
      </div>

      <div className="mt-8">
        {resultados.map((seccion, index) => {
          const config = configuracion(seccion);
          const abierto = abiertos.has(seccion.id);

          return (
            <div key={seccion.id}>
              {index > 0 && <WaveDivider />}
              <article className="py-12 first:pt-6">
                <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                      {config.etiqueta || etiqueta}
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                      {seccion.titulo}
                    </h2>
                    {config.descripcion && (
                      <p className="mt-5 text-base leading-8 text-slate-600">
                        {config.descripcion}
                      </p>
                    )}
                    {abierto && seccion.contenido && (
                      <div className="mt-8 border-t border-slate-200 pt-8">
                        <p className="whitespace-pre-line text-base leading-8 text-slate-700">
                          {seccion.contenido}
                        </p>
                        <ImagenOpcional seccion={seccion} />
                        <Fuente seccion={seccion} />
                      </div>
                    )}
                  </div>

                  <div className="lg:flex lg:items-start lg:justify-end">
                    <button
                      type="button"
                      onClick={() => toggle(seccion.id)}
                      aria-expanded={abierto}
                      className="inline-flex h-11 items-center justify-center border border-slate-300 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 transition-all hover:border-cyan-500 hover:bg-cyan-500 hover:text-white"
                    >
                      {abierto ? "Cerrar artículo" : "Leer más"}
                    </button>
                  </div>
                </div>

                {!abierto && palabrasClave(seccion).length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {palabrasClave(seccion).slice(0, 6).map((palabra) => (
                      <span
                        key={palabra}
                        className="border border-slate-200 px-3 py-1.5 text-[11px] uppercase tracking-wide text-slate-500"
                      >
                        {palabra}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Recursos({
  secciones,
}: {
  secciones: SeccionPublica[];
}) {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [abiertos, setAbiertos] = useState<Set<number>>(new Set());

  const categorias = useMemo(() => {
    const valores = secciones
      .map((seccion) => configuracion(seccion).categoria)
      .filter((valor): valor is string => Boolean(valor));

    return ["Todos", ...Array.from(new Set(valores))];
  }, [secciones]);

  const resultados = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase();

    return secciones.filter((seccion) => {
      const config = configuracion(seccion);
      const coincideCategoria =
        categoria === "Todos" ||
        config.categoria === categoria;

      if (!coincideCategoria) {
        return false;
      }

      if (!termino) {
        return true;
      }

      const texto = [
        seccion.titulo,
        config.descripcion,
        seccion.contenido,
        config.categoria,
        config.fuenteNombre,
        ...(config.palabrasClave ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();

      return texto.includes(termino);
    });
  }, [busqueda, categoria, secciones]);

  const toggle = (id: number) => {
    setAbiertos((actuales) => {
      const nuevas = new Set(actuales);
      if (nuevas.has(id)) {
        nuevas.delete(id);
      } else {
        nuevas.add(id);
      }
      return nuevas;
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <div className="grid gap-5 md:grid-cols-[1fr_260px]">
        <input
          type="search"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Buscar recurso..."
          className="h-11 w-full border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
        />

        <select
          value={categoria}
          onChange={(event) => setCategoria(event.target.value)}
          className="h-11 border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
        >
          {categorias.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-xs text-slate-400">
        {resultados.length} {resultados.length === 1 ? "recurso encontrado" : "recursos encontrados"}
      </p>

      <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
        {resultados.map((seccion) => {
          const config = configuracion(seccion);
          const abierto = abiertos.has(seccion.id);

          return (
            <article key={seccion.id} className="py-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-4xl">
                  {config.categoria && (
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                      {config.categoria}
                    </p>
                  )}
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    {seccion.titulo}
                  </h2>
                  {config.descripcion && (
                    <p className="mt-5 text-base leading-8 text-slate-600">
                      {config.descripcion}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => toggle(seccion.id)}
                  aria-expanded={abierto}
                  className="inline-flex h-11 shrink-0 items-center justify-center border border-slate-300 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 transition-all hover:border-cyan-500 hover:bg-cyan-500 hover:text-white"
                >
                  {abierto ? "Cerrar artículo" : "Leer más"}
                </button>
              </div>

              {abierto && (
                <div className="mt-8 max-w-4xl border-t border-slate-200 pt-8">
                  {seccion.contenido && (
                    <p className="whitespace-pre-line text-base leading-8 text-slate-700">
                      {seccion.contenido}
                    </p>
                  )}
                  <ImagenOpcional seccion={seccion} />
                  <Fuente seccion={seccion} />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function WaveDivider() {
  return (
    <div className="flex h-10 items-center justify-center" aria-hidden="true">
      <svg
        viewBox="0 0 400 32"
        className="h-8 w-full max-w-md text-cyan-500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 16C25 16 25 7 50 7C75 7 75 25 100 25C125 25 125 7 150 7C175 7 175 25 200 25C225 25 225 7 250 7C275 7 275 25 300 25C325 25 325 16 350 16C375 16 375 16 400 16"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

export default function ContenidoPaginaClient({
  paginaSlug,
  vista,
}: ContenidoPaginaClientProps) {
  const [secciones, setSecciones] = useState<SeccionPublica[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      try {
        const response = await fetch(
          `/api/contenido/${encodeURIComponent(paginaSlug)}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("No se pudo cargar el contenido.");
        }

        const data = (await response.json()) as {
          secciones?: SeccionPublica[];
        };

        if (activo) {
          setSecciones(
            Array.isArray(data.secciones)
              ? data.secciones
              : [],
          );
        }
      } catch {
        if (activo) {
          setError(true);
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargar();

    return () => {
      activo = false;
    };
  }, [paginaSlug]);

  const cabecera = obtenerCabecera(secciones);
  const items = obtenerItems(secciones);

  if (cargando) {
    return (
      <main className="min-h-[70vh] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="h-4 w-24 animate-pulse bg-slate-100" />
          <div className="mt-4 h-10 w-80 animate-pulse bg-slate-100" />
          <div className="mt-6 h-20 max-w-2xl animate-pulse bg-slate-100" />
        </div>
      </main>
    );
  }

  if (error || !cabecera) {
    return (
      <main className="min-h-[70vh] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Contenido
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            Esta página todavía no tiene contenido administrable.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Creá una cabecera desde el panel de administración para comenzar a editar esta página.
          </p>
          <Link
            href="/dashboard/contenido/secciones"
            className="mt-8 inline-flex h-11 items-center justify-center bg-slate-950 px-5 text-sm font-semibold text-white"
          >
            Ir al administrador
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Cabecera seccion={cabecera} />
      {vista === "INSTITUCION" && (
        <TextoInstitucional secciones={items} />
      )}
      {vista === "INVESTIGADORES" && (
        <Equipo secciones={items} />
      )}
      {vista === "TRATAMIENTOS" && (
        <Listado
          secciones={items}
          tipo="TRATAMIENTO"
        />
      )}
      {vista === "PATOLOGIAS" && (
        <Listado
          secciones={items}
          tipo="PATOLOGIA"
        />
      )}
      {vista === "RECURSOS" && (
        <Recursos secciones={items} />
      )}
    </>
  );
}
