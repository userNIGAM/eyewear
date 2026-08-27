"use client";

import { FormEvent, useState } from "react";
import {
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminRegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminSecret, setAdminSecret] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          adminSecret,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      setSuccess(
        "Admin account created successfully. You can now login.",
      );

      setFullName("");
      setEmail("");
      setPassword("");
      setAdminSecret("");

      setTimeout(() => {
        router.push("/admin/login");
      }, 1200);
    } catch {
      setError("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black">
            <ShieldCheck size={28} />
          </div>

          <h1 className="text-3xl font-semibold">
            Create Admin Account
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Create an administrator for your eyewear store
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                {success}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Store Administrator"
                  required
                  minLength={3}
                  className="w-full rounded-xl border border-white/10 bg-black/30 py-3.5 pl-11 pr-4 outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yourstore.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/30 py-3.5 pl-11 pr-4 outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-white/10 bg-black/30 py-3.5 pl-11 pr-12 outline-none focus:border-white/30"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Admin Registration Secret
              </label>

              <div className="relative">
                <KeyRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type={showSecret ? "text" : "password"}
                  value={adminSecret}
                  onChange={(e) =>
                    setAdminSecret(e.target.value)
                  }
                  placeholder="Enter admin secret"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/30 py-3.5 pl-11 pr-12 outline-none focus:border-white/30"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowSecret((value) => !value)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showSecret ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <p className="mt-2 text-xs text-zinc-500">
                This secret is required to create an administrator.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white py-3.5 font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Creating account..."
                : "Create Admin Account"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}