import {
  ConfiguracionPublica,
  ImagenPublica,
  SeccionPublica,
} from "./contenidoPaginaTipos";

export function configuracion(
  seccion: SeccionPublica,
): ConfiguracionPublica {
  return seccion.configuracion ?? {};
}

export function palabrasClave(
  seccion: SeccionPublica,
): string[] {
  const valores = configuracion(seccion).palabrasClave;
  return Array.isArray(valores) ? valores : [];
}

export function imagenesDeSeccion(
  seccion: SeccionPublica,
): ImagenPublica[] {
  const config = configuracion(seccion);

  if (
    Array.isArray(config.imagenes) &&
    config.imagenes.length > 0
  ) {
    const validas = config.imagenes.filter(
      (imagen): imagen is ImagenPublica =>
        Boolean(
          imagen &&
            typeof imagen.url === "string" &&
            imagen.url.trim(),
        ),
    );

    if (validas.some((imagen) => imagen.principal)) {
      return [
        ...validas.filter(
          (imagen) => imagen.principal,
        ),
        ...validas.filter(
          (imagen) => !imagen.principal,
        ),
      ];
    }

    return validas;
  }

  if (
    config.mostrarImagen &&
    config.imagenUrl?.trim()
  ) {
    return [
      {
        id: `${seccion.id}-legacy`,
        url: config.imagenUrl,
        alt:
          config.imagenAlt ||
          seccion.titulo,
        principal: true,
      },
    ];
  }

  return [];
}

export function tieneImagen(
  seccion: SeccionPublica,
): boolean {
  return imagenesDeSeccion(seccion).length > 0;
}

export function imagenPrincipal(
  seccion: SeccionPublica,
): ImagenPublica | undefined {
  return imagenesDeSeccion(seccion)[0];
}

export function tieneFuente(
  seccion: SeccionPublica,
): boolean {
  const config = configuracion(seccion);

  return Boolean(
    config.mostrarFuente &&
      config.fuenteNombre?.trim(),
  );
}

export function esCabecera(
  seccion: SeccionPublica,
): boolean {
  return (
    configuracion(seccion).tipo ===
    "CABECERA"
  );
}

export function obtenerCabecera(
  secciones: SeccionPublica[],
): SeccionPublica | undefined {
  return secciones.find(esCabecera);
}

export function obtenerItems(
  secciones: SeccionPublica[],
): SeccionPublica[] {
  return secciones.filter(
    (seccion) => !esCabecera(seccion),
  );
}