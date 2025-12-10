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
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const storedUser = getCurrentUser();
    if (!storedUser) {
      clearToken();
      router.replace("/login");
      return;
    }

    setUser(storedUser);
    setChecking(false);
  }, [router]);

  function handleLogout() {
    clearToken();
    clearCurrentUser();
    router.push("/login");
  }

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-2 text-sm">
          <span className="h-3 w-3 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
          Checking access…
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <AdminSidebar
        user={user}
        pathname={pathname}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
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
