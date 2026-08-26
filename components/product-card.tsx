"use client";

import Image from "next/image";
import Link from "next/link";
import { CreditCard, Heart, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  rating?: number;
  category?: string;
}

export default function ProductCard({
  id,
  image,
  title,
  description,
  price,
  rating = 4.5,
  category = "Classic",
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();

  const productObj = {
    id,
    image,
    title,
    description,
    price,
    rating,
    category,
    details: { frameColor: "", lensColor: "", material: "", protection: "", dimensions: "" },
    inStock: true,
  };

  const wishlisted = isInWishlist(id);

  const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(productObj);
    router.push("/cart");
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(productObj);
  };

  const handleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist(productObj);
    }
  };

  return (
    <Link
      href={`/shop/${id}`}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900/20 p-4 transition-all duration-300 hover:border-zinc-800 hover:bg-zinc-900/40 hover:shadow-xl hover:shadow-green-500/[0.02]"
    >
      <div>
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-950 border border-zinc-900">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 25vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-zinc-950/80 px-2 py-0.5 text-xs text-amber-500 backdrop-blur-md border border-zinc-800">
            <Star className="h-3 w-3 fill-amber-500" />
            <span>{rating.toFixed(1)}</span>
          </div>

          {/* Wishlist Heart Button — top left of image */}
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute top-2 left-2 flex h-7 w-7 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-200 active:scale-90 ${
              wishlisted
                ? "border-rose-500/40 bg-rose-500/20 text-rose-500"
                : "border-zinc-800 bg-zinc-950/70 text-zinc-400 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400"
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 transition-all duration-200 ${
                wishlisted ? "fill-rose-500" : ""
              }`}
            />
          </button>
        </div>

        {/* Info */}
        <div className="mt-4 flex flex-col">
          <span className="text-xl font-bold text-white group-hover:text-green-500 transition-colors">
            Rs. {price}
          </span>
          <h3 className="text-base font-semibold text-zinc-100 mt-1 line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-5 flex items-center gap-2">
        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-xs font-bold text-zinc-950 transition-all hover:bg-green-400 active:scale-95"
        >
          <CreditCard className="h-3.5 w-3.5" />
          <span>Buy Now</span>
        </button>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-900 hover:text-green-500 active:scale-95"
          aria-label="Add to cart"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>
    </Link>
  );
}
