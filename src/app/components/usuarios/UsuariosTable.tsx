"use client";

import { useMemo, useState } from "react";

interface UsuarioDashboard {
  id: number;
  nombre: string;
  apellido: string;
  localidad: string;
  centroMedico: string;
  especialidad: string;
  correo: string;
  estado: string;
  rol: string;
  correoVerificado: boolean;
  esSuperAdmin: boolean;
  createdAt: string;
  sistemasIds: number[];
}

interface SistemaDashboard {
  id: number;
  nombre: string;
  slug: string;
}

interface UsuariosPanelProps {
  usuarios: UsuarioDashboard[];
  estados: string[];
  roles: string[];
  sistemas: SistemaDashboard[];
}

export default function UsuariosPanel({
  usuarios: usuariosIniciales,
  estados,
  roles,
  sistemas,
}: UsuariosPanelProps) {
  const [usuarios, setUsuarios] =
    useState<UsuarioDashboard[]>(
      usuariosIniciales,
    );

  const [estadoActivo, setEstadoActivo] =
    useState<string>("PENDIENTE");

  const [procesando, setProcesando] =
    useState<number | null>(null);

  const [error, setError] = useState<string | null>(
    null,
  );

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(
      (usuario) =>
        usuario.estado === estadoActivo,
    );
  }, [usuarios, estadoActivo]);

  async function actualizarUsuario(
    usuarioId: number,
    accion: "aprobar" | "denegar",
    rol?: string,
    sistemasIds?: number[],
  ) {
    setProcesando(usuarioId);
    setError(null);

    try {
      const response = await fetch(
        `/api/dashboard/usuarios/${usuarioId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accion,
            rol,
            sistemasIds,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "No se pudo actualizar el usuario.",
        );
      }

      setUsuarios((actuales) =>
        actuales.map((usuario) =>
          usuario.id === usuarioId
            ? {
                ...usuario,
                estado:
                  data.usuario.estado,
                rol: data.usuario.rol,
                sistemasIds:
                  data.usuario.sistemasIds ??
                  usuario.sistemasIds,
              }
            : usuario,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado.",
      );
    } finally {
      setProcesando(null);
    }
  }

  const cantidadPorEstado = (
    estado: string,
  ) =>
    usuarios.filter(
      (usuario) => usuario.estado === estado,
    ).length;

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-3">
        {estados.map((estado) => (
          <button
            key={estado}
            type="button"
            onClick={() => setEstadoActivo(estado)}
            className={`border p-4 text-left transition ${
              estadoActivo === estado
                ? "border-cyan-500 bg-cyan-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {estado}
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {cantidadPorEstado(estado)}
            </p>
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-hidden border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Usuario
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Información profesional
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Estado
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Rol
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Sistemas
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <UsuarioFila
                  key={usuario.id}
                  usuario={usuario}
                  roles={roles}
                  sistemas={sistemas}
                  procesando={
                    procesando === usuario.id
                  }
                  onActualizar={actualizarUsuario}
                />
              ))}

              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No hay usuarios en este
                    estado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface UsuarioFilaProps {
  usuario: UsuarioDashboard;
  roles: string[];
  sistemas: SistemaDashboard[];
  procesando: boolean;
  onActualizar: (
    usuarioId: number,
    accion: "aprobar" | "denegar",
    rol?: string,
    sistemasIds?: number[],
  ) => Promise<void>;
}

function UsuarioFila({
  usuario,
  roles,
  sistemas,
  procesando,
  onActualizar,
}: UsuarioFilaProps) {
  const [rolSeleccionado, setRolSeleccionado] =
    useState<string>(
      usuario.rol === "INVESTIGADOR" ||
        usuario.rol === "COLABORADOR"
        ? usuario.rol
        : roles[0] ?? "",
    );

  const [sistemasSeleccionados, setSistemasSeleccionados] =
    useState<number[]>(
      usuario.sistemasIds,
    );

  const alternarSistema = (
    sistemaId: number,
  ) => {
    setSistemasSeleccionados((actuales) =>
      actuales.includes(sistemaId)
        ? actuales.filter(
            (id) => id !== sistemaId,
          )
        : [...actuales, sistemaId],
    );
  };

  return (
    <tr className="border-b border-slate-100 last:border-b-0">
      <td className="px-5 py-5 align-middle">
        <p className="font-semibold text-slate-950">
          {usuario.nombre} {usuario.apellido}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {usuario.correo}
        </p>

        {!usuario.correoVerificado && (
          <span className="mt-2 inline-flex text-xs font-medium text-amber-600">
            Correo sin verificar
          </span>
        )}
      </td>

      <td className="px-5 py-5 align-middle">
        <div className="mx-auto flex max-w-[360px] items-center justify-center">
          <div className="flex w-full items-center justify-center">
            <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Especialidad
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {usuario.especialidad}
              </p>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center border-l border-slate-100 px-4 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Centro médico
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {usuario.centroMedico}
              </p>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center border-l border-slate-100 px-4 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Localidad
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {usuario.localidad}
              </p>
            </div>
          </div>
        </div>
      </td>

      <td className="px-5 py-5 align-middle">
        <EstadoBadge estado={usuario.estado} />
      </td>

      <td className="px-5 py-5 align-middle">
        <span className="text-sm font-medium text-slate-700">
          {usuario.esSuperAdmin
            ? "SUPERADMIN"
            : usuario.rol}
        </span>
      </td>

      <td className="px-5 py-5 align-middle">
        {usuario.sistemasIds.length > 0 ? (
          <div className="flex max-w-[220px] flex-col gap-2">
            {usuario.sistemasIds.map(
              (sistemaId) => {
                const sistema =
                  sistemas.find(
                    (item) =>
                      item.id === sistemaId,
                  );

                return sistema ? (
                  <span
                    key={sistema.id}
                    className="border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700"
                  >
                    {sistema.nombre}
                  </span>
                ) : null;
              },
            )}
          </div>
        ) : (
          <span className="text-sm text-slate-400">
            Sin sistemas asignados
          </span>
        )}
      </td>

      <td className="px-5 py-5 align-middle text-center">
        {usuario.estado === "PENDIENTE" &&
          !usuario.esSuperAdmin && (
            <div className="mx-auto flex min-w-[250px] flex-col gap-3 text-left">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Rol
                </label>

                <select
                  value={rolSeleccionado}
                  onChange={(event) =>
                    setRolSeleccionado(
                      event.target.value,
                    )
                  }
                  disabled={procesando}
                  className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-500"
                >
                  {roles.map((rol) => (
                    <option
                      key={rol}
                      value={rol}
                    >
                      {rol}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Sistemas asignados
                </p>

                <div className="max-h-40 space-y-2 overflow-y-auto border border-slate-200 p-3">
                  {sistemas.length === 0 ? (
                    <p className="text-xs text-slate-400">
                      No hay sistemas disponibles.
                    </p>
                  ) : (
                    sistemas.map((sistema) => (
                      <label
                        key={sistema.id}
                        className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={sistemasSeleccionados.includes(
                            sistema.id,
                          )}
                          onChange={() =>
                            alternarSistema(
                              sistema.id,
                            )
                          }
                          disabled={procesando}
                          className="h-4 w-4"
                        />

                        <span>
                          {sistema.nombre}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={
                    procesando ||
                    sistemasSeleccionados.length ===
                      0
                  }
                  onClick={() =>
                    onActualizar(
                      usuario.id,
                      "aprobar",
                      rolSeleccionado,
                      sistemasSeleccionados,
                    )
                  }
                  className="flex-1 bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {procesando
                    ? "Procesando..."
                    : "Aprobar"}
                </button>

                <button
                  type="button"
                  disabled={procesando}
                  onClick={() =>
                    onActualizar(
                      usuario.id,
                      "denegar",
                    )
                  }
                  className="flex-1 border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Rechazar
                </button>
              </div>
            </div>
          )}

        {usuario.estado !== "PENDIENTE" && (
          <div className="flex w-full items-center justify-center text-center">
            <span className="text-sm text-slate-400">
              Sin acciones pendientes
            </span>
          </div>
        )}
      </td>
    </tr>
  );
}

function EstadoBadge({
  estado,
}: {
  estado: string;
}) {
  const clases =
    estado === "APROBADO"
      ? "bg-emerald-50 text-emerald-700"
      : estado === "DENEGADO"
        ? "bg-red-50 text-red-700"
        : "bg-amber-50 text-amber-700";

  return (
    <span
      className={`inline-flex px-2.5 py-1 text-xs font-semibold ${clases}`}
    >
      {estado}
    </span>
  );
}