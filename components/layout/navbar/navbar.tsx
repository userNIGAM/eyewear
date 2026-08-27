"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Heart, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";

import DesktopNav from "./desktop-nav";
import Logo from "./logo";
import MobileNav from "./mobile-nav";
import ProfileMenu from "./profile-menu";

const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
];

export default function Navbar() {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [desktopProfileOpen, setDesktopProfileOpen] =
    useState(false);

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  if (isAuthRoute) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Logo onClick={handleCloseMobileMenu} />

        {/* Desktop Navigation */}
        <DesktopNav />

        {/* Right Side */}
        <div className="flex items-center gap-2">
          
          {/* Shopping Cart */}
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-green-500"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] font-extrabold text-zinc-950 shadow-md shadow-green-500/30">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-rose-500"
            aria-label="Wishlist"
          >
            <Heart className="h-4 w-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white shadow-md shadow-rose-500/30">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Desktop Profile */}
          <div
            className="relative hidden md:block"
            onMouseEnter={() =>
              setDesktopProfileOpen(true)
            }
            onMouseLeave={() =>
              setDesktopProfileOpen(false)
            }
          >
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-green-500"
              aria-label="Profile menu"
            >
              <User className="h-5 w-5" />
            </button>

            <AnimatePresence>
              {desktopProfileOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 8,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="absolute right-0 top-full mt-3 w-48 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-xl"
                >
                  <ProfileMenu />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-zinc-900 hover:text-green-500 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={handleCloseMobileMenu}
      />
    </header>
  );
}
