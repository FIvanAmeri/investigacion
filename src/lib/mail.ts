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
      "La configuración SMTP está incompleta",
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

  const url = `${appUrl}/api/auth/verify-email?token=${encodeURIComponent(
    token,
  )}`;

  const transporter =
    getTransporter();

  await transporter.sendMail({
    from: getFromAddress(),
    to: correo,
    subject:
      "Confirmá tu correo electrónico",
    text: `Hola ${nombre}.

Para confirmar tu correo electrónico ingresá al siguiente enlace:

${url}

Si no realizaste este registro, podés ignorar este mensaje.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Confirmá tu correo electrónico</h2>
        <p>Hola ${nombre}.</p>
        <p>
          Para confirmar tu correo electrónico,
          hacé clic en el siguiente enlace:
        </p>
        <p>
          <a href="${url}">
            Confirmar correo electrónico
          </a>
        </p>
        <p>
          Si no realizaste este registro,
          podés ignorar este mensaje.
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
        <p>Hola ${nombre}.</p>
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