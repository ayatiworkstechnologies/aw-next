"use client";

const TASKS = [
  { id: 1, title: "Design landing page", status: "Completed", due: "12 Sep" },
  { id: 2, title: "Fix login validation", status: "In Progress", due: "14 Sep" },
  { id: 3, title: "Prepare report", status: "Pending", due: "16 Sep" },
];

export default function EmployeeTasks() {
  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">
          My Tasks
        </h1>
        <p className="text-xs text-slate-500">
          Track and manage your assigned work
        </p>
      </header>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">Task</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {TASKS.map(task => (
              <tr key={task.id} className="border-t hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{task.title}</td>
                <td className="px-4 py-3">{task.due}</td>
                <td className="px-4 py-3">
                  <StatusPill status={task.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function StatusPill({ status }) {
  const colors = {
    Completed: "bg-emerald-50 text-emerald-700",
    "In Progress": "bg-indigo-50 text-indigo-700",
    Pending: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${colors[status]}`}>
      {status}
    </span>
  );
}
