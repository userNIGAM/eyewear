import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function PaymentFailurePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <AlertCircle className="h-7 w-7" />
        </div>

        <h1 className="text-2xl font-bold text-white">
          Payment not completed
        </h1>

        <p className="mt-3 text-sm text-zinc-400">
          The eSewa transaction failed or was cancelled.
        </p>

        <Link
          href="/cart"
          className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-green-500 px-6 py-3.5 text-sm font-bold text-zinc-950 transition hover:bg-green-400"
        >
          Back to Cart
        </Link>
      </div>
    </main>
  );
}
