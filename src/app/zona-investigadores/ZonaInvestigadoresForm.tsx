"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";


type Vista = "login" | "registro" | "recuperar";

interface LoginResponse {
  message?: string;
  mensaje?: string;
  error?: string;
}

interface RegistroResponse {
  message?: string;
  error?: string;
}

export default function ZonaInvestigadoresForm() {
  const router = useRouter();

  const [vista, setVista] =
    useState<Vista>("login");

  const [correo, setCorreo] =
    useState("");
  const [contrasena, setContrasena] =
    useState("");

  const [nombre, setNombre] =
    useState("");
  const [apellido, setApellido] =
    useState("");
  const [localidad, setLocalidad] =
    useState("");
  const [centroMedico, setCentroMedico] =
    useState("");
  const [especialidad, setEspecialidad] =
    useState("");

  const [
    correoRecuperacion,
    setCorreoRecuperacion,
  ] = useState("");

  const [mensaje, setMensaje] =
    useState("");
  const [error, setError] =
    useState("");
  const [cargando, setCargando] =
    useState(false);

  const cambiarVista = (
    nuevaVista: Vista,
  ) => {
    setVista(nuevaVista);
    setMensaje("");
    setError("");
  };

  const iniciarSesion = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setMensaje("");
    setError("");
    setCargando(true);

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            correo,
            password: contrasena,
          }),
        },
      );

      const data =
        (await response.json()) as LoginResponse;

      if (!response.ok) {
        setError(
          data.error ??
          "No se pudo iniciar sesión.",
        );
        return;
      }

      setMensaje(
        data.mensaje ??
        data.message ??
        "Logueado exitosamente.",
      );

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(
        "No se pudo conectar con el servidor.",
      );
    } finally {
      setCargando(false);
    }
  };


  const registrarUsuario = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setMensaje("");
    setError("");
    setCargando(true);

    try {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            nombre,
            apellido,
            localidad,
            centroMedico,
            especialidad,
            correo,
            password: contrasena,
          }),
        },
      );

      const data =
        (await response.json()) as RegistroResponse;

      if (!response.ok) {
        setError(
          data.error ??
          "No se pudo crear la cuenta.",
        );
        return;
      }

      setMensaje(
        data.message ??
        "Cuenta creada correctamente. Revisá tu correo electrónico: tu solicitud quedó pendiente de aprobación.",
      );

      setNombre("");
      setApellido("");
      setLocalidad("");
      setCentroMedico("");
      setEspecialidad("");
      setCorreo("");
      setContrasena("");

      window.setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch {
      setError(
        "No se pudo conectar con el servidor.",
      );
    } finally {
      setCargando(false);
    }
  };


  return (
    <main className="min-h-[calc(100vh-68px)] bg-slate-50">
      <section className="mx-auto flex min-h-[calc(100vh-68px)] max-w-7xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
              Zona de investigadores
            </p>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {vista === "login" &&
                "Ingresar"}

              {vista === "registro" &&
                "Crear cuenta"}

              {vista === "recuperar" &&
                "Recuperar contraseña"}
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              {vista === "login" &&
                "Ingresá a tu cuenta para acceder a la zona de investigadores."}

              {vista === "registro" &&
                "Completá tus datos para crear tu cuenta de investigador."}

              {vista === "recuperar" &&
                "Ingresá tu correo electrónico y te enviaremos las instrucciones para recuperar tu contraseña."}
            </p>
          </div>

          <div className="border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {vista === "login" && (
              <form
                onSubmit={iniciarSesion}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="login-correo"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500"
                  >
                    Correo
                  </label>

                  <input
                    id="login-correo"
                    type="email"
                    value={correo}
                    onChange={(event) =>
                      setCorreo(
                        event.target.value,
                      )
                    }
                    placeholder="tu@correo.com"
                    autoComplete="email"
                    required
                    className="h-12 w-full border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="login-contrasena"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500"
                  >
                    Contraseña
                  </label>

                  <input
                    id="login-contrasena"
                    type="password"
                    value={contrasena}
                    onChange={(event) =>
                      setContrasena(
                        event.target.value,
                      )
                    }
                    placeholder="Ingresá tu contraseña"
                    autoComplete="current-password"
                    required
                    className="h-12 w-full border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500"
                  />
                </div>

                {error && (
                  <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {mensaje && (
                  <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {mensaje}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={cargando}
                  className="flex h-12 w-full items-center justify-center bg-cyan-500 px-5 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cargando
                    ? "Ingresando..."
                    : "Ingresar"}
                </button>

                <div className="flex flex-col items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      cambiarVista(
                        "recuperar",
                      )
                    }
                    className="text-sm font-medium text-slate-500 transition-colors hover:text-cyan-600"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>

                  <div className="h-px w-full bg-slate-200" />

                  <button
                    type="button"
                    onClick={() =>
                      cambiarVista(
                        "registro",
                      )
                    }
                    className="text-sm font-semibold text-cyan-600 transition-colors hover:text-cyan-700"
                  >
                    Registrarse
                  </button>
                </div>
              </form>
            )}

            {vista === "registro" && (
              <form
                onSubmit={registrarUsuario}
                className="space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="registro-nombre"
                      className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500"
                    >
                      Nombre
                    </label>

                    <input
                      id="registro-nombre"
                      type="text"
                      value={nombre}
                      onChange={(event) =>
                        setNombre(
                          event.target.value,
                        )
                      }
                      placeholder="Nombre"
                      autoComplete="given-name"
                      required
                      className="h-12 w-full border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="registro-apellido"
                      className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500"
                    >
                      Apellido
                    </label>

                    <input
                      id="registro-apellido"
                      type="text"
                      value={apellido}
                      onChange={(event) =>
                        setApellido(
                          event.target.value,
                        )
                      }
                      placeholder="Apellido"
                      autoComplete="family-name"
                      required
                      className="h-12 w-full border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="registro-localidad"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500"
                  >
                    Localidad
                  </label>

                  <input
                    id="registro-localidad"
                    type="text"
                    value={localidad}
                    onChange={(event) =>
                      setLocalidad(
                        event.target.value,
                      )
                    }
                    placeholder="Localidad"
                    autoComplete="address-level2"
                    required
                    className="h-12 w-full border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="registro-centro-medico"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500"
                  >
                    Centro Médico
                  </label>

                  <input
                    id="registro-centro-medico"
                    type="text"
                    value={centroMedico}
                    onChange={(event) =>
                      setCentroMedico(
                        event.target.value,
                      )
                    }
                    placeholder="Centro médico"
                    required
                    className="h-12 w-full border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="registro-especialidad"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500"
                  >
                    Especialidad
                  </label>

                  <input
                    id="registro-especialidad"
                    type="text"
                    value={especialidad}
                    onChange={(event) =>
                      setEspecialidad(
                        event.target.value,
                      )
                    }
                    placeholder="Especialidad"
                    required
                    className="h-12 w-full border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="registro-correo"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500"
                  >
                    Correo
                  </label>

                  <input
                    id="registro-correo"
                    type="email"
                    value={correo}
                    onChange={(event) =>
                      setCorreo(
                        event.target.value,
                      )
                    }
                    placeholder="tu@correo.com"
                    autoComplete="email"
                    required
                    className="h-12 w-full border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="registro-contrasena"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500"
                  >
                    Contraseña
                  </label>

                  <input
                    id="registro-contrasena"
                    type="password"
                    value={contrasena}
                    onChange={(event) =>
                      setContrasena(
                        event.target.value,
                      )
                    }
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="h-12 w-full border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    La contraseña debe tener al
                    menos 8 caracteres.
                  </p>
                </div>

                {error && (
                  <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {mensaje && (
                  <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {mensaje}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={cargando}
                  className="flex h-12 w-full items-center justify-center bg-cyan-500 px-5 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cargando
                    ? "Creando cuenta..."
                    : "Crear cuenta"}
                </button>

                <div className="border-t border-slate-200 pt-5 text-center">
                  <button
                    type="button"
                    onClick={() =>
                      cambiarVista("login")
                    }
                    className="text-sm font-semibold text-cyan-600 transition-colors hover:text-cyan-700"
                  >
                    Volver al inicio de sesión
                  </button>
                </div>
              </form>
            )}

            {vista === "recuperar" && (
              <form
                onSubmit={(event) =>
                  event.preventDefault()
                }
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="recuperar-correo"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500"
                  >
                    Correo
                  </label>

                  <input
                    id="recuperar-correo"
                    type="email"
                    value={correoRecuperacion}
                    onChange={(event) =>
                      setCorreoRecuperacion(
                        event.target.value,
                      )
                    }
                    placeholder="tu@correo.com"
                    autoComplete="email"
                    className="h-12 w-full border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center bg-cyan-500 px-5 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-cyan-600"
                >
                  Recuperar contraseña
                </button>

                <div className="border-t border-slate-200 pt-5 text-center">
                  <button
                    type="button"
                    onClick={() =>
                      cambiarVista("login")
                    }
                    className="text-sm font-semibold text-cyan-600 transition-colors hover:text-cyan-700"
                  >
                    Volver al inicio de sesión
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}