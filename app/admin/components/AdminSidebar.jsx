// app/admin/components/AdminSidebar.jsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  FiGrid,
  FiUsers,
  FiShield,
  FiLogOut,
  FiX,
  FiSettings,
  FiFileText,
  FiChevronDown,
  FiPlus,
  FiPlusSquare,
  FiTag,
  FiUser,
  FiCodepen
} from "react-icons/fi";

const mainNavItems = [
  { href: "/admin", label: "Dashboard", icon: FiGrid },
  { href: "/admin/users", label: "Users", icon: FiUsers },
  { href: "/admin/roles", label: "Roles", icon: FiShield },
  { href: "/admin/departments", label: "Departments", icon: FiCodepen },
  { href: "/admin/settings", label: "Settings", icon: FiSettings },
];

// 👉 Adjust these routes if your pages use different URLs
const blogNavItems = [
  { href: "/admin/blogs", label: "Blogs", icon: FiFileText },
  { href: "/admin/blogs/new", label: "Add blog", icon: FiPlusSquare },
  { href: "/admin/categories", label: "Categories", icon: FiTag },
  { href: "/admin/authors", label: "Authors", icon: FiUser },
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

  const blogActive = useMemo(
    () =>
      blogNavItems.some(
        (item) => pathname === item.href || pathname.startsWith(item.href + "/")
      ),
    [pathname]
  );

  const [blogOpen, setBlogOpen] = useState(blogActive);

  function isActive(href) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-surface border-r border-border">
        <div className="h-16 flex items-center px-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-slate-900 flex items-center justify-center">
              <span className="text-xs font-black tracking-tight text-white">
                AW
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight text-slate-900">
                AW Admin
              </p>
              <p className="text-[11px] text-slate-500 leading-tight">
                Internal console
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          {/* Main items */}
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${
                  active
                    ? "bg-slate-900 text-white font-medium"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Blog group */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setBlogOpen((o) => !o)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition ${
                blogActive
                  ? "bg-slate-900 text-white font-medium"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <FiFileText size={16} />
                <span>Blog</span>
              </span>
              <span
                className={`transition-transform ${
                  blogOpen ? "rotate-180" : ""
                }`}
              >
                <FiChevronDown size={14} />
              </span>
            </button>

            {blogOpen && (
              <div className="mt-1 space-y-1">
                {blogNavItems.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen?.(false)}
                      className={`flex items-center gap-2 pl-9 pr-3 py-1.5 rounded-lg text-xs transition ${
                        active
                          ? "bg-slate-900 text-white font-medium"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Icon size={13} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        <div className="px-4 pb-4 border-t border-border pt-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-xs font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate text-slate-900">
                {user.full_name}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                {user.role?.name || "User"}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 text-white py-1.5 text-xs hover:bg-slate-800 transition"
          >
            <FiLogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-64 bg-surface border-r border-border transform transition-transform lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-slate-900 flex items-center justify-center">
              <span className="text-xs font-black tracking-tight text-white">
                AW
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight text-slate-900">
                AW Admin
              </p>
              <p className="text-[11px] text-slate-500 leading-tight">
                Internal console
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100"
          >
            <FiX size={16} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          {/* Main items */}
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${
                  active
                    ? "bg-slate-900 text-white font-medium"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Blog group */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setBlogOpen((o) => !o)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition ${
                blogActive
                  ? "bg-slate-900 text-white font-medium"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <FiFileText size={16} />
                <span>Blog</span>
              </span>
              <span
                className={`transition-transform ${
                  blogOpen ? "rotate-180" : ""
                }`}
              >
                <FiChevronDown size={14} />
              </span>
            </button>

            {blogOpen && (
              <div className="mt-1 space-y-1">
                {blogNavItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2 pl-9 pr-3 py-1.5 rounded-lg text-xs transition ${
                        active
                          ? "bg-slate-900 text-white font-medium"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {item.label === "Add blog" ? (
                        <FiPlus size={11} />
                      ) : (
                        <span className="w-[11px]" />
                      )}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        <div className="px-4 pb-4 border-t border-border pt-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-xs font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate text-slate-900">
                {user.full_name}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                {user.role?.name || "User"}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 text-white py-1.5 text-xs hover:bg-slate-800 transition"
          >
            <FiLogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
