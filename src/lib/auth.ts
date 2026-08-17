
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import {
  RolUsuario,
  User,
} from "@/entities/Usuario";

const COOKIE_NAME = "investigacion_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

export interface SessionPayload {
  userId: number;
  rol: RolUsuario;
  esSuperAdmin: boolean;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET no está configurado",
    );
  }

  return secret;
}

export function createSessionToken(
  user: User,
): string {
  const payload: SessionPayload = {
    userId: user.id,
    rol: user.rol,
    esSuperAdmin: user.esSuperAdmin,
  };

  return jwt.sign(
    payload,
    getJwtSecret(),
    {
      expiresIn: SESSION_DURATION_SECONDS,
    },
  );
}

export function createSessionTokenFromPayload(
  session: SessionPayload,
): string {
  return jwt.sign(
    session,
    getJwtSecret(),
    {
      expiresIn: SESSION_DURATION_SECONDS,
    },
  );
}

export function verifySessionToken(
  token: string,
): SessionPayload {
  return jwt.verify(
    token,
    getJwtSecret(),
  ) as SessionPayload;
}

export async function setSessionCookie(
  user: User,
): Promise<void> {
  const cookieStore = await cookies();
  const token = createSessionToken(user);

  cookieStore.set(
    COOKIE_NAME,
    token,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    },
  );
}

export async function refreshSessionCookie(
  session: SessionPayload,
): Promise<void> {
  const cookieStore = await cookies();
  const token =
    createSessionTokenFromPayload(session);

  cookieStore.set(
    COOKIE_NAME,
    token,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    },
  );
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();

  const token =
    cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(
    COOKIE_NAME,
    "",
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    },
  );
}
