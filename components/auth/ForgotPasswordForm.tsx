"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowLeft, CheckCircle2, Mail } from "lucide-react";

interface FormErrors {
  email?: string;
}

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          email: data.message || "Unable to process your request.",
        });

        return;
      }

      setSuccessMessage(
        data.message ||
          "If an account exists with this email, a password reset OTP has been sent.",
      );

      // Optional:
      // For development, your backend returns developmentOTP
      if (data.developmentOTP) {
        console.log("Development OTP:", data.developmentOTP);
      }
    } catch (error) {
      console.error("Forgot password request failed:", error);

      setErrors({
        email: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl sm:p-8">
          {/* Back Button */}
          <Link
            href="/login"
            className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-green-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-zinc-100 sm:text-3xl">
              Forgot Password?
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Enter your email address and we&apos;ll send you a password reset
              OTP.
            </p>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 flex items-start gap-2 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                <p>{successMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);

                    if (errors.email) {
                      setErrors((prev) => ({
                        ...prev,
                        email: undefined,
                      }));
                    }
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`w-full rounded-xl border bg-zinc-950 py-3 pl-11 pr-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 ${
                    errors.email
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-zinc-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                  }`}
                />
              </div>

              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-2 flex items-center gap-1 text-xs text-red-400"
                  >
                    <AlertCircle className="h-3.5 w-3.5" />

                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-green-500 text-sm font-semibold text-zinc-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending OTP..." : "Send Reset OTP"}
            </motion.button>
          </form>

          {/* Login */}
          <p className="mt-7 text-center text-sm text-zinc-400">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-medium text-green-500 transition hover:text-green-400"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
