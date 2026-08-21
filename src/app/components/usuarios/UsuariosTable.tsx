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
    useState<UsuarioDashboard[]>(usuariosIniciales);

  const [estadoActivo, setEstadoActivo] =
    useState<string>("PENDIENTE");

  const [procesando, setProcesando] =
    useState<number | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const usuariosFiltrados = useMemo(
    () =>
      usuarios.filter(
        (usuario) =>
          usuario.estado === estadoActivo,
      ),
    [usuarios, estadoActivo],
  );

  async function aprobarUsuario(
    usuarioId: number,
    rol: string,
  ) {
    setProcesando(usuarioId);
    setError(null);

    try {
      const response = await fetch(
        "/api/superadmin/aprobar",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id: usuarioId,
            rol,
          }),
        },
      );

      const data =
        (await response.json()) as {
          error?: string;
          usuario?: {
            estado: string;
            rol: string;
            sistemasIds?: number[];
          };
        };

      if (!response.ok) {
        throw new Error(
          data.error ??
            "No se pudo aprobar el usuario.",
        );
      }

      setUsuarios((actuales) =>
        actuales.map((usuario) =>
          usuario.id === usuarioId
            ? {
                ...usuario,
                estado:
                  data.usuario?.estado ??
                  "APROBADO",
                rol:
                  data.usuario?.rol ??
                  rol,
                sistemasIds:
                  data.usuario?.sistemasIds ??
                  [],
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

  async function rechazarUsuario(
    usuarioId: number,
  ) {
    setProcesando(usuarioId);
    setError(null);

    try {
      const response = await fetch(
        "/api/superadmin/rechazar",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id: usuarioId,
          }),
        },
      );

      const data =
        (await response.json()) as {
          error?: string;
        };

      if (!response.ok) {
        throw new Error(
          data.error ??
            "No se pudo rechazar el usuario.",
        );
      }

      setUsuarios((actuales) =>
        actuales.filter(
          (usuario) =>
            usuario.id !== usuarioId,
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

  async function actualizarSistemas(
    usuarioId: number,
    sistemasIds: number[],
  ) {
    setProcesando(usuarioId);
    setError(null);

    try {
      const response = await fetch(
        `/api/superadmin/usuarios/${usuarioId}/sistemas`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            sistemasIds,
          }),
        },
      );

      const data =
        (await response.json()) as {
          error?: string;
          sistemasIds?: number[];
        };

      if (!response.ok) {
        throw new Error(
          data.error ??
            "No se pudieron actualizar los sistemas.",
        );
      }

      setUsuarios((actuales) =>
        actuales.map((usuario) =>
          usuario.id === usuarioId
            ? {
                ...usuario,
                sistemasIds:
                  data.sistemasIds ??
                  sistemasIds,
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
      (usuario) =>
        usuario.estado === estado,
    ).length;

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-3">
        {estados.map((estado) => (
          <button
            key={estado}
            type="button"
            onClick={() =>
              setEstadoActivo(estado)
            }
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
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="grid gap-4 md:grid-cols-[1.4fr_1.7fr_0.8fr]">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Usuario
            </p>

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Información profesional
            </p>

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Estado
            </p>
          </div>
        </div>

        <div>
          {usuariosFiltrados.map((usuario) => (
            <UsuarioFila
              key={usuario.id}
              usuario={usuario}
              roles={roles}
              sistemas={sistemas}
              procesando={
                procesando === usuario.id
              }
              onAprobar={aprobarUsuario}
              onRechazar={rechazarUsuario}
              onActualizarSistemas={
                actualizarSistemas
              }
            />
          ))}

          {usuariosFiltrados.length === 0 && (
            <div className="px-5 py-14 text-center">
              <p className="text-sm font-medium text-slate-700">
                No hay usuarios en este estado.
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Los usuarios que correspondan
                aparecerán aquí.
              </p>
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
  sistemas: SistemaDashboard[];
  procesando: boolean;
  onAprobar: (
    usuarioId: number,
    rol: string,
  ) => Promise<void>;
  onRechazar: (
    usuarioId: number,
  ) => Promise<void>;
  onActualizarSistemas: (
    usuarioId: number,
    sistemasIds: number[],
  ) => Promise<void>;
}

function UsuarioFila({
  usuario,
  roles,
  sistemas,
  procesando,
  onAprobar,
  onRechazar,
  onActualizarSistemas,
}: UsuarioFilaProps) {
  const [rolSeleccionado, setRolSeleccionado] =
    useState<string>(
      usuario.rol === "COLABORADOR"
        ? "COLABORADOR"
        : "INVESTIGADOR",
    );

  const [
    sistemasSeleccionados,
    setSistemasSeleccionados,
  ] = useState<number[]>(
    usuario.sistemasIds,
  );

  const [
    sistemasModificados,
    setSistemasModificados,
  ] = useState(false);

  function alternarSistema(
    sistemaId: number,
  ) {
    setSistemasSeleccionados(
      (actuales) =>
        actuales.includes(sistemaId)
          ? actuales.filter(
              (id) => id !== sistemaId,
            )
          : [
              ...actuales,
              sistemaId,
            ],
    );

    setSistemasModificados(true);
  }

  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <div className="grid gap-6 px-5 py-6 md:grid-cols-[1.4fr_1.7fr_0.8fr]">
        <div className="flex min-w-0 flex-col justify-center">
          <p className="text-base font-semibold text-slate-950">
            {usuario.nombre}{" "}
            {usuario.apellido}
          </p>

          <p className="mt-1 break-all text-sm text-slate-500">
            {usuario.correo}
          </p>

          <span
            className={`mt-3 inline-flex w-fit text-xs font-medium ${
              usuario.correoVerificado
                ? "text-emerald-600"
                : "text-amber-600"
            }`}
          >
            {usuario.correoVerificado
              ? "Correo verificado"
              : "Correo sin verificar"}
          </span>
        </div>

        <div className="grid min-w-0 grid-cols-1 border border-slate-100 sm:grid-cols-3">
          <InfoProfesional
            titulo="Especialidad"
            valor={usuario.especialidad}
          />

          <InfoProfesional
            titulo="Centro médico"
            valor={usuario.centroMedico}
          />

          <InfoProfesional
            titulo="Localidad"
            valor={usuario.localidad}
          />
        </div>

        <div className="flex items-center md:justify-start">
          <EstadoBadge
            estado={usuario.estado}
          />
        </div>
      </div>

      <div className="mx-5 border-t border-slate-100" />

      <div className="grid gap-6 bg-slate-50/60 px-5 py-5 lg:grid-cols-[0.8fr_1.8fr_0.9fr]">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Rol
          </p>

          {usuario.estado ===
            "PENDIENTE" &&
          !usuario.esSuperAdmin ? (
            <select
              value={rolSeleccionado}
              onChange={(event) =>
                setRolSeleccionado(
                  event.target.value,
                )
              }
              disabled={procesando}
              className="h-10 w-full border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500"
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
          ) : (
            <div className="flex h-10 items-center border border-slate-200 bg-white px-3">
              <span className="text-sm font-medium text-slate-700">
                {usuario.esSuperAdmin
                  ? "SUPERADMIN"
                  : usuario.rol}
              </span>
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Sistemas asignados
            </p>

            {usuario.estado !==
              "PENDIENTE" &&
              !usuario.esSuperAdmin && (
                <span className="text-xs text-slate-400">
                  {sistemasSeleccionados.length}{" "}
                  asignado
                  {sistemasSeleccionados.length ===
                  1
                    ? ""
                    : "s"}
                </span>
              )}
          </div>

          {usuario.estado ===
          "PENDIENTE" ? (
            <div className="flex min-h-10 items-center border border-slate-200 bg-white px-3">
              <p className="text-sm text-slate-400">
                Se pueden asignar después de
                aprobar.
              </p>
            </div>
          ) : usuario.esSuperAdmin ? (
            <div className="flex min-h-10 items-center border border-slate-200 bg-white px-3">
              <p className="text-sm text-slate-400">
                Todos los sistemas disponibles.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid gap-2 border border-slate-200 bg-white p-3 sm:grid-cols-2">
                {sistemas.length === 0 ? (
                  <p className="text-xs text-slate-400 sm:col-span-2">
                    No hay sistemas disponibles.
                  </p>
                ) : (
                  sistemas.map((sistema) => (
                    <label
                      key={sistema.id}
                      className="flex min-w-0 cursor-pointer items-center gap-2 border border-transparent px-2 py-2 text-sm text-slate-700 transition hover:border-slate-200 hover:bg-slate-50"
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
                        className="h-4 w-4 shrink-0 accent-cyan-500"
                      />

                      <span className="min-w-0 truncate">
                        {sistema.nombre}
                      </span>
                    </label>
                  ))
                )}
              </div>

              <button
                type="button"
                disabled={
                  procesando ||
                  !sistemasModificados
                }
                onClick={() =>
                  onActualizarSistemas(
                    usuario.id,
                    sistemasSeleccionados,
                  ).then(() =>
                    setSistemasModificados(
                      false,
                    ),
                  )
                }
                className="h-10 border border-cyan-600 px-4 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Guardar sistemas
              </button>
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Acciones
          </p>

          {usuario.estado ===
            "PENDIENTE" &&
          !usuario.esSuperAdmin ? (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              <button
                type="button"
                disabled={procesando}
                onClick={() =>
                  onAprobar(
                    usuario.id,
                    rolSeleccionado,
                  )
                }
                className="h-10 w-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {procesando
                  ? "Procesando..."
                  : "Aprobar"}
              </button>

              <button
                type="button"
                disabled={procesando}
                onClick={() =>
                  onRechazar(usuario.id)
                }
                className="h-10 w-full border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Rechazar
              </button>
            </div>
          ) : (
            <div className="flex h-10 items-center">
              <span className="text-sm text-slate-400">
                Sin acciones
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoProfesional({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="min-w-0 border-b border-slate-100 px-4 py-3 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {titulo}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-700">
        {valor}
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