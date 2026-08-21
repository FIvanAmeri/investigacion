"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

interface ContenidoBuscadorProps {
  children: React.ReactNode;
  placeholder: string;
  cantidad: number;
  singular: string;
  plural: string;
}

export default function ContenidoBuscador({
  children,
  placeholder,
  cantidad,
  singular,
  plural,
}: ContenidoBuscadorProps) {
  const contenedorRef =
    useRef<HTMLDivElement | null>(null);

  const [busqueda, setBusqueda] =
    useState("");

  const [resultados, setResultados] =
    useState(cantidad);

  useEffect(() => {
    const contenedor =
      contenedorRef.current;

    if (!contenedor) {
      return;
    }

    const actualizarResultados = () => {
      const articulos =
        Array.from(
          contenedor.querySelectorAll(
            "article",
          ),
        ).filter(
          (article) =>
            !article.closest("form"),
        );

      const termino =
        busqueda
          .trim()
          .toLocaleLowerCase(
            "es",
          );

      let visibles = 0;

      articulos.forEach(
        (article) => {
          const texto =
            article.textContent
              ?.toLocaleLowerCase(
                "es",
              ) ?? "";

          const coincide =
            !termino ||
            texto.includes(termino);

          article.hidden =
            !coincide;

          if (coincide) {
            visibles += 1;
          }
        },
      );

      setResultados(visibles);
    };

    actualizarResultados();

    const observer =
      new MutationObserver(
        actualizarResultados,
      );

    observer.observe(
      contenedor,
      {
        childList: true,
        subtree: true,
      },
    );

    return () => {
      observer.disconnect();
    };
  }, [busqueda, cantidad]);

  const limpiar = () => {
    setBusqueda("");
  };

  return (
    <div ref={contenedorRef}>
      <div className="mt-8 border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="block min-w-0 flex-1">
            <span className="text-sm font-semibold text-slate-800">
              Buscar
            </span>

            <div className="relative mt-2">
              <input
                type="search"
                value={busqueda}
                onChange={(event) =>
                  setBusqueda(
                    event.target.value,
                  )
                }
                placeholder={
                  placeholder
                }
                className="h-12 w-full border border-slate-300 bg-white px-4 pr-12 text-sm text-slate-900 outline-none transition focus:border-cyan-500"
              />

              {busqueda && (
                <button
                  type="button"
                  onClick={
                    limpiar
                  }
                  aria-label="Limpiar búsqueda"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 hover:text-slate-950"
                >
                  ×
                </button>
              )}
            </div>
          </label>

          <div className="shrink-0 text-sm text-slate-500">
            {resultados}{" "}
            {resultados === 1
              ? singular
              : plural}
          </div>
        </div>

        {busqueda &&
          resultados === 0 && (
            <div className="mt-5 border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
              <p className="text-sm font-semibold text-slate-700">
                No se encontraron
                resultados.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Probá con otro texto
                de búsqueda.
              </p>
            </div>
          )}
      </div>

      {children}
    </div>
  );
}