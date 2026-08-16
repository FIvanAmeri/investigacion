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
}

interface UsuariosPanelProps {
  usuarios: UsuarioDashboard[];
  estados: string[];
  roles: string[];
}

export default function UsuariosPanel({
  usuarios: usuariosIniciales,
  estados,
  roles,
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
    accion: "aprobar" | "rechazar",
    rol?: string,
  ) {
    setProcesando(usuarioId);
    setError(null);

    try {
      const response = await fetch(
        "/api/dashboard/usuarios",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuarioId,
            accion,
            rol,
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
                estado: data.usuario.estado,
                rol: data.usuario.rol,
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

  const cantidadPorEstado = (estado: string) =>
    usuarios.filter(
      (usuario) => usuario.estado === estado,
    ).length;

  return (
    <div className="w-full">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="w-[20%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Usuario
                </th>

                <th className="w-[40%] px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Información profesional
                </th>

                <th className="w-[12%] px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Estado
                </th>

                <th className="w-[12%] px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Rol
                </th>

                <th className="w-[16%] px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
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
                  procesando={
                    procesando === usuario.id
                  }
                  onActualizar={actualizarUsuario}
                />
              ))}

              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No hay usuarios en este estado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="block md:hidden">
          {usuariosFiltrados.map((usuario) => (
            <UsuarioMovil
              key={usuario.id}
              usuario={usuario}
              roles={roles}
              procesando={
                procesando === usuario.id
              }
              onActualizar={actualizarUsuario}
            />
          ))}

          {usuariosFiltrados.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-slate-500">
              No hay usuarios en este estado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface UsuarioFilaProps {
  usuario: UsuarioDashboard;
  roles: string[];
  procesando: boolean;
  onActualizar: (
    usuarioId: number,
    accion: "aprobar" | "rechazar",
    rol?: string,
  ) => Promise<void>;
}

function UsuarioFila({
  usuario,
  roles,
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

  return (
    <tr className="border-b border-slate-100 last:border-b-0">
      <td className="px-6 py-6 align-middle">
        <p className="font-semibold text-slate-950">
          {usuario.nombre} {usuario.apellido}
        </p>

        <p className="mt-1 break-all text-sm text-slate-500">
          {usuario.correo}
        </p>

        {!usuario.correoVerificado && (
          <span className="mt-2 inline-flex text-xs font-medium text-amber-600">
            Correo sin verificar
          </span>
        )}
      </td>

      <td className="px-6 py-6 align-middle">
        <div className="mx-auto grid max-w-[700px] grid-cols-3 gap-3">
          <DatoUsuario
            etiqueta="Especialidad"
            valor={usuario.especialidad}
          />

          <DatoUsuario
            etiqueta="Centro Médico"
            valor={usuario.centroMedico}
          />

          <DatoUsuario
            etiqueta="Localidad"
            valor={usuario.localidad}
          />
        </div>
      </td>

      <td className="px-6 py-6 text-center align-middle">
        <EstadoBadge estado={usuario.estado} />
      </td>

      <td className="px-6 py-6 text-center align-middle">
        <span className="whitespace-nowrap text-sm font-semibold text-slate-700">
          {usuario.esSuperAdmin
            ? "SUPERADMIN"
            : usuario.rol}
        </span>
      </td>

      <td className="px-6 py-6 align-middle">
        <div className="flex justify-center">
          {usuario.estado === "PENDIENTE" &&
            !usuario.esSuperAdmin && (
              <div className="flex w-full max-w-[230px] flex-col gap-3">
                <select
                  value={rolSeleccionado}
                  onChange={(event) =>
                    setRolSeleccionado(
                      event.target.value,
                    )
                  }
                  disabled={procesando}
                  className="h-10 border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-cyan-500"
                >
                  {roles.map((rol) => (
                    <option key={rol} value={rol}>
                      {rol}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={procesando}
                    onClick={() =>
                      onActualizar(
                        usuario.id,
                        "aprobar",
                        rolSeleccionado,
                      )
                    }
                    className="h-10 bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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
                        "rechazar",
                      )
                    }
                    className="h-10 border border-red-200 px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            )}

          {usuario.estado !== "PENDIENTE" && (
            <span className="text-center text-sm text-slate-400">
              Sin acciones pendientes
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}

function UsuarioMovil({
  usuario,
  roles,
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

  return (
    <div className="border-b border-slate-200 p-5 last:border-b-0">
      <div className="text-center">
        <p className="font-semibold text-slate-950">
          {usuario.nombre} {usuario.apellido}
        </p>

        <p className="mt-1 break-all text-sm text-slate-500">
          {usuario.correo}
        </p>

        {!usuario.correoVerificado && (
          <span className="mt-2 inline-flex text-xs font-medium text-amber-600">
            Correo sin verificar
          </span>
        )}
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Información profesional
        </p>

        <div className="flex flex-col gap-3">
          <DatoUsuario
            etiqueta="Especialidad"
            valor={usuario.especialidad}
          />

          <DatoUsuario
            etiqueta="Centro Médico"
            valor={usuario.centroMedico}
          />

          <DatoUsuario
            etiqueta="Localidad"
            valor={usuario.localidad}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Estado
          </p>

          <div className="mt-2">
            <EstadoBadge estado={usuario.estado} />
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Rol
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-700">
            {usuario.esSuperAdmin
              ? "SUPERADMIN"
              : usuario.rol}
          </p>
        </div>
      </div>

      {usuario.estado === "PENDIENTE" &&
        !usuario.esSuperAdmin && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Acciones
            </p>

            <div className="flex flex-col gap-3">
              <select
                value={rolSeleccionado}
                onChange={(event) =>
                  setRolSeleccionado(
                    event.target.value,
                  )
                }
                disabled={procesando}
                className="h-11 border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-cyan-500"
              >
                {roles.map((rol) => (
                  <option key={rol} value={rol}>
                    {rol}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={procesando}
                  onClick={() =>
                    onActualizar(
                      usuario.id,
                      "aprobar",
                      rolSeleccionado,
                    )
                  }
                  className="h-11 bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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
                      "rechazar",
                    )
                  }
                  className="h-11 border border-red-200 px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        )}

      {usuario.estado !== "PENDIENTE" && (
        <p className="mt-5 border-t border-slate-100 pt-5 text-center text-sm text-slate-400">
          Sin acciones pendientes
        </p>
      )}
    </div>
  );
}

function DatoUsuario({
  etiqueta,
  valor,
}: {
  etiqueta: string;
  valor: string;
}) {
  return (
    <div className="flex min-h-[84px] w-full flex-col border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="flex min-h-[30px] items-start text-[10px] font-semibold uppercase leading-[15px] tracking-[0.14em] text-slate-400">
        {etiqueta}
      </p>

      <p className="mt-2 break-words text-sm font-medium leading-5 text-slate-800">
        {valor || "No informado"}
      </p>
    </div>
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