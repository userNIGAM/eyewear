"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Shop Page Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-zinc-950 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 border border-red-500/20 text-red-500 mb-6">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
      <p className="text-zinc-400 text-sm max-w-md leading-relaxed mb-8">
        We encountered an error loading the product catalog. Please try refreshing or resetting the view.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-full bg-green-500 px-8 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-green-500/20 transition-all hover:bg-green-400 active:scale-95"
      >
        Try Again
      </button>
    </div>
  );
}
