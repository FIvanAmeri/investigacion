import { redirect } from "next/navigation";
import { obtenerUsuarioDashboard } from "@/lib/dashboard";
import { getDatabase } from "@/lib/db";

interface SistemaDashboard {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  url: string | null;
}

export default async function SistemasDashboardPage() {
  const usuario = await obtenerUsuarioDashboard();

  if (!usuario) {
    redirect("/zona-investigadores");
  }

  const database = await getDatabase();

  let sistemas: SistemaDashboard[];

  if (usuario.esSuperAdmin) {
    sistemas = await database.query<SistemaDashboard[]>(
      `
        SELECT
          id,
          nombre,
          slug,
          descripcion,
          url
        FROM sistemas
        WHERE activo = true
        ORDER BY orden ASC, id ASC
      `,
    );
  } else {
    sistemas = await database.query<SistemaDashboard[]>(
      `
        SELECT
          s.id,
          s.nombre,
          s.slug,
          s.descripcion,
          s.url
        FROM sistemas s
        INNER JOIN usuarios_sistemas us
          ON us.sistema_id = s.id
        WHERE us.usuario_id = $1
          AND s.activo = true
        ORDER BY s.orden ASC, s.id ASC
      `,
      [usuario.id],
    );
  }

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
        Plataforma
      </p>

      <h1 className="mt-3 text-3xl font-semibold text-slate-950">
        {usuario.esSuperAdmin
          ? "Todos los sistemas"
          : "Mis sistemas"}
      </h1>

      <p className="mt-3 max-w-2xl text-slate-600">
        {usuario.esSuperAdmin
          ? "Administrá y supervisá los sistemas disponibles en la plataforma."
          : "Accedé a los sistemas que fueron asignados a tu cuenta."}
      </p>

      {sistemas.length === 0 ? (
        <div className="mt-8 border border-slate-200 bg-white p-8">
          <h2 className="text-lg font-semibold text-slate-950">
            No tenés sistemas asignados
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Todavía no hay sistemas asociados a tu cuenta.
            Comunicate con el administrador para solicitar
            acceso.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sistemas.map((sistema) => (
            <div
              key={sistema.id}
              className="border border-slate-200 bg-white p-6 transition hover:border-cyan-300 hover:shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-600">
                Sistema
              </p>

              <h2 className="mt-3 text-xl font-semibold text-slate-950">
                {sistema.nombre}
              </h2>

              {sistema.descripcion && (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {sistema.descripcion}
                </p>
              )}

              {sistema.url && (
                <a
                  href={sistema.url}
                  className="mt-5 inline-flex text-sm font-semibold text-cyan-700 hover:text-cyan-900"
                >
                  Ingresar al sistema →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}