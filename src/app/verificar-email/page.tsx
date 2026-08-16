"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function VerificarEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [mensaje, setMensaje] = useState("Verificando tu correo...");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token) {
      setMensaje("El enlace de verificación no es válido.");
      setError(true);
      return;
    }

    const verificar = async () => {
      try {
        const response = await fetch(
          `/api/auth/verify-email?token=${encodeURIComponent(token)}`,
        );

        const data = (await response.json()) as {
          mensaje?: string;
          error?: string;
        };

        if (!response.ok) {
          setMensaje(data.error ?? "No se pudo verificar el correo.");
          setError(true);
          return;
        }

        setMensaje(data.mensaje ?? "Correo confirmado correctamente.");
      } catch {
        setMensaje("No se pudo verificar el correo.");
        setError(true);
      }
    };

    void verificar();
  }, [token]);

  return (
    <main className="flex min-h-[calc(100vh-68px)] items-center justify-center bg-slate-50 px-6">
      <section className="w-full max-w-lg border border-slate-200 bg-white p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
          Investigación
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          {error ? "No pudimos verificar tu correo" : "Confirmación de correo"}
        </h1>

        <p className="mt-5 text-sm leading-7 text-slate-600">
          {mensaje}
        </p>

        {!error && (
          <p className="mt-4 text-sm leading-7 text-slate-500">
            Una vez que el superadmin apruebe tu cuenta, vas a poder ingresar
            a la zona de investigadores.
          </p>
        )}

        <Link
          href="/investigacion"
          className="mt-8 inline-flex h-11 items-center justify-center bg-cyan-500 px-6 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-cyan-600"
        >
          Volver a Investigación
        </Link>
      </section>
    </main>
  );
}