"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();

  const transactionUuid = searchParams.get("transaction_uuid");

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />

        <h1 className="mt-5 text-2xl font-bold">Payment Successful</h1>

        <p className="mt-3 text-sm text-zinc-400">
          Your eSewa payment has been verified successfully.
        </p>

        {transactionUuid && (
          <div className="mt-5 rounded-lg bg-zinc-950 p-3 text-left">
            <p className="text-xs text-zinc-500">Transaction ID</p>

            <p className="mt-1 break-all text-sm text-zinc-200">
              {transactionUuid}
            </p>
          </div>
        )}

        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-green-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-green-400"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
