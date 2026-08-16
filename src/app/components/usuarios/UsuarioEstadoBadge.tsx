interface UsuarioEstadoBadgeProps {
  estado: "PENDIENTE" | "APROBADO" | "DENEGADO";
}

const estilos = {
  PENDIENTE:
    "border-amber-200 bg-amber-50 text-amber-700",
  APROBADO:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  DENEGADO:
    "border-red-200 bg-red-50 text-red-700",
};

const etiquetas = {
  PENDIENTE: "Pendiente",
  APROBADO: "Aprobado",
  DENEGADO: "Denegado",
};

export default function UsuarioEstadoBadge({
  estado,
}: UsuarioEstadoBadgeProps) {
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-1 text-xs font-semibold ${estilos[estado]}`}
    >
      {etiquetas[estado]}
    </span>
  );
}