"use client";

import { useCart } from "@/context/cart-context";

interface DeliveryInfo {
    name: string;
    phone: string;
    location: string;
    note: string;
}

interface OrderReviewProps {
    deliveryInfo: DeliveryInfo;
    paymentMethod: string;
    onSubmit: () => void | Promise<void>;
}

export default function OrderReview({
    deliveryInfo,
    paymentMethod,
    onSubmit,
}: OrderReviewProps) {
    const { cartTotal } = useCart();

    const shippingThreshold = 150;

    const shippingCost =
        cartTotal >= shippingThreshold || cartTotal === 0
            ? 0
            : 15;

    const tax = cartTotal * 0.08;

    const total = cartTotal + shippingCost + tax;

    const paymentLabels: Record<string, string> = {
        esewa: "eSewa Wallet",
        bank: "Bank",
        digital: "Digital Payment",
        card: "Credit / Debit Card",
    };

    const isValid =
        deliveryInfo.name.trim() &&
        deliveryInfo.phone.trim() &&
        deliveryInfo.location.trim();

    return (
        <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-zinc-900 bg-zinc-900/10 p-6">
                <h2 className="text-lg font-bold text-white mb-6">
                    Order Review
                </h2>

                <div className="space-y-4 text-sm">
                    <div className="flex justify-between text-zinc-400">
                        <span>Subtotal</span>
                        <span>Rs. {cartTotal}</span>
                    </div>

                    <div className="flex justify-between text-zinc-400">
                        <span>Shipping</span>
                        <span>
                            {shippingCost === 0
                                ? "Free"
                                : `Rs. ${shippingCost}`}
                        </span>
                    </div>

                    <div className="flex justify-between text-zinc-400">
                        <span>Tax</span>
                        <span>Rs. {tax.toFixed(2)}</span>
                    </div>

                    <div className="border-t border-zinc-900 pt-4 flex justify-between font-bold text-white">
                        <span>Total</span>
                        <span className="text-green-500">
                            Rs. {total.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="mt-6 border-t border-zinc-900 pt-6">
                    <p className="text-xs text-zinc-500">
                        Payment Method
                    </p>

                    <p className="mt-1 font-semibold text-white">
                        {paymentLabels[paymentMethod]}
                    </p>
                </div>

                <button
                    type="button"
                    disabled={!isValid}
                    onClick={onSubmit}
                    className="mt-8 w-full rounded-full bg-green-500 px-6 py-4 text-sm font-bold text-zinc-950 transition-all hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Continue to Payment
                </button>
            </div>
        </div>
    );
}
