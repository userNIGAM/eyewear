"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/context/cart-context";

import DeliveryForm from "@/components/checkout/DeliveryForm";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import OrderReview from "@/components/checkout/OrderReview";

export default function DeliveryInformationPage() {
    const router = useRouter();
    const { cartTotal } = useCart();

    const [paymentMethod, setPaymentMethod] = useState("esewa");

    const [deliveryInfo, setDeliveryInfo] = useState({
        name: "",
        phone: "",
        location: "",
        note: "",
    });

    const shippingThreshold = 150;
    const shippingCost =
        cartTotal >= shippingThreshold || cartTotal === 0 ? 0 : 15;
    const tax = cartTotal * 0.08;

    const handleSubmit = async () => {
        try {
            if (paymentMethod !== "esewa") {
                console.log({
                    deliveryInfo,
                    paymentMethod,
                });
                return;
            }

            const response = await fetch("/api/payments/esewa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: cartTotal,
                    taxAmount: tax,
                    serviceCharge: 0,
                    deliveryCharge: shippingCost,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to initialize payment",
                );
            }

            sessionStorage.setItem(
                "checkout_delivery_info",
                JSON.stringify({
                    deliveryInfo,
                    paymentMethod,
                    orderTotal: cartTotal + tax + shippingCost,
                }),
            );

            const form = document.createElement("form");
            form.method = "POST";
            form.action = data.actionUrl;
            form.style.display = "none";

            Object.entries(data.fields).forEach(([name, value]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = name;
                input.value = String(value);
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            console.error("eSewa checkout failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <button
                    onClick={() => router.back()}
                    className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-green-500"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Cart
                </button>

                <h1 className="text-3xl font-extrabold text-white">
                    Delivery Information
                </h1>

                <p className="mt-2 text-sm text-zinc-400">
                    Enter your delivery details and choose your preferred
                    payment method.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="space-y-8 lg:col-span-8">
                        <DeliveryForm
                            value={deliveryInfo}
                            onChange={setDeliveryInfo}
                        />

                        <PaymentMethod
                            value={paymentMethod}
                            onChange={setPaymentMethod}
                        />
                    </div>

                    <OrderReview
                        deliveryInfo={deliveryInfo}
                        paymentMethod={paymentMethod}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}
