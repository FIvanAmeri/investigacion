import {
  configuracion,
  tieneFuente,
} from "./contenidoPaginaHelpers";
import { SeccionPublica } from "./contenidoPaginaTipos";

export default function Fuente({
  seccion,
  compact = false,
}: {
  seccion: SeccionPublica;
  compact?: boolean;
}) {
  const config = configuracion(seccion);

  if (!tieneFuente(seccion)) {
    return null;
  }

  const contenido = (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
        Fuente
      </p>

      {config.fuenteUrl ? (
        <a
          href={config.fuenteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block text-sm leading-6 text-slate-700 transition-colors hover:text-cyan-600"
        >
          {config.fuenteNombre}
        </a>
      ) : (
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {config.fuenteNombre}
        </p>
      )}
    </>
  );

  return (
    <div
      className={`${
        compact ? "mt-6" : "mt-8"
      } border-l-2 border-cyan-500 bg-slate-50 px-5 py-4`}
    >
      {contenido}
    </div>
  );
}