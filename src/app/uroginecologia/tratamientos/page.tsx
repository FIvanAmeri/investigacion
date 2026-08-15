"use client";

import { useMemo, useState } from "react";

interface Fuente {
  nombre: string;
  url: string;
}

interface Tratamiento {
  id: string;
  titulo: string;
  resumen: string;
  articulo: string;
  palabrasClave: string[];
  fuente: Fuente;
}

const tratamientos: Tratamiento[] = [
  {
    id: "rehabilitacion-piso-pelvico",
    titulo: "Rehabilitación del piso pélvico",
    resumen:
      "La rehabilitación del piso pélvico comprende diferentes estrategias destinadas a mejorar la función de la musculatura y la coordinación del piso pelviano. Constituye una herramienta fundamental dentro del tratamiento conservador de diversas disfunciones uroginecológicas.",
    articulo:
      "La rehabilitación del piso pélvico puede formar parte del tratamiento de distintas disfunciones uroginecológicas, particularmente de algunos tipos de incontinencia urinaria y de determinadas alteraciones del piso pelviano. El abordaje puede incluir ejercicios de la musculatura del piso pélvico, reeducación funcional, fisioterapia y otras estrategias seleccionadas de acuerdo con la evaluación clínica. La indicación debe individualizarse según los síntomas, la función muscular y las características de cada paciente. AUGA incluye los principios de rehabilitación funcional uroginecológica y el manejo conservador de las patologías del piso pélvico dentro de su formación específica.",
    palabrasClave: [
      "rehabilitación",
      "piso pélvico",
      "piso pelviano",
      "ejercicios",
      "Kegel",
      "fisioterapia",
      "incontinencia urinaria",
      "tratamiento conservador",
    ],
    fuente: {
      nombre:
        "AUGA — Asociación Uroginecológica Argentina: Contenidos académicos de Uroginecología",
      url: "https://www.auga.com.ar/acreditacion-contenidos-academicos.html",
    },
  },
  {
    id: "tratamiento-incontinencia-esfuerzo",
    titulo: "Tratamiento de la incontinencia urinaria de esfuerzo",
    resumen:
      "El tratamiento de la incontinencia urinaria de esfuerzo se selecciona según la intensidad de los síntomas, el impacto sobre la calidad de vida y las características clínicas de cada paciente. Puede incluir medidas conservadoras y, en casos seleccionados, procedimientos quirúrgicos.",
    articulo:
      "El abordaje inicial puede incluir medidas conservadoras y rehabilitación de la musculatura del piso pélvico. Cuando estas estrategias no son suficientes o cuando las características clínicas de la paciente lo justifican, pueden considerarse alternativas quirúrgicas. Entre los procedimientos contemplados en la práctica uroginecológica se encuentran las técnicas con sling y otras alternativas quirúrgicas para la incontinencia de esfuerzo. La selección del tratamiento debe realizarse luego de una evaluación clínica adecuada y considerando los beneficios y riesgos de cada alternativa.",
    palabrasClave: [
      "incontinencia de esfuerzo",
      "incontinencia urinaria",
      "sling",
      "tratamiento quirúrgico",
      "rehabilitación",
      "piso pélvico",
      "tratamiento conservador",
    ],
    fuente: {
      nombre:
        "Sociedad Argentina de Urología — Algoritmo Urológico Nacional para el Diagnóstico y Tratamiento de la Incontinencia de Orina Femenina",
      url: "https://www.sau-net.org/publicaciones/lineamientos-diagnostico-tratamiento",
    },
  },
  {
    id: "vejiga-hiperactiva",
    titulo: "Tratamiento de la vejiga hiperactiva",
    resumen:
      "El tratamiento de la vejiga hiperactiva busca disminuir la urgencia miccional, la frecuencia urinaria y, cuando está presente, la incontinencia asociada a la urgencia.",
    articulo:
      "El manejo puede incluir medidas conductuales y rehabilitación del piso pélvico. Según la evaluación clínica y la respuesta al tratamiento inicial, pueden indicarse tratamientos farmacológicos. En pacientes seleccionadas también pueden considerarse tratamientos avanzados, entre ellos la neuroestimulación. El Hospital Posadas documenta la utilización de neuroestimulación del nervio tibial posterior en pacientes con vejiga hiperactiva e incontinencia de orina. AUGA también contempla dentro de su formación el tratamiento conservador y farmacológico de la incontinencia de urgencia, además de Botox y neuroestimulación sacra.",
    palabrasClave: [
      "vejiga hiperactiva",
      "urgencia miccional",
      "incontinencia de urgencia",
      "frecuencia urinaria",
      "tratamiento farmacológico",
      "neuroestimulación",
      "Botox",
    ],
    fuente: {
      nombre:
        "Hospital Posadas — Realización de neuroestimulación en el Hospital Posadas",
      url: "https://www.argentina.gob.ar/node/311284",
    },
  },
  {
    id: "neuromodulacion",
    titulo: "Neuroestimulación",
    resumen:
      "La neuroestimulación constituye una alternativa terapéutica utilizada en determinadas pacientes con síntomas urinarios persistentes, particularmente en cuadros de vejiga hiperactiva e incontinencia de orina.",
    articulo:
      "La neuroestimulación puede utilizarse como parte del tratamiento de determinados trastornos funcionales del tracto urinario inferior. En el Hospital Posadas se realiza neuroestimulación del nervio tibial posterior en forma ambulatoria para pacientes con vejiga hiperactiva e incontinencia de orina, entre otras indicaciones. La selección de esta alternativa depende de la evaluación médica y de la respuesta a otras estrategias terapéuticas. AUGA incluye además la neuroestimulación sacra dentro de los tratamientos de la incontinencia de orina de urgencia.",
    palabrasClave: [
      "neuroestimulación",
      "neuromodulación",
      "nervio tibial posterior",
      "vejiga hiperactiva",
      "incontinencia de urgencia",
      "incontinencia urinaria",
    ],
    fuente: {
      nombre:
        "Argentina.gob.ar — Hospital Posadas: Realización de neuroestimulación",
      url: "https://www.argentina.gob.ar/node/311284",
    },
  },
  {
    id: "pesarios-prolapso",
    titulo: "Pesarios para el prolapso de órganos pélvicos",
    resumen:
      "Los pesarios son dispositivos que se colocan en la vagina y pueden utilizarse como alternativa no quirúrgica para determinadas pacientes con prolapso de órganos pélvicos.",
    articulo:
      "El tratamiento del prolapso debe individualizarse según los síntomas, el grado de descenso, las características anatómicas y las preferencias de la paciente. El manejo conservador puede incluir el uso de pesarios y rehabilitación del piso pélvico. Los pesarios pueden ayudar a sostener los órganos pélvicos y disminuir los síntomas en pacientes seleccionadas. Su indicación y seguimiento deben realizarse mediante evaluación profesional, ya que el tipo de dispositivo y los controles necesarios dependen de cada caso.",
    palabrasClave: [
      "pesario",
      "pesarios",
      "prolapso",
      "órganos pélvicos",
      "prolapso vaginal",
      "tratamiento conservador",
      "piso pélvico",
    ],
    fuente: {
      nombre:
        "Ministerio de Salud de la Nación — Glosario de Procedimientos en Salud",
      url: "https://www.argentina.gob.ar/sites/default/files/serie1nro25.pdf",
    },
  },
  {
    id: "cirugia-prolapso",
    titulo: "Tratamiento quirúrgico del prolapso",
    resumen:
      "La cirugía constituye una alternativa terapéutica para determinadas pacientes con prolapso de órganos pélvicos, especialmente cuando los síntomas son relevantes o cuando las opciones conservadoras no resultan adecuadas.",
    articulo:
      "El tratamiento quirúrgico del prolapso busca corregir los defectos anatómicos responsables del descenso de los órganos pélvicos y aliviar los síntomas asociados. Las técnicas pueden variar según el compartimento afectado, el tipo de prolapso, los antecedentes de la paciente y los objetivos del tratamiento. La documentación oficial argentina contempla procedimientos quirúrgicos reconstructivos para diferentes formas de prolapso. La indicación debe surgir de una evaluación uroginecológica completa y de una discusión individualizada de los beneficios, riesgos y alternativas.",
    palabrasClave: [
      "prolapso",
      "cirugía",
      "cirugía reconstructiva",
      "colpoplastia",
      "prolapso anterior",
      "prolapso posterior",
      "prolapso apical",
    ],
    fuente: {
      nombre:
        "Argentina.gob.ar — Programa de Pasantía en Urodinamia y Disfunciones del Piso Pélvico",
      url: "https://www.argentina.gob.ar/sites/default/files/2019/07/pasantia_en_urodinamia_y_disfunciones_del_piso_pelvico.pdf",
    },
  },
  {
    id: "tratamiento-farmacologico",
    titulo: "Tratamiento farmacológico",
    resumen:
      "Los medicamentos forman parte de las alternativas terapéuticas disponibles para determinados trastornos uroginecológicos, especialmente algunos cuadros de vejiga hiperactiva e incontinencia urinaria de urgencia.",
    articulo:
      "El tratamiento farmacológico se indica luego de establecer el diagnóstico y valorar las características particulares de cada paciente. En la incontinencia urinaria de urgencia y la vejiga hiperactiva pueden utilizarse medicamentos dirigidos a disminuir los síntomas urinarios. La elección del fármaco, la dosis, la duración y el seguimiento deben ser definidos por un profesional de la salud, considerando posibles contraindicaciones, efectos adversos e interacciones. AUGA contempla específicamente el tratamiento farmacológico de la incontinencia de orina de urgencia dentro de su formación en uroginecología.",
    palabrasClave: [
      "medicación",
      "tratamiento farmacológico",
      "vejiga hiperactiva",
      "urgencia",
      "incontinencia de urgencia",
      "fármacos",
    ],
    fuente: {
      nombre:
        "AUGA — Asociación Uroginecológica Argentina: Curso de Formación en Uroginecología",
      url: "https://www.auga.com.ar/cursos.html",
    },
  },
];

export default function TratamientosPage() {
  const [busqueda, setBusqueda] = useState("");
  const [abiertos, setAbiertos] = useState<Set<string>>(new Set());

  const resultados = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase();

    if (!termino) {
      return tratamientos;
    }

    return tratamientos.filter((tratamiento) => {
      const contenido = [
        tratamiento.titulo,
        tratamiento.resumen,
        tratamiento.articulo,
        ...tratamiento.palabrasClave,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return contenido.includes(termino);
    });
  }, [busqueda]);

  const toggleArticulo = (id: string) => {
    setAbiertos((actuales) => {
      const nuevos = new Set(actuales);

      if (nuevos.has(id)) {
        nuevos.delete(id);
      } else {
        nuevos.add(id);
      }

      return nuevos;
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
            Tratamientos
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Información sobre las principales alternativas terapéuticas
            utilizadas en el abordaje de las disfunciones uroginecológicas y
            del piso pélvico.
          </p>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500">
            El contenido tiene finalidad informativa y académica y no
            reemplaza la evaluación, indicación ni seguimiento de un
            profesional de la salud.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="sticky top-[68px] z-30 bg-white pb-8 pt-2">
          <label
            htmlFor="buscar-tratamiento"
            className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
          >
            Buscar tratamiento
          </label>

          <div className="relative">
            <input
              id="buscar-tratamiento"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar por tratamiento o palabra clave..."
              className="h-14 w-full border border-slate-300 bg-white px-5 pr-12 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500"
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
              ? "tratamiento encontrado"
              : "tratamientos encontrados"}
          </p>
        </div>

        <div>
          {resultados.length === 0 ? (
            <div className="border border-slate-200 bg-slate-50 px-6 py-12 text-center">
              <p className="text-sm font-medium text-slate-700">
                No encontramos tratamientos que coincidan con tu búsqueda.
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
            resultados.map((tratamiento, index) => {
              const abierto = abiertos.has(tratamiento.id);

              return (
                <div key={tratamiento.id}>
                  {index > 0 && <WaveDivider />}

                  <article className="py-12 first:pt-6">
                    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                          Tratamiento
                        </p>

                        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                          {tratamiento.titulo}
                        </h2>

                        <p className="mt-5 text-base leading-8 text-slate-600">
                          {tratamiento.resumen}
                        </p>

                        {abierto && (
                          <div className="mt-8 border-t border-slate-200 pt-8">
                            <p className="text-base leading-8 text-slate-700">
                              {tratamiento.articulo}
                            </p>

                            <div className="mt-8 border-l-2 border-cyan-500 bg-slate-50 px-5 py-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                                Fuente argentina
                              </p>

                              <a
                                href={tratamiento.fuente.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 block text-sm font-medium leading-6 text-slate-700 transition-colors hover:text-cyan-600"
                              >
                                {tratamiento.fuente.nombre}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="lg:flex lg:items-start lg:justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            toggleArticulo(tratamiento.id)
                          }
                          aria-expanded={abierto}
                          className="inline-flex h-11 items-center justify-center border border-slate-300 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 transition-all hover:border-cyan-500 hover:bg-cyan-500 hover:text-white"
                        >
                          {abierto
                            ? "Cerrar artículo"
                            : "Leer más"}
                        </button>
                      </div>
                    </div>

                    {!abierto && (
                      <div className="mt-8 flex flex-wrap gap-2">
                        {tratamiento.palabrasClave
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