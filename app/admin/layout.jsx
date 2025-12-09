// app/admin/layout.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  clearToken,
  getToken,
  getCurrentUser,
  clearCurrentUser,
} from "../lib/api";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    function checkAuth() {
      const token = getToken();
      if (!token) {
        router.replace("/login");
        return;
      }

      const storedUser = getCurrentUser();
      if (!storedUser) {
        // no user stored → treat as not logged in
        clearToken();
        router.replace("/login");
        return;
      }

      if (!mounted) return;
      setUser(storedUser);
      setChecking(false);
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [router]);

  function handleLogout() {
    clearToken();
    clearCurrentUser();
    router.push("/login");
  }

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <div className="flex items-center gap-2 text-sm">
          <span className="h-3 w-3 rounded-full border-2 border-slate-500 border-t-transparent animate-spin" />
          Checking access…
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar
        user={user}
        pathname={pathname}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader
          user={user}
          onLogout={handleLogout}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
