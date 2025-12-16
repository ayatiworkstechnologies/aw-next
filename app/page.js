// app/login/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, setToken, setCurrentUser } from "./lib/api";
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

      /* ================= SAVE SESSION ================= */
      setToken(data.token);
      setCurrentUser(data.user);

      /* ================= ROLE BASED ROUTING ================= */
      const role = data.user?.role?.name?.toLowerCase();

      let redirectPath = "/";

      switch (role) {
        case "admin":
          redirectPath = "/admin";
          break;

        case "manager":
          redirectPath = "/manager";
          break;

        case "hr":
          redirectPath = "/hr";
          break;

        case "employee":
        case "intern":
          redirectPath = "/employee";
          break;

        default:
          redirectPath = "/dashboard"; // fallback
      }

      Swal.fire({
        icon: "success",
        title: "Welcome back!",
        text: `Logged in as ${data.user?.full_name || role}`,
        timer: 1300,
        showConfirmButton: false,
      });

      router.push(redirectPath);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: err?.message || "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">

        {/* ================= LEFT ================= */}
        <div className="hidden md:block relative bg-slate-900">
          <video
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/admin-hero.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-slate-900/40" />
          <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs mb-4">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Secure Access
              </div>
              <h1 className="text-3xl font-semibold mb-2">AW Admin Console</h1>
              <p className="text-sm text-slate-200 max-w-sm">
                Role-based dashboards for Admins, Managers, HR & Employees.
              </p>
            </div>
            <p className="text-[11px] text-slate-200/80">
              FastAPI · JWT · Role Guards
            </p>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
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
                Login to Dashboard
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Email or Username
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 px-10 py-2 text-sm focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none"
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
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-10 pr-10 py-2 text-sm focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white py-2.5 text-sm font-medium hover:bg-slate-800 transition disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
