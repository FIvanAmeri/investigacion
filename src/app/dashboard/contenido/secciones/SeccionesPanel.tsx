"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { ContenidoPagina } from "@/lib/contenido";

type SeccionTipo =
  | "CABECERA"
  | "TEXTO"
  | "TRATAMIENTO"
  | "PATOLOGIA"
  | "RECURSO"
  | "PERSONA";

interface ImagenContenido {
  id: string;
  url: string;
  alt: string;
  principal: boolean;
}

interface PersonaContenido {
  id: string;
  nombre: string;
  rol: string;
  contenido: string;
  imagenUrl: string;
  imagenAlt: string;
}

interface ConfiguracionSeccion {
  tipo?: SeccionTipo;
  etiqueta?: string;
  descripcion?: string;
  rol?: string;
  categoria?: string;
  imagenUrl?: string;
  imagenAlt?: string;
  mostrarImagen?: boolean;
  imagenes?: ImagenContenido[];
  fuenteNombre?: string;
  fuenteUrl?: string;
  mostrarFuente?: boolean;
  palabrasClave?: string[];
  destacado?: boolean;
  personas?: PersonaContenido[];
}

interface PaginaDestino {
  id: number;
  tipo: "MENU" | "SUBMENU";
  titulo: string;
  slug: string;
  padreTitulo: string | null;
}

interface SeccionesPanelProps {
  seccionesIniciales: ContenidoPagina[];
  paginas: PaginaDestino[];
}

interface Formulario {
  titulo: string;
  slug: string;
  contenido: string;
  orden: string;
  activo: boolean;
  paginaId: string;
  tipo: SeccionTipo;
  etiqueta: string;
  descripcion: string;
  rol: string;
  categoria: string;
  imagenesActivas: boolean;
  imagenes: ImagenContenido[];
  fuenteActiva: boolean;
  fuenteNombre: string;
  fuenteUrl: string;
  palabrasClave: string;
  destacado: boolean;
  personas: PersonaContenido[];
}

const TIPOS: Array<{
  value: SeccionTipo;
  label: string;
}> = [
  {
    value: "CABECERA",
    label: "Cabecera de página",
  },
  {
    value: "TEXTO",
    label: "Texto institucional",
  },
  {
    value: "TRATAMIENTO",
    label: "Tratamiento",
  },
  {
    value: "PATOLOGIA",
    label: "Patología",
  },
  {
    value: "RECURSO",
    label: "Recurso",
  },
  {
    value: "PERSONA",
    label: "Integrante / persona",
  },
];

function nuevoId(): string {
  return typeof crypto !==
    "undefined" &&
    "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;
}

function imagenVacia(
  principal = false,
): ImagenContenido {
  return {
    id: nuevoId(),
    url: "",
    alt: "",
    principal,
  };
}

function personaVacia(): PersonaContenido {
  return {
    id: nuevoId(),
    nombre: "",
    rol: "",
    contenido: "",
    imagenUrl: "",
    imagenAlt: "",
  };
}

function normalizarImagenes(
  valor: unknown,
): ImagenContenido[] {
  if (!Array.isArray(valor)) {
    return [];
  }

  return valor.flatMap(
    (item): ImagenContenido[] => {
      if (
        !item ||
        typeof item !== "object"
      ) {
        return [];
      }

      const objeto =
        item as Record<
          string,
          unknown
        >;

      const url =
        typeof objeto.url === "string"
          ? objeto.url
          : "";

      if (!url.trim()) {
        return [];
      }

      return [
        {
          id:
            typeof objeto.id ===
              "string" &&
            objeto.id
              ? objeto.id
              : nuevoId(),
          url,
          alt:
            typeof objeto.alt ===
            "string"
              ? objeto.alt
              : "",
          principal:
            objeto.principal === true,
        },
      ];
    },
  );
}

function normalizarPersonas(
  valor: unknown,
): PersonaContenido[] {
  if (!Array.isArray(valor)) {
    return [];
  }

  return valor.flatMap(
    (item): PersonaContenido[] => {
      if (
        !item ||
        typeof item !== "object"
      ) {
        return [];
      }

      const objeto =
        item as Record<
          string,
          unknown
        >;

      return [
        {
          id:
            typeof objeto.id ===
              "string" &&
            objeto.id
              ? objeto.id
              : nuevoId(),
          nombre:
            typeof objeto.nombre ===
            "string"
              ? objeto.nombre
              : "",
          rol:
            typeof objeto.rol ===
            "string"
              ? objeto.rol
              : "",
          contenido:
            typeof objeto.contenido ===
            "string"
              ? objeto.contenido
              : "",
          imagenUrl:
            typeof objeto.imagenUrl ===
            "string"
              ? objeto.imagenUrl
              : "",
          imagenAlt:
            typeof objeto.imagenAlt ===
            "string"
              ? objeto.imagenAlt
              : "",
        },
      ];
    },
  );
}

function leerConfiguracion(
  seccion?: ContenidoPagina,
): ConfiguracionSeccion {
  const configuracion =
    seccion?.configuracion ?? {};

  const imagenesGuardadas =
    normalizarImagenes(
      configuracion.imagenes,
    );

  const imagenLegacy =
    typeof configuracion.imagenUrl ===
      "string" &&
    configuracion.imagenUrl.trim()
      ? [
          {
            id: nuevoId(),
            url:
              configuracion.imagenUrl,
            alt:
              typeof configuracion.imagenAlt ===
              "string"
                ? configuracion.imagenAlt
                : "",
            principal: true,
          },
        ]
      : [];

  const imagenes =
    imagenesGuardadas.length > 0
      ? imagenesGuardadas
      : imagenLegacy;

  if (
    imagenes.length > 0 &&
    !imagenes.some(
      (imagen) =>
        imagen.principal,
    )
  ) {
    imagenes[0] = {
      ...imagenes[0],
      principal: true,
    };
  }

  return {
    tipo:
      configuracion.tipo ===
        "CABECERA" ||
      configuracion.tipo ===
        "TEXTO" ||
      configuracion.tipo ===
        "TRATAMIENTO" ||
      configuracion.tipo ===
        "PATOLOGIA" ||
      configuracion.tipo ===
        "RECURSO" ||
      configuracion.tipo ===
        "PERSONA"
        ? configuracion.tipo
        : undefined,
    etiqueta:
      typeof configuracion.etiqueta ===
      "string"
        ? configuracion.etiqueta
        : "",
    descripcion:
      typeof configuracion.descripcion ===
      "string"
        ? configuracion.descripcion
        : "",
    rol:
      typeof configuracion.rol ===
      "string"
        ? configuracion.rol
        : "",
    categoria:
      typeof configuracion.categoria ===
      "string"
        ? configuracion.categoria
        : "",
    imagenUrl:
      imagenes[0]?.url ??
      (typeof configuracion.imagenUrl ===
      "string"
        ? configuracion.imagenUrl
        : ""),
    imagenAlt:
      imagenes[0]?.alt ??
      (typeof configuracion.imagenAlt ===
      "string"
        ? configuracion.imagenAlt
        : ""),
    mostrarImagen:
      configuracion.mostrarImagen ===
        true ||
      imagenes.length > 0,
    imagenes,
    fuenteNombre:
      typeof configuracion.fuenteNombre ===
      "string"
        ? configuracion.fuenteNombre
        : "",
    fuenteUrl:
      typeof configuracion.fuenteUrl ===
      "string"
        ? configuracion.fuenteUrl
        : "",
    mostrarFuente:
      configuracion.mostrarFuente ===
      true,
    palabrasClave:
      Array.isArray(
        configuracion.palabrasClave,
      )
        ? configuracion.palabrasClave.filter(
            (
              valor,
            ): valor is string =>
              typeof valor ===
              "string",
          )
        : [],
    destacado:
      configuracion.destacado ===
      true,
    personas:
      normalizarPersonas(
        configuracion.personas,
      ),
  };
}

function crearFormulario(
  seccion?: ContenidoPagina,
): Formulario {
  const config =
    leerConfiguracion(seccion);

  return {
    titulo:
      seccion?.titulo ?? "",
    slug:
      seccion?.slug ?? "",
    contenido:
      seccion?.contenido ?? "",
    orden: String(
      seccion?.orden ?? 1,
    ),
    activo:
      seccion?.activo ?? true,
    paginaId:
      seccion?.padreId !== null &&
      seccion?.padreId !== undefined
        ? String(seccion.padreId)
        : "",
    tipo:
      config.tipo ?? "TEXTO",
    etiqueta:
      config.etiqueta ?? "",
    descripcion:
      config.descripcion ?? "",
    rol:
      config.rol ?? "",
    categoria:
      config.categoria ?? "",
    imagenesActivas:
      (config.imagenes ?? [])
        .length > 0,
    imagenes:
      config.imagenes ?? [],
    fuenteActiva:
      config.mostrarFuente === true,
    fuenteNombre:
      config.fuenteNombre ?? "",
    fuenteUrl:
      config.fuenteUrl ?? "",
    palabrasClave:
      config.palabrasClave?.join(
        ", ",
      ) ?? "",
    destacado:
      config.destacado ?? false,
    personas:
      config.personas ?? [],
  };
}

function generarSlug(
  valor: string,
): string {
  return valor
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );
}

function tipoLabel(
  tipo: SeccionTipo,
): string {
  return (
    TIPOS.find(
      (item) =>
        item.value === tipo,
    )?.label ?? tipo
  );
}

function paginaLabel(
  pagina: PaginaDestino,
): string {
  if (
    pagina.tipo === "SUBMENU" &&
    pagina.padreTitulo
  ) {
    return `${pagina.padreTitulo} — ${pagina.titulo}`;
  }

  return pagina.titulo;
}

function campoBase(
  className = "",
): string {
  return `mt-2 w-full border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-cyan-500 ${className}`;
}

function leerRespuesta(
  data: unknown,
): {
  contenido?: ContenidoPagina;
  error?: string;
} {
  if (
    !data ||
    typeof data !== "object"
  ) {
    return {};
  }

  const objeto =
    data as Record<
      string,
      unknown
    >;

  return {
    error:
      typeof objeto.error ===
      "string"
        ? objeto.error
        : undefined,
    contenido:
      objeto.contenido &&
      typeof objeto.contenido ===
        "object"
        ? (objeto.contenido as ContenidoPagina)
        : undefined,
  };
}

export default function SeccionesPanel({
  seccionesIniciales,
  paginas,
}: SeccionesPanelProps) {
  const router = useRouter();

  const [
    secciones,
    setSecciones,
  ] = useState(
    seccionesIniciales,
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
  ] = useState<number | null>(
    null,
  );

  const [
    mostrarFormulario,
    setMostrarFormulario,
  ] = useState(false);

  const [guardando, setGuardando] =
    useState(false);

  const [
    accionandoId,
    setAccionandoId,
  ] = useState<number | null>(
    null,
  );

  const [mensaje, setMensaje] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [
    subiendoImagen,
    setSubiendoImagen,
  ] = useState(false);

  const paginasOrdenadas = useMemo(
    () =>
      [...paginas].sort(
        (a, b) =>
          paginaLabel(a).localeCompare(
            paginaLabel(b),
            "es",
          ),
      ),
    [paginas],
  );

  const seccionesOrdenadas =
    useMemo(
      () =>
        [...secciones].sort(
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
      [secciones],
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
    seccion: ContenidoPagina,
  ) => {
    setEditandoId(
      seccion.id,
    );
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
    setFormulario(
      crearFormulario(),
    );
  };

  const actualizar = <
    K extends keyof Formulario
  >(
    campo: K,
    valor: Formulario[K],
  ) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
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

  const cargarImagen = async (
    archivo: File,
    aplicar: (
      url: string,
    ) => void,
  ) => {
    if (
      !archivo.type.startsWith(
        "image/",
      )
    ) {
      setError(
        "El archivo seleccionado no es una imagen válida.",
      );
      return;
    }

    if (
      archivo.size >
      5 * 1024 * 1024
    ) {
      setError(
        "La imagen no puede superar los 5 MB.",
      );
      return;
    }

    setSubiendoImagen(true);
    setMensaje(null);
    setError(null);

    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        archivo,
      );

      const response =
        await fetch(
          "/api/dashboard/contenido/imagen",
          {
            method: "POST",
            body: formData,
          },
        );

      const data =
        (await response.json()) as {
          url?: string;
          error?: string;
        };

      if (
        !response.ok ||
        !data.url
      ) {
        throw new Error(
          data.error ??
            "No se pudo cargar la imagen.",
        );
      }

      aplicar(data.url);

      setMensaje(
        "Imagen cargada correctamente.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "No se pudo cargar la imagen.",
      );
    } finally {
      setSubiendoImagen(false);
    }
  };

  const agregarImagen = () => {
    setFormulario((actual) => ({
      ...actual,
      imagenesActivas: true,
      imagenes: [
        ...actual.imagenes,
        imagenVacia(
          actual.imagenes
            .length === 0,
        ),
      ],
    }));
  };

  const actualizarImagen = (
    id: string,
    campo: keyof Omit<
      ImagenContenido,
      "id"
    >,
    valor: string | boolean,
  ) => {
    setFormulario((actual) => ({
      ...actual,
      imagenes:
        actual.imagenes
          .map((imagen) =>
            imagen.id === id
              ? {
                  ...imagen,
                  [campo]:
                    valor,
                }
              : imagen,
          )
          .map((imagen) =>
            campo ===
              "principal" &&
            valor === true &&
            imagen.id !== id
              ? {
                  ...imagen,
                  principal:
                    false,
                }
              : imagen,
          ),
    }));
  };

  const eliminarImagen = (
    id: string,
  ) => {
    setFormulario((actual) => {
      const restantes =
        actual.imagenes.filter(
          (imagen) =>
            imagen.id !== id,
        );

      if (
        restantes.length > 0 &&
        !restantes.some(
          (imagen) =>
            imagen.principal,
        )
      ) {
        restantes[0] = {
          ...restantes[0],
          principal: true,
        };
      }

      return {
        ...actual,
        imagenesActivas:
          restantes.length > 0,
        imagenes: restantes,
      };
    });
  };

  const agregarPersona = () => {
    setFormulario((actual) => ({
      ...actual,
      personas: [
        ...actual.personas,
        personaVacia(),
      ],
    }));
  };

  const actualizarPersona = (
    id: string,
    campo: keyof Omit<
      PersonaContenido,
      "id"
    >,
    valor: string,
  ) => {
    setFormulario((actual) => ({
      ...actual,
      personas:
        actual.personas.map(
          (persona) =>
            persona.id === id
              ? {
                  ...persona,
                  [campo]:
                    valor,
                }
              : persona,
        ),
    }));
  };

  const eliminarPersona = (
    id: string,
  ) => {
    setFormulario((actual) => ({
      ...actual,
      personas:
        actual.personas.filter(
          (persona) =>
            persona.id !== id,
        ),
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

      const paginaId =
        Number(
          formulario.paginaId,
        );

      const orden =
        Number(
          formulario.orden,
        );

      if (!titulo) {
        throw new Error(
          "El título es obligatorio.",
        );
      }

      if (!slug) {
        throw new Error(
          "El identificador interno es obligatorio.",
        );
      }

      if (
        !Number.isInteger(
          paginaId,
        ) ||
        paginaId < 1
      ) {
        throw new Error(
          "Seleccioná la página donde se mostrará esta sección.",
        );
      }

      if (
        !Number.isInteger(
          orden,
        ) ||
        orden < 1
      ) {
        throw new Error(
          "El orden debe ser un número entero mayor a cero.",
        );
      }

      const imagenes =
        formulario.imagenes
          .filter(
            (imagen) =>
              imagen.url.trim(),
          )
          .map((imagen) => ({
            ...imagen,
            url:
              imagen.url.trim(),
            alt:
              imagen.alt.trim() ||
              titulo,
          }));

      if (
        formulario.imagenesActivas &&
        imagenes.length === 0
      ) {
        throw new Error(
          "Agregá al menos una imagen o desactivá la opción de imágenes.",
        );
      }

      if (
        formulario.fuenteActiva &&
        !formulario.fuenteNombre.trim()
      ) {
        throw new Error(
          "Indicá el nombre de la fuente o desactivá la fuente.",
        );
      }

      if (
        imagenes.length > 0 &&
        !imagenes.some(
          (imagen) =>
            imagen.principal,
        )
      ) {
        imagenes[0] = {
          ...imagenes[0],
          principal: true,
        };
      }

      const personas =
        formulario.personas.map(
          (persona) => ({
            ...persona,
            nombre:
              persona.nombre.trim(),
            rol:
              persona.rol.trim(),
            contenido:
              persona.contenido.trim(),
            imagenUrl:
              persona.imagenUrl.trim(),
            imagenAlt:
              persona.imagenAlt.trim(),
          }),
        );

      const personasVacias =
        personas.filter(
          (persona) =>
            !persona.nombre &&
            !persona.rol &&
            !persona.contenido &&
            !persona.imagenUrl &&
            !persona.imagenAlt,
        );

      if (
        personasVacias.length !==
        personas.length
      ) {
        const personaSinNombre =
          personas.find(
            (persona) =>
              !persona.nombre,
          );

        if (
          personaSinNombre
        ) {
          throw new Error(
            "Cada integrante debe tener un nombre.",
          );
        }
      }

      const seccionActual =
        editandoId !== null
          ? secciones.find(
              (seccion) =>
                seccion.id ===
                editandoId,
            )
          : undefined;

      const configuracionActual =
        seccionActual
          ?.configuracion &&
        typeof seccionActual.configuracion ===
          "object"
          ? {
              ...seccionActual.configuracion,
            }
          : {};

      const configuracion: ConfiguracionSeccion =
        {
          ...configuracionActual,
          tipo:
            formulario.tipo,
        };

      if (
        formulario.etiqueta.trim()
      ) {
        configuracion.etiqueta =
          formulario.etiqueta.trim();
      } else {
        delete configuracion.etiqueta;
      }

      if (
        formulario.descripcion.trim()
      ) {
        configuracion.descripcion =
          formulario.descripcion.trim();
      } else {
        delete configuracion.descripcion;
      }

      if (
        formulario.rol.trim()
      ) {
        configuracion.rol =
          formulario.rol.trim();
      } else {
        delete configuracion.rol;
      }

      if (
        formulario.categoria.trim()
      ) {
        configuracion.categoria =
          formulario.categoria.trim();
      } else {
        delete configuracion.categoria;
      }

      if (
        imagenes.length > 0
      ) {
        configuracion.mostrarImagen =
          true;

        configuracion.imagenes =
          imagenes;

        const principal =
          imagenes.find(
            (imagen) =>
              imagen.principal,
          ) ??
          imagenes[0];

        configuracion.imagenUrl =
          principal.url;

        configuracion.imagenAlt =
          principal.alt;
      } else {
        delete configuracion.imagenes;
        delete configuracion.imagenUrl;
        delete configuracion.imagenAlt;
        configuracion.mostrarImagen =
          false;
      }

      if (
        formulario.fuenteActiva
      ) {
        configuracion.mostrarFuente =
          true;

        configuracion.fuenteNombre =
          formulario.fuenteNombre.trim();

        if (
          formulario.fuenteUrl.trim()
        ) {
          configuracion.fuenteUrl =
            formulario.fuenteUrl.trim();
        } else {
          delete configuracion.fuenteUrl;
        }
      } else {
        delete configuracion.fuenteNombre;
        delete configuracion.fuenteUrl;
        configuracion.mostrarFuente =
          false;
      }

      const palabrasClave =
        formulario.palabrasClave
          .split(",")
          .map((item) =>
            item.trim(),
          )
          .filter(Boolean);

      if (
        palabrasClave.length > 0
      ) {
        configuracion.palabrasClave =
          palabrasClave;
      } else {
        delete configuracion.palabrasClave;
      }

      configuracion.destacado =
        formulario.destacado;

      if (
        formulario.tipo ===
        "PERSONA"
      ) {
        const personasValidas =
          personas.filter(
            (persona) =>
              persona.nombre,
          );

        if (
          personasValidas.length >
          0
        ) {
          configuracion.personas =
            personasValidas;
        } else {
          delete configuracion.personas;
        }
      } else {
        delete configuracion.personas;
      }

      const esNueva =
        editandoId === null;

      const response =
        await fetch(
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
            body: JSON.stringify({
              tipo: "SECCION",
              titulo,
              slug,
              contenido:
                formulario.contenido,
              configuracion,
              orden,
              activo:
                formulario.activo,
              padreId: paginaId,
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
            "No se pudo guardar la sección.",
        );
      }

      if (!data.contenido) {
        throw new Error(
          "El servidor no devolvió la sección guardada.",
        );
      }

      setSecciones(
        (actuales) =>
          esNueva
            ? [
                ...actuales,
                data.contenido as ContenidoPagina,
              ]
            : actuales.map(
                (item) =>
                  item.id ===
                  editandoId
                    ? (data.contenido as ContenidoPagina)
                    : item,
              ),
      );

      setMensaje(
        esNueva
          ? "Sección creada correctamente."
          : "Sección actualizada correctamente.",
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
          : "Ocurrió un error al guardar la sección.",
      );
    } finally {
      setGuardando(false);
    }
  };

  const cambiarActivo = async (
    seccion: ContenidoPagina,
  ) => {
    setAccionandoId(
      seccion.id,
    );
    setMensaje(null);
    setError(null);

    try {
      const response =
        await fetch(
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
        leerRespuesta(
          await response.json(),
        );

      if (!response.ok) {
        throw new Error(
          data.error ??
            "No se pudo cambiar el estado.",
        );
      }

      setSecciones(
        (actuales) =>
          actuales.map(
            (item) =>
              item.id ===
              seccion.id
                ? {
                    ...item,
                    ...(data.contenido ??
                      {}),
                    activo:
                      data.contenido
                        ?.activo ??
                      !seccion.activo,
                  }
                : item,
          ),
      );

      setMensaje(
        seccion.activo
          ? "Sección desactivada correctamente."
          : "Sección activada correctamente.",
      );

      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
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

    setAccionandoId(
      seccion.id,
    );
    setMensaje(null);
    setError(null);

    try {
      const response =
        await fetch(
          `/api/dashboard/contenido/${seccion.id}`,
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
            "No se pudo eliminar la sección.",
        );
      }

      setSecciones(
        (actuales) =>
          actuales.filter(
            (item) =>
              item.id !==
              seccion.id,
          ),
      );

      setMensaje(
        "Sección eliminada correctamente.",
      );

      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Ocurrió un error al eliminar la sección.",
      );
    } finally {
      setAccionandoId(null);
    }
  };

  const necesitaCategoria =
    formulario.tipo ===
      "TRATAMIENTO" ||
    formulario.tipo ===
      "PATOLOGIA" ||
    formulario.tipo ===
      "RECURSO";

  const esPersona =
    formulario.tipo ===
    "PERSONA";

  const formularioEditor =
    mostrarFormulario ? (
      <form
        onSubmit={guardar}
        className="mt-6 border border-slate-200 bg-white p-6 sm:p-8"
      >
        <div className="flex flex-col gap-2 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
              Contenido público
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              {editandoId ===
              null
                ? "Crear sección"
                : "Editar sección"}
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Todos los campos guardados de la sección se pueden editar desde este formulario.
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

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-800">
              Página
            </span>

            <select
              value={
                formulario.paginaId
              }
              onChange={(event) =>
                actualizar(
                  "paginaId",
                  event.target.value,
                )
              }
              className={campoBase(
                "h-11",
              )}
              required
            >
              <option value="">
                Seleccionar página
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
                    {paginaLabel(
                      pagina,
                    )}
                  </option>
                ),
              )}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-800">
              Tipo de contenido
            </span>

            <select
              value={
                formulario.tipo
              }
              onChange={(event) =>
                actualizar(
                  "tipo",
                  event.target
                    .value as SeccionTipo,
                )
              }
              className={campoBase(
                "h-11",
              )}
            >
              {TIPOS.map(
                (tipo) => (
                  <option
                    key={
                      tipo.value
                    }
                    value={
                      tipo.value
                    }
                  >
                    {
                      tipo.label
                    }
                  </option>
                ),
              )}
            </select>
          </label>

          <label className="block lg:col-span-2">
            <span className="text-sm font-semibold text-slate-800">
              Título
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
              className={campoBase(
                "h-11",
              )}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-800">
              Etiqueta
            </span>

            <input
              value={
                formulario.etiqueta
              }
              onChange={(event) =>
                actualizar(
                  "etiqueta",
                  event.target.value,
                )
              }
              className={campoBase(
                "h-11",
              )}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-800">
              Orden
            </span>

            <input
              type="number"
              min="1"
              value={
                formulario.orden
              }
              onChange={(event) =>
                actualizar(
                  "orden",
                  event.target.value,
                )
              }
              className={campoBase(
                "h-11",
              )}
              required
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="text-sm font-semibold text-slate-800">
              Descripción breve
            </span>

            <textarea
              value={
                formulario.descripcion
              }
              onChange={(event) =>
                actualizar(
                  "descripcion",
                  event.target.value,
                )
              }
              rows={3}
              className={campoBase(
                "py-3",
              )}
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="text-sm font-semibold text-slate-800">
              Contenido
            </span>

            <textarea
              value={
                formulario.contenido
              }
              onChange={(event) =>
                actualizar(
                  "contenido",
                  event.target.value,
                )
              }
              rows={10}
              className={campoBase(
                "py-3",
              )}
            />
          </label>

          {esPersona && (
            <label className="block lg:col-span-2">
              <span className="text-sm font-semibold text-slate-800">
                Rol principal
              </span>

              <input
                value={
                  formulario.rol
                }
                onChange={(event) =>
                  actualizar(
                    "rol",
                    event.target.value,
                  )
                }
                className={campoBase(
                  "h-11",
                )}
              />
            </label>
          )}

          {necesitaCategoria && (
            <label className="block lg:col-span-2">
              <span className="text-sm font-semibold text-slate-800">
                Categoría
              </span>

              <input
                value={
                  formulario.categoria
                }
                onChange={(event) =>
                  actualizar(
                    "categoria",
                    event.target.value,
                  )
                }
                className={campoBase(
                  "h-11",
                )}
              />
            </label>
          )}

          <div className="border-t border-slate-200 pt-6 lg:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-950">
                  Imágenes
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Podés agregar, editar,
                  reemplazar y eliminar
                  imágenes de esta sección.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <label className="inline-flex h-10 cursor-pointer items-center gap-2 border border-slate-300 px-4 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={
                      formulario.imagenesActivas
                    }
                    onChange={(event) => {
                      actualizar(
                        "imagenesActivas",
                        event.target.checked,
                      );

                      if (
                        event.target
                          .checked &&
                        formulario.imagenes
                          .length === 0
                      ) {
                        agregarImagen();
                      }
                    }}
                    className="h-4 w-4"
                  />
                  Usar imágenes
                </label>

                <button
                  type="button"
                  onClick={
                    agregarImagen
                  }
                  className="h-10 bg-slate-950 px-4 text-xs font-semibold text-white hover:bg-cyan-600"
                >
                  Agregar imagen
                </button>
              </div>
            </div>

            {formulario.imagenesActivas &&
              formulario.imagenes
                .length ===
                0 && (
                <div className="mt-4 border border-dashed border-slate-300 px-5 py-8 text-center text-sm text-slate-500">
                  Todavía no hay
                  imágenes. Agregá
                  una para comenzar.
                </div>
              )}

            {formulario.imagenesActivas &&
              formulario.imagenes
                .length >
                0 && (
                <div className="mt-5 space-y-5">
                  {formulario.imagenes.map(
                    (
                      imagen,
                      index,
                    ) => (
                      <article
                        key={
                          imagen.id
                        }
                        className="border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row">
                          <div className="w-full shrink-0 lg:w-52">
                            {imagen.url ? (
                              <img
                                src={
                                  imagen.url
                                }
                                alt={
                                  imagen.alt ||
                                  formulario.titulo
                                }
                                className="h-52 w-full object-cover border border-slate-200 bg-white"
                              />
                            ) : (
                              <div className="flex h-52 items-center justify-center border border-dashed border-slate-300 bg-white text-center text-xs text-slate-400">
                                Sin imagen
                              </div>
                            )}

                            <label className="mt-3 flex h-10 cursor-pointer items-center justify-center border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:border-cyan-500 hover:text-cyan-600">
                              {subiendoImagen
                                ? "Subiendo..."
                                : "Subir imagen"}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={
                                  subiendoImagen
                                }
                                onChange={(
                                  event,
                                ) => {
                                  const archivo =
                                    event
                                      .target
                                      .files?.[0];

                                  if (
                                    !archivo
                                  ) {
                                    return;
                                  }

                                  void cargarImagen(
                                    archivo,
                                    (
                                      url,
                                    ) =>
                                      actualizarImagen(
                                        imagen.id,
                                        "url",
                                        url,
                                      ),
                                  );

                                  event.currentTarget.value =
                                    "";
                                }}
                              />
                            </label>
                          </div>

                          <div className="min-w-0 flex-1 space-y-4">
                            <div className="flex items-center justify-between gap-3">
                              <h4 className="font-semibold text-slate-950">
                                Imagen{" "}
                                {index +
                                  1}
                              </h4>

                              <button
                                type="button"
                                onClick={() =>
                                  eliminarImagen(
                                    imagen.id,
                                  )
                                }
                                className="text-xs font-semibold text-red-600 hover:text-red-700"
                              >
                                Eliminar
                              </button>
                            </div>

                            <label className="block">
                              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                URL / ruta
                              </span>

                              <input
                                value={
                                  imagen.url
                                }
                                onChange={(
                                  event,
                                ) =>
                                  actualizarImagen(
                                    imagen.id,
                                    "url",
                                    event
                                      .target
                                      .value,
                                  )
                                }
                                className={campoBase(
                                  "h-11",
                                )}
                              />
                            </label>

                            <label className="block">
                              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Texto alternativo
                              </span>

                              <input
                                value={
                                  imagen.alt
                                }
                                onChange={(
                                  event,
                                ) =>
                                  actualizarImagen(
                                    imagen.id,
                                    "alt",
                                    event
                                      .target
                                      .value,
                                  )
                                }
                                className={campoBase(
                                  "h-11",
                                )}
                              />
                            </label>

                            <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                              <input
                                type="checkbox"
                                checked={
                                  imagen.principal
                                }
                                onChange={(
                                  event,
                                ) =>
                                  actualizarImagen(
                                    imagen.id,
                                    "principal",
                                    event
                                      .target
                                      .checked,
                                  )
                                }
                                className="h-4 w-4"
                              />
                              Imagen principal
                            </label>
                          </div>
                        </div>
                      </article>
                    ),
                  )}
                </div>
              )}
          </div>

          {esPersona && (
            <div className="border-t border-slate-200 pt-6 lg:col-span-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-950">
                    Integrantes
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Administrá todas las
                    personas que aparecen
                    en la sección Nuestro
                    equipo.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    agregarPersona
                  }
                  className="h-10 bg-slate-950 px-4 text-xs font-semibold text-white hover:bg-cyan-600"
                >
                  Agregar integrante
                </button>
              </div>

              {formulario.personas
                .length ===
                0 && (
                <div className="mt-4 border border-dashed border-slate-300 px-5 py-8 text-center text-sm text-slate-500">
                  Todavía no hay
                  integrantes cargados.
                </div>
              )}

              {formulario.personas
                .length >
                0 && (
                <div className="mt-5 space-y-5">
                  {formulario.personas.map(
                    (
                      persona,
                      index,
                    ) => (
                      <article
                        key={
                          persona.id
                        }
                        className="border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-600">
                              Integrante{" "}
                              {index +
                                1}
                            </p>

                            <h4 className="mt-1 text-lg font-semibold text-slate-950">
                              {persona.nombre ||
                                "Nuevo integrante"}
                            </h4>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              eliminarPersona(
                                persona.id,
                              )
                            }
                            className="text-xs font-semibold text-red-600 hover:text-red-700"
                          >
                            Eliminar
                          </button>
                        </div>

                        <div className="mt-5 grid gap-5 lg:grid-cols-[220px_1fr]">
                          <div>
                            {persona.imagenUrl ? (
                              <img
                                src={
                                  persona.imagenUrl
                                }
                                alt={
                                  persona.imagenAlt ||
                                  persona.nombre ||
                                  "Integrante"
                                }
                                className="h-64 w-full object-cover border border-slate-200 bg-white"
                              />
                            ) : (
                              <div className="flex h-64 items-center justify-center border border-dashed border-slate-300 bg-white text-center text-xs text-slate-400">
                                Este integrante
                                no tiene
                                imagen
                              </div>
                            )}

                            <label className="mt-3 flex h-10 cursor-pointer items-center justify-center border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:border-cyan-500 hover:text-cyan-600">
                              {subiendoImagen
                                ? "Subiendo..."
                                : "Subir imagen"}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={
                                  subiendoImagen
                                }
                                onChange={(
                                  event,
                                ) => {
                                  const archivo =
                                    event
                                      .target
                                      .files?.[0];

                                  if (
                                    !archivo
                                  ) {
                                    return;
                                  }

                                  void cargarImagen(
                                    archivo,
                                    (
                                      url,
                                    ) =>
                                      actualizarPersona(
                                        persona.id,
                                        "imagenUrl",
                                        url,
                                      ),
                                  );

                                  event.currentTarget.value =
                                    "";
                                }}
                              />
                            </label>
                          </div>

                          <div className="space-y-4">
                            <label className="block">
                              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Nombre
                              </span>

                              <input
                                value={
                                  persona.nombre
                                }
                                onChange={(
                                  event,
                                ) =>
                                  actualizarPersona(
                                    persona.id,
                                    "nombre",
                                    event
                                      .target
                                      .value,
                                  )
                                }
                                className={campoBase(
                                  "h-11",
                                )}
                                required
                              />
                            </label>

                            <label className="block">
                              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Rol
                              </span>

                              <input
                                value={
                                  persona.rol
                                }
                                onChange={(
                                  event,
                                ) =>
                                  actualizarPersona(
                                    persona.id,
                                    "rol",
                                    event
                                      .target
                                      .value,
                                  )
                                }
                                className={campoBase(
                                  "h-11",
                                )}
                              />
                            </label>

                            <label className="block">
                              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Descripción
                              </span>

                              <textarea
                                value={
                                  persona.contenido
                                }
                                onChange={(
                                  event,
                                ) =>
                                  actualizarPersona(
                                    persona.id,
                                    "contenido",
                                    event
                                      .target
                                      .value,
                                  )
                                }
                                rows={6}
                                className={campoBase(
                                  "py-3",
                                )}
                              />
                            </label>

                            <label className="block">
                              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                URL / ruta de imagen
                              </span>

                              <input
                                value={
                                  persona.imagenUrl
                                }
                                onChange={(
                                  event,
                                ) =>
                                  actualizarPersona(
                                    persona.id,
                                    "imagenUrl",
                                    event
                                      .target
                                      .value,
                                  )
                                }
                                className={campoBase(
                                  "h-11",
                                )}
                              />
                            </label>

                            <label className="block">
                              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Texto alternativo de imagen
                              </span>

                              <input
                                value={
                                  persona.imagenAlt
                                }
                                onChange={(
                                  event,
                                ) =>
                                  actualizarPersona(
                                    persona.id,
                                    "imagenAlt",
                                    event
                                      .target
                                      .value,
                                  )
                                }
                                className={campoBase(
                                  "h-11",
                                )}
                              />
                            </label>
                          </div>
                        </div>
                      </article>
                    ),
                  )}
                </div>
              )}
            </div>
          )}

          <div className="border-t border-slate-200 pt-6 lg:col-span-2">
            <h3 className="text-base font-semibold text-slate-950">
              Fuente y metadatos
            </h3>

            <div className="mt-5 space-y-5">
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={
                    formulario.fuenteActiva
                  }
                  onChange={(event) =>
                    actualizar(
                      "fuenteActiva",
                      event.target.checked,
                    )
                  }
                  className="h-4 w-4"
                />
                Mostrar fuente
              </label>

              {formulario.fuenteActiva && (
                <div className="grid gap-5 lg:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Nombre de la fuente
                    </span>

                    <input
                      value={
                        formulario.fuenteNombre
                      }
                      onChange={(
                        event,
                      ) =>
                        actualizar(
                          "fuenteNombre",
                          event.target.value,
                        )
                      }
                      className={campoBase(
                        "h-11",
                      )}
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      URL de la fuente
                    </span>

                    <input
                      type="url"
                      value={
                        formulario.fuenteUrl
                      }
                      onChange={(
                        event,
                      ) =>
                        actualizar(
                          "fuenteUrl",
                          event.target.value,
                        )
                      }
                      className={campoBase(
                        "h-11",
                      )}
                    />
                  </label>
                </div>
              )}

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Palabras clave
                </span>

                <input
                  value={
                    formulario.palabrasClave
                  }
                  onChange={(event) =>
                    actualizar(
                      "palabrasClave",
                      event.target.value,
                    )
                  }
                  placeholder="Separadas por comas"
                  className={campoBase(
                    "h-11",
                  )}
                />
              </label>

              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={
                    formulario.destacado
                  }
                  onChange={(event) =>
                    actualizar(
                      "destacado",
                      event.target.checked,
                    )
                  }
                  className="h-4 w-4"
                />
                Marcar como destacado
              </label>
            </div>
          </div>

          <label className="flex items-center gap-3 border-t border-slate-200 pt-6 text-sm font-semibold text-slate-800 lg:col-span-2">
            <input
              type="checkbox"
              checked={
                formulario.activo
              }
              onChange={(event) =>
                actualizar(
                  "activo",
                  event.target.checked,
                )
              }
              className="h-4 w-4"
            />
            Publicar esta sección
          </label>
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
            disabled={
              guardando ||
              subiendoImagen
            }
            className="h-11 bg-cyan-500 px-6 text-sm font-semibold text-white hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {guardando
              ? "Guardando..."
              : "Guardar sección"}
          </button>
        </div>
      </form>
    ) : null;

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

      {editandoId === null &&
        formularioEditor}

      <div className="mt-8 space-y-4">
        {seccionesOrdenadas.map(
          (seccion) => {
            const config =
              leerConfiguracion(
                seccion,
              );

            const pagina =
              paginas.find(
                (item) =>
                  item.id ===
                  seccion.padreId,
              );

            return (
              <div
                key={
                  seccion.id
                }
              >
                <article className="border border-slate-200 bg-white p-5 sm:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-700">
                          {tipoLabel(
                            config.tipo ??
                              "TEXTO",
                          )}
                        </span>

                        <span
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                            seccion.activo
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {seccion.activo
                            ? "Publicado"
                            : "Oculto"}
                        </span>
                      </div>

                      <h3 className="mt-3 text-xl font-semibold text-slate-950">
                        {
                          seccion.titulo
                        }
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Página:{" "}
                        {pagina
                          ? paginaLabel(
                              pagina,
                            )
                          : "Sin página asignada"}
                      </p>

                      {config.descripcion && (
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                          {
                            config.descripcion
                          }
                        </p>
                      )}

                      {seccion.contenido && (
                        <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-500">
                          {seccion
                            .contenido
                            .length >
                          280
                            ? `${seccion.contenido.slice(
                                0,
                                280,
                              )}…`
                            : seccion.contenido}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
                        <span>
                          Orden{" "}
                          {
                            seccion.orden
                          }
                        </span>

                        {config.personas &&
                          config.personas
                            .length >
                            0 && (
                            <span>
                              {
                                config
                                  .personas
                                  .length
                              }{" "}
                              {config
                                .personas
                                .length ===
                              1
                                ? "integrante"
                                : "integrantes"}
                            </span>
                          )}

                        {config.imagenes &&
                          config.imagenes
                            .length >
                            0 && (
                            <span>
                              {
                                config
                                  .imagenes
                                  .length
                              }{" "}
                              {config
                                .imagenes
                                .length ===
                              1
                                ? "imagen"
                                : "imágenes"}
                            </span>
                          )}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          abrirEditar(
                            seccion,
                          )
                        }
                        className="h-10 border border-slate-300 px-4 text-xs font-semibold uppercase tracking-wide text-slate-700 hover:border-cyan-500 hover:text-cyan-600"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          cambiarActivo(
                            seccion,
                          )
                        }
                        disabled={
                          accionandoId ===
                          seccion.id
                        }
                        className="h-10 border border-slate-300 px-4 text-xs font-semibold uppercase tracking-wide text-slate-700 hover:border-cyan-500 hover:text-cyan-600 disabled:opacity-50"
                      >
                        {seccion.activo
                          ? "Ocultar"
                          : "Publicar"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          eliminar(
                            seccion,
                          )
                        }
                        disabled={
                          accionandoId ===
                          seccion.id
                        }
                        className="h-10 border border-red-200 px-4 text-xs font-semibold uppercase tracking-wide text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>

                {editandoId ===
                  seccion.id &&
                  formularioEditor}
              </div>
            );
          },
        )}
      </div>

      {secciones.length ===
        0 &&
        !mostrarFormulario && (
          <div className="mt-8 border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <h2 className="text-lg font-semibold text-slate-950">
              Todavía no hay
              secciones
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Creá la primera
              sección para comenzar
              a administrar el
              contenido público.
            </p>
          </div>
        )}
    </div>
  );
}