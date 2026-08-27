"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          email: data.message || "Invalid email or password.",
        });
        return;
      }

      console.log("Login successful:", data);

      // Redirect after successful login
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed:", error);

      setErrors({
        email: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    // Add Google authentication here
    console.log("Google login clicked");
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Login Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl sm:p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-zinc-100 sm:text-3xl">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Login to continue shopping for your favorite eyewear.
            </p>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleGoogleLogin}
              aria-label="Continue with Google"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 transition hover:border-green-500 hover:bg-zinc-700"
            >
              <GoogleIcon />
            </button>
          </div>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-800" />

            <span className="text-xs text-zinc-500">
              OR CONTINUE WITH EMAIL
            </span>

            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          {/* Login Form */}
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

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-zinc-300"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs text-green-500 transition hover:text-green-400"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);

                    if (errors.password) {
                      setErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }));
                    }
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`w-full rounded-xl border bg-zinc-950 py-3 pl-11 pr-12 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 ${
                    errors.password
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-zinc-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-green-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-2 flex items-center gap-1 text-xs text-red-400"
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-green-500 text-sm font-semibold text-zinc-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          {/* Register */}
          <p className="mt-7 text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-green-500 transition hover:text-green-400"
            >
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.79h3.14c1.84-1.69 2.91-4.18 2.91-7.76Z"
      />
      <path
        fill="#34A853"
        d="M12 21.75c2.62 0 4.82-.87 6.43-2.36l-3.14-2.79c-.87.58-1.99.92-3.29.92-2.53 0-4.68-1.71-5.45-4.01H3.31v2.88A9.72 9.72 0 0 0 12 21.75Z"
      />
      <path
        fill="#FBBC05"
        d="M6.55 13.51A5.85 5.85 0 0 1 6.24 12c0-.52.09-1.02.31-1.51V7.61H3.31A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.06 4.39l3.24-2.88Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.48c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.81 3.55 14.62 2.25 12 2.25a9.72 9.72 0 0 0-8.69 5.36l3.24 2.88c.77-2.3 2.92-4.01 5.45-4.01Z"
      />
    </svg>
  );
}
