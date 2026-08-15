export interface NavigationItem {
  label: string;
  href: string;
}

export interface NavigationMenu {
  label: string;
  href?: string;
  items?: NavigationItem[];
}

export const navigation: NavigationMenu[] = [
  {
    label: "Inicio",
    href: "/",
  },
  {
    label: "Investigación",
    items: [
      {
        label: "Líneas de investigación",
        href: "/investigacion/lineas",
      },
      {
        label: "Proyectos",
        href: "/investigacion/proyectos",
      },
      {
        label: "Publicaciones",
        href: "/investigacion/publicaciones",
      },
      {
        label: "Congresos",
        href: "/investigacion/congresos",
      },
    ],
  },
  {
    label: "Investigadores",
    items: [
      {
        label: "Nuestro equipo",
        href: "/investigadores",
      },
      {
        label: "Colaboradores",
        href: "/investigadores/colaboradores",
      },
    ],
  },
  {
    label: "Uroginecología",
    items: [
      {
        label: "Patologías",
        href: "/uroginecologia/patologias",
      },
      {
        label: "Tratamientos",
        href: "/uroginecologia/tratamientos",
      },
      {
        label: "Recursos",
        href: "/uroginecologia/recursos",
      },
    ],
  },
  {
    label: "Docencia",
    items: [
      {
        label: "Cursos",
        href: "/docencia/cursos",
      },
      {
        label: "Material académico",
        href: "/docencia/material-academico",
      },
    ],
  },
  {
    label: "Institución",
    items: [
      {
        label: "Sobre nosotros",
        href: "/institucion",
      },
      {
        label: "Contacto",
        href: "/contacto",
      },
    ],
  },
];