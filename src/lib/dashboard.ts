import { getSession } from "@/lib/auth";
import { getDatabase } from "@/lib/db";
import { RolUsuario, User } from "@/entities/Usuario";

export async function obtenerUsuarioDashboard(): Promise<User | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const database = await getDatabase();

  const usuarios = await database.query<
    {
      id: number;
      nombre: string;
      apellido: string;
      localidad: string;
      centro_medico: string;
      especialidad: string;
      correo: string;
      password: string;
      estado: string;
      rol: string;
      correo_verificado: boolean;
      es_super_admin: boolean;
      token_verificacion: string | null;
      token_recuperacion: string | null;
      token_recuperacion_expira: Date | null;
      created_at: Date;
      updated_at: Date;
    }[]
  >(
    `
      SELECT
        id,
        nombre,
        apellido,
        localidad,
        centro_medico,
        especialidad,
        correo,
        password,
        estado,
        rol,
        correo_verificado,
        es_super_admin,
        token_verificacion,
        token_recuperacion,
        token_recuperacion_expira,
        created_at,
        updated_at
      FROM usuarios
      WHERE id = $1
      LIMIT 1
    `,
    [session.userId],
  );

  const usuario = usuarios[0];

  if (!usuario) {
    return null;
  }

  return {
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    localidad: usuario.localidad,
    centroMedico: usuario.centro_medico,
    especialidad: usuario.especialidad,
    correo: usuario.correo,
    password: usuario.password,
    estado: usuario.estado as User["estado"],
    rol: usuario.rol as User["rol"],
    correoVerificado: usuario.correo_verificado,
    esSuperAdmin: usuario.es_super_admin,
    tokenVerificacion: usuario.token_verificacion,
    tokenRecuperacion: usuario.token_recuperacion,
    tokenRecuperacionExpira:
      usuario.token_recuperacion_expira,
    createdAt: usuario.created_at,
    updatedAt: usuario.updated_at,
  };
}

export async function obtenerSuperAdminDashboard(): Promise<User | null> {
  const usuario = await obtenerUsuarioDashboard();

  if (!usuario || !usuario.esSuperAdmin) {
    return null;
  }

  return usuario;
}

export function puedeAccederDashboard(
  usuario: User,
): boolean {
  return (
    usuario.esSuperAdmin ||
    usuario.rol === RolUsuario.INVESTIGADOR ||
    usuario.rol === RolUsuario.COLABORADOR
  );
}