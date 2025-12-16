"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  getToken,
  getCurrentUser,
  clearToken,
  clearCurrentUser,
} from "../lib/api";
import HRSidebar from "./components/HRSidebar";
import HRHeader from "./components/HRHeader";

export default function HRLayout({ children }) {
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

    if (storedUser?.role?.name?.toLowerCase() !== "hr") {
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
      <HRSidebar
        user={user}
        pathname={pathname}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        <HRHeader
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
