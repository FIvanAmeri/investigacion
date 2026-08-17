import { redirect } from "next/navigation";
import {
  EstadoUsuario,
  RolUsuario,
} from "@/entities/Usuario";
import { obtenerSuperAdminDashboard } from "@/lib/dashboard";
import { getDatabase } from "@/lib/db";
import UsuariosPanel from "@/app/components/usuarios/UsuariosTable";

interface SistemaUsuario {
  id: number;
  nombre: string;
  slug: string;
}

interface UsuarioRow {
  id: number;
  nombre: string;
  apellido: string;
  localidad: string;
  centro_medico: string;
  especialidad: string;
  correo: string;
  estado: string;
  rol: string;
  correo_verificado: boolean;
  es_super_admin: boolean;
  created_at: Date;
}

interface UsuarioSistemaRow {
  sistema_id: number;
}

export default async function UsuariosDashboardPage() {
  const superAdmin =
    await obtenerSuperAdminDashboard();

  if (!superAdmin) {
    redirect("/dashboard");
  }

  const database = await getDatabase();

  const usuarios =
    await database.query<UsuarioRow[]>(
      `
        SELECT
          id,
          nombre,
          apellido,
          localidad,
          centro_medico,
          especialidad,
          correo,
          estado,
          rol,
          correo_verificado,
          es_super_admin,
          created_at
        FROM usuarios
        ORDER BY created_at DESC
      `,
    );

  const sistemas =
    await database.query<SistemaUsuario[]>(
      `
        SELECT
          id,
          nombre,
          slug
        FROM sistemas
        WHERE activo = true
        ORDER BY orden ASC, id ASC
      `,
    );

  const usuariosSerializados =
    await Promise.all(
      usuarios.map(async (usuario) => {
        const asignaciones =
          await database.query<
            UsuarioSistemaRow[]
          >(
            `
              SELECT sistema_id
              FROM usuarios_sistemas
              WHERE usuario_id = $1
            `,
            [usuario.id],
          );

        return {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          localidad: usuario.localidad,
          centroMedico:
            usuario.centro_medico,
          especialidad:
            usuario.especialidad,
          correo: usuario.correo,
          estado:
            usuario.estado as EstadoUsuario,
          rol: usuario.rol as RolUsuario,
          correoVerificado:
            usuario.correo_verificado,
          esSuperAdmin:
            usuario.es_super_admin,
          createdAt:
            usuario.created_at.toISOString(),
          sistemasIds:
            asignaciones.map(
              (asignacion) =>
                asignacion.sistema_id,
            ),
        };
      }),
    );

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
        Administración
      </p>

      <h1 className="mt-3 text-3xl font-semibold text-slate-950">
        Usuarios
      </h1>

      <p className="mt-3 max-w-2xl text-slate-600">
        Revisá los registros, aprobá o rechazá usuarios
        y asignales uno o varios sistemas según su rol.
      </p>

      <div className="mt-8">
        <UsuariosPanel
          usuarios={usuariosSerializados}
          estados={Object.values(EstadoUsuario)}
          roles={[
            RolUsuario.INVESTIGADOR,
            RolUsuario.COLABORADOR,
          ]}
          sistemas={sistemas}
        />
      </div>
    </section>
  );
}