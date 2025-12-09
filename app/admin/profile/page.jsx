// app/admin/profile/page.jsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { FiUser, FiMail, FiShield, FiSettings } from "react-icons/fi";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadMe() {
      try {
        const me = await apiFetch("/auth/me");
        setUser(me);
      } catch (err) {
        console.error(err);
      }
    }
    loadMe();
  }, []);

  if (!user) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-3 w-3 rounded-full border-2 border-slate-500 border-t-transparent animate-spin" />
          Loading profile…
        </div>
      </main>
    );
  }

  const initials =
    user.full_name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "AW";

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-50 tracking-tight">
            Profile
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Overview of your account details.
          </p>
        </div>
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1.5 text-[11px] text-slate-200 hover:bg-slate-800/80 transition"
        >
          <FiSettings size={13} />
          Settings
        </Link>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex gap-4 items-center">
        <div className="h-14 w-14 rounded-2xl bg-slate-800 flex items-center justify-center text-lg font-semibold text-slate-50">
          {initials}
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2 text-slate-100">
            <FiUser className="text-slate-400" />
            <span>{user.full_name}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-xs">
            <FiMail className="text-slate-400" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <FiShield className="text-slate-400" />
            <span className="uppercase tracking-wide">
              {user.role?.name || "User"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
