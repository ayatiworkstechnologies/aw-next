// app/admin/components/AdminSidebar.jsx
"use client";

import Link from "next/link";
import { FiGrid, FiUsers, FiShield, FiLogOut, FiX, FiMenu, FiSettings } from "react-icons/fi";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: FiGrid },
  { href: "/admin/users", label: "Users", icon: FiUsers },
  { href: "/admin/roles", label: "Roles", icon: FiShield },
  { href: "/admin/settings", label: "Settings", icon: FiSettings },

];

export default function AdminSidebar({
  user,
  pathname,
  sidebarOpen,
  setSidebarOpen,
  onLogout,
}) {
  const initials =
    user.full_name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "AW";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-950 border-r border-slate-800/60">
        <div className="h-16 flex items-center px-5 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-slate-100 flex items-center justify-center">
              <span className="text-xs font-black tracking-tight text-slate-950">
                AW
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">AW Admin</p>
              <p className="text-[11px] text-slate-400 leading-tight">
                Internal console
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition ${
                  active
                    ? "bg-slate-100 text-slate-950 font-medium"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-4 border-t border-slate-800/60 pt-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{user.full_name}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                {user.role?.name || "User"}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 text-slate-100 py-1.5 text-xs hover:bg-slate-700 transition"
          >
            <FiLogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-64 bg-slate-950 border-r border-slate-800/60 transform transition-transform lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-slate-100 flex items-center justify-center">
              <span className="text-xs font-black tracking-tight text-slate-950">
                AW
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">AW Admin</p>
              <p className="text-[11px] text-slate-400 leading-tight">
                Internal console
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-800"
          >
            <FiX size={16} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition ${
                  active
                    ? "bg-slate-100 text-slate-950 font-medium"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-4 border-t border-slate-800/60 pt-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{user.full_name}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                {user.role?.name || "User"}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 text-slate-100 py-1.5 text-xs hover:bg-slate-700 transition"
          >
            <FiLogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
