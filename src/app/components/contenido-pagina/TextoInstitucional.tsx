import Fuente from "./Fuente";
import ImagenesOpcionales from "./ImagenesOpcionales";
import { configuracion } from "./contenidoPaginaHelpers";
import { SeccionPublica } from "./contenidoPaginaTipos";

export default function TextoInstitucional({
  secciones,
}: {
  secciones: SeccionPublica[];
}) {
  return (
    <main className="bg-white">
      {secciones.map((seccion, index) => {
        const config =
          configuracion(seccion);

        return (
          <section
            key={seccion.id}
            className={
              index % 2 === 0
                ? "bg-white"
                : "bg-slate-50"
            }
          >
            <div className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
              <div className="max-w-4xl">
                {config.etiqueta && (
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
                    {config.etiqueta}
                  </p>
                )}

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  {seccion.titulo}
                </h2>

                {config.descripcion && (
                  <p className="mt-3 text-base leading-7 text-slate-600">
                    {config.descripcion}
                  </p>
                )}

                {seccion.contenido && (
                  <div className="mt-4 whitespace-pre-line text-base leading-7 text-slate-700">
                    {seccion.contenido}
                  </div>
                )}

                <ImagenesOpcionales
                  seccion={seccion}
                />

                <Fuente
                  seccion={seccion}
                />
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}