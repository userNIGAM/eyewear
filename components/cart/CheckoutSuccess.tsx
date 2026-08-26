import Link from "next/link";
import { CheckCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutSuccess() {
    return (
        <div className="relative min-h-[85vh] flex items-center justify-center bg-zinc-950 px-4">
            <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center backdrop-blur-xl shadow-2xl"
            >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 text-green-500">
                    <CheckCircle className="h-8 w-8" />
                </div>

                <div className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400 font-semibold mb-4">
                    <Sparkles className="h-3 w-3" />
                    <span>Success!</span>
                </div>

                <h1 className="text-2xl font-extrabold text-white tracking-tight mb-2">
                    Order Placed Successfully!
                </h1>

                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                    Thank you for your purchase. We are preparing your
                    premium eyewear and will send a tracking link shortly.
                </p>

                <Link
                    href="/shop"
                    className="w-full inline-flex items-center justify-center rounded-full bg-green-500 px-6 py-3.5 text-sm font-bold text-zinc-950 shadow-lg shadow-green-500/20 transition-all hover:bg-green-400"
                >
                    Continue Shopping
                </Link>
            </motion.div>
        </div>
    );
}