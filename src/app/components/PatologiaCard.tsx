"use client";

import { useState } from "react";
import Link from "next/link";
import type { Patologia } from "@/app/data/patologias";
import ScrollReveal from "./ScrollReveal";

interface PatologiaCardProps {
  patologia: Patologia;
  index: number;
}

export default function PatologiaCard({
  patologia,
  index,
}: PatologiaCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <ScrollReveal delay={index * 80}>
      <article className="py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                Patología
              </span>

              <span className="text-xs font-medium text-slate-400">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {patologia.nombre}
            </h2>

            <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600">
              {patologia.descripcion}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {patologia.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:pt-8">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              className={`inline-flex min-w-[140px] items-center justify-center border px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] transition-all duration-300 ${
                open
                  ? "border-cyan-500 bg-cyan-500 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-cyan-500 hover:text-cyan-600"
              }`}
            >
              {open ? "Cerrar artículo" : "Leer más"}
            </button>
          </div>
        </div>

        <div
          className={`grid transition-[grid-template-rows,opacity] duration-700 ease-out ${
            open
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="mt-10 border-t border-slate-200 pt-10">
              <div className="max-w-4xl">
                <p className="text-base leading-8 text-slate-700">
                  {patologia.contenido}
                </p>

                <div className="mt-10 border-l-2 border-cyan-500 bg-slate-50 px-6 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Fuente
                  </p>

                  <Link
                    href={patologia.fuenteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-semibold text-slate-800 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-cyan-600"
                  >
                    {patologia.fuente}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
}