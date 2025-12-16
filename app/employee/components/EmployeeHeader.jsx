"use client";

import { useState, useEffect, useRef } from "react";
import { FiMenu, FiLogOut, FiUser } from "react-icons/fi";

export default function EmployeeHeader({ user, onLogout, onOpenSidebar }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const initials =
    user.full_name?.split(" ").map(p => p[0]).join("").slice(0, 2) || "EM";

  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <header className="h-16 sticky top-0 z-30 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden h-9 w-9 rounded-full border flex items-center justify-center"
          onClick={onOpenSidebar}
        >
          <FiMenu />
        </button>
        <span className="text-sm font-semibold text-slate-900">
          Employee Portal
        </span>
      </div>

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(o => !o)}
          className="h-9 w-9 rounded-full bg-slate-900 text-white text-xs font-semibold"
        >
          {initials}
        </button>

        {open && (
          <div className="absolute right-0 top-11 w-48 bg-white border rounded-xl shadow-xl text-xs">
            <div className="px-3 py-2 border-b">
              <p className="font-medium">{user.full_name}</p>
              <p className="text-[11px] text-slate-500">{user.email}</p>
            </div>

            <button className="w-full px-3 py-2 flex gap-2 hover:bg-slate-50">
              <FiUser size={13} /> Profile
            </button>

            <button
              onClick={onLogout}
              className="w-full px-3 py-2 flex gap-2 text-red-600 hover:bg-red-50"
            >
              <FiLogOut size={13} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
