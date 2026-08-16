import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import ZonaInvestigadoresForm from "./ZonaInvestigadoresForm";

export default async function ZonaInvestigadoresPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return <ZonaInvestigadoresForm />;
}