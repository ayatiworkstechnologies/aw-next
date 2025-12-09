// app/admin/users/page.jsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import Swal from "sweetalert2";
import {
  FiUserPlus,
  FiUsers,
  FiEdit2,
  FiTrash2,
  FiX,
  FiMail,
  FiLock,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  // Create form
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role_id: "",
  });

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role_id: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [usersData, rolesData] = await Promise.all([
        apiFetch("/users"),
        apiFetch("/roles"),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // ===== CREATE USER =====
  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setForm({ full_name: "", email: "", password: "", role_id: "" });

      await loadData();

      Swal.fire({
        icon: "success",
        title: "User created",
        text: "The user has been added successfully.",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: "error",
        title: "Failed to create user",
        text: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  // ===== OPEN EDIT MODAL =====
  function openEditModal(user) {
    setEditUser(user);
    setEditForm({
      full_name: user.full_name || "",
      email: user.email || "",
      password: "",
      role_id: user.role?.id || "",
      is_active: user.is_active,
    });
    setEditOpen(true);
  }

  function closeEditModal() {
    setEditOpen(false);
    setEditUser(null);
  }

  // ===== UPDATE USER =====
  async function handleUpdate(e) {
    e.preventDefault();
    if (!editUser) return;
    setLoadingEdit(true);

    try {
      const body = {
        full_name: editForm.full_name,
        email: editForm.email,
        is_active: editForm.is_active,
        role_id: editForm.role_id,
      };

      // Only send password if filled
      if (editForm.password.trim()) {
        body.password = editForm.password.trim();
      }

      await apiFetch(`/users/${editUser.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });

      await loadData();
      closeEditModal();

      Swal.fire({
        icon: "success",
        title: "User updated",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to update user",
        text: err.message || "Something went wrong",
      });
    } finally {
      setLoadingEdit(false);
    }
  }

  // ===== DELETE USER =====
  async function handleDelete(id) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete this user?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#b91c1c",
      cancelButtonColor: "#4b5563",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      await apiFetch(`/users/${id}`, { method: "DELETE" });
      await loadData();
      Swal.fire({
        icon: "success",
        title: "User deleted",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to delete user",
        text: err.message || "Something went wrong",
      });
    }
  }

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.is_active).length;

  return (
    <section className="space-y-6">
      {/* Header + stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <FiUsers className="text-slate-400" />
            Users
          </h2>
          <p className="text-xs text-slate-400">
            Manage admin, HR, managers, and employees.
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <div className="px-3 py-2 rounded-2xl bg-slate-900 text-slate-100 flex items-center gap-2">
            <FiUsers size={14} />
            <span>Total:</span>
            <span className="font-semibold">{totalUsers}</span>
          </div>
          <div className="px-3 py-2 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center gap-2">
            <FiCheckCircle size={14} />
            <span>Active:</span>
            <span className="font-semibold">{activeUsers}</span>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {/* Create user card */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-slate-800 flex items-center justify-center">
              <FiUserPlus className="text-slate-100" size={16} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-50">
                Create User
              </h3>
              <p className="text-xs text-slate-400">
                Add a new person and assign a role.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleCreate}
          className="grid gap-3 md:grid-cols-2 lg:grid-cols-4"
        >
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">
              <FiUsers size={14} />
            </span>
            <input
              className="w-full bg-slate-900 text-slate-50 border border-slate-700 rounded-xl px-9 py-2 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-500"
              placeholder="Full name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">
              <FiMail size={14} />
            </span>
            <input
              className="w-full bg-slate-900 text-slate-50 border border-slate-700 rounded-xl px-9 py-2 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-500"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">
              <FiLock size={14} />
            </span>
            <input
              className="w-full bg-slate-900 text-slate-50 border border-slate-700 rounded-xl px-9 py-2 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-500"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">
              <FiShield size={14} />
            </span>
            <select
              className="w-full bg-slate-900 text-slate-50 border border-slate-700 rounded-xl px-9 py-2 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-500"
              value={form.role_id}
              onChange={(e) => setForm({ ...form, role_id: e.target.value })}
            >
              <option value="">Select role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 lg:col-span-4 mt-1 inline-flex items-center justify-center gap-2 bg-slate-50 text-slate-950 rounded-xl py-2 text-xs font-medium hover:bg-white disabled:opacity-60 transition"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>

      {/* Users table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-sm p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-slate-50 mb-3 flex items-center gap-2">
          <FiUsers className="text-slate-400" size={14} />
          All Users
        </h3>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-[11px] text-slate-400">
                <th className="text-left px-3 py-2 border-b border-slate-800">
                  ID
                </th>
                <th className="text-left px-3 py-2 border-b border-slate-800">
                  Name
                </th>
                <th className="text-left px-3 py-2 border-b border-slate-800">
                  Email
                </th>
                <th className="text-left px-3 py-2 border-b border-slate-800">
                  Role
                </th>
                <th className="text-left px-3 py-2 border-b border-slate-800">
                  Active
                </th>
                <th className="text-right px-3 py-2 border-b border-slate-800">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-slate-800 last:border-0 hover:bg-slate-900/70 transition"
                >
                  <td className="px-3 py-2 text-slate-300">{u.id}</td>
                  <td className="px-3 py-2 text-slate-50">{u.full_name}</td>
                  <td className="px-3 py-2 text-slate-300">{u.email}</td>
                  <td className="px-3 py-2 text-slate-200">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] uppercase tracking-wide">
                      <FiShield size={10} />
                      {u.role?.name || "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {u.is_active ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500 text-[11px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-slate-700 text-slate-200 hover:bg-slate-800 text-[11px]"
                        title="Edit"
                      >
                        <FiEdit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-red-900 text-red-300 hover:bg-red-950/80 text-[11px]"
                        title="Delete"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-4 text-center text-xs text-slate-500"
                  >
                    No users yet. Create one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit modal */}
      {editOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-50 flex items-center gap-2">
                  <FiEdit2 className="text-slate-400" />
                  Edit User
                </h3>
                <p className="text-[11px] text-slate-400">
                  Update user details or role. Leave password empty to keep it
                  unchanged.
                </p>
              </div>
              <button
                onClick={closeEditModal}
                className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-800"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Full name
                </label>
                <input
                  className="w-full bg-slate-900 text-slate-50 border border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-500"
                  value={editForm.full_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, full_name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Email
                </label>
                <input
                  className="w-full bg-slate-900 text-slate-50 border border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-500"
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  New password (optional)
                </label>
                <input
                  className="w-full bg-slate-900 text-slate-50 border border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-500"
                  type="password"
                  placeholder="Leave blank to keep current password"
                  value={editForm.password}
                  onChange={(e) =>
                    setEditForm({ ...editForm, password: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Role
                  </label>
                  <select
                    className="w-full bg-slate-900 text-slate-50 border border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-500"
                    value={editForm.role_id}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role_id: e.target.value })
                    }
                  >
                    <option value="">Select role</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Status
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditForm((prev) => ({
                        ...prev,
                        is_active: !prev.is_active,
                      }))
                    }
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-[11px] border ${
                      editForm.is_active
                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-300"
                        : "bg-slate-900 border-slate-700 text-slate-300"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        editForm.is_active ? "bg-emerald-400" : "bg-slate-500"
                      }`}
                    />
                    {editForm.is_active ? "Active" : "Inactive"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-3 py-1.5 rounded-full border border-slate-700 text-[11px] text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingEdit}
                  className="px-4 py-1.5 rounded-full bg-slate-50 text-slate-950 text-[11px] font-medium hover:bg-white disabled:opacity-60"
                >
                  {loadingEdit ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
