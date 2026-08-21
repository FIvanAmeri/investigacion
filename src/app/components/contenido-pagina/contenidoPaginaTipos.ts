export type ContenidoPaginaVista =
  | "INSTITUCION"
  | "INVESTIGADORES"
  | "TRATAMIENTOS"
  | "PATOLOGIAS"
  | "RECURSOS"
  | "GENERICO";

export interface ImagenPublica {
  id: string;
  url: string;
  alt: string;
  principal: boolean;
}

export interface PersonaPublica {
  id: string;
  nombre: string;
  rol: string;
  contenido: string;
  imagenUrl: string;
  imagenAlt: string;
}

export interface ConfiguracionPublica {
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
  imagenes?: ImagenPublica[];
  fuenteNombre?: string;
  fuenteUrl?: string;
  mostrarFuente?: boolean;
  palabrasClave?: string[];
  destacado?: boolean;
  personas?: PersonaPublica[];
}

export interface SeccionPublica {
  id: number;
  titulo: string;
  slug: string;
  contenido: string | null;
  configuracion: ConfiguracionPublica | null;
  orden: number;
}

export interface ContenidoPaginaClientProps {
  paginaSlug: string;
  vista: ContenidoPaginaVista;
}