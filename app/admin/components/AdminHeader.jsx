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

  // click outside to close
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
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden h-9 w-9 rounded-full border border-slate-700 flex items-center justify-center text-slate-200 hover:bg-slate-800/80"
          onClick={onOpenSidebar}
        >
          <FiMenu size={18} />
        </button>
        <div className="hidden lg:flex flex-col">
          <span className="text-xs text-slate-500">AW Admin</span>
          <span className="text-[11px] text-slate-400">
            Internal management console
          </span>
        </div>
      </div>

      {/* Right side: avatar dropdown */}
      <div className="flex items-center gap-3" ref={dropdownRef}>
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs text-slate-100 font-medium">
            {user.full_name}
          </span>
          <span className="text-[11px] text-slate-400 max-w-[180px] truncate">
            {user.email}
          </span>
        </div>

        <button
          onClick={() => setDropdownOpen((o) => !o)}
          className="relative h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-100 border border-slate-700 hover:border-slate-500"
        >
          {initials}
        </button>

        {dropdownOpen && (
          <div className="absolute right-4 top-14 w-60 bg-slate-950 border border-slate-800 rounded-2xl shadow-xl overflow-hidden text-xs">
            <div className="px-3 py-3 border-b border-slate-800 flex gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-[11px] font-semibold">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-100 font-medium truncate">
                  {user.full_name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user.email}
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">
                  {user.role?.name || "User"}
                </p>
              </div>
            </div>

            {/* Profile / Settings button */}
            <button
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-slate-200 hover:bg-slate-900"
              onClick={() => {
                setDropdownOpen(false);
                router.push("/admin/settings"); // or "/admin/profile" if you prefer
              }}
            >
              <span className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center">
                <FiUser size={13} className="text-slate-200" />
              </span>
              <span>Profile & Settings</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-300 hover:bg-red-950/40"
            >
              <span className="h-6 w-6 rounded-full bg-red-900/50 flex items-center justify-center">
                <FiLogOut size={13} className="text-red-200" />
              </span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
