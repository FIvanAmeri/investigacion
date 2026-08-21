"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { ContenidoPagina } from "@/lib/contenido";

type ContenidoTipo = "MENU" | "SUBMENU";

interface PaginaDestino {
  id: number;
  tipo: "MENU";
  titulo: string;
  slug: string;
  padreTitulo: null;
}

interface ContenidoPanelProps {
  tipo: ContenidoTipo;
  contenidosIniciales: ContenidoPagina[];
  paginas: PaginaDestino[];
}

interface Formulario {
  titulo: string;
  slug: string;
  padreId: string;
}

interface RespuestaContenido {
  contenido?: ContenidoPagina;
  error?: string;
}

function generarSlug(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function crearFormulario(
  contenido?: ContenidoPagina,
): Formulario {
  return {
    titulo: contenido?.titulo ?? "",
    slug: contenido?.slug ?? "",
    padreId:
      contenido?.padreId !== null &&
      contenido?.padreId !== undefined
        ? String(contenido.padreId)
        : "",
  };
}

function leerRespuesta(
  valor: unknown,
): RespuestaContenido {
  if (
    !valor ||
    typeof valor !== "object"
  ) {
    return {};
  }

  const objeto =
    valor as Record<string, unknown>;

  return {
    error:
      typeof objeto.error === "string"
        ? objeto.error
        : undefined,
    contenido:
      objeto.contenido &&
      typeof objeto.contenido === "object"
        ? (objeto.contenido as ContenidoPagina)
        : undefined,
  };
}

function obtenerSiguienteOrden(
  contenidos: ContenidoPagina[],
  tipo: ContenidoTipo,
  padreId: number | null,
): number {
  const hermanos = contenidos.filter(
    (contenido) =>
      contenido.tipo === tipo &&
      contenido.padreId === padreId,
  );

  if (hermanos.length === 0) {
    return 1;
  }

  return (
    Math.max(
      ...hermanos.map(
        (contenido) => contenido.orden,
      ),
    ) + 1
  );
}

export default function ContenidoPanel({
  tipo,
  contenidosIniciales,
  paginas,
}: ContenidoPanelProps) {
  const router = useRouter();

  const [contenidos, setContenidos] =
    useState<ContenidoPagina[]>(
      contenidosIniciales,
    );

  const [
    formulario,
    setFormulario,
  ] = useState<Formulario>(
    crearFormulario(),
  );

  const [
    editandoId,
    setEditandoId,
  ] = useState<number | null>(null);

  const [
    mostrarFormulario,
    setMostrarFormulario,
  ] = useState(false);

  const [guardando, setGuardando] =
    useState(false);

  const [
    accionandoId,
    setAccionandoId,
  ] = useState<number | null>(null);

  const [mensaje, setMensaje] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const esMenu = tipo === "MENU";

  const tituloSingular = esMenu
    ? "Menú"
    : "Submenú";

  const tituloPlural = esMenu
    ? "menús"
    : "submenús";

  const paginasOrdenadas = useMemo(
    () =>
      [...paginas].sort((a, b) =>
        a.titulo.localeCompare(
          b.titulo,
          "es",
        ),
      ),
    [paginas],
  );

  const contenidosOrdenados =
    useMemo(
      () =>
        [...contenidos].sort(
          (a, b) => {
            if (
              a.padreId !==
              b.padreId
            ) {
              return (
                (a.padreId ?? 0) -
                (b.padreId ?? 0)
              );
            }

            if (
              a.orden !==
              b.orden
            ) {
              return (
                a.orden -
                b.orden
              );
            }

            return a.id - b.id;
          },
        ),
      [contenidos],
    );

  const abrirNuevo = () => {
    setEditandoId(null);
    setFormulario(
      crearFormulario(),
    );
    setMensaje(null);
    setError(null);
    setMostrarFormulario(true);
  };

  const abrirEditar = (
    contenido: ContenidoPagina,
  ) => {
    setEditandoId(contenido.id);
    setFormulario(
      crearFormulario(contenido),
    );
    setMensaje(null);
    setError(null);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    if (guardando) {
      return;
    }

    setMostrarFormulario(false);
    setEditandoId(null);
    setFormulario(
      crearFormulario(),
    );
  };

  const cambiarTitulo = (
    titulo: string,
  ) => {
    setFormulario((actual) => ({
      ...actual,
      titulo,
      slug:
        editandoId === null
          ? generarSlug(titulo)
          : actual.slug,
    }));
  };

  const actualizarPadre = (
    padreId: string,
  ) => {
    setFormulario((actual) => ({
      ...actual,
      padreId,
    }));
  };

  const guardar = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setGuardando(true);
    setMensaje(null);
    setError(null);

    try {
      const titulo =
        formulario.titulo.trim();

      if (!titulo) {
        throw new Error(
          `El texto del ${tituloSingular.toLowerCase()} es obligatorio.`,
        );
      }

      if (
        !esMenu &&
        !formulario.padreId
      ) {
        throw new Error(
          "Seleccioná el menú al que pertenece este submenú.",
        );
      }

      let padreId: number | null = null;

      if (!esMenu) {
        const padreIdNumerico = Number(
          formulario.padreId,
        );

        if (
          !Number.isInteger(
            padreIdNumerico,
          ) ||
          padreIdNumerico < 1
        ) {
          throw new Error(
            "El menú seleccionado no es válido.",
          );
        }

        padreId = padreIdNumerico;
      }

      const slug =
        editandoId === null
          ? generarSlug(titulo)
          : formulario.slug;

      if (!slug) {
        throw new Error(
          "No se pudo generar el identificador del contenido.",
        );
      }

      const orden =
        editandoId === null
          ? obtenerSiguienteOrden(
              contenidos,
              tipo,
              padreId,
            )
          : contenidos.find(
              (contenido) =>
                contenido.id ===
                editandoId,
            )?.orden ?? 1;

      const contenidoExistente =
        editandoId !== null
          ? contenidos.find(
              (contenido) =>
                contenido.id ===
                editandoId,
            )
          : undefined;

      const payload = {
        tipo,
        titulo,
        slug,
        contenido: null,
        configuracion: {},
        orden,
        activo:
          editandoId === null
            ? true
            : contenidoExistente?.activo ?? true,
        padreId,
      };

      const esNuevo =
        editandoId === null;

      const response = await fetch(
        esNuevo
          ? "/api/dashboard/contenido"
          : `/api/dashboard/contenido/${editandoId}`,
        {
          method: esNuevo
            ? "POST"
            : "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            payload,
          ),
        },
      );

      const data =
        leerRespuesta(
          await response.json(),
        );

      if (!response.ok) {
        throw new Error(
          data.error ??
            `No se pudo guardar el ${tituloSingular.toLowerCase()}.`,
        );
      }

      if (!data.contenido) {
        throw new Error(
          "El servidor no devolvió el contenido guardado.",
        );
      }

      setContenidos(
        (actuales) =>
          esNuevo
            ? [
                ...actuales,
                data.contenido as ContenidoPagina,
              ]
            : actuales.map(
                (contenido) =>
                  contenido.id ===
                  editandoId
                    ? (data.contenido as ContenidoPagina)
                    : contenido,
              ),
      );

      setMensaje(
        esNuevo
          ? `${tituloSingular} creado correctamente.`
          : `${tituloSingular} actualizado correctamente.`,
      );

      setMostrarFormulario(
        false,
      );
      setEditandoId(null);
      setFormulario(
        crearFormulario(),
      );

      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : `No se pudo guardar el ${tituloSingular.toLowerCase()}.`,
      );
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (
    contenido: ContenidoPagina,
  ) => {
    const confirmado =
      window.confirm(
        `¿Seguro que querés eliminar el ${tituloSingular.toLowerCase()} "${contenido.titulo}"?`,
      );

    if (!confirmado) {
      return;
    }

    setAccionandoId(
      contenido.id,
    );
    setMensaje(null);
    setError(null);

    try {
      const response =
        await fetch(
          `/api/dashboard/contenido/${contenido.id}`,
          {
            method: "DELETE",
          },
        );

      const data =
        leerRespuesta(
          await response.json(),
        );

      if (!response.ok) {
        throw new Error(
          data.error ??
            `No se pudo eliminar el ${tituloSingular.toLowerCase()}.`,
        );
      }

      setContenidos(
        (actuales) =>
          actuales.filter(
            (actual) =>
              actual.id !==
              contenido.id,
          ),
      );

      setMensaje(
        `${tituloSingular} eliminado correctamente.`,
      );

      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : `No se pudo eliminar el ${tituloSingular.toLowerCase()}.`,
      );
    } finally {
      setAccionandoId(null);
    }
  };

  const cambiarActivo = async (
    contenido: ContenidoPagina,
  ) => {
    setAccionandoId(
      contenido.id,
    );
    setMensaje(null);
    setError(null);

    try {
      const response =
        await fetch(
          `/api/dashboard/contenido/${contenido.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              activo:
                !contenido.activo,
            }),
          },
        );

      const data =
        leerRespuesta(
          await response.json(),
        );

      if (!response.ok) {
        throw new Error(
          data.error ??
            "No se pudo cambiar el estado.",
        );
      }

      setContenidos(
        (actuales) =>
          actuales.map(
            (actual) =>
              actual.id ===
              contenido.id
                ? {
                    ...actual,
                    ...(data.contenido ??
                      {}),
                    activo:
                      data.contenido
                        ?.activo ??
                      !contenido.activo,
                  }
                : actual,
          ),
      );

      setMensaje(
        contenido.activo
          ? `${tituloSingular} oculto correctamente.`
          : `${tituloSingular} publicado correctamente.`,
      );

      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "No se pudo cambiar el estado.",
      );
    } finally {
      setAccionandoId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          {contenidos.length}{" "}
          {contenidos.length === 1
            ? tituloSingular.toLowerCase()
            : tituloPlural}
        </p>

        <button
          type="button"
          onClick={abrirNuevo}
          className="inline-flex h-11 items-center justify-center bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-cyan-600"
        >
          Nuevo {tituloSingular.toLowerCase()}
        </button>
      </div>

      {mensaje && (
        <div className="mt-5 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {mostrarFormulario && (
        <form
          onSubmit={guardar}
          className="mt-6 border border-slate-200 bg-white p-6 sm:p-8"
        >
          <div className="flex flex-col gap-2 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
                Navegación pública
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                {editandoId === null
                  ? `Crear ${tituloSingular.toLowerCase()}`
                  : `Editar ${tituloSingular.toLowerCase()}`}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {esMenu
                  ? "El menú se define únicamente mediante su texto."
                  : "El submenú se define mediante su texto y el menú al que pertenece."}
              </p>
            </div>

            <button
              type="button"
              onClick={
                cerrarFormulario
              }
              disabled={guardando}
              className="text-sm font-semibold text-slate-500 hover:text-slate-950"
            >
              Cerrar
            </button>
          </div>

          <div className="mt-8 space-y-6">
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">
                Texto
              </span>

              <input
                value={
                  formulario.titulo
                }
                onChange={(event) =>
                  cambiarTitulo(
                    event.target.value,
                  )
                }
                className="mt-2 h-12 w-full border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-cyan-500"
                placeholder={
                  esMenu
                    ? "Ej.: Investigación"
                    : "Ej.: Nuestro equipo"
                }
                required
                autoFocus
              />
            </label>

            {!esMenu && (
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">
                  Menú al que pertenece
                </span>

                <select
                  value={
                    formulario.padreId
                  }
                  onChange={(event) =>
                    actualizarPadre(
                      event.target.value,
                    )
                  }
                  className="mt-2 h-12 w-full border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-cyan-500"
                  required
                >
                  <option value="">
                    Seleccionar menú
                  </option>

                  {paginasOrdenadas.map(
                    (pagina) => (
                      <option
                        key={
                          pagina.id
                        }
                        value={
                          pagina.id
                        }
                      >
                        {
                          pagina.titulo
                        }
                      </option>
                    ),
                  )}
                </select>
              </label>
            )}
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                cerrarFormulario
              }
              disabled={guardando}
              className="h-11 border border-slate-300 px-5 text-sm font-semibold text-slate-700"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="h-11 bg-cyan-500 px-6 text-sm font-semibold text-white hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {guardando
                ? "Guardando..."
                : "Guardar"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 space-y-3">
        {contenidosOrdenados.map(
          (contenido) => {
            const padre =
              contenido.padreId
                ? paginas.find(
                    (pagina) =>
                      pagina.id ===
                      contenido.padreId,
                  )
                : undefined;

            return (
              <article
                key={
                  contenido.id
                }
                className="border border-slate-200 bg-white p-5 sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-950">
                        {
                          contenido.titulo
                        }
                      </h3>

                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                          contenido.activo
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {contenido.activo
                          ? "Publicado"
                          : "Oculto"}
                      </span>
                    </div>

                    {!esMenu && (
                      <p className="mt-2 text-sm text-slate-500">
                        Menú:{" "}
                        {padre?.titulo ??
                          "Sin menú asignado"}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        cambiarActivo(
                          contenido,
                        )
                      }
                      disabled={
                        accionandoId ===
                        contenido.id
                      }
                      className="h-10 border border-slate-300 px-4 text-xs font-semibold uppercase tracking-wide text-slate-700 hover:border-cyan-500 hover:text-cyan-600 disabled:opacity-50"
                    >
                      {contenido.activo
                        ? "Ocultar"
                        : "Publicar"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        abrirEditar(
                          contenido,
                        )
                      }
                      className="h-10 border border-slate-300 px-4 text-xs font-semibold uppercase tracking-wide text-slate-700 hover:border-cyan-500 hover:text-cyan-600"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        eliminar(
                          contenido,
                        )
                      }
                      disabled={
                        accionandoId ===
                        contenido.id
                      }
                      className="h-10 border border-red-200 px-4 text-xs font-semibold uppercase tracking-wide text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            );
          },
        )}
      </div>

      {contenidos.length === 0 && (
        <div className="mt-8 border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <h2 className="text-lg font-semibold text-slate-950">
            Todavía no hay{" "}
            {tituloPlural}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Creá el primero para
            comenzar a administrar
            la navegación pública.
          </p>
        </div>
      )}
    </div>
  );
}
