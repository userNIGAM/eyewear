import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function CartEmpty() {
    return (
        <div className="flex flex-col items-center justify-center border border-zinc-900 rounded-2xl p-16 text-center bg-zinc-900/10">
            <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 mb-6">
                <ShoppingBag className="h-8 w-8" />
            </div>

            <h2 className="text-xl font-bold text-white mb-2">
                Your cart is empty
            </h2>

            <p className="text-zinc-400 text-sm max-w-sm mb-8">
                Browse our signature collections and find the perfect
                frame designed to redefine your vision.
            </p>

            <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-zinc-950"
            >
                <ArrowLeft className="h-4 w-4" />
                <span>Go to Shop</span>
            </Link>
        </div>
    );
}