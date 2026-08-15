"use client";

import { useMemo, useState } from "react";

interface Fuente {
  nombre: string;
  url: string;
}

interface Patologia {
  id: string;
  titulo: string;
  resumen: string;
  articulo: string;
  palabrasClave: string[];
  fuente: Fuente;
}

const patologias: Patologia[] = [
  {
    id: "incontinencia-urinaria",
    titulo: "Incontinencia urinaria",
    resumen:
      "La incontinencia urinaria es la pérdida involuntaria de orina. En uroginecología se consideran distintos tipos de incontinencia según los síntomas y el mecanismo involucrado, entre ellos la incontinencia urinaria de esfuerzo, de urgencia y mixta.",
    articulo:
      "La evaluación de la incontinencia urinaria comienza con una historia clínica orientada a caracterizar los síntomas, su frecuencia, los factores desencadenantes y su impacto en la calidad de vida. La exploración clínica permite orientar el diagnóstico y determinar si existen otras alteraciones del piso pelviano asociadas. El tratamiento depende del tipo de incontinencia, la intensidad de los síntomas y las características individuales de cada paciente. Puede incluir medidas conductuales, entrenamiento de la musculatura del piso pélvico, rehabilitación especializada, dispositivos como pesarios, tratamiento farmacológico o procedimientos quirúrgicos en casos seleccionados. En Argentina, la Sociedad Argentina de Urología cuenta con un algoritmo nacional específico para el diagnóstico y tratamiento de la incontinencia de orina femenina.",
    palabrasClave: [
      "incontinencia",
      "pérdida de orina",
      "vejiga",
      "incontinencia de esfuerzo",
      "incontinencia de urgencia",
      "incontinencia mixta",
      "piso pelviano",
    ],
    fuente: {
      nombre: "Sociedad Argentina de Urología — Algoritmo Nacional para la Incontinencia de Orina Femenina",
      url: "https://www.sau-net.org/publicaciones/lineamientos-diagnostico-tratamiento",
    },
  },
  {
    id: "prolapso-organos-pelvicos",
    titulo: "Prolapso de órganos pélvicos",
    resumen:
      "El prolapso de órganos pélvicos ocurre cuando uno o más órganos de la pelvis descienden debido a alteraciones de los tejidos y estructuras que proporcionan su soporte.",
    articulo:
      "El prolapso puede comprometer diferentes compartimentos del piso pelviano. Entre sus presentaciones se encuentran el descenso de la pared vaginal anterior, asociado habitualmente a la vejiga; el descenso de la pared vaginal posterior, relacionado con el recto; el prolapso uterino y el prolapso de la cúpula vaginal luego de una histerectomía. Los síntomas pueden incluir sensación de peso o presión pelviana, percepción de un bulto vaginal, alteraciones urinarias, dificultades evacuatorias y molestias sexuales. El diagnóstico se basa fundamentalmente en la evaluación clínica. La clasificación y estadificación pueden realizarse mediante sistemas estandarizados como POP-Q. El tratamiento depende de los síntomas, el grado de prolapso y las características y preferencias de cada paciente, y puede incluir observación, rehabilitación del piso pelviano, pesarios o cirugía.",
    palabrasClave: [
      "prolapso",
      "órganos pélvicos",
      "POP",
      "POP-Q",
      "cistocele",
      "rectocele",
      "prolapso uterino",
      "cúpula vaginal",
    ],
    fuente: {
      nombre:
        "International Continence Society — Pelvic Organ Prolapse",
      url: "https://www.ics.org/public/factsheets/pelvicorganprolapse",
    },
  },
  {
    id: "infeccion-urinaria-recurrente",
    titulo: "Infección urinaria recurrente",
    resumen:
      "Las infecciones urinarias recurrentes constituyen un problema frecuente en la práctica uroginecológica y requieren una evaluación adecuada para confirmar el diagnóstico y determinar factores asociados.",
    articulo:
      "En pacientes con episodios urinarios recurrentes es importante diferenciar una infección urinaria verdadera de síntomas urinarios producidos por otras condiciones. La evaluación clínica debe considerar los antecedentes, la presentación de los episodios y los estudios microbiológicos correspondientes cuando estén indicados. La identificación de factores predisponentes y la adecuada elección del tratamiento son componentes centrales del manejo. En el ámbito argentino, la Sociedad Argentina de Urología incluye un Consenso Argentino Intersociedades sobre infección urinaria dentro de sus lineamientos de diagnóstico y tratamiento.",
    palabrasClave: [
      "infección urinaria",
      "ITU",
      "infección recurrente",
      "cistitis",
      "vejiga",
      "tracto urinario",
    ],
    fuente: {
      nombre:
        "Sociedad Argentina de Urología — Consenso Argentino Intersociedades de Infección Urinaria",
      url: "https://www.sau-net.org/publicaciones/lineamientos-diagnostico-tratamiento",
    },
  },
  {
    id: "sindrome-genitourinario-menopausia",
    titulo: "Síndrome genitourinario de la menopausia",
    resumen:
      "El síndrome genitourinario de la menopausia comprende síntomas y signos que pueden afectar los tejidos genitales y el aparato urinario durante la menopausia.",
    articulo:
      "Los cambios hormonales asociados a la menopausia pueden producir modificaciones en los tejidos del tracto genitourinario y generar síntomas que afectan la función urinaria, genital y sexual. La valoración clínica permite determinar qué síntomas están presentes y descartar otras causas. Las alternativas terapéuticas se seleccionan de acuerdo con la presentación clínica y las características de cada paciente. AUGA incorpora el síndrome genitourinario dentro de los contenidos de su formación en uroginecología y disfunciones del piso pelviano.",
    palabrasClave: [
      "menopausia",
      "síndrome genitourinario",
      "atrofia",
      "síntomas urinarios",
      "síntomas genitales",
      "salud vaginal",
    ],
    fuente: {
      nombre:
        "AUGA — Curso de Formación en Uroginecología y Disfunciones del Piso Pelviano",
      url: "https://www.auga.com.ar/cursos.html",
    },
  },
  {
    id: "disfuncion-vaciado-vesical",
    titulo: "Disfunciones del vaciado vesical",
    resumen:
      "Las alteraciones del vaciado vesical pueden dificultar el vaciamiento adecuado de la vejiga y requieren una evaluación clínica orientada a identificar su causa.",
    articulo:
      "Las disfunciones del vaciado vesical pueden manifestarse mediante dificultad para iniciar la micción, flujo urinario alterado, sensación de vaciamiento incompleto u otros síntomas urinarios. La evaluación debe considerar la historia clínica, el examen físico y los estudios complementarios que correspondan según cada caso. En uroginecología es especialmente importante diferenciar las alteraciones funcionales del vaciado de aquellas secundarias a obstrucción, alteraciones del piso pelviano, medicamentos u otras condiciones. AUGA contempla las disfunciones del vaciado vesical no neurogénicas dentro de sus contenidos formativos.",
    palabrasClave: [
      "vaciado vesical",
      "micción",
      "dificultad para orinar",
      "retención",
      "vejiga",
      "vaciamiento incompleto",
    ],
    fuente: {
      nombre:
        "AUGA — Curso de Formación en Uroginecología y Disfunciones del Piso Pelviano",
      url: "https://www.auga.com.ar/cursos.html",
    },
  },
  {
    id: "patologia-uretral",
    titulo: "Patología uretral femenina",
    resumen:
      "Dentro de la patología uretral femenina se encuentran diferentes alteraciones que pueden producir síntomas urinarios, molestias locales u otras manifestaciones del tracto urinario inferior.",
    articulo:
      "La evaluación de la patología uretral requiere considerar los síntomas, los antecedentes y los hallazgos del examen físico. Entre las entidades que forman parte del abordaje uroginecológico se encuentran el divertículo uretral, los quistes y las carúnculas uretrales. El diagnóstico y tratamiento dependen de la entidad específica y de las características clínicas de cada paciente. AUGA incluye estas patologías dentro de los contenidos de su formación específica en uroginecología.",
    palabrasClave: [
      "uretra",
      "patología uretral",
      "divertículo uretral",
      "quiste uretral",
      "carúncula",
      "síntomas urinarios",
    ],
    fuente: {
      nombre:
        "AUGA — Curso de Formación en Uroginecología y Disfunciones del Piso Pelviano",
      url: "https://www.auga.com.ar/cursos.html",
    },
  },
  {
    id: "incontinencia-anal",
    titulo: "Incontinencia anal",
    resumen:
      "La incontinencia anal se refiere a la pérdida involuntaria de gases o materia fecal y constituye una disfunción relevante dentro de la evaluación integral del piso pelviano.",
    articulo:
      "La incontinencia anal puede afectar significativamente la calidad de vida y puede presentarse en asociación con otras alteraciones del piso pelviano. La International Continence Society define la incontinencia anal como la pérdida involuntaria de flatos o materia fecal. Su evaluación requiere una historia clínica detallada y un examen orientado a determinar los mecanismos involucrados y las alteraciones asociadas.",
    palabrasClave: [
      "incontinencia anal",
      "incontinencia fecal",
      "pérdida de materia fecal",
      "pérdida de gases",
      "piso pelviano",
      "esfínter anal",
    ],
    fuente: {
      nombre:
        "International Continence Society — ICS Glossary: Anal Incontinence",
      url: "https://www.ics.org/glossary/symptom/analincontinence",
    },
  },
];

export default function PatologiasPage() {
  const [busqueda, setBusqueda] = useState("");
  const [abiertas, setAbiertas] = useState<Set<string>>(new Set());

  const resultados = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase();

    if (!termino) {
      return patologias;
    }

    return patologias.filter((patologia) => {
      const contenido = [
        patologia.titulo,
        patologia.resumen,
        patologia.articulo,
        ...patologia.palabrasClave,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return contenido.includes(termino);
    });
  }, [busqueda]);

  const toggleArticulo = (id: string) => {
    setAbiertas((actuales) => {
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
            Uroginecología
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Patologías
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Información médica y científica sobre las principales patologías
            relacionadas con la uroginecología y las disfunciones del piso
            pelviano.
          </p>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500">
            Contenido orientado a profesionales y público interesado en
            información científica. No reemplaza la evaluación de un
            profesional de la salud.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="sticky top-[68px] z-30 bg-white pb-8 pt-2">
          <label
            htmlFor="buscar-patologia"
            className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
          >
            Buscar patología
          </label>

          <div className="relative">
            <input
              id="buscar-patologia"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar por nombre o palabra clave..."
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
              ? "patología encontrada"
              : "patologías encontradas"}
          </p>
        </div>

        <div>
          {resultados.length === 0 ? (
            <div className="border border-slate-200 bg-slate-50 px-6 py-12 text-center">
              <p className="text-sm font-medium text-slate-700">
                No encontramos patologías que coincidan con tu búsqueda.
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
            resultados.map((patologia, index) => {
              const abierta = abiertas.has(patologia.id);

              return (
                <div key={patologia.id}>
                  {index > 0 && <WaveDivider />}

                  <article className="py-12 first:pt-6">
                    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                          Patología
                        </p>

                        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                          {patologia.titulo}
                        </h2>

                        <p className="mt-5 text-base leading-8 text-slate-600">
                          {patologia.resumen}
                        </p>

                        {abierta && (
                          <div className="mt-8 border-t border-slate-200 pt-8">
                            <p className="text-base leading-8 text-slate-700">
                              {patologia.articulo}
                            </p>

                            <div className="mt-8 border-l-2 border-cyan-500 bg-slate-50 px-5 py-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                                Fuente
                              </p>

                              <a
                                href={patologia.fuente.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 block text-sm font-medium leading-6 text-slate-700 transition-colors hover:text-cyan-600"
                              >
                                {patologia.fuente.nombre}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="lg:flex lg:items-start lg:justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            toggleArticulo(patologia.id)
                          }
                          aria-expanded={abierta}
                          className="inline-flex h-11 items-center justify-center border border-slate-300 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 transition-all hover:border-cyan-500 hover:bg-cyan-500 hover:text-white"
                        >
                          {abierta ? "Cerrar artículo" : "Leer más"}
                        </button>
                      </div>
                    </div>

                    {!abierta && (
                      <div className="mt-8 flex flex-wrap gap-2">
                        {patologia.palabrasClave
                          .slice(0, 4)
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
        </div>
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