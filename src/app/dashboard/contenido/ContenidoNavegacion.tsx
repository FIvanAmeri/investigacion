import Link from "next/link";

type ContenidoSeccion =
  | "menus"
  | "submenus"
  | "secciones";

interface ContenidoNavegacionProps {
  actual: ContenidoSeccion;
}

const opciones: Array<{
  href: string;
  clave: ContenidoSeccion;
  titulo: string;
  descripcion: string;
}> = [
  {
    href: "/dashboard/contenido/menus",
    clave: "menus",
    titulo: "Menús",
    descripcion: "Elementos principales",
  },
  {
    href: "/dashboard/contenido/submenus",
    clave: "submenus",
    titulo: "Submenús",
    descripcion: "Elementos secundarios",
  },
  {
    href: "/dashboard/contenido/secciones",
    clave: "secciones",
    titulo: "Secciones",
    descripcion: "Contenido de las páginas",
  },
];

export default function ContenidoNavegacion({
  actual,
}: ContenidoNavegacionProps) {
  return (
    <nav className="mt-8 border border-slate-200 bg-white">
      <div className="flex flex-col sm:flex-row">
        {opciones.map((opcion) => {
          const activa =
            opcion.clave === actual;

          return (
            <Link
              key={opcion.clave}
              href={opcion.href}
              className={`flex-1 border-b border-slate-200 px-5 py-4 transition last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 ${
                activa
                  ? "bg-slate-950 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-50 hover:text-cyan-600"
              }`}
            >
              <span
                className={`block text-sm font-semibold ${
                  activa
                    ? "text-white"
                    : "text-slate-950"
                }`}
              >
                {opcion.titulo}
              </span>

              <span
                className={`mt-1 block text-xs ${
                  activa
                    ? "text-slate-300"
                    : "text-slate-500"
                }`}
              >
                {opcion.descripcion}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}