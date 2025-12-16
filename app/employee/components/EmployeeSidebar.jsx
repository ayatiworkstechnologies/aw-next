"use client";

import Link from "next/link";
import { FiGrid, FiClipboard, FiUser, FiLogOut } from "react-icons/fi";

const nav = [
  { href: "/employee", label: "Dashboard", icon: FiGrid },
  { href: "/employee/tasks", label: "My Tasks", icon: FiClipboard },
  { href: "/employee/profile", label: "Profile", icon: FiUser },
];

export default function EmployeeSidebar({
  user,
  pathname,
  sidebarOpen,
  setSidebarOpen,
  onLogout,
}) {
  const isActive = (href) => pathname === href;

  return (
    <aside className={`w-64 bg-surface border-r fixed inset-y-0 z-40 transform lg:translate-x-0 transition ${
      sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    }`}>
      <div className="h-16 flex items-center px-5 border-b font-semibold">
        Employee
      </div>

      <nav className="p-3 space-y-1 text-sm">
        {nav.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                isActive(item.href)
                  ? "bg-slate-900 text-white"
                  : "hover:bg-slate-100"
              }`}
            >
              <Icon size={16} /> {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 border-t">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 text-white py-2 text-xs"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
}
