import Link from "next/link";
import ScrollReveal from "@/app/components/ScrollReveal";

export default function Home() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2">
          <ScrollReveal>
            <div>
              <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Investigación · Ciencia · Uroginecología
              </p>

              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Investigación científica en uroginecología
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Un espacio dedicado a la investigación, generación de
                evidencia científica y formación especializada en el campo de
                la uroginecología.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/investigacion"
                  className="inline-flex h-12 items-center justify-center bg-slate-950 px-6 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                >
                  Conocer la investigación
                </Link>

                <Link
                  href="/investigadores"
                  className="inline-flex h-12 items-center justify-center border border-slate-300 bg-white px-6 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
                >
                  Nuestro equipo
                </Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150} className="hidden lg:block">
            <div className="relative mx-auto aspect-square max-w-md border border-slate-200 bg-white p-8">
              <div className="flex h-full items-center justify-center border border-slate-100">
                <svg
                  viewBox="0 0 300 300"
                  className="h-64 w-64 text-slate-300"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle
                    cx="150"
                    cy="150"
                    r="110"
                    stroke="currentColor"
                    strokeWidth="1"
                  />

                  <circle
                    cx="150"
                    cy="150"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="1"
                  />

                  <path
                    d="M95 115C120 95 180 95 205 115"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  <path
                    d="M95 185C120 205 180 205 205 185"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  <path
                    d="M150 75V225"
                    stroke="currentColor"
                    strokeWidth="1"
                  />

                  <path
                    d="M75 150H225"
                    stroke="currentColor"
                    strokeWidth="1"
                  />

                  <circle
                    cx="150"
                    cy="150"
                    r="8"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <ScrollReveal>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Áreas de trabajo
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Ciencia orientada a generar conocimiento
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Nuestro trabajo integra investigación clínica, formación
              especializada y análisis de evidencia para abordar los
              principales desafíos de la uroginecología.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="mt-12 grid gap-px overflow-hidden border border-slate-200 bg-slate-200 md:grid-cols-3">
            <article className="bg-white p-8 transition-transform duration-300 hover:-translate-y-1">
              <span className="text-sm font-semibold text-slate-400">
                01
              </span>

              <h3 className="mt-6 text-xl font-semibold text-slate-950">
                Investigación
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Desarrollo de proyectos y líneas de investigación clínica y
                científica.
              </p>
            </article>

            <article className="bg-white p-8 transition-transform duration-300 hover:-translate-y-1">
              <span className="text-sm font-semibold text-slate-400">
                02
              </span>

              <h3 className="mt-6 text-xl font-semibold text-slate-950">
                Formación
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Recursos y contenidos destinados a profesionales y estudiantes.
              </p>
            </article>

            <article className="bg-white p-8 transition-transform duration-300 hover:-translate-y-1">
              <span className="text-sm font-semibold text-slate-400">
                03
              </span>

              <h3 className="mt-6 text-xl font-semibold text-slate-950">
                Evidencia
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Producción y difusión de conocimiento basado en evidencia
                científica.
              </p>
            </article>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}