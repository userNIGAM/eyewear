"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import DeliveryForm from "@/components/checkout/DeliveryForm";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import OrderReview from "@/components/checkout/OrderReview";

export default function DeliveryInformationPage() {
    const router = useRouter();

    const [paymentMethod, setPaymentMethod] = useState("esewa");

    const [deliveryInfo, setDeliveryInfo] = useState({
        name: "",
        phone: "",
        location: "",
        note: "",
    });

    const handleSubmit = () => {
        console.log({
            deliveryInfo,
            paymentMethod,
        });

        // Payment integration will be added here later.
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