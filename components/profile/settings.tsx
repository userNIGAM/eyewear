import { Settings, Truck, CreditCard } from "lucide-react";

export default function ProfileSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>

        <p className="mt-2 text-neutral-400">Manage future account settings.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-neutral-900 p-6">
          <Truck size={28} className="mb-4 text-neutral-300" />

          <h2 className="text-lg font-semibold">Delivery Information</h2>

          <p className="mt-2 text-sm leading-6 text-neutral-400">
            This is settings for delivery information. This feature will be
            available in future development.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-neutral-900 p-6">
          <CreditCard size={28} className="mb-4 text-neutral-300" />

          <h2 className="text-lg font-semibold">Payment Integration</h2>

          <p className="mt-2 text-sm leading-6 text-neutral-400">
            This is settings for payment integration. Payment methods and saved
            payment options will be added in future development.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-neutral-900 p-8 text-center">
        <Settings size={40} className="mx-auto mb-4 text-neutral-400" />

        <h2 className="text-xl font-semibold">This is settings</h2>

        <p className="mt-3 text-sm text-neutral-400">
          More account, delivery and payment settings will be added here in
          future updates.
        </p>
      </div>
    </div>
  );
}
