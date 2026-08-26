"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`Added ${quantity} x ${product.title} to your cart!`);
  };

  const handleOrderNow = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      {product.inStock && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-zinc-400">Quantity:</span>
          <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 p-1">
            <button
              onClick={handleDecrement}
              className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
              type="button"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-10 text-center text-sm font-semibold text-white">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
              type="button"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={handleOrderNow}
          disabled={!product.inStock}
          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-8 py-4 text-sm font-bold text-zinc-950 shadow-lg shadow-green-500/20 transition-all hover:bg-green-400 active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed"
          type="button"
        >
          <Check className="h-4 w-4" />
          <span>Order Now</span>
        </button>

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-8 py-4 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-900 hover:text-white active:scale-[0.98] disabled:border-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed"
          type="button"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
