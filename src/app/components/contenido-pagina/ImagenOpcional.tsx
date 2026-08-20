import Image from "next/image";

import { imagenPrincipal } from "./contenidoPaginaHelpers";
import { SeccionPublica } from "./contenidoPaginaTipos";

export default function ImagenOpcional({
  seccion,
}: {
  seccion: SeccionPublica;
}) {
  const principal = imagenPrincipal(seccion);

  if (!principal) {
    return null;
  }

  return (
    <div className="relative mt-8 overflow-hidden border border-slate-200 bg-slate-100">
      <Image
        src={principal.url}
        alt={
          principal.alt ||
          seccion.titulo
        }
        width={1200}
        height={700}
        className="h-auto w-full object-cover"
      />
    </div>
  );
}