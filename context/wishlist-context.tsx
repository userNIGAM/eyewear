"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types/product";

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("eyewear_wishlist");
      if (stored) {
        setWishlistItems(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    }
    setIsLoaded(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("eyewear_wishlist", JSON.stringify(wishlistItems));
    } catch (err) {
      console.error("Failed to save wishlist:", err);
    }
  }, [wishlistItems, isLoaded]);

  const addToWishlist = (product: Product) => {
    setWishlistItems((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((p) => p.id === productId);
  };

  const clearWishlist = () => setWishlistItems([]);

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
