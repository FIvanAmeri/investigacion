"use client";

import {
  useMemo,
  useState,
} from "react";

import Fuente from "./Fuente";
import ImagenesOpcionales from "./ImagenesOpcionales";
import { configuracion } from "./contenidoPaginaHelpers";
import { SeccionPublica } from "./contenidoPaginaTipos";

export default function Recursos({
  secciones,
}: {
  secciones: SeccionPublica[];
}) {
  const [busqueda, setBusqueda] =
    useState("");

  const [categoria, setCategoria] =
    useState("Todos");

  const [abiertos, setAbiertos] =
    useState<Set<number>>(
      new Set(),
    );

  const categorias = useMemo(() => {
    const valores = secciones
      .map(
        (seccion) =>
          configuracion(seccion)
            .categoria,
      )
      .filter(
        (
          valor,
        ): valor is string =>
          Boolean(valor),
      );

    return [
      "Todos",
      ...Array.from(
        new Set(valores),
      ),
    ];
  }, [secciones]);

  const resultados = useMemo(() => {
    const termino =
      busqueda
        .trim()
        .toLocaleLowerCase();

    return secciones.filter(
      (seccion) => {
        const config =
          configuracion(seccion);

        const coincideCategoria =
          categoria === "Todos" ||
          config.categoria ===
            categoria;

        if (!coincideCategoria) {
          return false;
        }

        if (!termino) {
          return true;
        }

        const texto = [
          seccion.titulo,
          config.descripcion,
          seccion.contenido,
          config.categoria,
          config.fuenteNombre,
          ...(config.palabrasClave ?? []),
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
    categoria,
    secciones,
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

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
      <div className="grid gap-4 md:grid-cols-[1fr_240px]">
        <input
          type="search"
          value={busqueda}
          onChange={(event) =>
            setBusqueda(
              event.target.value,
            )
          }
          placeholder="Buscar recurso..."
          className="h-11 w-full border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
        />

        <select
          value={categoria}
          onChange={(event) =>
            setCategoria(
              event.target.value,
            )
          }
          className="h-11 border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none focus:border-cyan-500"
        >
          {categorias.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ),
          )}
        </select>
      </div>

      <p className="mt-2 text-xs text-slate-400">
        {resultados.length}{" "}
        {resultados.length === 1
          ? "recurso encontrado"
          : "recursos encontrados"}
      </p>

      <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
        {resultados.map(
          (seccion) => {
            const config =
              configuracion(seccion);

            const abierto =
              abiertos.has(
                seccion.id,
              );

            return (
              <article
                key={seccion.id}
                className="py-7"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-4xl">
                    {config.categoria && (
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
                        {
                          config.categoria
                        }
                      </p>
                    )}

                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                      {seccion.titulo}
                    </h2>

                    {config.descripcion && (
                      <p className="mt-3 text-base leading-7 text-slate-600">
                        {
                          config.descripcion
                        }
                      </p>
                    )}
                  </div>

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
                    className="inline-flex h-11 shrink-0 items-center justify-center border border-slate-300 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 transition-all hover:border-cyan-500 hover:bg-cyan-500 hover:text-white"
                  >
                    {abierto
                      ? "Cerrar artículo"
                      : "Leer más"}
                  </button>
                </div>

                {abierto && (
                  <div className="mt-5 max-w-4xl border-t border-slate-200 pt-5">
                    {seccion.contenido && (
                      <p className="whitespace-pre-line text-base leading-7 text-slate-700">
                        {
                          seccion.contenido
                        }
                      </p>
                    )}

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
              </article>
            );
          },
        )}
      </div>
    </section>
  );
}