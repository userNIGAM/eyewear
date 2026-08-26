"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navLinks } from "./nav-links";

export default function DesktopNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <div className="hidden items-center gap-8 md:flex">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`group relative py-2 text-sm font-medium transition-colors ${
            isActive(link.href)
              ? "text-zinc-100"
              : "text-zinc-400 hover:text-zinc-100"
          }`}
        >
          {link.name}

          <span
            className={`absolute bottom-0 left-0 h-0.5 bg-green-500 transition-all duration-300 ${
              isActive(link.href)
                ? "w-full"
                : "w-0 group-hover:w-full"
            }`}
          />
        </Link>
      ))}
    </div>
  );
}