"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================
  // GET EMAIL
  // ============================================

  useEffect(() => {
    const queryEmail = searchParams.get("email");

    const storedEmail = sessionStorage.getItem("verificationEmail");

    const verificationEmail = queryEmail || storedEmail;

    if (verificationEmail) {
      setEmail(verificationEmail);
    }
  }, [searchParams]);

  // ============================================
  // VERIFY OTP
  // ============================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email) {
      setError("Email address is missing.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid OTP.");
        return;
      }

      setSuccess(data.message || "Email verified successfully!");

      // Remove temporary email
      sessionStorage.removeItem("verificationEmail");

      // Give user a moment to see success message
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error) {
      console.error("OTP verification failed:", error);

      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white">Verify Your Email</h1>

        <p className="mt-2 text-sm text-zinc-400">
          We sent a 6-digit verification code to:
        </p>

        <p className="mt-1 font-medium text-green-500">{email}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="otp"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Verification Code
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);

                setOtp(value);
                setError("");
              }}
              placeholder="123456"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-center text-xl tracking-[0.5em] text-white outline-none focus:border-green-500"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-400">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || otp.length !== 6}
            className="w-full rounded-xl bg-green-500 px-6 py-3.5 text-sm font-bold text-zinc-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.push("/register")}
          className="mt-6 w-full text-center text-sm text-zinc-400 hover:text-green-500"
        >
          Back to registration
        </button>
      </div>
    </main>
  );
}
