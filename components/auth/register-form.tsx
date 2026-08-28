"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score === 2) return { score, label: "Fair", color: "bg-amber-500" };
  if (score === 3) return { score, label: "Good", color: "bg-yellow-400" };
  return { score, label: "Strong", color: "bg-green-500" };
}

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registered] = useState(false);

  const strength = getPasswordStrength(password);

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name
    if (!name.trim()) {
      newErrors.name = "Name is required.";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    // Email
    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    // Confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // Terms
    if (!termsAccepted) {
      newErrors.terms = "You must accept the terms and conditions.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const text = await response.text();
      console.log("Registration API status:", response.status);
      console.log("Registration API response:", text);
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Server returned a non-JSON response (${response.status}).`,
        );
      }
      if (!response.ok) {
        if (data.field === "email") {
          setErrors({
            email: data.message || "This email is already registered.",
          });
        } else {
          setErrors({
            email: data.message || "Registration failed. Please try again.",
          });
        }

        return;
      }

      console.log("Registration successful:", data);
      sessionStorage.setItem("verificationEmail", email.trim().toLowerCase());
      router.push(
        `/verify-otp?email=${encodeURIComponent(email.trim().toLowerCase())}`,
      );
    } catch (error) {
      console.error("Registration failed:", error);

      setErrors({
        email: "Unable to connect to the server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleGoogleSignUp = () => {
    // Add Google OAuth here
    console.log("Google sign-up clicked");
  };

  // Success screen
  if (registered) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-2xl"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Account Created!
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">
            Welcome aboard,{" "}
            <span className="text-white font-semibold">
              {name.split(" ")[0]}
            </span>
            ! Your account has been created successfully. Start exploring our
            premium eyewear collections.
          </p>
          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center rounded-xl bg-green-500 px-6 py-3.5 text-sm font-bold text-zinc-950 shadow-lg shadow-green-500/20 transition-all hover:bg-green-400 active:scale-[0.98]"
          >
            Sign In to Your Account
          </Link>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Register Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl sm:p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-zinc-100 sm:text-3xl">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Join us to discover premium eyewear crafted for your style.
            </p>
          </div>

          {/* Google Sign-Up */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleGoogleSignUp}
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

          {/* Register Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearError("name");
                  }}
                  placeholder="John Doe"
                  autoComplete="name"
                  className={`w-full rounded-xl border bg-zinc-950 py-3 pl-11 pr-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 ${
                    errors.name
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-zinc-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                  }`}
                />
              </div>
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-2 flex items-center gap-1 text-xs text-red-400"
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="reg-email"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
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
              <label
                htmlFor="reg-password"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError("password");
                  }}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
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

              {/* Password strength meter */}
              {password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2.5 space-y-1.5"
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? strength.color : "bg-zinc-800"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-500">
                    Strength:{" "}
                    <span
                      className={`font-semibold ${
                        strength.score <= 1
                          ? "text-red-400"
                          : strength.score <= 2
                            ? "text-amber-400"
                            : strength.score <= 3
                              ? "text-yellow-400"
                              : "text-green-400"
                      }`}
                    >
                      {strength.label}
                    </span>
                  </p>
                </motion.div>
              )}

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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearError("confirmPassword");
                  }}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className={`w-full rounded-xl border bg-zinc-950 py-3 pl-11 pr-12 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : confirmPassword && confirmPassword === password
                        ? "border-green-500 focus:ring-2 focus:ring-green-500/20"
                        : "border-zinc-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-green-500"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {/* Match indicator */}
              <AnimatePresence>
                {confirmPassword && confirmPassword === password && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-2 flex items-center gap-1 text-xs text-green-500"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Passwords match
                  </motion.p>
                )}
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-2 flex items-center gap-1 text-xs text-red-400"
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative mt-0.5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      clearError("terms");
                    }}
                    className="sr-only"
                  />

                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${
                      termsAccepted
                        ? "border-green-500 bg-green-500"
                        : errors.terms
                          ? "border-red-500 bg-zinc-950"
                          : "border-zinc-700 bg-zinc-950"
                    }`}
                  >
                    {termsAccepted && (
                      <svg
                        className="h-3 w-3 text-zinc-950"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                <span className="text-sm text-zinc-400 leading-relaxed">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-green-500 hover:text-green-400 transition"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-green-500 hover:text-green-400 transition"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <AnimatePresence>
                {errors.terms && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-2 flex items-center gap-1 text-xs text-red-400"
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.terms}
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
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </motion.button>
          </form>

          {/* Sign In Link */}
          <p className="mt-7 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-green-500 transition hover:text-green-400"
            >
              Sign in
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
