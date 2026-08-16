"use client";

import { useState } from "react";

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  localidad: string;
  centroMedico: string;
  especialidad: string;
  estado: "PENDIENTE" | "APROBADO" | "DENEGADO";
  rol: "INVESTIGADOR" | "COLABORADOR" | "SUPERADMIN";
  correoVerificado: boolean;
}

interface ModalGestionarUsuarioProps {
  usuario: Usuario;
  onClose: () => void;
  onUpdated: () => void;
}

export default function ModalGestionarUsuario({
  usuario,
  onClose,
  onUpdated,
}: ModalGestionarUsuarioProps) {
  const [rol, setRol] = useState<
    "INVESTIGADOR" | "COLABORADOR"
  >(
    usuario.rol === "COLABORADOR"
      ? "COLABORADOR"
      : "INVESTIGADOR",
  );

  const [estado, setEstado] = useState<
    "PENDIENTE" | "APROBADO" | "DENEGADO"
  >(usuario.estado);

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  async function gestionarUsuario(): Promise<void> {
    setGuardando(true);
    setError("");

    try {
      const response = await fetch(
        `/api/dashboard/usuarios/${usuario.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado,
            rol,
          }),
        },
      );

      const data: unknown = await response.json();

      if (!response.ok) {
        if (
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
        ) {
          throw new Error(data.error);
        }

        throw new Error(
          "No se pudo actualizar el usuario.",
        );
      }

      onUpdated();
      onClose();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar el usuario.",
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                Gestión de usuario
              </p>

              <h2 className="mt-2 text-xl font-semibold text-slate-950">
                {usuario.nombre} {usuario.apellido}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {usuario.correo}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={guardando}
              className="text-2xl leading-none text-slate-400 transition hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Localidad
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {usuario.localidad}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Centro médico
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {usuario.centroMedico}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Especialidad
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {usuario.especialidad}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Correo verificado
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {usuario.correoVerificado
                  ? "Sí"
                  : "No"}
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="estado-usuario"
              className="block text-sm font-medium text-slate-700"
            >
              Estado
            </label>

            <select
              id="estado-usuario"
              value={estado}
              onChange={(event) =>
                setEstado(
                  event.target.value as
                    | "PENDIENTE"
                    | "APROBADO"
                    | "DENEGADO",
                )
              }
              disabled={guardando}
              className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              <option value="PENDIENTE">
                Pendiente
              </option>

              <option value="APROBADO">
                Aprobado
              </option>

              <option value="DENEGADO">
                Denegado
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="rol-usuario"
              className="block text-sm font-medium text-slate-700"
            >
              Dashboard / Rol
            </label>

            <select
              id="rol-usuario"
              value={rol}
              onChange={(event) =>
                setRol(
                  event.target.value as
                    | "INVESTIGADOR"
                    | "COLABORADOR",
                )
              }
              disabled={
                guardando ||
                estado !== "APROBADO"
              }
              className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              <option value="INVESTIGADOR">
                Investigador
              </option>

              <option value="COLABORADOR">
                Colaborador
              </option>
            </select>

            {estado !== "APROBADO" && (
              <p className="mt-2 text-xs text-slate-500">
                El dashboard se asigna cuando el
                usuario está aprobado.
              </p>
            )}
          </div>

          {error && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={guardando}
            className="border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={gestionarUsuario}
            disabled={guardando}
            className="bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {guardando
              ? "Guardando..."
              : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}