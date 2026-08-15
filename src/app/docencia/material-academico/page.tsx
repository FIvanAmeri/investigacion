"use client";

import { useMemo, useState } from "react";

interface Material {
  id: string;
  categoria: string;
  titulo: string;
  descripcion: string;
  contenido: string;
  palabrasClave: string[];
  fuente: {
    nombre: string;
    url: string;
  };
}

const materiales: Material[] = [
  {
    id: "infeccion-tracto-urinario-recurrente",
    categoria: "Artículo científico",
    titulo: "Infección del Tracto Urinario Recurrente",
    descripcion:
      "Material científico disponible en la sección de artículos de AUGA relacionado con las infecciones del tracto urinario recurrentes.",
    contenido:
      "Artículo científico presentado por AUGA dentro de su biblioteca de artículos científicos. El material puede utilizarse como recurso de consulta y actualización dentro del estudio de las infecciones urinarias recurrentes en el contexto uroginecológico.",
    palabrasClave: [
      "infección urinaria",
      "ITU",
      "infección recurrente",
      "tracto urinario",
      "uroginecología",
    ],
    fuente: {
      nombre: "AUGA — Artículos Científicos",
      url: "https://www.auga.com.ar/articulos-cientificos.html",
    },
  },
  {
    id: "post-hysterectomy-vaginal-vault-prolapse",
    categoria: "Artículo científico",
    titulo: "Post-Hysterectomy Vaginal Vault Prolapse",
    descripcion:
      "Artículo científico incluido por AUGA dentro de su biblioteca de publicaciones relacionadas con la uroginecología.",
    contenido:
      "Material de consulta centrado en el prolapso de la cúpula vaginal posterior a una histerectomía. Se encuentra disponible dentro de la sección de artículos científicos de AUGA.",
    palabrasClave: [
      "prolapso",
      "cúpula vaginal",
      "histerectomía",
      "prolapso apical",
      "piso pelviano",
    ],
    fuente: {
      nombre: "AUGA — Artículos Científicos",
      url: "https://www.auga.com.ar/articulos-cientificos.html",
    },
  },
  {
    id: "guidelines-urinary-incontinence",
    categoria: "Guía clínica",
    titulo: "Guidelines on Urinary Incontinence",
    descripcion:
      "Documento académico sobre incontinencia urinaria disponible a través del sitio oficial de AUGA.",
    contenido:
      "Documento de referencia que incluye metodología, preguntas clínicas, estrategias de búsqueda, niveles de evidencia, grados de recomendación y diferentes aspectos relacionados con la evaluación y el manejo de la incontinencia urinaria.",
    palabrasClave: [
      "incontinencia urinaria",
      "guía",
      "evidencia",
      "diagnóstico",
      "tratamiento",
      "investigación",
    ],
    fuente: {
      nombre: "AUGA — Guidelines on Urinary Incontinence",
      url: "https://www.auga.com.ar/articulos/uroginecologia.pdf",
    },
  },
  {
    id: "metodologia-investigacion",
    categoria: "Formación académica",
    titulo: "Metodología de la investigación y lectura crítica",
    descripcion:
      "Contenido académico contemplado por AUGA dentro de los conocimientos generales requeridos para la acreditación en uroginecología.",
    contenido:
      "AUGA establece entre sus contenidos académicos el conocimiento y utilización de metodología de la investigación, la interpretación crítica de trabajos científicos y la recopilación y análisis de casuística propia. Este material constituye una referencia para orientar la formación científica del profesional en uroginecología.",
    palabrasClave: [
      "investigación",
      "metodología",
      "trabajos científicos",
      "lectura crítica",
      "evidencia",
      "casuística",
    ],
    fuente: {
      nombre: "AUGA — Contenidos Académicos Generales",
      url: "https://auga.com.ar/acreditacion-contenidos-academicos.html",
    },
  },
  {
    id: "webinar-revision-bibliografica",
    categoria: "Webinar",
    titulo: "Revisiones bibliográficas en uroginecología",
    descripcion:
      "Material audiovisual de las actividades académicas desarrolladas por AUGA en formato webinar.",
    contenido:
      "AUGA dispone de grabaciones de webinars que incluyen revisiones bibliográficas de temas relacionados con la uroginecología. Estas actividades están orientadas a la actualización y discusión de evidencia científica.",
    palabrasClave: [
      "webinar",
      "revisión bibliográfica",
      "evidencia",
      "actualización",
      "uroginecología",
    ],
    fuente: {
      nombre: "AUGA — Actividades y Webinars",
      url: "https://www.auga.com.ar/actividades.html",
    },
  },
  {
    id: "nueva-terminologia-prolapso",
    categoria: "Webinar",
    titulo: "Nueva terminología en cirugía de prolapso",
    descripcion:
      "Actividad académica de AUGA dedicada a la actualización de la terminología relacionada con la cirugía del prolapso.",
    contenido:
      "Actividad incluida dentro de los webinars de AUGA. Aborda la actualización de la terminología utilizada en cirugía de prolapso y presenta material relacionado con documentos y reportes científicos internacionales.",
    palabrasClave: [
      "prolapso",
      "cirugía",
      "terminología",
      "piso pelviano",
      "webinar",
    ],
    fuente: {
      nombre: "AUGA — Webinars",
      url: "https://www.auga.com.ar/webinars.html",
    },
  },
  {
    id: "complicaciones-mallas",
    categoria: "Webinar",
    titulo: "Manejo de las complicaciones con mallas",
    descripcion:
      "Actividad académica incluida en los webinars de AUGA sobre las complicaciones relacionadas con el uso de mallas en el tratamiento del prolapso.",
    contenido:
      "Material audiovisual de actualización incluido en las actividades académicas de AUGA. La actividad aborda el manejo de complicaciones relacionadas con mallas y se vincula con declaraciones y documentos científicos internacionales.",
    palabrasClave: [
      "mallas",
      "complicaciones",
      "prolapso",
      "cirugía",
      "webinar",
    ],
    fuente: {
      nombre: "AUGA — Webinars",
      url: "https://www.auga.com.ar/webinars.html",
    },
  },
  {
    id: "laser-uroginecologia",
    categoria: "Webinar",
    titulo: "Láser en Uroginecología",
    descripcion:
      "Actividad académica de AUGA dedicada al análisis del uso del láser dentro de la uroginecología.",
    contenido:
      "Webinar de AUGA dedicado al láser en uroginecología, con coordinación y participación de profesionales del área. Se encuentra disponible como grabación dentro de los recursos audiovisuales de la asociación.",
    palabrasClave: [
      "láser",
      "uroginecología",
      "tratamientos",
      "tecnología",
      "webinar",
    ],
    fuente: {
      nombre: "AUGA — Webinars",
      url: "https://www.auga.com.ar/webinars.html",
    },
  },
  {
    id: "tratamientos-innovadores-bajo-la-lupa",
    categoria: "Webinar",
    titulo: "Tratamientos innovadores bajo la lupa",
    descripcion:
      "Actividad de la Subcomisión de Investigación de AUGA dedicada al análisis crítico de un trabajo científico.",
    contenido:
      "Actividad desarrollada por la Subcomisión de Investigación de AUGA bajo el título 'Tratamientos innovadores bajo la lupa'. El encuentro incluyó el análisis crítico de un trabajo científico sobre hilos vaginales y contó con la participación de integrantes de la Subcomisión de Investigación.",
    palabrasClave: [
      "investigación",
      "tratamientos innovadores",
      "lectura crítica",
      "hilos vaginales",
      "evidencia",
    ],
    fuente: {
      nombre: "AUGA — Actividades y Webinars",
      url: "https://auga.com.ar/",
    },
  },
];

export default function MaterialAcademicoPage() {
  const [busqueda, setBusqueda] = useState("");
  const [abiertos, setAbiertos] = useState<Set<string>>(new Set());

  const resultados = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase();

    if (!termino) {
      return materiales;
    }

    return materiales.filter((material) => {
      const contenido = [
        material.titulo,
        material.categoria,
        material.descripcion,
        material.contenido,
        ...material.palabrasClave,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return contenido.includes(termino);
    });
  }, [busqueda]);

  const toggleMaterial = (id: string) => {
    setAbiertos((actuales) => {
      const nuevas = new Set(actuales);

      if (nuevas.has(id)) {
        nuevas.delete(id);
      } else {
        nuevas.add(id);
      }

      return nuevas;
    });
  };

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
            Docencia
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Material académico
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Recursos científicos y académicos de AUGA para la formación,
            actualización y consulta en uroginecología.
          </p>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500">
            Esta sección reúne materiales publicados o difundidos por AUGA.
            Los contenidos externos mantienen la autoría y responsabilidad de
            sus respectivas fuentes.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="sticky top-[68px] z-30 bg-white pb-8 pt-2">
          <label
            htmlFor="buscar-material"
            className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
          >
            Buscar material
          </label>

          <div className="relative cursor-default">
  <input
    id="buscar-material"
    type="search"
    value={busqueda}
    onChange={(event) => setBusqueda(event.target.value)}
    placeholder="Buscar por título, tema o palabra clave..."
    className="h-14 w-full cursor-text border border-slate-300 bg-white px-5 pr-12 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500"
  />

  <svg
    className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="11"
      cy="11"
      r="6.5"
      stroke="currentColor"
      strokeWidth="1.7"
    />

    <path
      d="M16 16L21 21"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
</div>

          <p className="mt-3 text-xs text-slate-500">
            {resultados.length}{" "}
            {resultados.length === 1
              ? "material encontrado"
              : "materiales encontrados"}
          </p>
        </div>

        {resultados.length === 0 ? (
          <div className="border border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <p className="text-sm font-medium text-slate-700">
              No encontramos materiales que coincidan con tu búsqueda.
            </p>

            <button
              type="button"
              onClick={() => setBusqueda("")}
              className="mt-4 text-sm font-semibold text-cyan-600 transition-colors hover:text-cyan-700"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          resultados.map((material, index) => {
            const abierto = abiertos.has(material.id);

            return (
              <div key={material.id}>
                {index > 0 && <WaveDivider />}

                <article className="py-12 first:pt-6">
                  <div className="grid gap-8 lg:grid-cols-[1fr_220px]">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                        {material.categoria}
                      </p>

                      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                        {material.titulo}
                      </h2>

                      <p className="mt-5 text-base leading-8 text-slate-600">
                        {material.descripcion}
                      </p>

                      {abierto && (
                        <div className="mt-8 border-t border-slate-200 pt-8">
                          <p className="text-base leading-8 text-slate-700">
                            {material.contenido}
                          </p>

                          <div className="mt-8 border-l-2 border-cyan-500 bg-slate-50 px-5 py-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                              Fuente oficial
                            </p>

                            <a
                              href={material.fuente.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 block text-sm font-medium leading-6 text-slate-700 transition-colors hover:text-cyan-600"
                            >
                              {material.fuente.nombre}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="lg:flex lg:items-start lg:justify-end">
                      <button
                        type="button"
                        onClick={() => toggleMaterial(material.id)}
                        aria-expanded={abierto}
                        className="inline-flex h-11 items-center justify-center border border-slate-300 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 transition-all hover:border-cyan-500 hover:bg-cyan-500 hover:text-white"
                      >
                        {abierto ? "Cerrar material" : "Leer material"}
                      </button>
                    </div>
                  </div>

                  {!abierto && (
                    <div className="mt-8 flex flex-wrap gap-2">
                      {material.palabrasClave
                        .slice(0, 5)
                        .map((palabra) => (
                          <span
                            key={palabra}
                            className="border border-slate-200 px-3 py-1.5 text-[11px] uppercase tracking-wide text-slate-500"
                          >
                            {palabra}
                          </span>
                        ))}
                    </div>
                  )}
                </article>
              </div>
            );
          })
        )}
      </section>
    </main>
  );
}

function WaveDivider() {
  return (
    <div
      className="flex h-10 items-center justify-center"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 32"
        className="h-8 w-full max-w-md text-cyan-500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 16C25 16 25 7 50 7C75 7 75 25 100 25C125 25 125 7 150 7C175 7 175 25 200 25C225 25 225 7 250 7C275 7 275 25 300 25C325 25 325 16 350 16C375 16 375 16 400 16"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}