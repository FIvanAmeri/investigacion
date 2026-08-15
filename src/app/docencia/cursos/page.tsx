"use client";

import { useMemo, useState } from "react";

interface Curso {
  id: string;
  categoria: string;
  titulo: string;
  modalidad: string;
  ubicacion: string;
  fecha: string;
  estado: string;
  descripcion: string;
  contenidos: string[];
  fuente: {
    nombre: string;
    url: string;
  };
  palabrasClave: string[];
}

const cursos: Curso[] = [
  {
    id: "curso-formacion-uroginecologia",
    categoria: "Formación",
    titulo:
      "Curso de Formación en Uroginecología y Disfunciones del Piso Pelviano",
    modalidad: "Virtual",
    ubicacion: "Argentina",
    fecha: "Edición 2026 finalizada · Próxima edición 2027",
    estado: "Próxima edición 2027",
    descripcion:
      "Curso de formación de AUGA destinado a profesionales ginecólogos y urólogos en proceso de formación en uroginecología, así como a especialistas del área. Su objetivo es proporcionar una base sólida y actualizada sobre las principales patologías, estudios diagnósticos y abordajes terapéuticos relacionados con las disfunciones del piso pelviano.",
    contenidos: [
      "Anatomía funcional del piso pelviano.",
      "Fisiología de la micción y la defecación.",
      "Epidemiología y clasificación de las disfunciones uroginecológicas.",
      "Evaluación clínica y examen físico.",
      "Cuestionarios validados y escalas de calidad de vida.",
      "Estudios urodinámicos.",
      "Ecografía transperineal y resonancia magnética.",
      "Incontinencia urinaria.",
      "Prolapso de órganos pélvicos.",
      "Infecciones urinarias recurrentes.",
      "Síndrome genitourinario.",
      "Patología uretral.",
      "Disfunciones del vaciado vesical.",
      "Dolor asociado a patología del piso pelviano.",
    ],
    fuente: {
      nombre:
        "AUGA — Curso de Formación en Uroginecología y Disfunciones del Piso Pelviano",
      url: "https://www.auga.com.ar/cursos.html",
    },
    palabrasClave: [
      "uroginecología",
      "piso pelviano",
      "formación",
      "incontinencia",
      "prolapso",
      "urodinamia",
      "investigación",
    ],
  },
  {
    id: "curso-urodinamia",
    categoria: "Curso precongreso",
    titulo: "Urodinamia",
    modalidad: "Presencial",
    ubicacion: "Buenos Aires, Argentina",
    fecha: "15 de abril de 2026",
    estado: "Actividad realizada",
    descripcion:
      "Curso precongreso organizado por AUGA dentro de las actividades del III Congreso Internacional AUGA 2026, orientado a la capacitación específica en urodinamia dentro del ámbito de la uroginecología.",
    contenidos: [
      "Evaluación funcional del tracto urinario inferior.",
      "Indicaciones de estudios urodinámicos.",
      "Interpretación de estudios.",
      "Aplicación clínica de la urodinamia en uroginecología.",
    ],
    fuente: {
      nombre: "AUGA — III Congreso Internacional AUGA 2026",
      url: "https://auga.com.ar/congresos.html",
    },
    palabrasClave: [
      "urodinamia",
      "diagnóstico",
      "uroginecología",
      "piso pelviano",
    ],
  },
  {
    id: "curso-ginecologia-regenerativa",
    categoria: "Curso precongreso",
    titulo: "Ginecología Regenerativa y Tecnologías Avanzadas",
    modalidad: "Presencial",
    ubicacion: "Buenos Aires, Argentina",
    fecha: "15 de abril de 2026",
    estado: "Actividad realizada",
    descripcion:
      "Curso precongreso de AUGA dedicado a ginecología regenerativa y tecnologías avanzadas, desarrollado en el marco del III Congreso Internacional AUGA 2026.",
    contenidos: [
      "Ginecología regenerativa.",
      "Tecnologías aplicadas al área ginecológica.",
      "Análisis crítico de nuevas alternativas terapéuticas.",
    ],
    fuente: {
      nombre:
        "AUGA — Curso Precongreso: Ginecología Regenerativa y Tecnologías Avanzadas",
      url: "https://www.auga.com.ar/inscripcion-curso-precongreso-ginecologia-regenerativa-2026.html",
    },
    palabrasClave: [
      "ginecología regenerativa",
      "tecnologías avanzadas",
      "uroginecología",
    ],
  },
  {
    id: "curso-cirugia-uroginecologia",
    categoria: "Curso precongreso",
    titulo: "Cirugía en Uroginecología",
    modalidad: "Presencial",
    ubicacion: "Buenos Aires, Argentina",
    fecha: "15 de abril de 2026",
    estado: "Actividad realizada",
    descripcion:
      "Curso precongreso de AUGA centrado en aspectos quirúrgicos relacionados con la práctica uroginecológica.",
    contenidos: [
      "Abordajes quirúrgicos en uroginecología.",
      "Tratamiento quirúrgico de patologías del piso pelviano.",
      "Principios de cirugía uroginecológica.",
    ],
    fuente: {
      nombre: "AUGA — III Congreso Internacional AUGA 2026",
      url: "https://auga.com.ar/congresos.html",
    },
    palabrasClave: [
      "cirugía",
      "uroginecología",
      "piso pelviano",
      "tratamiento quirúrgico",
    ],
  },
  {
    id: "curso-rehabilitacion-piso-pelviano",
    categoria: "Curso precongreso",
    titulo: "Rehabilitación del Piso Pelviano",
    modalidad: "Presencial",
    ubicacion: "Buenos Aires, Argentina",
    fecha: "15 de abril de 2026",
    estado: "Actividad realizada",
    descripcion:
      "Curso precongreso de AUGA dedicado a la rehabilitación del piso pelviano como parte del abordaje integral de las disfunciones uroginecológicas.",
    contenidos: [
      "Rehabilitación funcional del piso pelviano.",
      "Abordaje conservador de las disfunciones uroginecológicas.",
      "Integración de la rehabilitación en el tratamiento multidisciplinario.",
    ],
    fuente: {
      nombre: "AUGA — III Congreso Internacional AUGA 2026",
      url: "https://auga.com.ar/congresos.html",
    },
    palabrasClave: [
      "rehabilitación",
      "piso pelviano",
      "fisioterapia",
      "tratamiento conservador",
    ],
  },
  {
    id: "curso-slings-cistoscopia",
    categoria: "Curso precongreso",
    titulo: "Slings Retropúbicos y Cistoscopia",
    modalidad: "Presencial",
    ubicacion: "Buenos Aires, Argentina",
    fecha: "15 de abril de 2026",
    estado: "Actividad realizada",
    descripcion:
      "Curso precongreso de AUGA relacionado con el abordaje quirúrgico de la incontinencia urinaria y la utilización de la cistoscopia en el contexto de la cirugía uroginecológica.",
    contenidos: [
      "Slings retropúbicos.",
      "Principios del tratamiento quirúrgico de la incontinencia.",
      "Cistoscopia asociada a procedimientos uroginecológicos.",
    ],
    fuente: {
      nombre: "AUGA — III Congreso Internacional AUGA 2026",
      url: "https://auga.com.ar/congresos.html",
    },
    palabrasClave: [
      "slings",
      "retropúbico",
      "cistoscopia",
      "incontinencia urinaria",
    ],
  },
];

export default function CursosPage() {
  const [busqueda, setBusqueda] = useState("");
  const [abiertos, setAbiertos] = useState<Set<string>>(new Set());

  const resultados = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase();

    if (!termino) {
      return cursos;
    }

    return cursos.filter((curso) => {
      const contenido = [
        curso.titulo,
        curso.categoria,
        curso.modalidad,
        curso.ubicacion,
        curso.fecha,
        curso.estado,
        curso.descripcion,
        ...curso.contenidos,
        ...curso.palabrasClave,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return contenido.includes(termino);
    });
  }, [busqueda]);

  const toggleCurso = (id: string) => {
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
            Cursos
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Formación y capacitación científica en uroginecología a cargo de
            la Asociación Uroginecológica Argentina.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="sticky top-[68px] z-30 bg-white pb-8 pt-2">
          <label
            htmlFor="buscar-curso"
            className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
          >
            Buscar curso
          </label>

          <div className="relative">
            <input
              id="buscar-curso"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar por curso, tema o palabra clave..."
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
              ? "curso encontrado"
              : "cursos encontrados"}
          </p>
        </div>

        {resultados.length === 0 ? (
          <div className="border border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <p className="text-sm font-medium text-slate-700">
              No encontramos cursos que coincidan con tu búsqueda.
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
          resultados.map((curso, index) => {
            const abierto = abiertos.has(curso.id);

            return (
              <div key={curso.id}>
                {index > 0 && <WaveDivider />}

                <article className="py-12 first:pt-6">
                  <div className="grid gap-8 lg:grid-cols-[1fr_220px]">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                        {curso.categoria}
                      </p>

                      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                        {curso.titulo}
                      </h2>

                      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
                        <span>{curso.modalidad}</span>
                        <span>{curso.ubicacion}</span>
                        <span>{curso.fecha}</span>
                      </div>

                      <p className="mt-6 text-base leading-8 text-slate-600">
                        {curso.descripcion}
                      </p>

                      {abierto && (
                        <div className="mt-8 border-t border-slate-200 pt-8">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Contenidos
                          </p>

                          <ul className="mt-5 space-y-3">
                            {curso.contenidos.map((contenido) => (
                              <li
                                key={contenido}
                                className="flex gap-3 text-sm leading-7 text-slate-600"
                              >
                                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                                <span>{contenido}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-8 border-l-2 border-cyan-500 bg-slate-50 px-5 py-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                              Fuente oficial
                            </p>

                            <a
                              href={curso.fuente.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 block text-sm font-medium leading-6 text-slate-700 transition-colors hover:text-cyan-600"
                            >
                              {curso.fuente.nombre}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="lg:flex lg:items-start lg:justify-end">
                      <button
                        type="button"
                        onClick={() => toggleCurso(curso.id)}
                        aria-expanded={abierto}
                        className="inline-flex h-11 items-center justify-center border border-slate-300 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 transition-all hover:border-cyan-500 hover:bg-cyan-500 hover:text-white"
                      >
                        {abierto ? "Cerrar curso" : "Ver contenidos"}
                      </button>
                    </div>
                  </div>

                  {!abierto && (
                    <div className="mt-8 flex flex-wrap gap-2">
                      {curso.palabrasClave
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