import Link from "next/link";
import ScrollReveal from "@/app/components/ScrollReveal";

const secciones = [
  {
    titulo: "Líneas de investigación",
    descripcion:
      "Áreas y temas que orientan la investigación científica en uroginecología.",
    href: "/investigacion/lineas",
  },
  {
    titulo: "Proyectos",
    descripcion:
      "Proyectos de investigación en curso y trabajos desarrollados por la subcomisión.",
    href: "/investigacion/proyectos",
  },
  {
    titulo: "Publicaciones",
    descripcion:
      "Trabajos científicos, artículos y resultados de investigaciones realizadas.",
    href: "/investigacion/publicaciones",
  },
  {
    titulo: "Congresos",
    descripcion:
      "Presentaciones, comunicaciones y participación científica en congresos y jornadas.",
    href: "/investigacion/congresos",
  },
];

export default function InvestigacionPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <ScrollReveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
              Investigación
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Investigación científica
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Conocé las áreas de investigación, los proyectos desarrollados,
              las publicaciones científicas y las actividades académicas de la
              Subcomisión de Uroginecología.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <div className="grid gap-6 md:grid-cols-2">
          {secciones.map((seccion, index) => (
            <ScrollReveal
              key={seccion.href}
              delay={index * 100}
            >
              <Link
                href={seccion.href}
                className="group block h-full border border-slate-200 bg-white p-8 transition-colors duration-300 hover:border-cyan-500 hover:bg-slate-50 sm:p-10"
              >
                <div className="mb-6 h-px w-10 bg-cyan-500 transition-all duration-300 group-hover:w-16" />

                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  {seccion.titulo}
                </h2>

                <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                  {seccion.descripcion}
                </p>

                <div className="mt-8 text-sm font-semibold uppercase tracking-wide text-cyan-600">
                  Ver sección →
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </main>
  );
}