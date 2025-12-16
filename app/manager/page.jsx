"use client";

import { FiBarChart2, FiUsers, FiAlertCircle } from "react-icons/fi";

export default function ManagerDashboard() {
  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">
          Manager Dashboard
        </h1>
        <p className="text-xs text-slate-500">
          Team overview & performance
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card icon={<FiUsers />} title="Team Members" value="18" />
        <Card icon={<FiBarChart2 />} title="Active Projects" value="4" />
        <Card icon={<FiAlertCircle />} title="Pending Reviews" value="2" />
      </div>

      <section className="bg-white rounded-2xl border p-5">
        <h2 className="text-sm font-semibold mb-2">Manager Notes</h2>
        <p className="text-xs text-slate-600">
          Track team progress and resolve blockers efficiently.
        </p>
      </section>
    </main>
  );
}

function Card({ icon, title, value }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-xs text-slate-500">{title}</p>
          <p className="text-sm font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}
