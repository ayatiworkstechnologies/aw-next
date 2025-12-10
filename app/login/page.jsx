// app/login/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, setToken, setCurrentUser } from "../lib/api";
import Swal from "sweetalert2";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      setToken(data.token);
      setCurrentUser(data.user);

      Swal.fire({
        icon: "success",
        title: "Welcome back!",
        text: `Logged in as ${data.user?.full_name || "Admin"}`,
        timer: 1400,
        showConfirmButton: false,
      });

      router.push("/admin");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: err.message || "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">

        {/* LEFT: Image / Video */}
        <div className="hidden md:block relative bg-slate-900">
          {/* 🔁 Use VIDEO */}
          <video
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            {/* put your real video here */}
            <source src="/admin-hero.mp4" type="video/mp4" />
          </video>

          {/* Or, if you prefer IMAGE, comment video above and use this:
          <img
            src="/admin-hero.jpg"
            alt="Admin dashboard preview"
            className="h-full w-full object-cover"
          />
          */}

          {/* Optional overlay + small caption */}
          <div className="absolute inset-0 bg-slate-900/40" />
          <div className="absolute inset-0 flex flex-col justify-between p-8 text-slate-50">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs mb-4">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Secure Admin Panel</span>
              </div>
              <h1 className="text-3xl font-semibold mb-2">AW Admin Console</h1>
              <p className="text-sm text-slate-200 max-w-sm">
                Real-time control over users, roles and internal operations.
              </p>
            </div>
            <p className="text-[11px] text-slate-200/80">
              FastAPI · JWT Auth · Role-based Access
            </p>
          </div>
        </div>

        {/* RIGHT: Login Form */}
        <div className="p-6 sm:p-8 flex flex-col justify-center bg-white">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center">
              <FiLogIn className="text-white" size={18} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Sign in
              </p>
              <h2 className="text-lg font-semibold text-slate-900">
                Admin Login
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Username */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Email or Username
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com or username"
                  className="w-full rounded-xl border border-slate-200 bg-white px-10 py-2 text-sm focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white px-10 pr-10 py-2 text-sm focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <label className="flex items-center gap-2 text-xs text-slate-500">
              <input type="checkbox" defaultChecked className="rounded" />
              Remember this device
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white py-2.5 text-sm font-medium hover:bg-slate-800 transition disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In to Dashboard"}
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              Seed admin:{" "}
              <span className="text-slate-700">admin@example.com</span> /{" "}
              <span className="font-mono text-slate-700">admin123</span>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
