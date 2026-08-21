import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST;

  const port = Number(
    process.env.SMTP_PORT ?? 587,
  );

  const user = process.env.SMTP_USER;

  const password =
    process.env.SMTP_PASSWORD;

  if (
    !host ||
    !user ||
    !password
  ) {
    throw new Error(
      "La configuración SMTP está incompleta.",
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass: password,
    },
  });
}

function getFromAddress(): string {
  return (
    process.env.SMTP_FROM ||
    process.env.SMTP_USER ||
    ""
  );
}

export async function enviarCorreoVerificacion(
  correo: string,
  nombre: string,
  token: string,
): Promise<void> {
  const appUrl =
    process.env.APP_URL ??
    "http://localhost:3000";

  const url =
    `${appUrl}/api/auth/verify-email?token=` +
    encodeURIComponent(token);

  const transporter =
    getTransporter();

  await transporter.sendMail({
    from: getFromAddress(),
    to: correo,
    subject:
      "Confirmá tu correo electrónico",

    text: `Hola ${nombre}.

Tu registro fue realizado correctamente.

Para confirmar tu correo electrónico ingresá al siguiente enlace:

${url}

Una vez confirmado, tu solicitud quedará pendiente de aprobación por parte del administrador.

Si no realizaste este registro, podés ignorar este mensaje.`,

    html: `
      <div
        style="
          margin:0;
          padding:40px 20px;
          background:#f8fafc;
          font-family:Arial,Helvetica,sans-serif;
          color:#0f172a;
        "
      >
        <div
          style="
            max-width:560px;
            margin:0 auto;
            background:#ffffff;
            border:1px solid #e2e8f0;
            padding:40px;
          "
        >
          <h2
            style="
              margin:0 0 20px;
              font-size:24px;
              color:#0f172a;
            "
          >
            Confirmá tu correo electrónico
          </h2>

          <p
            style="
              margin:0 0 16px;
              font-size:16px;
              line-height:1.6;
              color:#475569;
            "
          >
            Hola ${nombre}.
          </p>

          <p
            style="
              margin:0 0 24px;
              font-size:16px;
              line-height:1.6;
              color:#475569;
            "
          >
            Tu registro fue realizado correctamente.
            Para continuar, necesitás confirmar tu
            correo electrónico.
          </p>

          <div style="text-align:center;margin:32px 0;">
            <a
              href="${url}"
              style="
                display:inline-block;
                padding:14px 28px;
                background:#06b6d4;
                color:#ffffff;
                text-decoration:none;
                font-size:14px;
                font-weight:bold;
                border-radius:4px;
              "
            >
              CONFIRMAR MI CORREO ELECTRÓNICO
            </a>
          </div>

          <p
            style="
              margin:0 0 12px;
              font-size:13px;
              line-height:1.6;
              color:#64748b;
            "
          >
            Si el botón no funciona, copiá y pegá
            este enlace en tu navegador:
          </p>

          <p
            style="
              margin:0 0 24px;
              word-break:break-all;
              font-size:12px;
              line-height:1.6;
              color:#0891b2;
            "
          >
            ${url}
          </p>

          <p
            style="
              margin:0;
              padding-top:20px;
              border-top:1px solid #e2e8f0;
              font-size:13px;
              line-height:1.6;
              color:#64748b;
            "
          >
            Después de confirmar tu correo,
            tu solicitud quedará pendiente de
            aprobación por parte del administrador.
          </p>
        </div>
      </div>
    `,
  });
}

export async function enviarCorreoAprobacion(
  correo: string,
  nombre: string,
): Promise<void> {
  const appUrl =
    process.env.APP_URL ??
    "http://localhost:3000";

  const url = `${appUrl}/zona-investigadores`;

  const transporter =
    getTransporter();

  await transporter.sendMail({
    from: getFromAddress(),
    to: correo,
    subject:
      "Tu cuenta fue aprobada",
    text: `Hola ${nombre}.

Tu solicitud de acceso fue aprobada por el SuperAdmin.

Ya podés utilizar el sistema ingresando desde:

${url}

Saludos.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
        <h2 style="color: #0f172a;">
          Tu cuenta fue aprobada
        </h2>

        <p>
          Hola ${nombre}.
        </p>

        <p>
          Tu solicitud de acceso fue
          <strong>aprobada por el SuperAdmin</strong>.
        </p>

        <p>
          Ya podés utilizar el sistema ingresando desde el siguiente enlace:
        </p>

        <p>
          <a
            href="${url}"
            style="display: inline-block; padding: 12px 20px; background: #06b6d4; color: white; text-decoration: none; font-weight: bold;"
          >
            Ingresar al sistema
          </a>
        </p>

        <p>
          Saludos.
        </p>
      </div>
    `,
  });
}

export async function enviarCorreoRechazo(
  correo: string,
  nombre: string,
): Promise<void> {
  const transporter =
    getTransporter();

  await transporter.sendMail({
    from: getFromAddress(),
    to: correo,
    subject:
      "Solicitud de acceso rechazada",
    text: `Hola ${nombre}.

Tu solicitud de acceso al sistema fue rechazada por el SuperAdmin.

En este momento no tenés habilitado el acceso al sistema.

Si considerás que se trata de un error, podés comunicarte con el administrador.

Saludos.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
        <h2 style="color: #0f172a;">
          Solicitud de acceso rechazada
        </h2>

        <p>
          Hola ${nombre}.
        </p>

        <p>
          Tu solicitud de acceso al sistema fue
          <strong>rechazada por el SuperAdmin</strong>.
        </p>

        <p>
          En este momento no tenés habilitado el acceso al sistema.
        </p>

        <p>
          Si considerás que se trata de un error,
          podés comunicarte con el administrador.
        </p>

        <p>
          Saludos.
        </p>
      </div>
    `,
  });
}

export async function enviarCorreoRecuperacion(
  correo: string,
  nombre: string,
  token: string,
): Promise<void> {
  const appUrl =
    process.env.APP_URL ??
    "http://localhost:3000";

  const url = `${appUrl}/recuperar-contrasena?token=${encodeURIComponent(
    token,
  )}`;

  const transporter =
    getTransporter();

  await transporter.sendMail({
    from: getFromAddress(),
    to: correo,
    subject:
      "Recuperación de contraseña",
    text: `Hola ${nombre}.

Para restablecer tu contraseña ingresá al siguiente enlace:

${url}

El enlace tiene una duración limitada.

Si no solicitaste recuperar tu contraseña, podés ignorar este mensaje.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Recuperación de contraseña</h2>

        <p>
          Hola ${nombre}.
        </p>

        <p>
          Para restablecer tu contraseña,
          hacé clic en el siguiente enlace:
        </p>

        <p>
          <a href="${url}">
            Restablecer contraseña
          </a>
        </p>

        <p>
          Si no solicitaste recuperar tu contraseña,
          podés ignorar este mensaje.
        </p>
      </div>
    `,
  });
}