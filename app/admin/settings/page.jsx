// app/admin/settings/page.jsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch, getCurrentUser, setCurrentUser } from "../../lib/api";
import Swal from "sweetalert2";
import { FiUser, FiMail, FiLock, FiSave } from "react-icons/fi";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState(null);

  // profile form
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    email: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // password form
  const [passForm, setPassForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passSaving, setPassSaving] = useState(false);

  // Load current user from localStorage (no /auth/me)
  useEffect(() => {
    const current = getCurrentUser();
    if (current) {
      setUserId(current.id);
      setProfileForm({
        full_name: current.full_name || "",
        email: current.email || "",
      });
    }
    setLoading(false);
  }, []);

  // ===== UPDATE PROFILE =====
  async function handleProfileSubmit(e) {
    e.preventDefault();
    if (!userId) return;

    setProfileSaving(true);
    try {
      const payload = {
        full_name: profileForm.full_name,
        email: profileForm.email,
      };

      const data = await apiFetch(`/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      // Update form & local user store
      setProfileForm({
        full_name: data.full_name || "",
        email: data.email || "",
      });
      setCurrentUser(data);

      Swal.fire({
        icon: "success",
        title: "Profile updated",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to update profile",
        text: err.message || "Something went wrong",
      });
    } finally {
      setProfileSaving(false);
    }
  }

  // ===== CHANGE PASSWORD =====
  async function handlePasswordSubmit(e) {
    e.preventDefault();
    if (!userId) return;

    if (passForm.new_password !== passForm.confirm_password) {
      Swal.fire({
        icon: "warning",
        title: "Passwords do not match",
        text: "Please confirm your new password.",
      });
      return;
    }

    if (!passForm.new_password) {
      Swal.fire({
        icon: "warning",
        title: "New password required",
        text: "Please enter a new password.",
      });
      return;
    }

    setPassSaving(true);
    try {
      // Backend ignores old_password in this simplified version.
      // If you later add check in backend, you can send old_password too.
      await apiFetch(`/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify({
          password: passForm.new_password,
        }),
      });

      setPassForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });

      Swal.fire({
        icon: "success",
        title: "Password changed",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to change password",
        text: err.message || "Something went wrong",
      });
    } finally {
      setPassSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-3 w-3 rounded-full border-2 border-slate-500 border-t-transparent animate-spin" />
          Loading settings…
        </div>
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <p className="text-xs text-slate-400">
          No user found. Please log in again.
        </p>
      </main>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-50 tracking-tight">
          Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Update your profile info and change your password.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Profile card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-slate-800 flex items-center justify-center">
              <FiUser className="text-slate-100" size={16} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-50">Profile</h3>
              <p className="text-[11px] text-slate-400">
                Basic information about your account.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleProfileSubmit}
            className="space-y-3 text-xs mt-2"
          >
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Full name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">
                  <FiUser size={13} />
                </span>
                <input
                  className="w-full bg-slate-900 text-slate-50 border border-slate-700 rounded-xl px-9 py-2 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-500"
                  value={profileForm.full_name}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      full_name: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">
                  <FiMail size={13} />
                </span>
                <input
                  className="w-full bg-slate-900 text-slate-50 border border-slate-700 rounded-xl px-9 py-2 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-500"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-50 text-slate-950 px-4 py-2 text-[11px] font-medium hover:bg-white disabled:opacity-60 transition"
            >
              <FiSave size={13} />
              {profileSaving ? "Saving…" : "Save changes"}
            </button>
          </form>
        </div>

        {/* Password card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-xl bg-slate-800 flex items-center justify-center">
              <FiLock className="text-slate-100" size={16} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-50">
                Change Password
              </h3>
              <p className="text-[11px] text-slate-400">
                Use a strong, unique password for better security.
              </p>
            </div>
          </div>

          <form
            onSubmit={handlePasswordSubmit}
            className="space-y-3 text-xs mt-2"
          >
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Current password
              </label>
              <input
                className="w-full bg-slate-900 text-slate-50 border border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-500"
                type="password"
                value={passForm.old_password}
                onChange={(e) =>
                  setPassForm({ ...passForm, old_password: e.target.value })
                }
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  New password
                </label>
                <input
                  className="w-full bg-slate-900 text-slate-50 border border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-500"
                  type="password"
                  value={passForm.new_password}
                  onChange={(e) =>
                    setPassForm({
                      ...passForm,
                      new_password: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Confirm password
                </label>
                <input
                  className="w-full bg-slate-900 text-slate-50 border border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-500"
                  type="password"
                  value={passForm.confirm_password}
                  onChange={(e) =>
                    setPassForm({
                      ...passForm,
                      confirm_password: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-50 text-slate-950 px-4 py-2 text-[11px] font-medium hover:bg-white disabled:opacity-60 transition"
            >
              <FiLock size={13} />
              {passSaving ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
