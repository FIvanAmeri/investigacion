import { redirect } from "next/navigation";
import { obtenerUsuarioDashboard } from "@/lib/dashboard";

export default async function SistemasDashboardPage() {
  const usuario =
    await obtenerUsuarioDashboard();

  if (!usuario) {
    redirect("/zona-investigadores");
  }

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
        Plataforma
      </p>

      <h1 className="mt-3 text-3xl font-semibold text-slate-950">
        Sistemas
      </h1>

      <p className="mt-3 max-w-2xl text-slate-600">
        Acá se mostrarán los sistemas disponibles
        según los permisos de cada usuario.
      </p>
    </section>
  );
}