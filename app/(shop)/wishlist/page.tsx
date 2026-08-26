"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  ShoppingBag,
  Star,
  Trash2,
} from "lucide-react";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();

  const handleMoveToCart = (product: (typeof wishlistItems)[number]) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  const handleMoveAllToCart = () => {
    wishlistItems.forEach((product) => addToCart(product));
    clearWishlist();
    router.push("/cart");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-zinc-950 min-h-screen text-zinc-100">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-green-500 transition-colors mb-8 group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>Back</span>
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-900 pb-8 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/5 px-3 py-1 text-xs font-semibold text-rose-400 mb-3">
            <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
            <span>Saved Items</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            My Wishlist
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            {wishlistItems.length} item{wishlistItems.length !== 1 && "s"} saved
          </p>
        </div>

        {wishlistItems.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleMoveAllToCart}
              className="inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-xs font-bold text-zinc-950 shadow-lg shadow-green-500/20 transition-all hover:bg-green-400 active:scale-95"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Move All to Cart
            </button>
            <button
              onClick={clearWishlist}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 px-5 py-2.5 text-xs font-medium text-zinc-400 transition-all hover:border-red-500/30 hover:text-red-400 active:scale-95"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {wishlistItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center border border-zinc-900 rounded-2xl p-16 text-center bg-zinc-900/10"
        >
          <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-600 mb-6">
            <Heart className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-zinc-400 text-sm max-w-sm mb-8 leading-relaxed">
            Browse our collections and tap the heart icon on any frame you love
            to save it here.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-green-500/20 transition-all hover:bg-green-400"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Explore Shop</span>
          </Link>
        </motion.div>
      ) : (
        /* Wishlist Grid */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence initial={false}>
            {wishlistItems.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group flex flex-col justify-between rounded-2xl border border-zinc-900 bg-zinc-900/15 p-4 transition-all hover:border-zinc-800 hover:bg-zinc-900/35"
              >
                {/* Image */}
                <Link href={`/shop/${product.id}`}>
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-950 border border-zinc-900 mb-4">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Rating badge */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-zinc-950/80 px-2 py-0.5 text-xs text-amber-500 backdrop-blur-md border border-zinc-800">
                      <Star className="h-3 w-3 fill-amber-500" />
                      <span>{product.rating.toFixed(1)}</span>
                    </div>
                    {/* Heart filled indicator */}
                    <div className="absolute top-2 left-2 flex h-7 w-7 items-center justify-center rounded-full border border-rose-500/40 bg-rose-500/20 text-rose-500">
                      <Heart className="h-3.5 w-3.5 fill-rose-500" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mb-4">
                    <span className="text-lg font-bold text-white group-hover:text-green-500 transition-colors">
                      Rs. {product.price}
                    </span>
                    <h3 className="text-sm font-semibold text-zinc-100 mt-1 line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-auto">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-3 py-2.5 text-xs font-bold text-zinc-950 transition-all hover:bg-green-400 active:scale-95"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>Move to Cart</span>
                  </button>

                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition-all hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400 active:scale-95"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
