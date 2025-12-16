"use client";

import { FiMail, FiBriefcase, FiUser } from "react-icons/fi";

export default function EmployeeProfile() {
  // Later you can fetch this from getCurrentUser()
  const user = {
    full_name: "John Doe",
    email: "john@example.com",
    dept: "Web Development",
    role: "Employee",
    status: "Active",
  };

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">
          My Profile
        </h1>
        <p className="text-xs text-slate-500">
          View your personal details
        </p>
      </header>

      <div className="bg-white rounded-2xl border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-14 w-14 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg font-semibold">
            {user.full_name[0]}
          </div>
          <div>
            <h2 className="text-sm font-semibold">{user.full_name}</h2>
            <p className="text-xs text-slate-500">{user.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <ProfileItem icon={<FiMail />} label="Email" value={user.email} />
          <ProfileItem icon={<FiBriefcase />} label="Department" value={user.dept} />
          <ProfileItem icon={<FiUser />} label="Status" value={user.status} />
        </div>
      </div>
    </main>
  );
}

function ProfileItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 border rounded-xl p-3">
      <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-slate-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
