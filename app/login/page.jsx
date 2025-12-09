// app/login/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, setToken, setCurrentUser } from "../lib/api";
import Swal from "sweetalert2";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Save token + user in localStorage
      setToken(data.token);
      setCurrentUser(data.user);

      Swal.fire({
        icon: "success",
        title: "Welcome back!",
        text: `Logged in as ${data.user?.full_name || "Admin"}`,
        timer: 1400,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      setTimeout(() => {
        router.push("/admin");
      }, 200);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: err.message || "Invalid credentials",
        confirmButtonColor: "#0f172a",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Left / Branding */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50 p-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs mb-4">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Secure Admin Panel</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight mb-3">
              AW Admin Console
            </h1>
            <p className="text-sm text-slate-300 max-w-sm">
              Manage users, roles, and internal operations from a single clean,
              secure dashboard built with Next.js and FastAPI.
            </p>
          </div>
          <div className="space-y-2 text-xs text-slate-400">
            <p>• Role-based access: admin, manager, HR, employee</p>
            <p>• JWT secured API on FastAPI backend</p>
            <p>• Modern UI powered by Tailwind CSS</p>
          </div>
        </div>

        {/* Right / Login form */}
        <div className="bg-slate-50/90 p-6 sm:p-8 flex flex-col justify-center">
          <div className="mb-6 flex items-center justify-center md:justify-start gap-2">
            <div className="h-10 w-10 rounded-2xl bg-slate-900 flex items-center justify-center">
              <FiLogIn className="text-slate-50" size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Sign in
              </p>
              <h2 className="text-lg font-semibold text-slate-900">
                Admin Login
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <FiMail size={16} />
                </span>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-200 bg-white px-10 py-2 text-sm outline-none ring-0 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <FiLock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-xl border border-slate-200 bg-white px-10 pr-10 py-2 text-sm outline-none ring-0 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember & CTA */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-3 w-3 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  defaultChecked
                />
                <span>Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white py-2.5 text-sm font-medium shadow-lg shadow-slate-900/20 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <FiLogIn size={16} />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-400 text-center mt-2">
              Use{" "}
              <span className="font-medium text-slate-700">
                admin@example.com
              </span>{" "}
              /{" "}
              <span className="font-mono text-slate-700">admin123</span> (seed
              admin).
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
