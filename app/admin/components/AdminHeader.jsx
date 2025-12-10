// app/admin/components/AdminHeader.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiMenu, FiUser, FiLogOut } from "react-icons/fi";

export default function AdminHeader({ user, onLogout, onOpenSidebar }) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initials =
    user.full_name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "AW";

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-border bg-surface/95 backdrop-blur-md sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden h-9 w-9 rounded-full border border-border flex items-center justify-center text-slate-700 hover:bg-slate-100"
          onClick={onOpenSidebar}
        >
          <FiMenu size={18} />
        </button>
        <div className="hidden lg:flex flex-col">
          <span className="text-xs text-slate-500 font-medium">AW Admin</span>
          <span className="text-[11px] text-slate-400">
            Internal management console
          </span>
        </div>
      </div>

      {/* Right side: avatar dropdown */}
      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs text-slate-900 font-medium">
            {user.full_name}
          </span>
          <span className="text-[11px] text-slate-500 max-w-[200px] truncate">
            {user.email}
          </span>
        </div>

        <button
          onClick={() => setDropdownOpen((o) => !o)}
          className="relative h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold hover:bg-slate-800"
        >
          {initials}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-11 w-60 bg-surface border border-border rounded-2xl shadow-xl overflow-hidden text-xs">
            <div className="px-3 py-3 border-b border-border flex gap-2 bg-slate-50">
              <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-semibold">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-900 font-medium truncate">
                  {user.full_name}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {user.email}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">
                  {user.role?.name || "User"}
                </p>
              </div>
            </div>

            {/* Profile / Settings */}
            <button
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
              onClick={() => {
                setDropdownOpen(false);
                router.push("/admin/settings");
              }}
            >
              <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                <FiUser size={13} className="text-slate-700" />
              </span>
              <span>Profile & Settings</span>
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50"
            >
              <span className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                <FiLogOut size={13} className="text-red-600" />
              </span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
