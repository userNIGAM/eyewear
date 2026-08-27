"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentFailurePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />

        <h1 className="mt-5 text-2xl font-bold">Payment Failed</h1>

        <p className="mt-3 text-sm text-zinc-400">
          Your eSewa payment was not completed. No payment has been confirmed
          for this order.
        </p>

        <Link
          href="/checkout"
          className="mt-6 inline-flex rounded-lg bg-green-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-green-400"
        >
          Return to Checkout
        </Link>
      </div>
    </main>
  );
}
