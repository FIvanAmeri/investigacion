"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import DropdownMenu from "./DropdownMenu";
import { navigation } from "@/app/data/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHomePage = pathname === "/";

  const visibleNavigation = navigation.filter(
    (menu) => !(isHomePage && menu.label === "Inicio"),
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="flex h-[68px] items-center justify-between">
          <div className="shrink-0">
            <Logo />
          </div>

          <nav
            className="hidden h-full lg:flex"
            aria-label="Navegación principal"
          >
            {visibleNavigation.map((menu) => (
              <DropdownMenu
                key={menu.label}
                menu={menu}
              />
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/investigacion"
              className="flex h-10 items-center justify-center bg-cyan-500 px-5 text-[12px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-cyan-600"
            >
              Investigación
            </Link>

            <Link
              href="/zona-investigadores"
              className="flex h-10 items-center justify-center border border-cyan-500 px-5 text-[12px] font-bold uppercase tracking-wide text-cyan-600 transition-colors hover:bg-cyan-500 hover:text-white"
            >
              Zona de investigadores
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center text-slate-700 lg:hidden"
            aria-label={
              mobileOpen
                ? "Cerrar menú"
                : "Abrir menú"
            }
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 7H20"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <path
                  d="M4 12H20"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <path
                  d="M4 17H20"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <MobileNavigation
          navigation={visibleNavigation}
          onNavigate={() => setMobileOpen(false)}
        />
      )}
    </header>
  );
}

interface MobileNavigationProps {
  navigation: typeof navigation;
  onNavigate: () => void;
}

function MobileNavigation({
  navigation,
  onNavigate,
}: MobileNavigationProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(
    null,
  );

  return (
    <nav
      className="border-t border-slate-200 bg-white lg:hidden"
      aria-label="Navegación móvil"
    >
      <div className="px-6 py-3">
        {navigation.map((menu) => {
          const isOpen = openMenu === menu.label;

          if (!menu.items) {
            return (
              <Link
                key={menu.label}
                href={menu.href ?? "#"}
                onClick={onNavigate}
                className="flex border-b border-slate-200 py-4 text-[13px] font-semibold uppercase text-slate-700 transition-colors hover:text-cyan-600"
              >
                {menu.label}
              </Link>
            );
          }

          return (
            <div
              key={menu.label}
              className="border-b border-slate-200"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenMenu(
                    isOpen ? null : menu.label,
                  )
                }
                className={`flex w-full items-center py-4 text-left text-[13px] font-semibold uppercase transition-colors ${
                  isOpen
                    ? "text-cyan-600"
                    : "text-slate-700 hover:text-cyan-600"
                }`}
                aria-expanded={isOpen}
              >
                {menu.label}
              </button>

              {isOpen && (
                <div className="pb-2 pl-4">
                  {menu.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className="flex border-t border-slate-100 py-3 text-[12px] font-medium uppercase text-slate-500 transition-colors hover:text-cyan-600"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div className="mt-3 border-t border-slate-200 pt-3">
          <Link
            href="/investigacion"
            onClick={onNavigate}
            className="flex h-11 items-center justify-center bg-cyan-500 px-5 text-[12px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-cyan-600"
          >
            Investigación
          </Link>

          <Link
            href="/zona-investigadores"
            onClick={onNavigate}
            className="mt-2 flex h-11 items-center justify-center border border-cyan-500 px-5 text-[12px] font-bold uppercase tracking-wide text-cyan-600 transition-colors hover:bg-cyan-500 hover:text-white"
          >
            Zona de investigadores
          </Link>
        </div>
      </div>
    </nav>
  );
}