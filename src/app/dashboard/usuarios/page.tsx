import { redirect } from "next/navigation";
import { obtenerSuperAdminDashboard } from "@/lib/dashboard";
import { getDatabase } from "@/lib/db";
import {
  EstadoUsuario,
  RolUsuario,
} from "@/entities/Usuario";
import UsuariosPanel from "@/app/components/usuarios/UsuariosTable";

export default async function UsuariosDashboardPage() {
  const superAdmin =
    await obtenerSuperAdminDashboard();

  if (!superAdmin) {
    redirect("/dashboard");
  }

  const database = await getDatabase();
  const repository = database.getRepository("usuarios");

  const usuarios = await repository.find({
    order: {
      createdAt: "DESC",
    },
  });

  const usuariosSerializados = usuarios.map((usuario) => ({
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    localidad: usuario.localidad,
    centroMedico: usuario.centroMedico,
    especialidad: usuario.especialidad,
    correo: usuario.correo,
    estado: usuario.estado,
    rol: usuario.rol,
    correoVerificado: usuario.correoVerificado,
    esSuperAdmin: usuario.esSuperAdmin,
    createdAt: usuario.createdAt.toISOString(),
  }));

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
        y asigná el dashboard correspondiente.
      </p>

      <div className="mt-8">
        <UsuariosPanel
          usuarios={usuariosSerializados}
          estados={Object.values(EstadoUsuario)}
          roles={[
            RolUsuario.INVESTIGADOR,
            RolUsuario.COLABORADOR,
          ]}
        />
      </div>
    </section>
  );
}