"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import Cabecera from "./contenido-pagina/Cabecera";
import ContenidoGenerico from "./contenido-pagina/ContenidoGenerico";
import Equipo from "./contenido-pagina/Equipo";
import Listado from "./contenido-pagina/Listado";
import Recursos from "./contenido-pagina/Recursos";
import TextoInstitucional from "./contenido-pagina/TextoInstitucional";

import {
  obtenerCabecera,
  obtenerItems,
} from "./contenido-pagina/contenidoPaginaHelpers";

import {
  ContenidoPaginaClientProps,
  ContenidoPaginaVista,
  SeccionPublica,
} from "./contenido-pagina/contenidoPaginaTipos";

export type {
  ContenidoPaginaVista,
};

export default function ContenidoPaginaClient({
  paginaSlug,
  vista,
}: ContenidoPaginaClientProps) {
  const [
    secciones,
    setSecciones,
  ] = useState<SeccionPublica[]>(
    [],
  );

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      try {
        const response =
          await fetch(
            `/api/contenido/${encodeURIComponent(
              paginaSlug,
            )}`,
            {
              method: "GET",
              cache: "no-store",
            },
          );

        if (!response.ok) {
          throw new Error(
            "No se pudo cargar el contenido.",
          );
        }

        const data =
          (await response.json()) as {
            secciones?: SeccionPublica[];
          };

        if (activo) {
          setSecciones(
            Array.isArray(
              data.secciones,
            )
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

  const cabecera =
    obtenerCabecera(
      secciones,
    );

  const items =
    obtenerItems(
      secciones,
    );

  const investigadoresSinCabecera =
    vista ===
      "INVESTIGADORES" &&
    !cabecera;

  const vistaGenerica =
    vista === "GENERICO";

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

  if (
    error ||
    (!cabecera &&
      !investigadoresSinCabecera &&
      !vistaGenerica)
  ) {
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

  if (vistaGenerica) {
    return (
      <>
        {cabecera && (
          <Cabecera
            seccion={
              cabecera
            }
          />
        )}

        <ContenidoGenerico
          secciones={
            items
          }
        />
      </>
    );
  }

  if (investigadoresSinCabecera) {
    return (
      <Equipo
        secciones={
          secciones
        }
      />
    );
  }

  return (
    <>
      {cabecera && (
        <Cabecera
          seccion={
            cabecera
          }
        />
      )}

      {vista ===
        "INSTITUCION" && (
        <TextoInstitucional
          secciones={
            items
          }
        />
      )}

      {vista ===
        "INVESTIGADORES" && (
        <Equipo
          secciones={
            items
          }
        />
      )}

      {vista ===
        "TRATAMIENTOS" && (
        <Listado
          secciones={
            items
          }
          tipo="TRATAMIENTO"
        />
      )}

      {vista ===
        "PATOLOGIAS" && (
        <Listado
          secciones={
            items
          }
          tipo="PATOLOGIA"
        />
      )}

      {vista ===
        "RECURSOS" && (
        <Recursos
          secciones={
            items
          }
        />
      )}
    </>
  );
}