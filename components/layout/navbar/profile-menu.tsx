"use client";

import Link from "next/link";
import { LogIn, LogOut, User, UserPlus } from "lucide-react";

interface ProfileMenuProps {
  onNavigate?: () => void;
}

export default function ProfileMenu({
  onNavigate,
}: ProfileMenuProps) {
  const profileLinks = [
    {
      name: "Login",
      href: "/login",
      icon: LogIn,
    },
    {
      name: "Register",
      href: "/register",
      icon: UserPlus,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <>
      {profileLinks.map((link) => {
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-green-500"
          >
            <Icon className="h-4 w-4" />

            {link.name}
          </Link>
        );
      })}

      <div className="my-1 border-t border-zinc-800" />

      <button
        type="button"
        onClick={() => {
          // Add logout functionality later
          onNavigate?.();
        }}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-red-400"
      >
        <LogOut className="h-4 w-4" />

        Logout
      </button>
    </>
  );
}