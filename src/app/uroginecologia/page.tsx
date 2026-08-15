export default function UroginecologiaPage() {
  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-6 py-24">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Área médica
      </p>

      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
        Uroginecología
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
        Información científica y recursos relacionados con la salud
        uroginecológica.
      </p>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {["Patologías", "Tratamientos", "Recursos"].map((item) => (
          <article
            key={item}
            className="border border-slate-200 p-8"
          >
            <h2 className="text-xl font-semibold text-slate-950">
              {item}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Contenido próximamente disponible.
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}