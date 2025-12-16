"use client";

import { FiUsers, FiUserPlus, FiClipboard } from "react-icons/fi";

export default function HRDashboard() {
  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">
          HR Dashboard
        </h1>
        <p className="text-xs text-slate-500">
          Manage employees & recruitment
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card icon={<FiUsers />} title="Total Employees" value="128" />
        <Card icon={<FiUserPlus />} title="New Joiners" value="5" />
        <Card icon={<FiClipboard />} title="Pending Requests" value="3" />
      </div>

      <section className="bg-white rounded-2xl border p-5">
        <h2 className="text-sm font-semibold mb-2">HR Actions</h2>
        <ul className="text-xs text-slate-600 space-y-1">
          <li>• Review leave requests</li>
          <li>• Update employee records</li>
          <li>• Schedule interviews</li>
        </ul>
      </section>
    </main>
  );
}

function Card({ icon, title, value }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
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
