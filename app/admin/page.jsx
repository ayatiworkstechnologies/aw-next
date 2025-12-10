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
    Promise.all([
      apiFetch("/users").catch(() => []),
      apiFetch("/roles").catch(() => []),
    ]).then(([u, r]) => {
      setUsers(u);
      setRoles(r);
      setLoading(false);
    });
  }, []);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.is_active).length;
  const totalRoles = roles.length;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Overview
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Quick snapshot of your admin console.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Users"
          value={loading ? "—" : totalUsers}
          icon={<FiUsers />}
        />
        <StatCard
          title="Active Users"
          value={loading ? "—" : activeUsers}
          icon={<FiActivity />}
          highlight
        />
        <StatCard
          title="Roles"
          value={loading ? "—" : totalRoles}
          icon={<FiShield />}
        />
      </div>

      {/* Lower */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <Header
            title="Quick Actions"
            subtitle="Jump to common admin tasks."
            icon={<FiArrowRight size={14} />}
          />
          <div className="flex gap-2 text-xs">
            <a
              href="/admin/users"
              className="px-3 py-1.5 rounded-full bg-primary text-white hover:opacity-90"
            >
              <FiUsers size={12} /> Manage users
            </a>
            <a
              href="/admin/roles"
              className="px-3 py-1.5 rounded-full border border-border hover:bg-slate-50"
            >
              <FiShield size={12} /> Manage roles
            </a>
          </div>
        </Card>

        <Card>
          <Header
            title="System Status"
            subtitle="Basic health indicators."
            icon={<FiClock size={14} />}
          />
          <ul className="text-xs text-slate-500 space-y-1.5">
            <li>• Backend: FastAPI + JWT</li>
            <li>• Frontend: Next.js + Tailwind</li>
            <li>• Protected routes: <span className="text-slate-900">/admin/*</span></li>
          </ul>
        </Card>
      </div>
    </section>
  );
}

/* 🔹 Small components */
function Card({ children }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-4 space-y-3">
      {children}
    </div>
  );
}

function Header({ title, subtitle, icon }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, highlight }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-4 flex justify-between items-center">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">
          {title}
        </p>
        <p className={`text-2xl font-semibold ${highlight ? "text-emerald-600" : "text-slate-900"}`}>
          {value}
        </p>
      </div>
      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}
