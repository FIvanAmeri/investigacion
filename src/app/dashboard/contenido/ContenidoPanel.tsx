"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

type ContenidoTipo =
  | "MENU"
  | "SUBMENU"
  | "SECCION";

interface ContenidoPagina {
  id: number;
  tipo: ContenidoTipo;
  titulo: string;
  slug: string;
  contenido: string | null;
  configuracion: Record<string, unknown> | null;
  orden: number;
  activo: boolean;
  padreId: number | null;
  createdAt: string;
  updatedAt: string;
}

interface ContenidoPanelProps {
  tipo: ContenidoTipo;
  contenidosIniciales: ContenidoPagina[];
  padres: ContenidoPagina[];
}

interface Formulario {
  titulo: string;
  slug: string;
  contenido: string;
  orden: string;
  activo: boolean;
  padreId: string;
}

function crearFormulario(
  contenido?: ContenidoPagina,
): Formulario {
  return {
    titulo: contenido?.titulo ?? "",
    slug: contenido?.slug ?? "",
    contenido: contenido?.contenido ?? "",
    orden: String(contenido?.orden ?? 1),
    activo: contenido?.activo ?? true,
    padreId:
      contenido?.padreId !== null &&
      contenido?.padreId !== undefined
        ? String(contenido.padreId)
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

export default function ContenidoPanel({
  tipo,
  contenidosIniciales,
  padres,
}: ContenidoPanelProps) {
  const router = useRouter();

  const [contenidos, setContenidos] = useState(
    contenidosIniciales,
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

  const [mensaje, setMensaje] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const tituloTipo = useMemo(() => {
    if (tipo === "MENU") {
      return "Menú";
    }

    if (tipo === "SUBMENU") {
      return "Submenú";
    }

    return "Sección";
  }, [tipo]);

  const abrirNuevo = () => {
    setEditandoId(null);
    setFormulario(crearFormulario());
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
    setFormulario(crearFormulario());
  };

  const actualizarCampo = <
    K extends keyof Formulario,
  >(
    campo: K,
    valor: Formulario[K],
  ) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  };

  const cambiarTitulo = (valor: string) => {
    setFormulario((actual) => ({
      ...actual,
      titulo: valor,
      slug:
        editandoId === null
          ? generarSlug(valor)
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

      if (!titulo || !slug) {
        throw new Error(
          "El título y el slug son obligatorios.",
        );
      }

      if (
        tipo !== "MENU" &&
        !formulario.padreId
      ) {
        throw new Error(
          "Tenés que seleccionar un elemento padre.",
        );
      }

      const payload = {
        titulo,
        slug,
        contenido:
          tipo === "SECCION"
            ? formulario.contenido
            : null,
        orden:
          Number(formulario.orden) || 1,
        activo: formulario.activo,
        padreId:
          tipo === "MENU"
            ? null
            : Number(formulario.padreId),
      };

      const response = await fetch(
        editandoId === null
          ? "/api/dashboard/contenido"
          : `/api/dashboard/contenido/${editandoId}`,
        {
          method:
            editandoId === null
              ? "POST"
              : "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "No se pudo guardar el contenido.",
        );
      }

      if (editandoId === null) {
        setContenidos((actuales) => [
          ...actuales,
          data.contenido,
        ]);
      } else {
        setContenidos((actuales) =>
          actuales.map((contenido) =>
            contenido.id === editandoId
              ? {
                  ...contenido,
                  ...data.contenido,
                }
              : contenido,
          ),
        );
      }

      setMensaje(
        editandoId === null
          ? `${tituloTipo} creado correctamente.`
          : `${tituloTipo} actualizado correctamente.`,
      );

      setMostrarFormulario(false);
      setEditandoId(null);
      setFormulario(crearFormulario());

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error.",
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
        `¿Seguro que querés eliminar "${contenido.titulo}"?`,
      );

    if (!confirmado) {
      return;
    }

    setError(null);
    setMensaje(null);

    try {
      const response = await fetch(
        `/api/dashboard/contenido/${contenido.id}`,
        {
          method: "DELETE",
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "No se pudo eliminar el contenido.",
        );
      }

      setContenidos((actuales) =>
        actuales.filter(
          (actual) =>
            actual.id !== contenido.id,
        ),
      );

      setMensaje(
        `${tituloTipo} eliminado correctamente.`,
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error.",
      );
    }
  };

  const cambiarActivo = async (
    contenido: ContenidoPagina,
  ) => {
    const nuevoEstado =
      !contenido.activo;

    setError(null);
    setMensaje(null);

    try {
      const response = await fetch(
        `/api/dashboard/contenido/${contenido.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            activo: nuevoEstado,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "No se pudo cambiar el estado.",
        );
      }

      setContenidos((actuales) =>
        actuales.map((actual) =>
          actual.id === contenido.id
            ? {
                ...actual,
                ...data.contenido,
                activo:
                  typeof data?.contenido
                    ?.activo === "boolean"
                    ? data.contenido.activo
                    : nuevoEstado,
              }
            : actual,
        ),
      );

      setMensaje(
        nuevoEstado
          ? `${tituloTipo} activado correctamente.`
          : `${tituloTipo} desactivado correctamente.`,
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error.",
      );
    }
  };

  const ordenar = (
    lista: ContenidoPagina[],
  ) => {
    return [...lista].sort(
      (a, b) => {
        if (a.orden !== b.orden) {
          return a.orden - b.orden;
        }

        return a.id - b.id;
      },
    );
  };

  const contenidosOrdenados =
    ordenar(contenidos);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {contenidos.length}{" "}
            {contenidos.length === 1
              ? tituloTipo.toLowerCase()
              : `${tituloTipo.toLowerCase()}s`}
          </p>
        </div>

        <button
          type="button"
          onClick={abrirNuevo}
          className="inline-flex h-11 items-center justify-center bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-cyan-600"
        >
          Nuevo{" "}
          {tituloTipo.toLowerCase()}
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
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                {editandoId === null
                  ? `Nuevo ${tituloTipo.toLowerCase()}`
                  : `Editar ${tituloTipo.toLowerCase()}`}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Los cambios se aplican directamente al
                contenido administrable del sitio.
              </p>
            </div>

            <button
              type="button"
              onClick={cerrarFormulario}
              className="text-sm font-medium text-slate-500 hover:text-slate-950"
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
                  htmlFor="contenido-titulo"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Título
                </label>

                <input
                  id="contenido-titulo"
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
                  htmlFor="contenido-slug"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Slug
                </label>

                <input
                  id="contenido-slug"
                  value={formulario.slug}
                  onChange={(event) =>
                    actualizarCampo(
                      "slug",
                      event.target.value,
                    )
                  }
                  className="h-11 w-full border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            {tipo !== "MENU" && (
              <div>
                <label
                  htmlFor="contenido-padre"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Elemento padre
                </label>

                <select
                  id="contenido-padre"
                  value={formulario.padreId}
                  onChange={(event) =>
                    actualizarCampo(
                      "padreId",
                      event.target.value,
                    )
                  }
                  className="h-11 w-full border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
                  required
                >
                  <option value="">
                    Seleccionar...
                  </option>

                  {padres.map((padre) => (
                    <option
                      key={padre.id}
                      value={padre.id}
                    >
                      {padre.titulo}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {tipo === "SECCION" && (
              <div>
                <label
                  htmlFor="contenido-texto"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Contenido
                </label>

                <textarea
                  id="contenido-texto"
                  value={formulario.contenido}
                  onChange={(event) =>
                    actualizarCampo(
                      "contenido",
                      event.target.value,
                    )
                  }
                  rows={10}
                  className="w-full resize-y border border-slate-300 px-4 py-3 text-sm leading-7 text-slate-900 outline-none focus:border-cyan-500"
                />
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="contenido-orden"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Orden
                </label>

                <input
                  id="contenido-orden"
                  type="number"
                  min="1"
                  value={formulario.orden}
                  onChange={(event) =>
                    actualizarCampo(
                      "orden",
                      event.target.value,
                    )
                  }
                  className="h-11 w-full border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
                />
              </div>

              <label className="flex h-11 items-center gap-3 self-end border border-slate-300 px-4 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={formulario.activo}
                  onChange={(event) =>
                    actualizarCampo(
                      "activo",
                      event.target.checked,
                    )
                  }
                  className="h-4 w-4"
                />

                Contenido activo
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
                  : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6 overflow-hidden border border-slate-200 bg-white">
        {contenidosOrdenados.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-slate-500">
              No hay contenidos creados.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {contenidosOrdenados.map(
              (contenido) => {
                const padre =
                  padres.find(
                    (item) =>
                      item.id ===
                      contenido.padreId,
                  );

                return (
                  <div
                    key={contenido.id}
                    className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-950">
                          {contenido.titulo}
                        </h3>

                        <span
                          className={`border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                            contenido.activo
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-slate-50 text-slate-500"
                          }`}
                        >
                          {contenido.activo
                            ? "Activo"
                            : "Inactivo"}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        /{contenido.slug}
                      </p>

                      {padre && (
                        <p className="mt-2 text-xs text-slate-400">
                          Padre:{" "}
                          {padre.titulo}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="mr-2 text-xs text-slate-400">
                        Orden{" "}
                        {contenido.orden}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          cambiarActivo(
                            contenido,
                          )
                        }
                        className="h-9 border border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:border-cyan-500 hover:text-cyan-600"
                      >
                        {contenido.activo
                          ? "Desactivar"
                          : "Activar"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          abrirEditar(
                            contenido,
                          )
                        }
                        className="h-9 border border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:border-cyan-500 hover:text-cyan-600"
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
                        className="h-9 border border-red-200 px-3 text-xs font-semibold text-red-600 hover:border-red-400 hover:bg-red-50"
                      >
                        Eliminar
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