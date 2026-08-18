import { getSession } from "@/lib/auth";

export async function verificarSuperAdmin(): Promise<boolean> {
  const session = await getSession();

  return Boolean(session?.esSuperAdmin);
}