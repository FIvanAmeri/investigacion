"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,transform] duration-700 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

const integrantes = [
  {
    nombre: "Dra. Noelia Miralles",
    imagen: "/images/equipo/noelia-miralles.jpg",
  },
  {
    nombre: "Dra. Carolina Justo",
    imagen: "/images/equipo/carolina-justo.png",
  },
  {
    nombre: "Dra. Agustina Vendramini",
    imagen: "/images/equipo/agustina-vendramini.jpg",
  },
  {
    nombre: "Dra. Maricel Zocco",
    imagen: "/images/equipo/maricel-zocco.png",
  },
];

export default function InvestigadoresPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
          <ScrollReveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-cyan-500" />

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                Equipo
              </p>
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Nuestro equipo
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Profesionales que forman parte de la Subcomisión de
              Uroginecología de AUGA.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Coordinación
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Dra. Patricia Cavina
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <article className="mt-10 grid overflow-hidden border border-slate-200 bg-slate-50 md:grid-cols-[400px_1fr]">
            <div className="relative aspect-[4/5] bg-slate-200 md:aspect-auto md:min-h-[500px]">
              <Image
                src="/images/equipo/patricia-cavina.jpg"
                alt="Dra. Patricia Cavina"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                priority
              />
            </div>

            <div className="flex items-center p-8 sm:p-12 lg:p-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                  Coordinadora de la subcomisión de AUGA
                </p>

                <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Dra. Patricia Cavina
                </h3>

                <div className="mt-6 h-px w-12 bg-cyan-500" />

                <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">
                  Responsable de la coordinación de las actividades
                  científicas y de investigación de la Subcomisión de
                  Uroginecología.
                </p>
              </div>
            </div>
          </article>
        </ScrollReveal>
      </section>

      <div className="relative mx-auto flex max-w-7xl items-center justify-center px-6">
        <div className="absolute left-6 right-6 top-1/2 h-px bg-slate-200" />

        <svg
          viewBox="0 0 240 32"
          className="relative z-10 h-8 w-60 bg-white"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M0 16C20 16 20 8 40 8C60 8 60 24 80 24C100 24 100 8 120 8C140 8 140 24 160 24C180 24 180 8 200 8C220 8 220 16 240 16"
            stroke="#06B6D4"
            strokeWidth="1.5"
          />

          <circle
            cx="120"
            cy="8"
            r="2.5"
            fill="#06B6D4"
          />
        </svg>
      </div>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <ScrollReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Equipo de trabajo
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Integrantes
            </h2>
          </ScrollReveal>

          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {integrantes.map((integrante, index) => (
              <ScrollReveal
                key={integrante.nombre}
                delay={index * 100}
              >
                <article>
                  <div className="relative aspect-[4/5] overflow-hidden bg-slate-200">
                    <Image
                      src={integrante.imagen}
                      alt={integrante.nombre}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                    />
                  </div>

                  <div className="pt-5">
                    <div className="mb-3 h-px w-8 bg-cyan-500" />

                    <h3 className="text-lg font-semibold text-slate-950">
                      {integrante.nombre}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Integrante de la Subcomisión de Uroginecología
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}