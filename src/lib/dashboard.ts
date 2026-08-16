import { getSession } from "@/lib/auth";
import { getDatabase } from "@/lib/db";
import {
  RolUsuario,
  User,
} from "@/entities/Usuario";

export async function obtenerUsuarioDashboard(): Promise<User | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const database = await getDatabase();

  const repository =
    database.getRepository<User>("User");

  return repository.findOne({
    where: {
      id: session.userId,
    },
  });
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