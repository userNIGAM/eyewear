"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Product } from "@/types/product";
import { useCart } from "@/context/cart-context";

interface CartItemProps {
    product: Product;
    quantity: number;
}

export default function CartItem({
    product,
    quantity,
}: CartItemProps) {
    const {
        updateQuantity,
        removeFromCart,
    } = useCart();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-zinc-900 rounded-2xl bg-zinc-900/15 hover:bg-zinc-900/25 transition-all"
        >
            <div className="flex items-center gap-4">
                <Link
                    href={`/shop/${product.id}`}
                    className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950"
                >
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover object-center"
                    />
                </Link>

                <div>
                    <Link
                        href={`/shop/${product.id}`}
                        className="font-bold text-white hover:text-green-500 transition-colors text-base"
                    >
                        {product.title}
                    </Link>

                    <p className="text-xs text-zinc-500 mt-0.5">
                        {product.category}
                    </p>

                    <p className="text-sm font-semibold text-zinc-300 mt-1">
                        Rs. {product.price}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-end gap-6 w-full sm:w-auto">
                <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 p-0.5">
                    <button
                        onClick={() =>
                            updateQuantity(product.id, quantity - 1)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        aria-label="Decrease quantity"
                    >
                        <Minus className="h-3 w-3" />
                    </button>

                    <span className="w-8 text-center text-xs font-semibold text-white">
                        {quantity}
                    </span>

                    <button
                        onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        aria-label="Increase quantity"
                    >
                        <Plus className="h-3 w-3" />
                    </button>
                </div>

                <span className="font-bold text-white text-sm min-w-[60px] text-right">
                    Rs. {product.price * quantity}
                </span>

                <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                    aria-label="Delete item"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    );
}