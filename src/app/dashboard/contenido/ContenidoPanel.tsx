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

type SeccionTipo =
  | "CABECERA"
  | "TEXTO"
  | "TRATAMIENTO"
  | "PATOLOGIA"
  | "RECURSO"
  | "PERSONA";

interface ConfiguracionSeccion {
  tipo?: SeccionTipo;
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

interface PaginaDestino {
  id: number;
  tipo: "MENU" | "SUBMENU";
  titulo: string;
  slug: string;
  padreTitulo: string | null;
}

interface ContenidoPanelProps {
  tipo: ContenidoTipo;
  contenidosIniciales: ContenidoPagina[];
  paginas: PaginaDestino[];
}

interface Formulario {
  titulo: string;
  slug: string;
  contenido: string;
  orden: string;
  activo: boolean;
  paginaId: string;
  tipoSeccion: SeccionTipo;
  etiqueta: string;
  descripcion: string;
  rol: string;
  categoria: string;
  imagenUrl: string;
  imagenAlt: string;
  mostrarImagen: boolean;
  fuenteNombre: string;
  fuenteUrl: string;
  mostrarFuente: boolean;
  palabrasClave: string;
  destacado: boolean;
  href: string;
}

function leerConfiguracion(
  contenido?: ContenidoPagina,
): ConfiguracionSeccion {
  const configuracion =
    contenido?.configuracion ?? {};

  return {
    tipo:
      configuracion.tipo === "CABECERA" ||
      configuracion.tipo === "TEXTO" ||
      configuracion.tipo === "TRATAMIENTO" ||
      configuracion.tipo === "PATOLOGIA" ||
      configuracion.tipo === "RECURSO" ||
      configuracion.tipo === "PERSONA"
        ? configuracion.tipo
        : undefined,
    etiqueta:
      typeof configuracion.etiqueta === "string"
        ? configuracion.etiqueta
        : "",
    descripcion:
      typeof configuracion.descripcion === "string"
        ? configuracion.descripcion
        : "",
    rol:
      typeof configuracion.rol === "string"
        ? configuracion.rol
        : "",
    categoria:
      typeof configuracion.categoria === "string"
        ? configuracion.categoria
        : "",
    imagenUrl:
      typeof configuracion.imagenUrl === "string"
        ? configuracion.imagenUrl
        : "",
    imagenAlt:
      typeof configuracion.imagenAlt === "string"
        ? configuracion.imagenAlt
        : "",
    mostrarImagen:
      configuracion.mostrarImagen === true,
    fuenteNombre:
      typeof configuracion.fuenteNombre === "string"
        ? configuracion.fuenteNombre
        : "",
    fuenteUrl:
      typeof configuracion.fuenteUrl === "string"
        ? configuracion.fuenteUrl
        : "",
    mostrarFuente:
      configuracion.mostrarFuente === true,
    palabrasClave:
      Array.isArray(configuracion.palabrasClave)
        ? configuracion.palabrasClave.filter(
            (valor): valor is string =>
              typeof valor === "string",
          )
        : [],
    destacado:
      configuracion.destacado === true,
  };
}

function crearFormulario(
  contenido?: ContenidoPagina,
): Formulario {
  const configuracion = leerConfiguracion(
    contenido,
  );

  return {
    titulo: contenido?.titulo ?? "",
    slug: contenido?.slug ?? "",
    contenido: contenido?.contenido ?? "",
    orden: String(contenido?.orden ?? 1),
    activo: contenido?.activo ?? true,
    paginaId:
      contenido?.padreId !== null &&
      contenido?.padreId !== undefined
        ? String(contenido.padreId)
        : "",
    tipoSeccion:
      configuracion.tipo ?? "TEXTO",
    etiqueta: configuracion.etiqueta ?? "",
    descripcion:
      configuracion.descripcion ?? "",
    rol: configuracion.rol ?? "",
    categoria:
      configuracion.categoria ?? "",
    imagenUrl:
      configuracion.imagenUrl ?? "",
    imagenAlt:
      configuracion.imagenAlt ?? "",
    mostrarImagen:
      configuracion.mostrarImagen ?? false,
    fuenteNombre:
      configuracion.fuenteNombre ?? "",
    fuenteUrl:
      configuracion.fuenteUrl ?? "",
    mostrarFuente:
      configuracion.mostrarFuente ?? false,
    palabrasClave:
      configuracion.palabrasClave?.join(", ") ?? "",
    destacado:
      configuracion.destacado ?? false,
    href:
      typeof contenido?.configuracion?.href === "string"
        ? contenido.configuracion.href
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

function tipoSeccionLabel(
  tipo: SeccionTipo,
): string {
  const labels: Record<SeccionTipo, string> = {
    CABECERA: "Cabecera de página",
    TEXTO: "Texto general",
    TRATAMIENTO: "Tratamiento",
    PATOLOGIA: "Patología",
    RECURSO: "Recurso",
    PERSONA: "Persona / integrante",
  };

  return labels[tipo];
}

function obtenerPaginaLabel(
  pagina: PaginaDestino,
): string {
  if (pagina.tipo === "SUBMENU" && pagina.padreTitulo) {
    return `${pagina.padreTitulo} — ${pagina.titulo}`;
  }

  return pagina.titulo;
}

export default function ContenidoPanel({
  tipo,
  contenidosIniciales,
  paginas,
}: ContenidoPanelProps) {
  const router = useRouter();

  const [contenidos, setContenidos] = useState(
    contenidosIniciales,
  );
  const [formulario, setFormulario] =
    useState<Formulario>(crearFormulario());
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
    setFormulario(crearFormulario(contenido));
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
      const titulo = formulario.titulo.trim();
      const slug = formulario.slug.trim();

      if (!titulo || !slug) {
        throw new Error(
          "El título y el slug son obligatorios.",
        );
      }

      if (!formulario.paginaId) {
        throw new Error(
          "Seleccioná la página donde se mostrará esta sección.",
        );
      }

      if (
        formulario.mostrarImagen &&
        !formulario.imagenUrl.trim()
      ) {
        throw new Error(
          "Ingresá la ruta o URL de la imagen.",
        );
      }

      if (
        formulario.mostrarFuente &&
        (!formulario.fuenteNombre.trim() ||
          !formulario.fuenteUrl.trim())
      ) {
        throw new Error(
          "Completá el nombre y la URL de la fuente.",
        );
      }

      const configuracion: Record<string, unknown> = {
        tipo: formulario.tipoSeccion,
        etiqueta:
          formulario.etiqueta.trim() || undefined,
        descripcion:
          formulario.descripcion.trim() || undefined,
        rol: formulario.rol.trim() || undefined,
        categoria:
          formulario.categoria.trim() || undefined,
        imagenUrl:
          formulario.mostrarImagen
            ? formulario.imagenUrl.trim()
            : undefined,
        imagenAlt:
          formulario.mostrarImagen
            ? formulario.imagenAlt.trim() || formulario.titulo.trim()
            : undefined,
        mostrarImagen:
          formulario.mostrarImagen,
        fuenteNombre:
          formulario.mostrarFuente
            ? formulario.fuenteNombre.trim()
            : undefined,
        fuenteUrl:
          formulario.mostrarFuente
            ? formulario.fuenteUrl.trim()
            : undefined,
        mostrarFuente:
          formulario.mostrarFuente,
        palabrasClave:
          formulario.palabrasClave
            .split(",")
            .map((valor) => valor.trim())
            .filter(Boolean),
        destacado: formulario.destacado,
      };

      if (tipo !== "SECCION" && formulario.href.trim()) {
        configuracion.href = formulario.href.trim();
      }

      Object.keys(configuracion).forEach((clave) => {
        if (configuracion[clave] === undefined) {
          delete configuracion[clave];
        }
      });

      const payload = {
        titulo,
        slug,
        contenido:
          tipo === "SECCION"
            ? formulario.contenido
            : null,
        orden: Number(formulario.orden) || 1,
        activo: formulario.activo,
        configuracion,
        padreId:
          tipo === "SECCION"
            ? Number(formulario.paginaId)
            : null,
      };

      const response = await fetch(
        editandoId === null
          ? "/api/dashboard/contenido"
          : `/api/dashboard/contenido/${editandoId}`,
        {
          method:
            editandoId === null ? "POST" : "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

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
          ? "Sección creada correctamente."
          : "Sección actualizada correctamente.",
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
    const confirmado = window.confirm(
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
        { method: "DELETE" },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "No se pudo eliminar el contenido.",
        );
      }

      setContenidos((actuales) =>
        actuales.filter(
          (actual) => actual.id !== contenido.id,
        ),
      );
      setMensaje("Sección eliminada correctamente.");
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
    const nuevoEstado = !contenido.activo;
    setError(null);
    setMensaje(null);

    try {
      const response = await fetch(
        `/api/dashboard/contenido/${contenido.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            activo: nuevoEstado,
          }),
        },
      );
      const data = await response.json();

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
                activo: nuevoEstado,
              }
            : actual,
        ),
      );
      setMensaje(
        nuevoEstado
          ? "Sección activada correctamente."
          : "Sección desactivada correctamente.",
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

  const contenidosOrdenados = [...contenidos].sort(
    (a, b) => {
      if (a.orden !== b.orden) {
        return a.orden - b.orden;
      }

      return a.id - b.id;
    },
  );

  const requiereDescripcion =
    formulario.tipoSeccion !== "TEXTO";
  const requiereFuente =
    formulario.tipoSeccion === "TRATAMIENTO" ||
    formulario.tipoSeccion === "PATOLOGIA" ||
    formulario.tipoSeccion === "RECURSO";
  const requiereKeywords =
    formulario.tipoSeccion === "TRATAMIENTO" ||
    formulario.tipoSeccion === "PATOLOGIA" ||
    formulario.tipoSeccion === "RECURSO";
  const esPersona =
    formulario.tipoSeccion === "PERSONA";

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          {contenidos.length} {contenidos.length === 1 ? "sección" : "secciones"}
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
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                {editandoId === null
                  ? "Nueva sección"
                  : "Editar sección"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Completá solamente los datos que realmente usa esta sección.
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

          <form onSubmit={guardar} className="mt-6 space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="contenido-tipo" className="mb-2 block text-sm font-medium text-slate-700">
                  Tipo de contenido
                </label>
                <select
                  id="contenido-tipo"
                  value={formulario.tipoSeccion}
                  onChange={(event) =>
                    actualizarCampo(
                      "tipoSeccion",
                      event.target.value as SeccionTipo,
                    )
                  }
                  className="h-11 w-full border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
                >
                  <option value="CABECERA">Cabecera de página</option>
                  <option value="TEXTO">Texto general</option>
                  <option value="TRATAMIENTO">Tratamiento</option>
                  <option value="PATOLOGIA">Patología</option>
                  <option value="RECURSO">Recurso</option>
                  <option value="PERSONA">Persona / integrante</option>
                </select>
              </div>

              <div>
                <label htmlFor="contenido-pagina" className="mb-2 block text-sm font-medium text-slate-700">
                  Página
                </label>
                <select
                  id="contenido-pagina"
                  value={formulario.paginaId}
                  onChange={(event) =>
                    actualizarCampo(
                      "paginaId",
                      event.target.value,
                    )
                  }
                  className="h-11 w-full border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
                  required
                >
                  <option value="">Seleccionar página...</option>
                  {paginas.map((pagina) => (
                    <option key={pagina.id} value={pagina.id}>
                      {obtenerPaginaLabel(pagina)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="contenido-titulo" className="mb-2 block text-sm font-medium text-slate-700">
                  Título
                </label>
                <input
                  id="contenido-titulo"
                  value={formulario.titulo}
                  onChange={(event) => cambiarTitulo(event.target.value)}
                  className="h-11 w-full border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="contenido-slug" className="mb-2 block text-sm font-medium text-slate-700">
                  Identificador
                </label>
                <input
                  id="contenido-slug"
                  value={formulario.slug}
                  onChange={(event) => actualizarCampo("slug", event.target.value)}
                  className="h-11 w-full border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="contenido-etiqueta" className="mb-2 block text-sm font-medium text-slate-700">
                Etiqueta superior
              </label>
              <input
                id="contenido-etiqueta"
                value={formulario.etiqueta}
                onChange={(event) => actualizarCampo("etiqueta", event.target.value)}
                placeholder="Ej.: Uroginecología, Equipo, Tratamiento"
                className="h-11 w-full border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
              />
            </div>

            {requiereDescripcion && (
              <div>
                <label htmlFor="contenido-descripcion" className="mb-2 block text-sm font-medium text-slate-700">
                  Descripción / resumen
                </label>
                <textarea
                  id="contenido-descripcion"
                  value={formulario.descripcion}
                  onChange={(event) => actualizarCampo("descripcion", event.target.value)}
                  rows={4}
                  className="w-full resize-y border border-slate-300 px-4 py-3 text-sm leading-7 text-slate-900 outline-none focus:border-cyan-500"
                />
              </div>
            )}

            {esPersona && (
              <div>
                <label htmlFor="contenido-rol" className="mb-2 block text-sm font-medium text-slate-700">
                  Cargo / rol
                </label>
                <input
                  id="contenido-rol"
                  value={formulario.rol}
                  onChange={(event) => actualizarCampo("rol", event.target.value)}
                  placeholder="Ej.: Coordinadora de la subcomisión de AUGA"
                  className="h-11 w-full border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
                />
              </div>
            )}

            {formulario.tipoSeccion === "RECURSO" && (
              <div>
                <label htmlFor="contenido-categoria" className="mb-2 block text-sm font-medium text-slate-700">
                  Categoría
                </label>
                <input
                  id="contenido-categoria"
                  value={formulario.categoria}
                  onChange={(event) => actualizarCampo("categoria", event.target.value)}
                  placeholder="Ej.: Formación, Publicaciones, Guías y consensos"
                  className="h-11 w-full border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
                />
              </div>
            )}

            <div>
              <label htmlFor="contenido-texto" className="mb-2 block text-sm font-medium text-slate-700">
                Contenido
              </label>
              <textarea
                id="contenido-texto"
                value={formulario.contenido}
                onChange={(event) => actualizarCampo("contenido", event.target.value)}
                rows={10}
                placeholder="Escribí el contenido completo de esta sección..."
                className="w-full resize-y border border-slate-300 px-4 py-3 text-sm leading-7 text-slate-900 outline-none focus:border-cyan-500"
              />
            </div>

            {(requiereKeywords || esPersona) && (
              <div>
                <label htmlFor="contenido-keywords" className="mb-2 block text-sm font-medium text-slate-700">
                  Palabras clave
                </label>
                <input
                  id="contenido-keywords"
                  value={formulario.palabrasClave}
                  onChange={(event) => actualizarCampo("palabrasClave", event.target.value)}
                  placeholder="Separadas por comas"
                  className="h-11 w-full border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
                />
              </div>
            )}

            <div className="border-t border-slate-200 pt-5">
              <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={formulario.mostrarImagen}
                  onChange={(event) => actualizarCampo("mostrarImagen", event.target.checked)}
                  className="h-4 w-4"
                />
                Esta sección tiene una imagen
              </label>

              {formulario.mostrarImagen && (
                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="contenido-imagen" className="mb-2 block text-sm font-medium text-slate-700">
                      Imagen
                    </label>
                    <input
                      id="contenido-imagen"
                      value={formulario.imagenUrl}
                      onChange={(event) => actualizarCampo("imagenUrl", event.target.value)}
                      placeholder="/images/equipo/nombre.jpg"
                      className="h-11 w-full border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contenido-imagen-alt" className="mb-2 block text-sm font-medium text-slate-700">
                      Texto alternativo
                    </label>
                    <input
                      id="contenido-imagen-alt"
                      value={formulario.imagenAlt}
                      onChange={(event) => actualizarCampo("imagenAlt", event.target.value)}
                      className="h-11 w-full border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {(requiereFuente || formulario.tipoSeccion === "CABECERA" || formulario.tipoSeccion === "TEXTO") && (
              <div className="border-t border-slate-200 pt-5">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={formulario.mostrarFuente}
                    onChange={(event) => actualizarCampo("mostrarFuente", event.target.checked)}
                    className="h-4 w-4"
                  />
                  Esta sección tiene una fuente
                </label>

                {formulario.mostrarFuente && (
                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    <div>
                      <label htmlFor="contenido-fuente" className="mb-2 block text-sm font-medium text-slate-700">
                        Fuente
                      </label>
                      <input
                        id="contenido-fuente"
                        value={formulario.fuenteNombre}
                        onChange={(event) => actualizarCampo("fuenteNombre", event.target.value)}
                        className="h-11 w-full border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="contenido-fuente-url" className="mb-2 block text-sm font-medium text-slate-700">
                        URL de la fuente
                      </label>
                      <input
                        id="contenido-fuente-url"
                        type="url"
                        value={formulario.fuenteUrl}
                        onChange={(event) => actualizarCampo("fuenteUrl", event.target.value)}
                        className="h-11 w-full border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label htmlFor="contenido-orden" className="mb-2 block text-sm font-medium text-slate-700">
                  Orden
                </label>
                <input
                  id="contenido-orden"
                  type="number"
                  min="1"
                  value={formulario.orden}
                  onChange={(event) => actualizarCampo("orden", event.target.value)}
                  className="h-11 w-full border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
                />
              </div>

              <label className="flex h-11 items-center gap-3 self-end border border-slate-300 px-4 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={formulario.activo}
                  onChange={(event) => actualizarCampo("activo", event.target.checked)}
                  className="h-4 w-4"
                />
                Sección activa
              </label>

              <label className="flex h-11 items-center gap-3 self-end border border-slate-300 px-4 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={formulario.destacado}
                  onChange={(event) => actualizarCampo("destacado", event.target.checked)}
                  className="h-4 w-4"
                />
                Destacar sección
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
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6 overflow-hidden border border-slate-200 bg-white">
        {contenidosOrdenados.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-slate-500">
              No hay secciones creadas.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {contenidosOrdenados.map((contenido) => {
              const configuracion = leerConfiguracion(contenido);
              const pagina = paginas.find(
                (item) => item.id === contenido.padreId,
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
                      <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        {tipoSeccionLabel(
                          configuracion.tipo ?? "TEXTO",
                        )}
                      </span>
                      <span className={`border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${contenido.activo ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
                        {contenido.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {pagina ? obtenerPaginaLabel(pagina) : "Página no asignada"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="mr-2 text-xs text-slate-400">
                      Orden {contenido.orden}
                    </span>
                    <button
                      type="button"
                      onClick={() => cambiarActivo(contenido)}
                      className="h-9 border border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:border-cyan-500 hover:text-cyan-600"
                    >
                      {contenido.activo ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => abrirEditar(contenido)}
                      className="h-9 border border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:border-cyan-500 hover:text-cyan-600"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => eliminar(contenido)}
                      className="h-9 border border-red-200 px-3 text-xs font-semibold text-red-600 hover:border-red-400 hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
