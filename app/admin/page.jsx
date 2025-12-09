// app/admin/page.jsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import {
  FiUsers,
  FiShield,
  FiActivity,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [usersData, rolesData] = await Promise.all([
          apiFetch("/users").catch(() => []),
          apiFetch("/roles").catch(() => []),
        ]);
        if (!mounted) return;
        setUsers(usersData);
        setRoles(rolesData);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.is_active).length;
  const totalRoles = roles.length;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-50 tracking-tight">
          Overview
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Quick snapshot of your AW Admin console.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Total Users
              </p>
              <p className="text-2xl font-semibold text-slate-50">
                {loading ? "—" : totalUsers}
              </p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-slate-800 flex items-center justify-center">
              <FiUsers className="text-slate-50" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            All accounts across admin, HR, managers and employees.
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Active Users
              </p>
              <p className="text-2xl font-semibold text-emerald-400">
                {loading ? "—" : activeUsers}
              </p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center">
              <FiActivity className="text-emerald-300" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            Users with active access to the system.
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Roles
              </p>
              <p className="text-2xl font-semibold text-slate-50">
                {loading ? "—" : totalRoles}
              </p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-slate-800 flex items-center justify-center">
              <FiShield className="text-slate-50" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            Access levels like admin, manager, HR, employee.
          </p>
        </div>
      </div>

      {/* Lower section */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-50">
                Quick Actions
              </p>
              <p className="text-[11px] text-slate-400">
                Jump to common admin tasks.
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
              <FiArrowRight className="text-slate-100" size={14} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <a
              href="/admin/users"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-950 hover:bg-white"
            >
              <FiUsers size={12} />
              Manage users
            </a>
            <a
              href="/admin/roles"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-slate-100 border border-slate-700 hover:bg-slate-800"
            >
              <FiShield size={12} />
              Manage roles
            </a>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-50">
                System Status
              </p>
              <p className="text-[11px] text-slate-400">
                Basic health indicators.
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
              <FiClock className="text-slate-100" size={14} />
            </div>
          </div>
          <ul className="text-[11px] text-slate-400 space-y-1.5">
            <li>• Backend: Flask API with JWT auth</li>
            <li>• Frontend: Next.js App Router / Tailwind</li>
            <li>
              • Protected routes: <span className="text-slate-200">/admin/*</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
