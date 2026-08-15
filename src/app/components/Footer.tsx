export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Investigación en Uroginecología
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
              Espacio dedicado a la investigación, formación y difusión del
              conocimiento científico en uroginecología.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Investigación
            </h3>
            <p className="mt-3 text-sm text-slate-400">
              Líneas de investigación · Proyectos · Publicaciones
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contacto
            </h3>
            <p className="mt-3 text-sm text-slate-400">
              Información institucional y consultas académicas.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-sm text-slate-500">
          © 2026 Investigación en Uroginecología. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
}