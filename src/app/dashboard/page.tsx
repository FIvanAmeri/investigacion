import Link from "next/link";
import { redirect } from "next/navigation";
import { RolUsuario } from "@/entities/Usuario";
import { obtenerUsuarioDashboard } from "@/lib/dashboard";
import { getDatabase } from "@/lib/db";

interface SistemaAsignado {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
}

export default async function DashboardPage() {
  const usuario =
    await obtenerUsuarioDashboard();

  if (!usuario) {
    redirect("/zona-investigadores");
  }

  const database = await getDatabase();

  let sistemas: SistemaAsignado[];

  if (usuario.esSuperAdmin) {
    sistemas =
      await database.query<SistemaAsignado[]>(
        `
          SELECT
            id,
            nombre,
            slug,
            descripcion
          FROM sistemas
          WHERE activo = true
          ORDER BY orden ASC, id ASC
        `,
      );
  } else {
    sistemas =
      await database.query<SistemaAsignado[]>(
        `
          SELECT
            s.id,
            s.nombre,
            s.slug,
            s.descripcion
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

  if (usuario.esSuperAdmin) {
    return (
      <section className="space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
            Administración
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-slate-950">
            Dashboard del SuperAdmin
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Desde este espacio podés administrar los
            usuarios, los sistemas y el contenido
            general de la plataforma.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <DashboardCard
            href="/dashboard/usuarios"
            etiqueta="Administración"
            titulo="Usuarios"
            descripcion="Aprobá o rechazá solicitudes, asigná roles y vinculá usuarios con uno o varios sistemas."
          />

          <DashboardCard
            href="/dashboard/sistemas"
            etiqueta="Plataforma"
            titulo="Sistemas"
            descripcion="Administrá los sistemas disponibles y supervisá sus espacios de trabajo."
          />

          <DashboardCard
            href="/dashboard/contenido"
            etiqueta="Sitio público"
            titulo="Contenido"
            descripcion="Administrá menús, submenús y secciones del sitio público."
          />
        </div>

        <section>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Sistemas activos
              </p>

              <h2 className="mt-2 text-xl font-semibold text-slate-950">
                Sistemas de la plataforma
              </h2>
            </div>

            <Link
              href="/dashboard/sistemas"
              className="text-sm font-semibold text-cyan-700 hover:text-cyan-900"
            >
              Ver todos →
            </Link>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sistemas.map((sistema) => (
              <div
                key={sistema.id}
                className="border border-slate-200 bg-white p-5"
              >
                <h3 className="font-semibold text-slate-950">
                  {sistema.nombre}
                </h3>

                {sistema.descripcion && (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {sistema.descripcion}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </section>
    );
  }

  const esInvestigador =
    usuario.rol ===
    RolUsuario.INVESTIGADOR;

  return (
    <section className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
          {esInvestigador
            ? "Investigación"
            : "Colaboración"}
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-slate-950">
          Bienvenido, {usuario.nombre}
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          {esInvestigador
            ? "Desde este dashboard podés acceder a los sistemas asignados y trabajar con la información habilitada para investigadores."
            : "Desde este dashboard podés acceder a los sistemas asignados y trabajar con la información correspondiente a tu participación."}
        </p>
      </div>

      <section>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
            Sistemas asignados
          </p>

          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            {sistemas.length === 0
              ? "No hay sistemas asignados"
              : "Tus sistemas"}
          </h2>
        </div>

        {sistemas.length === 0 ? (
          <div className="mt-5 border border-slate-200 bg-white p-6">
            <p className="text-sm leading-6 text-slate-600">
              Todavía no tenés ningún sistema
              asignado. El administrador deberá
              vincular tu cuenta con un sistema
              para que puedas comenzar a trabajar.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sistemas.map((sistema) => (
              <div
                key={sistema.id}
                className="border border-slate-200 bg-white p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-600">
                  Sistema asignado
                </p>

                <h3 className="mt-3 text-lg font-semibold text-slate-950">
                  {sistema.nombre}
                </h3>

                {sistema.descripcion && (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {sistema.descripcion}
                  </p>
                )}

                <Link
                  href="/dashboard/sistemas"
                  className="mt-5 inline-flex text-sm font-semibold text-cyan-700 hover:text-cyan-900"
                >
                  Acceder →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="border border-slate-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-600">
            Tu rol
          </p>

          <h2 className="mt-3 text-lg font-semibold text-slate-950">
            {esInvestigador
              ? "Investigador"
              : "Colaborador"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {esInvestigador
              ? "Podrás consultar y trabajar con la información habilitada para investigadores dentro de los sistemas que tengas asignados."
              : "Podrás trabajar con la información habilitada para colaboradores dentro de los sistemas que tengas asignados."}
          </p>
        </div>

        <div className="border border-slate-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-600">
            Permisos
          </p>

          <h2 className="mt-3 text-lg font-semibold text-slate-950">
            Acceso según sistema y rol
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Los datos y herramientas disponibles
            estarán determinados por tu rol y por
            los sistemas que tengas asignados.
          </p>
        </div>
      </section>
    </section>
  );
}

interface DashboardCardProps {
  href: string;
  etiqueta: string;
  titulo: string;
  descripcion: string;
}

function DashboardCard({
  href,
  etiqueta,
  titulo,
  descripcion,
}: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="border border-slate-200 bg-white p-6 transition hover:border-cyan-300 hover:shadow-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-600">
        {etiqueta}
      </p>

      <h2 className="mt-3 text-lg font-semibold text-slate-950">
        {titulo}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {descripcion}
      </p>

      <p className="mt-5 text-sm font-semibold text-cyan-700">
        Administrar →
      </p>
    </Link>
  );
}