"use client";

import { useMemo, useState } from "react";

interface Recurso {
  id: string;
  categoria: string;
  titulo: string;
  descripcion: string;
  contenido: string;
  fuente: string;
  url: string;
  palabrasClave: string[];
}

const recursos: Recurso[] = [
  {
    id: "curso-formacion-uroginecologia",
    categoria: "Formación",
    titulo:
      "Curso de Formación en Uroginecología y Disfunciones del Piso Pelviano",
    descripcion:
      "Propuesta de formación de AUGA destinada a profesionales en formación y especialistas interesados en profundizar sus conocimientos en uroginecología.",
    contenido:
      "El curso aborda anatomía funcional del piso pelviano, fisiología de la micción y la defecación, epidemiología y clasificación de las disfunciones uroginecológicas, estudios diagnósticos, cuestionarios validados, urodinamia, incontinencia urinaria, prolapso de órganos pélvicos y diferentes patologías del área. También contempla abordajes conservadores y quirúrgicos y una perspectiva basada en la evidencia.",
    fuente:
      "Asociación Uroginecológica Argentina (AUGA)",
    url: "https://www.auga.com.ar/cursos.html",
    palabrasClave: [
      "curso",
      "formación",
      "uroginecología",
      "piso pelviano",
      "urodinamia",
      "incontinencia",
      "prolapso",
    ],
  },
  {
    id: "contenidos-academicos-auga",
    categoria: "Formación",
    titulo: "Contenidos académicos de Uroginecología",
    descripcion:
      "Referencia académica de AUGA sobre las competencias y conocimientos vinculados con la formación en uroginecología.",
    contenido:
      "Los contenidos académicos incluyen conocimientos sobre anatomía, fisiología y neurofisiología del piso pélvico femenino, fisiopatología, metodología de investigación e interpretación crítica de trabajos científicos. También contemplan evaluación clínica, pruebas diagnósticas, evaluación urodinámica, manejo conservador, rehabilitación funcional, métodos complementarios de diagnóstico y conocimientos relacionados con los tratamientos médicos.",
    fuente:
      "Asociación Uroginecológica Argentina (AUGA)",
    url: "https://auga.com.ar/acreditacion-contenidos-academicos.html",
    palabrasClave: [
      "formación",
      "investigación",
      "evidencia",
      "diagnóstico",
      "urodinamia",
      "rehabilitación",
      "tratamiento",
    ],
  },
  {
    id: "lineamientos-sau",
    categoria: "Guías y consensos",
    titulo: "Lineamientos de diagnóstico y tratamiento",
    descripcion:
      "Repositorio de la Sociedad Argentina de Urología que reúne guías, consensos y recomendaciones nacionales relacionadas con diferentes patologías urológicas.",
    contenido:
      "La Sociedad Argentina de Urología mantiene un repositorio de lineamientos de diagnóstico y tratamiento que incluye, entre otros documentos, el Consenso Argentino Intersociedades de Infección Urinaria y el Algoritmo Urológico Nacional para el Diagnóstico y Tratamiento de la Incontinencia de Orina Femenina. Los documentos permiten consultar recomendaciones elaboradas dentro del ámbito científico argentino.",
    fuente:
      "Sociedad Argentina de Urología (SAU)",
    url: "https://www.sau-net.org/publicaciones/lineamientos-diagnostico-tratamiento",
    palabrasClave: [
      "guías",
      "consensos",
      "diagnóstico",
      "tratamiento",
      "incontinencia",
      "infección urinaria",
      "recomendaciones",
    ],
  },
  {
    id: "revista-sau",
    categoria: "Publicaciones",
    titulo: "Revista de la Sociedad Argentina de Urología",
    descripcion:
      "Publicación científica de la Sociedad Argentina de Urología destinada a la difusión de conocimiento científico dentro de la especialidad.",
    contenido:
      "La Revista de la Sociedad Argentina de Urología constituye uno de los canales de publicación científica de la institución. Es un recurso para consultar trabajos y contenidos académicos vinculados con la urología y áreas relacionadas, dentro del ámbito de una sociedad científica argentina.",
    fuente:
      "Sociedad Argentina de Urología (SAU)",
    url: "https://www.sau-net.org/publicaciones/revista-sau",
    palabrasClave: [
      "revista",
      "publicaciones",
      "investigación",
      "artículos científicos",
      "urología",
      "evidencia",
    ],
  },
  {
    id: "boletin-sau",
    categoria: "Publicaciones",
    titulo: "Boletín de la Sociedad Argentina de Urología",
    descripcion:
      "Publicación periódica de la SAU con información científica, académica e institucional de la especialidad.",
    contenido:
      "El Boletín Informativo de la Sociedad Argentina de Urología reúne publicaciones periódicas y novedades científicas de la institución. Su archivo permite consultar diferentes ediciones y acceder a información relacionada con actividades académicas, publicaciones y novedades de la comunidad urológica argentina.",
    fuente:
      "Sociedad Argentina de Urología (SAU)",
    url: "https://www.sau-net.org/publicaciones/boletin-sau",
    palabrasClave: [
      "boletín",
      "publicaciones",
      "novedades",
      "ciencia",
      "urología",
      "actualización",
    ],
  },
  {
    id: "webinars-auga",
    categoria: "Formación",
    titulo: "Webinars AUGA",
    descripcion:
      "Biblioteca de seminarios y actividades virtuales de la Asociación Uroginecológica Argentina.",
    contenido:
      "AUGA dispone de una sección de webinars que reúne actividades educativas sobre distintos temas de uroginecología. Entre los contenidos disponibles se encuentran discusiones sobre tratamientos, análisis crítico de trabajos científicos, láser en uroginecología y otros temas relacionados con la especialidad.",
    fuente:
      "Asociación Uroginecológica Argentina (AUGA)",
    url: "https://www.auga.com.ar/webinars.html",
    palabrasClave: [
      "webinar",
      "seminario",
      "formación",
      "uroginecología",
      "investigación",
      "tratamientos",
    ],
  },
  {
    id: "congresos-auga",
    categoria: "Eventos científicos",
    titulo: "Congresos y actividades científicas AUGA",
    descripcion:
      "Información sobre congresos, jornadas y actividades científicas organizadas o difundidas por AUGA.",
    contenido:
      "AUGA organiza y comunica actividades científicas relacionadas con la uroginecología, incluyendo congresos, jornadas y cursos precongreso. Estas actividades constituyen un recurso para mantenerse actualizado sobre temas de la especialidad y conocer propuestas de formación e intercambio científico.",
    fuente:
      "Asociación Uroginecológica Argentina (AUGA)",
    url: "https://auga.com.ar/congresos.html",
    palabrasClave: [
      "congreso",
      "jornadas",
      "eventos",
      "formación",
      "uroginecología",
      "actualización",
    ],
  },
  {
    id: "videoteca-sau",
    categoria: "Material audiovisual",
    titulo: "Videoteca Virtual de Uro-Laparoscopía",
    descripcion:
      "Recurso audiovisual de la Sociedad Argentina de Urología destinado a la difusión de contenidos quirúrgicos y educativos.",
    contenido:
      "La Sociedad Argentina de Urología dispone de una videoteca virtual como parte de sus recursos de publicación y formación. El material audiovisual complementa las publicaciones y documentos científicos y permite acceder a contenidos relacionados con procedimientos y práctica urológica.",
    fuente:
      "Sociedad Argentina de Urología (SAU)",
    url: "https://www.sau-net.org/publicaciones/videoteca-virtual-de-uro-laparoscopia",
    palabrasClave: [
      "videoteca",
      "videos",
      "cirugía",
      "uro-laparoscopía",
      "formación",
      "material audiovisual",
    ],
  },
];

const categorias = [
  "Todos",
  "Guías y consensos",
  "Publicaciones",
  "Formación",
  "Eventos científicos",
  "Material audiovisual",
];

export default function RecursosPage() {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [abiertos, setAbiertos] = useState<Set<string>>(new Set());

  const resultados = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase();

    return recursos.filter((recurso) => {
      const coincideCategoria =
        categoria === "Todos" ||
        recurso.categoria === categoria;

      if (!coincideCategoria) {
        return false;
      }

      if (!termino) {
        return true;
      }

      const contenido = [
        recurso.titulo,
        recurso.descripcion,
        recurso.contenido,
        recurso.categoria,
        recurso.fuente,
        ...recurso.palabrasClave,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return contenido.includes(termino);
    });
  }, [busqueda, categoria]);

  const toggleRecurso = (id: string) => {
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
            Uroginecología
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Recursos
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Guías, publicaciones, actividades científicas y materiales de
            formación seleccionados de instituciones científicas argentinas
            relacionadas con la uroginecología.
          </p>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500">
            Los recursos enlazan directamente con sus fuentes institucionales
            y pueden estar sujetos a las condiciones de acceso establecidas
            por cada organización.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="sticky top-[68px] z-30 bg-white pb-8 pt-2">
          <label
            htmlFor="buscar-recurso"
            className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
          >
            Buscar recurso
          </label>

          <div className="relative">
            <input
              id="buscar-recurso"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar por título, institución o palabra clave..."
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

          <div className="mt-5 flex flex-wrap gap-2">
            {categorias.map((item) => {
              const activa = categoria === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategoria(item)}
                  className={`border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                    activa
                      ? "border-cyan-500 bg-cyan-500 text-white"
                      : "border-slate-200 bg-white text-slate-500 hover:border-cyan-500 hover:text-cyan-600"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-xs text-slate-500">
            {resultados.length}{" "}
            {resultados.length === 1
              ? "recurso encontrado"
              : "recursos encontrados"}
          </p>
        </div>

        {resultados.length === 0 ? (
          <div className="border border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <p className="text-sm font-medium text-slate-700">
              No encontramos recursos que coincidan con tu búsqueda.
            </p>

            <button
              type="button"
              onClick={() => {
                setBusqueda("");
                setCategoria("Todos");
              }}
              className="mt-4 text-sm font-semibold text-cyan-600 transition-colors hover:text-cyan-700"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <div>
            {resultados.map((recurso, index) => {
              const abierto = abiertos.has(recurso.id);

              return (
                <div key={recurso.id}>
                  {index > 0 && <WaveDivider />}

                  <article className="py-12 first:pt-6">
                    <div className="grid gap-8 lg:grid-cols-[1fr_220px]">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                            {recurso.categoria}
                          </p>

                          <span className="h-1 w-1 rounded-full bg-slate-300" />

                          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                            Argentina
                          </p>
                        </div>

                        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                          {recurso.titulo}
                        </h2>

                        <p className="mt-5 text-base leading-8 text-slate-600">
                          {recurso.descripcion}
                        </p>

                        {abierto && (
                          <div className="mt-8 border-t border-slate-200 pt-8">
                            <p className="text-base leading-8 text-slate-700">
                              {recurso.contenido}
                            </p>

                            <div className="mt-8 border-l-2 border-cyan-500 bg-slate-50 px-5 py-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                                Fuente institucional
                              </p>

                              <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                                {recurso.fuente}
                              </p>

                              <a
                                href={recurso.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex text-sm font-semibold text-cyan-600 transition-colors hover:text-cyan-700"
                              >
                                Ver recurso oficial
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="lg:flex lg:items-start lg:justify-end">
                        <button
                          type="button"
                          onClick={() => toggleRecurso(recurso.id)}
                          aria-expanded={abierto}
                          className="inline-flex h-11 items-center justify-center border border-slate-300 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 transition-all hover:border-cyan-500 hover:bg-cyan-500 hover:text-white"
                        >
                          {abierto ? "Cerrar recurso" : "Ver recurso"}
                        </button>
                      </div>
                    </div>

                    {!abierto && (
                      <div className="mt-8 flex flex-wrap gap-2">
                        {recurso.palabrasClave
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
            })}
          </div>
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