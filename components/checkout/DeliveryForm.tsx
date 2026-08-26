"use client";

interface DeliveryInfo {
    name: string;
    phone: string;
    location: string;
    note: string;
}

interface DeliveryFormProps {
    value: DeliveryInfo;
    onChange: (value: DeliveryInfo) => void;
}

export default function DeliveryForm({
    value,
    onChange,
}: DeliveryFormProps) {
    const updateField = (
        field: keyof DeliveryInfo,
        fieldValue: string
    ) => {
        onChange({
            ...value,
            [field]: fieldValue,
        });
    };

    return (
        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 p-6">
            <h2 className="text-xl font-bold text-white mb-6">
                Delivery Details
            </h2>

            <div className="space-y-5">
                <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                        Full Name
                    </label>

                    <input
                        type="text"
                        value={value.name}
                        onChange={(e) =>
                            updateField("name", e.target.value)
                        }
                        placeholder="Enter your full name"
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-green-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                        Phone Number
                    </label>

                    <input
                        type="tel"
                        value={value.phone}
                        onChange={(e) =>
                            updateField("phone", e.target.value)
                        }
                        placeholder="98XXXXXXXX"
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-green-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                        Delivery Location
                    </label>

                    <textarea
                        value={value.location}
                        onChange={(e) =>
                            updateField("location", e.target.value)
                        }
                        placeholder="Enter your complete delivery address"
                        rows={3}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-green-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                        Delivery Note
                        <span className="ml-2 text-zinc-600">
                            (Optional)
                        </span>
                    </label>

                    <textarea
                        value={value.note}
                        onChange={(e) =>
                            updateField("note", e.target.value)
                        }
                        placeholder="Example: Please call me before delivery"
                        rows={3}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-green-500"
                    />
                </div>
            </div>
        </div>
    );
}