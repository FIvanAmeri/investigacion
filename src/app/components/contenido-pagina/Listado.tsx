"use client";

import {
  useMemo,
  useState,
} from "react";

import Fuente from "./Fuente";
import ImagenesOpcionales from "./ImagenesOpcionales";
import WaveDivider from "./WaveDivider";
import {
  configuracion,
  palabrasClave,
} from "./contenidoPaginaHelpers";
import { SeccionPublica } from "./contenidoPaginaTipos";

export default function Listado({
  secciones,
  tipo,
}: {
  secciones: SeccionPublica[];
  tipo:
    | "TRATAMIENTO"
    | "PATOLOGIA";
}) {
  const [busqueda, setBusqueda] =
    useState("");

  const [abiertos, setAbiertos] =
    useState<Set<number>>(
      new Set(),
    );

  const resultados = useMemo(() => {
    const termino =
      busqueda
        .trim()
        .toLocaleLowerCase();

    return secciones.filter(
      (seccion) => {
        const config =
          configuracion(
            seccion,
          );

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
          ...(config.palabrasClave ??
            []),
          config.fuenteNombre,
        ]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase();

        return texto.includes(
          termino,
        );
      },
    );
  }, [
    busqueda,
    secciones,
    tipo,
  ]);

  const toggle = (
    id: number,
  ) => {
    setAbiertos(
      (actuales) => {
        const nuevas =
          new Set(actuales);

        if (nuevas.has(id)) {
          nuevas.delete(id);
        } else {
          nuevas.add(id);
        }

        return nuevas;
      },
    );
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
          onChange={(event) =>
            setBusqueda(
              event.target.value,
            )
          }
          placeholder={`Buscar ${
            tipo ===
            "TRATAMIENTO"
              ? "tratamiento"
              : "patología"
          }...`}
          className="mt-4 h-11 w-full border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
        />

        <p className="mt-3 text-xs text-slate-400">
          {resultados.length}{" "}
          {resultados.length ===
          1
            ? "resultado"
            : "resultados"}
        </p>
      </div>

      <div className="mt-8">
        {resultados.map(
          (seccion, index) => {
            const config =
              configuracion(
                seccion,
              );

            const abierto =
              abiertos.has(
                seccion.id,
              );

            return (
              <div
                key={seccion.id}
              >
                {index > 0 && (
                  <WaveDivider />
                )}

                <article className="py-12 first:pt-6">
                  <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                        {config.etiqueta ||
                          etiqueta}
                      </p>

                      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                        {
                          seccion.titulo
                        }
                      </h2>

                      {config.descripcion && (
                        <p className="mt-5 text-base leading-8 text-slate-600">
                          {
                            config.descripcion
                          }
                        </p>
                      )}

                      {abierto &&
                        seccion.contenido && (
                          <div className="mt-8 border-t border-slate-200 pt-8">
                            <p className="whitespace-pre-line text-base leading-8 text-slate-700">
                              {
                                seccion.contenido
                              }
                            </p>

                            <ImagenesOpcionales
                              seccion={
                                seccion
                              }
                            />

                            <Fuente
                              seccion={
                                seccion
                              }
                            />
                          </div>
                        )}
                    </div>

                    <div className="lg:flex lg:items-start lg:justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          toggle(
                            seccion.id,
                          )
                        }
                        aria-expanded={
                          abierto
                        }
                        className="inline-flex h-11 items-center justify-center border border-slate-300 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 transition-all hover:border-cyan-500 hover:bg-cyan-500 hover:text-white"
                      >
                        {abierto
                          ? "Cerrar artículo"
                          : "Leer más"}
                      </button>
                    </div>
                  </div>

                  {!abierto &&
                    palabrasClave(
                      seccion,
                    ).length >
                      0 && (
                      <div className="mt-8 flex flex-wrap gap-2">
                        {palabrasClave(
                          seccion,
                        )
                          .slice(0, 6)
                          .map(
                            (
                              palabra,
                            ) => (
                              <span
                                key={
                                  palabra
                                }
                                className="border border-slate-200 px-3 py-1.5 text-[11px] uppercase tracking-wide text-slate-500"
                              >
                                {
                                  palabra
                                }
                              </span>
                            ),
                          )}
                      </div>
                    )}
                </article>
              </div>
            );
          },
        )}
      </div>
    </section>
  );
}