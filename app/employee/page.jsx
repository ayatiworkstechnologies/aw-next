"use client";

import { FiClock, FiCheckCircle, FiUser, FiList } from "react-icons/fi";

export default function EmployeeDashboard() {
  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">
          Employee Dashboard
        </h1>
        <p className="text-xs text-slate-500">
          Overview of your work & profile
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard icon={<FiClock />} title="Attendance" value="Present" />
        <StatCard icon={<FiList />} title="Total Tasks" value="18" />
        <StatCard icon={<FiCheckCircle />} title="Completed" value="12" />
        <StatCard icon={<FiUser />} title="Profile" value="Active" />
      </div>

      {/* Notes */}
      <section className="bg-white rounded-2xl border p-5">
        <h2 className="text-sm font-semibold mb-2">Today’s Reminder</h2>
        <p className="text-xs text-slate-600">
          Complete assigned tasks and update progress before end of day.
        </p>
      </section>
    </main>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
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
