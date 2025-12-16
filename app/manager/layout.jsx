"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  getToken,
  getCurrentUser,
  clearToken,
  clearCurrentUser,
} from "../lib/api";
import ManagerSidebar from "./components/ManagerSidebar";
import ManagerHeader from "./components/ManagerHeader";

export default function ManagerLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    const storedUser = getCurrentUser();

    if (!token || !storedUser) {
      clearToken();
      clearCurrentUser();
      router.replace("/");
      return;
    }

    if (storedUser?.role?.name?.toLowerCase() !== "manager") {
      router.replace("/");
      return;
    }

    setUser(storedUser);
    setChecking(false);
  }, [router]);

  function handleLogout() {
    clearToken();
    clearCurrentUser();
    router.push("/");
  }

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <span className="animate-spin h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full" />
      </main>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <ManagerSidebar
        user={user}
        pathname={pathname}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        <ManagerHeader
          user={user}
          onOpenSidebar={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-4 lg:p-6 max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
