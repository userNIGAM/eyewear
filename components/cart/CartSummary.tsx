"use client";

import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartSummaryProps {
    cartTotal: number;
    shippingCost: number;
    estimatedTax: number;
    orderTotal: number;
    shippingThreshold: number;
}

export default function CartSummary({
    cartTotal,
    shippingCost,
    estimatedTax,
    orderTotal,
    shippingThreshold,
}: CartSummaryProps) {
    const router = useRouter();

    return (
        <div className="lg:col-span-4">
            <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-6">
                    Order Summary
                </h3>

                <div className="space-y-4 text-sm">
                    <div className="flex justify-between text-zinc-400">
                        <span>Subtotal</span>
                        <span className="font-semibold text-zinc-200">
                            Rs. {cartTotal}
                        </span>
                    </div>

                    <div className="flex justify-between text-zinc-400">
                        <span>Shipping</span>

                        {shippingCost === 0 ? (
                            <span className="font-semibold text-green-500">
                                Free
                            </span>
                        ) : (
                            <span className="font-semibold text-zinc-200">
                                Rs. {shippingCost}
                            </span>
                        )}
                    </div>

                    <div className="flex justify-between text-zinc-400">
                        <span>Estimated Tax (8%)</span>

                        <span className="font-semibold text-zinc-200">
                            Rs. {estimatedTax.toFixed(2)}
                        </span>
                    </div>

                    {shippingCost > 0 && (
                        <div className="rounded-xl bg-zinc-900/40 border border-zinc-800/50 p-3 text-xs text-zinc-500">
                            Add{" "}
                            <span className="text-green-500 font-semibold">
                                Rs. {shippingThreshold - cartTotal}
                            </span>{" "}
                            more to unlock{" "}
                            <span className="text-white font-semibold">
                                Free Shipping
                            </span>
                            !
                        </div>
                    )}

                    <div className="border-t border-zinc-900 pt-4 flex justify-between text-base font-bold text-white">
                        <span>Total</span>

                        <span className="text-green-500">
                            Rs. {orderTotal.toFixed(2)}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => router.push("/delivery-information")}
                    className="w-full mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-4 text-sm font-bold text-zinc-950 shadow-lg shadow-green-500/20 transition-all hover:bg-green-400 active:scale-[0.98]"
                >
                    <CreditCard className="h-4 w-4" />
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
}