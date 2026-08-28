"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, User, UserPlus } from "lucide-react";

interface ProfileMenuProps {
  onNavigate?: () => void;
}

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
}

export default function ProfileMenu({
  onNavigate,
}: ProfileMenuProps) {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (!mounted) return;

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data: { user?: CurrentUser } = await response.json();
        setUser(data.user ?? null);
      } catch {
        if (mounted) {
          setUser(null);
        }
      }
    };

    loadCurrentUser();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
      setIsLoggingOut(false);
      onNavigate?.();
      router.push("/login");
      router.refresh();
    }
  };

  const profileLinks = user
    ? [
        {
          name: "Profile",
          href: "/profile",
          icon: User,
        },
      ]
    : [
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

      {user && (
        <>
          <div className="my-1 border-t border-zinc-800" />

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />

            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </>
      )}
    </>
  );
}
