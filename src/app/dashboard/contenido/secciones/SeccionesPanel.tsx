"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ContenidoPagina } from "@/lib/contenido";

interface SeccionesPanelProps {
  seccionesIniciales: ContenidoPagina[];
  submenus: ContenidoPagina[];
}

interface Formulario {
  titulo: string;
  slug: string;
  contenido: string;
  orden: string;
  activo: boolean;
  padreId: string;
}

interface RespuestaContenido {
  contenido?: ContenidoPagina;
  error?: string;
}

function crearFormulario(
  seccion?: ContenidoPagina,
): Formulario {
  return {
    titulo: seccion?.titulo ?? "",
    slug: seccion?.slug ?? "",
    contenido: seccion?.contenido ?? "",
    orden: String(seccion?.orden ?? 1),
    activo: seccion?.activo ?? true,
    padreId:
      seccion?.padreId !== null &&
      seccion?.padreId !== undefined
        ? String(seccion.padreId)
        : "",
  };
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

async function leerRespuesta(
  response: Response,
): Promise<RespuestaContenido> {
  try {
    const data: unknown = await response.json();

    if (!data || typeof data !== "object") {
      return {};
    }

    const objeto = data as Record<string, unknown>;
    const resultado: RespuestaContenido = {};

    if (typeof objeto.error === "string") {
      resultado.error = objeto.error;
    }

    const contenido = objeto.contenido;

    if (
      contenido &&
      typeof contenido === "object"
    ) {
      resultado.contenido =
        contenido as ContenidoPagina;
    }

    return resultado;
  } catch {
    return {};
  }
}

export default function SeccionesPanel({
  seccionesIniciales,
  submenus,
}: SeccionesPanelProps) {
  const router = useRouter();

  const [secciones, setSecciones] =
    useState<ContenidoPagina[]>(
      seccionesIniciales,
    );

  const [formulario, setFormulario] =
    useState<Formulario>(
      crearFormulario(),
    );

  const [editandoId, setEditandoId] =
    useState<number | null>(null);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [guardando, setGuardando] =
    useState(false);

  const [accionandoId, setAccionandoId] =
    useState<number | null>(null);

  const [mensaje, setMensaje] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const submenusOrdenados = useMemo(
    () =>
      [...submenus].sort((a, b) => {
        if (a.orden !== b.orden) {
          return a.orden - b.orden;
        }

        return a.id - b.id;
      }),
    [submenus],
  );

  const seccionesOrdenadas = useMemo(
    () =>
      [...secciones].sort((a, b) => {
        if (a.orden !== b.orden) {
          return a.orden - b.orden;
        }

        return a.id - b.id;
      }),
    [secciones],
  );

  const abrirNuevo = () => {
    setEditandoId(null);
    setFormulario(crearFormulario());
    setMensaje(null);
    setError(null);
    setMostrarFormulario(true);
  };

  const abrirEditar = (
    seccion: ContenidoPagina,
  ) => {
    setEditandoId(seccion.id);
    setFormulario(
      crearFormulario(seccion),
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
    setFormulario(crearFormulario());
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

      const slug =
        formulario.slug.trim();

      const padreId =
        Number(formulario.padreId);

      const orden =
        Number(formulario.orden);

      if (!titulo) {
        throw new Error(
          "El título es obligatorio.",
        );
      }

      if (!slug) {
        throw new Error(
          "El slug es obligatorio.",
        );
      }

      if (
        !Number.isInteger(padreId) ||
        padreId <= 0
      ) {
        throw new Error(
          "Tenés que seleccionar un submenú.",
        );
      }

      if (
        !Number.isInteger(orden) ||
        orden < 1
      ) {
        throw new Error(
          "El orden debe ser un número entero mayor a cero.",
        );
      }

      const payload = {
        tipo: "SECCION",
        titulo,
        slug,
        contenido:
          formulario.contenido,
        configuracion: {},
        orden,
        activo:
          formulario.activo,
        padreId,
      };

      const esNueva =
        editandoId === null;

      const response = await fetch(
        esNueva
          ? "/api/dashboard/contenido"
          : `/api/dashboard/contenido/${editandoId}`,
        {
          method: esNueva
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
        await leerRespuesta(
          response,
        );

      if (!response.ok) {
        throw new Error(
          data.error ??
            "No se pudo guardar la sección.",
        );
      }

      if (!data.contenido) {
        throw new Error(
          "El servidor no devolvió la sección guardada.",
        );
      }

      if (esNueva) {
        setSecciones(
          (actuales) => [
            ...actuales,
            data.contenido as ContenidoPagina,
          ],
        );

        setMensaje(
          "Sección creada correctamente.",
        );
      } else {
        setSecciones(
          (actuales) =>
            actuales.map(
              (seccion) =>
                seccion.id ===
                editandoId
                  ? data.contenido as ContenidoPagina
                  : seccion,
            ),
        );

        setMensaje(
          "Sección actualizada correctamente.",
        );
      }

      setMostrarFormulario(false);
      setEditandoId(null);
      setFormulario(
        crearFormulario(),
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al guardar la sección.",
      );
    } finally {
      setGuardando(false);
    }
  };

  const cambiarActivo = async (
    seccion: ContenidoPagina,
  ) => {
    setAccionandoId(seccion.id);
    setMensaje(null);
    setError(null);

    try {
      const response = await fetch(
        `/api/dashboard/contenido/${seccion.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            activo:
              !seccion.activo,
          }),
        },
      );

      const data =
        await leerRespuesta(
          response,
        );

      if (!response.ok) {
        throw new Error(
          data.error ??
            "No se pudo cambiar el estado de la sección.",
        );
      }

      setSecciones(
        (actuales) =>
          actuales.map(
            (actual) =>
              actual.id ===
              seccion.id
                ? {
                    ...actual,
                    ...(data.contenido ??
                      {}),
                    activo:
                      data.contenido
                        ?.activo ??
                      !seccion.activo,
                  }
                : actual,
          ),
      );

      setMensaje(
        seccion.activo
          ? "Sección desactivada correctamente."
          : "Sección activada correctamente.",
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al cambiar el estado.",
      );
    } finally {
      setAccionandoId(null);
    }
  };

  const eliminar = async (
    seccion: ContenidoPagina,
  ) => {
    const confirmado =
      window.confirm(
        `¿Seguro que querés eliminar la sección "${seccion.titulo}"? Esta acción no se puede deshacer.`,
      );

    if (!confirmado) {
      return;
    }

    setAccionandoId(seccion.id);
    setMensaje(null);
    setError(null);

    try {
      const response = await fetch(
        `/api/dashboard/contenido/${seccion.id}`,
        {
          method: "DELETE",
        },
      );

      const data =
        await leerRespuesta(
          response,
        );

      if (!response.ok) {
        throw new Error(
          data.error ??
            "No se pudo eliminar la sección.",
        );
      }

      setSecciones(
        (actuales) =>
          actuales.filter(
            (actual) =>
              actual.id !==
              seccion.id,
          ),
      );

      setMensaje(
        "Sección eliminada correctamente.",
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al eliminar la sección.",
      );
    } finally {
      setAccionandoId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          {secciones.length}{" "}
          {secciones.length === 1
            ? "sección"
            : "secciones"}
        </p>

        <button
          type="button"
          onClick={abrirNuevo}
          className="inline-flex h-11 items-center justify-center bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-cyan-600"
        >
          Nueva sección
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
        <div className="mt-6 border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                {editandoId === null
                  ? "Nueva sección"
                  : "Editar sección"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                La sección quedará asociada al
                submenú seleccionado.
              </p>
            </div>

            <button
              type="button"
              onClick={cerrarFormulario}
              disabled={guardando}
              className="text-sm font-medium text-slate-500 hover:text-slate-950 disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>

          <form
            onSubmit={guardar}
            className="mt-6 space-y-5"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="seccion-titulo"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Título
                </label>

                <input
                  id="seccion-titulo"
                  value={formulario.titulo}
                  onChange={(event) =>
                    cambiarTitulo(
                      event.target.value,
                    )
                  }
                  className="h-11 w-full border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="seccion-slug"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Slug
                </label>

                <input
                  id="seccion-slug"
                  value={formulario.slug}
                  onChange={(event) =>
                    setFormulario(
                      (actual) => ({
                        ...actual,
                        slug: event.target.value,
                      }),
                    )
                  }
                  className="h-11 w-full border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="seccion-padre"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Submenú padre
              </label>

              <select
                id="seccion-padre"
                value={
                  formulario.padreId
                }
                onChange={(event) =>
                  setFormulario(
                    (actual) => ({
                      ...actual,
                      padreId:
                        event.target.value,
                    }),
                  )
                }
                className="h-11 w-full border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
                required
              >
                <option value="">
                  Seleccionar submenú...
                </option>

                {submenusOrdenados.map(
                  (submenu) => (
                    <option
                      key={submenu.id}
                      value={submenu.id}
                    >
                      {submenu.titulo}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="seccion-contenido"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Contenido
              </label>

              <textarea
                id="seccion-contenido"
                value={
                  formulario.contenido
                }
                onChange={(event) =>
                  setFormulario(
                    (actual) => ({
                      ...actual,
                      contenido:
                        event.target.value,
                    }),
                  )
                }
                rows={12}
                className="w-full resize-y border border-slate-300 px-4 py-3 text-sm leading-7 text-slate-900 outline-none focus:border-cyan-500"
                placeholder="Ingresá el contenido de la sección..."
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="seccion-orden"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Orden
                </label>

                <input
                  id="seccion-orden"
                  type="number"
                  min="1"
                  step="1"
                  value={
                    formulario.orden
                  }
                  onChange={(event) =>
                    setFormulario(
                      (actual) => ({
                        ...actual,
                        orden:
                          event.target.value,
                      }),
                    )
                  }
                  className="h-11 w-full border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <label className="flex h-11 items-center gap-3 self-end border border-slate-300 px-4 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={
                    formulario.activo
                  }
                  onChange={(event) =>
                    setFormulario(
                      (actual) => ({
                        ...actual,
                        activo:
                          event.target
                            .checked,
                      }),
                    )
                  }
                  className="h-4 w-4"
                />

                Sección activa
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={cerrarFormulario}
                disabled={guardando}
                className="h-11 border border-slate-300 px-5 text-sm font-medium text-slate-700 hover:border-slate-500 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={guardando}
                className="h-11 bg-cyan-600 px-6 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {guardando
                  ? "Guardando..."
                  : editandoId === null
                    ? "Crear sección"
                    : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6 overflow-hidden border border-slate-200 bg-white">
        {seccionesOrdenadas.length ===
        0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-slate-500">
              No hay secciones creadas.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {seccionesOrdenadas.map(
              (seccion) => {
                const submenu =
                  submenus.find(
                    (item) =>
                      item.id ===
                      seccion.padreId,
                  );

                const accionando =
                  accionandoId ===
                  seccion.id;

                return (
                  <div
                    key={seccion.id}
                    className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-950">
                          {seccion.titulo}
                        </h3>

                        <span
                          className={`border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                            seccion.activo
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-slate-50 text-slate-500"
                          }`}
                        >
                          {seccion.activo
                            ? "Activa"
                            : "Inactiva"}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        /{seccion.slug}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span>
                          Submenú:{" "}
                          {submenu?.titulo ??
                            "No disponible"}
                        </span>

                        <span>
                          Orden:{" "}
                          {seccion.orden}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          cambiarActivo(
                            seccion,
                          )
                        }
                        disabled={
                          accionando
                        }
                        className="h-9 border border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:border-cyan-500 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {seccion.activo
                          ? "Desactivar"
                          : "Activar"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          abrirEditar(
                            seccion,
                          )
                        }
                        disabled={
                          accionando
                        }
                        className="h-9 border border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:border-cyan-500 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          eliminar(
                            seccion,
                          )
                        }
                        disabled={
                          accionando
                        }
                        className="h-9 border border-red-200 px-3 text-xs font-semibold text-red-600 hover:border-red-400 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {accionando
                          ? "Procesando..."
                          : "Eliminar"}
                      </button>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>
    </div>
  );
}