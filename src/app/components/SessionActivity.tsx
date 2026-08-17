"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const ACTIVITY_INTERVAL = 5 * 60 * 1000;

export default function SessionActivity() {
  const pathname = usePathname();
  const router = useRouter();

  const ultimaActualizacion =
    useRef<number>(0);

  useEffect(() => {
    const registrarActividad = () => {
      const ahora = Date.now();

      if (
        ahora - ultimaActualizacion.current <
        ACTIVITY_INTERVAL
      ) {
        return;
      }

      ultimaActualizacion.current = ahora;

      fetch("/api/auth/activity", {
        method: "POST",
        credentials: "include",
      })
        .then((response) => {
          if (
            response.status === 401 &&
            pathname.startsWith("/dashboard")
          ) {
            router.replace("/");
          }
        })
        .catch(() => {});
    };

    const eventos = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "pointerdown",
    ];

    eventos.forEach((evento) => {
      window.addEventListener(
        evento,
        registrarActividad,
        {
          passive: true,
        },
      );
    });

    return () => {
      eventos.forEach((evento) => {
        window.removeEventListener(
          evento,
          registrarActividad,
        );
      });
    };
  }, [pathname, router]);

  return null;
}