import { obtenerNavegacionPublica } from "@/lib/contenido";
import NavbarClient from "./NavbarClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Navbar() {
  const navigation =
    await obtenerNavegacionPublica();

  return (
    <NavbarClient
      navigation={navigation}
    />
  );
}