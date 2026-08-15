"use client";

import Link from "next/link";
import { useState } from "react";
import type { NavigationMenu } from "@/app/data/navigation";

interface DropdownMenuProps {
  menu: NavigationMenu;
}

export default function DropdownMenu({
  menu,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);

  if (!menu.items) {
    return (
      <Link
        href={menu.href ?? "#"}
        className="relative flex h-[68px] items-center border-r border-slate-200 px-6 text-[13px] font-semibold uppercase tracking-[0.01em] text-slate-700 transition-colors first:border-l hover:text-cyan-600"
      >
        {menu.label}
      </Link>
    );
  }

  return (
    <div
      className="static h-[68px]"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`relative flex h-[68px] items-center border-r border-slate-200 px-6 text-[13px] font-semibold uppercase tracking-[0.01em] transition-colors ${
          open
            ? "text-cyan-600"
            : "text-slate-700 hover:text-cyan-600"
        }`}
        aria-expanded={open}
      >
        <span>{menu.label}</span>

        <span
          className={`absolute bottom-0 left-5 right-5 h-[3px] bg-cyan-500 transition-transform duration-200 ${
            open ? "scale-x-100" : "scale-x-0"
          }`}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 top-[68px] z-50 border-t border-slate-200 bg-white shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="mx-auto grid max-w-[1400px] grid-cols-4 px-8 py-7">
            {menu.items.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex min-h-[54px] items-center justify-center px-8 ${
                  index > 0
                    ? "border-l border-slate-200"
                    : ""
                }`}
              >
                <span className="text-center text-[13px] font-semibold uppercase tracking-[0.01em] text-slate-700 transition-colors group-hover:text-cyan-600">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}