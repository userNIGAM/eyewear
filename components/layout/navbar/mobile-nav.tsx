"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, User } from "lucide-react";

import { navLinks } from "./nav-links";
import ProfileMenu from "./profile-menu";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({
  isOpen,
  onClose,
}: MobileNavProps) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  const handleNavigation = () => {
    setProfileOpen(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden border-t border-zinc-800 bg-zinc-950 md:hidden"
        >
          <div className="space-y-1 px-4 py-4">
            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleNavigation}
                className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-zinc-900 text-green-500"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                }`}
              >
                {link.name}

                {link.name === "Wishlist" && (
                  <Heart className="h-4 w-4" />
                )}
              </Link>
            ))}

            <div className="my-3 border-t border-zinc-800" />

            {/* Account Button */}
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-zinc-300 transition hover:bg-zinc-900 hover:text-green-500"
            >
              <span className="flex items-center gap-3">
                <User className="h-5 w-5" />
                Account
              </span>

              <motion.span
                animate={{
                  rotate: profileOpen ? 180 : 0,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                ▼
              </motion.span>
            </button>

            {/* Profile Links */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1 pl-4 pt-2">
                    <ProfileMenu
                      onNavigate={handleNavigation}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}