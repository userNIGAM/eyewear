"use client";

import {
    Wallet,
    Landmark,
    Smartphone,
    CreditCard,
} from "lucide-react";

interface PaymentMethodProps {
    value: string;
    onChange: (value: string) => void;
}

const paymentMethods = [
    {
        id: "esewa",
        title: "Wallet",
        description: "Pay securely using eSewa",
        icon: Wallet,
    },
    {
        id: "bank",
        title: "Bank",
        description: "Pay directly through your bank",
        icon: Landmark,
    },
    {
        id: "digital",
        title: "Digital Payment",
        description: "Use your preferred digital payment",
        icon: Smartphone,
    },
    {
        id: "card",
        title: "Credit / Debit Card",
        description: "Pay using Visa, Mastercard, etc.",
        icon: CreditCard,
    },
];

export default function PaymentMethod({
    value,
    onChange,
}: PaymentMethodProps) {
    return (
        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 p-6">
            <h2 className="text-xl font-bold text-white mb-6">
                Payment Method
            </h2>

            <div className="space-y-3">
                {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const selected = value === method.id;

                    return (
                        <button
                            key={method.id}
                            type="button"
                            onClick={() => onChange(method.id)}
                            className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${selected
                                    ? "border-green-500 bg-green-500/10"
                                    : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                                }`}
                        >
                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-xl ${selected
                                        ? "bg-green-500 text-zinc-950"
                                        : "bg-zinc-900 text-zinc-400"
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                            </div>

                            <div className="flex-1">
                                <p className="font-semibold text-white">
                                    {method.title}
                                </p>

                                <p className="text-xs text-zinc-500 mt-1">
                                    {method.description}
                                </p>
                            </div>

                            <div
                                className={`h-5 w-5 rounded-full border flex items-center justify-center ${selected
                                        ? "border-green-500"
                                        : "border-zinc-700"
                                    }`}
                            >
                                {selected && (
                                    <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}